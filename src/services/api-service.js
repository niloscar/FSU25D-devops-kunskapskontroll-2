export const API_BASE_URL = 'https://mdhlvoozdqcyqosjiiry.supabase.co/rest/v1';
export const API_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kaGx2b296ZHFjeXFvc2ppaXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTMyMTUsImV4cCI6MjA5MDUyOTIxNX0.wv6x-RatgosfA4fK5L7tWr_inmVv6xjtGhPpGGQUCng';

const responseCache = new Map();
const CACHE_PREFIX = 'api_cache:';
const CACHE_DURATION = 60 * 60 * 1000;


/**
 * Sends an HTTP request to the specified table with the given options.
 * Used internally by the API helper functions.
 */
async function request(table, options = {}) {
    if (!table) throw new Error('Table name is required');

    const { 
        query, 
        headers, 
        body, 
        useCache = false,
        cacheTtlMs = CACHE_DURATION,
        ...rest 
    } = options; // Extract query, headers, and body from options.

    const method = (rest.method || 'GET').toUpperCase();

    const config = {
        headers: {
            apikey: API_ANON_KEY,
            // Authorization: `Bearer ${token}`, // For future use if needed.
            ...headers
        },
        ...rest
    };

    if (
        method === 'PATCH' && 
        (
            body === undefined ||
            body === null ||
            (typeof body === 'object' && Object.keys(body).length === 0)
        )
    ) {
        throw new Error('Body is required for PATCH requests');
    }

    if (body !== undefined) { // Only set content-type and body if body is provided.
        config.headers['Content-Type'] = 'application/json';
        config.body = (typeof body === 'string') ? body : JSON.stringify(body);
    }

    const url = buildQueryString(table, query);

    if (method === 'GET' && useCache) {
        const cachedData = getCachedResponse(url, cacheTtlMs);
        if (cachedData !== null) {
            console.log(`Using cached response for ${url}`);
            return cachedData;
        }
    }

    let response;

    try {
        response = await fetch(url, config);
    } catch {
        throw new Error('Network error: Failed to fetch data from the server');
    }

    if (!response.ok) {
        let message = 'Something went wrong';

        try {
            const errorData = await response.json();
            message = errorData.message || errorData.error || errorData.details || message; // Try to extract a more specific error message from the response.
        } catch {
            message = response.statusText || message; // Fallback to status text if JSON parsing fails.
        }
    
        throw new Error(message);
    }

    if (response.status === 204) return null; // No content to return.
    
    const data = await response.json();

    if (method === 'GET' && useCache) cacheResponse(url, data);

    return data;
}

/**
 * Sends a GET request to the specified table with optional query parameters:
 * @param {string} table The table or endpoint to request.
 * @param {Object} [query={}] Query parameters to include in the request URL.
 * @returns {Promise<any>} The parsed JSON response, or null if no content is returned.
 */
export function get(table, query = {}, options = {}) {
    return request(table, {
        method: 'GET',
        query,
        ...options
    });
}

/**
 * Sends a PATCH request to the specified table with a required body and optional query parameters:
 * @param {string} table The table or endpoint to request.
 * @param {Object} body The body of the request.
 * @param {Object} [query={}] Query parameters to include in the request URL.
 * @returns {Promise<any>} The parsed JSON response, or null if no content is returned.
 */
export function patch(table, body, query = {}) {
    return request(table, {
        method: 'PATCH',
        body,
        query,
        headers: {
            Prefer: 'return=representation'
        }
    });
}


/**
 * Builds a complete URL with query parameters for the given table and query object.
 */
function buildQueryString(table, query = {}) {
    const url = new URL(`${API_BASE_URL}/${table}`);

    Object.entries(query) // Sort query parameters alphabetically for consistent caching keys.
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([key, value]) => {
            if (value == null) return;
            url.searchParams.append(key, value);
        });

    return url.toString();
}


/**
 * Generates a unique storage key for caching based on the request URL.
 */
function getStorageKey(url) {
    return `${CACHE_PREFIX}${url}`;
}


/**
 * Caches the response data for a given URL in both in-memory cache and localStorage with a timestamp for expiration.
 */
function cacheResponse(url, data) {
    const entry = {
        data,
        cachedAt: Date.now()
    };

    responseCache.set(url, entry);
    localStorage.setItem(getStorageKey(url), JSON.stringify(entry));
}


/**
 * Retrieves a cached response for the given URL if it exists and is still valid based on the provided TTL (time-to-live).
 */
function getCachedResponse(url, ttl = CACHE_DURATION) {
    const inMemory = responseCache.get(url);

    if (inMemory && (Date.now() - inMemory.cachedAt < ttl)) {
        return inMemory.data;
    }

    if (inMemory) {
        responseCache.delete(url);
    }

    const raw = localStorage.getItem(getStorageKey(url));

    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);

        if (Date.now() - parsed.cachedAt >= ttl) {
            localStorage.removeItem(getStorageKey(url));
            return null;
        }

        responseCache.set(url, parsed);
        return parsed.data;
    } catch {
        localStorage.removeItem(getStorageKey(url));
        return null;
    }
}


/**
 * Clears the entire API response cache.
 */
export function clearApiCache() {
    responseCache.clear();

    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) {
            localStorage.removeItem(key);
        }
    });
}


/**
 * Removes a specific cached response based on the table and query parameters.
 */
export function invalidateApiCacheEntry(table, query = {}) {
    const url = buildQueryString(table, query);
    responseCache.delete(url);
    localStorage.removeItem(getStorageKey(url));
}
