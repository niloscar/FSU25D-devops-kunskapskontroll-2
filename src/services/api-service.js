export const API_BASE_URL = 'https://mdhlvoozdqcyqosjiiry.supabase.co/rest/v1';
export const API_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kaGx2b296ZHFjeXFvc2ppaXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTMyMTUsImV4cCI6MjA5MDUyOTIxNX0.wv6x-RatgosfA4fK5L7tWr_inmVv6xjtGhPpGGQUCng';

/**
 * Sends an HTTP request to the specified table with the given options.
 * Only used internally by the get function for now.
 */
async function request(table, options = {}) {
    // if (!API_BASE_URL) throw new Error('API_BASE_URL is not defined');
    // if (!API_ANON_KEY) throw new Error('API_ANON_KEY is not defined');
    if (!table) throw new Error('Table name is required');

    const { query, headers, body, ...rest } = options; // Extract query, headers, and body from options.

    const config = {
        headers: {
            'Content-Type': 'application/json',
            apikey: API_ANON_KEY,
            // Authorization: `Bearer ${token}`, // For future use if needed.
            ...headers
        },
        ...rest
    };

    if (config.method === 'PATCH' && (!body || Object.keys(body).length === 0)) {
        throw new Error('Body is required for PATCH requests');
    }

    if (body !== undefined) { // Only set content-type and body if body is provided.
        config.headers['Content-Type'] = 'application/json';
        config.body = (typeof body === 'string') ? body : JSON.stringify(body);
    }

    const response = await fetch(buildQueryString(table, query), config);

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

    return response.json();
}

/**
 * Sends a GET request to the specified table with optional query parameters:
 * @param {string} table The table or endpoint to request.
 * @param {Object} [query={}] Query parameters to include in the request URL.
 * @returns {Promise<any>} The parsed JSON response, or null if no content is returned.
 */
export function get(table, query = {}) {
    return request(table, {
        method: 'GET',
        query
    });
}

/**
 * Sends a PATCH request to the specified table with a body and optional query parameters:
 * @param {string} table The table or endpoint to request.
 * @param {Object} [body={}] The body of the request.
 * @param {Object} [query={}] Query parameters to include in the request URL.
 * @returns {Promise<any>} The parsed JSON response, or null if no content is returned.
 */
export function patch(table, body = {}, query = {}) {
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

    Object.entries(query).forEach(([key, value]) => {
        if (value == null) return;
        url.searchParams.append(key, value);
    });

    return url.toString();
}