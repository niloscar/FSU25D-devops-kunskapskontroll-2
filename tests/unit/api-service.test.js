/* =================================================================================
 *  api-service.test.js
 *  Contains unit tests for the API service functions, including caching behavior and error handling.
 * ================================================================================= */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { get, patch, API_BASE_URL, API_ANON_KEY, clearApiCache, invalidateApiCacheEntry } from '../../src/services/api-service.js';

beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ ok: true }),
    });

    clearApiCache();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('api-service / get', () => {
    const mockData = {
        table: 'test-table',
        query: { id: 123 },
    };

    test('get throws error when table name is not provided', async () => {
        await expect(get()).rejects.toThrow('Table name is required');
    });

    test('get calls API with correct URL and headers', async () => {
        await get(mockData.table, mockData.query);

        expect(fetch).toHaveBeenCalledTimes(1);

        const [url, config] = fetch.mock.calls[0];
        const parsedUrl = new URL(url);

        expect(parsedUrl.origin + parsedUrl.pathname).toBe(`${API_BASE_URL}/${mockData.table}`);
        expect(parsedUrl.searchParams.get('id')).toBe(String(mockData.query.id));
        expect(config).toMatchObject({
            method: 'GET',
            headers: {
                apikey: API_ANON_KEY
            },
        });
    });

    test('get omits query parameters with null or undefined values', async () => {
        await get(mockData.table, { id: 123, filter: null, sort: undefined });

        const [url] = fetch.mock.calls[0];
        const parsedUrl = new URL(url);

        expect(parsedUrl.searchParams.get('id')).toBe('123');
        expect(parsedUrl.searchParams.has('filter')).toBe(false);
        expect(parsedUrl.searchParams.has('sort')).toBe(false);
    });

    test('get throws network error when fetch fails', async () => {
        fetch.mockRejectedValueOnce(new Error('Network failure'));

        await expect(get(mockData.table, mockData.query)).rejects.toThrow(
            'Network error: Failed to fetch data from the server'
        );
    });
});

describe('api-service / patch', () => {
    const mockData = {
        table: 'test-table',
        body: { name: 'Updated Name' },
        query: { id: 123 },
    };

    test('patch calls API with correct method, URL, headers, and body', async () => {
        await patch(mockData.table, mockData.body, mockData.query);

        expect(fetch).toHaveBeenCalledTimes(1);

        const [url, config] = fetch.mock.calls[0];
        const parsedUrl = new URL(url);

        expect(parsedUrl.origin + parsedUrl.pathname).toBe(`${API_BASE_URL}/${mockData.table}`);
        expect(parsedUrl.searchParams.get('id')).toBe(String(mockData.query.id));
        expect(config).toMatchObject({
            method: 'PATCH',
            headers: {
                apikey: API_ANON_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mockData.body),
        });
    });

    test('patch throws error when table name is not provided', async () => {
        await expect(patch()).rejects.toThrow('Table name is required');
    });

    test('patch throws error when body is not provided', async () => {
        await expect(patch(mockData.table)).rejects.toThrow('Body is required for PATCH requests');
    });

    test.each([
        [
            'patch throws error using response json message',
            { ok: false, status: 400, json: async () => ({ message: 'Bad Request' }) },
            'Bad Request'
        ],
        [
            'patch throws error using response json error when message is missing',
            { ok: false, status: 400, json: async () => ({ error: 'Some error' }) },
            'Some error'
        ],
        [
            'patch throws error using response json details when message and error are missing',
            { ok: false, status: 400, json: async () => ({ details: 'Detailed error' }) },
            'Detailed error'
        ],
        [
            'patch throws default error when response json has no message, error, or details',
            { ok: false, status: 400, json: async () => ({}) },
            'Something went wrong'
        ],
        [
            'patch throws error using statusText when response json parsing fails',
            { ok: false, status: 404, statusText: 'Not Found', json: async () => { throw new Error('Invalid JSON'); } },
            'Not Found'
        ],
        [
            'patch throws default error when response json parsing fails and statusText is missing',
            { ok: false, status: 500, statusText: '', json: async () => { throw new Error('Invalid JSON'); } },
            'Something went wrong'
        ]
    ])('%s', async (_testName, mockResponse, expectedMessage) => {
        fetch.mockResolvedValueOnce(mockResponse);

        await expect(
            patch(mockData.table, mockData.body, mockData.query)
        ).rejects.toThrow(expectedMessage);
    });

    test('patch returns null on 204', async () => {
        fetch.mockResolvedValueOnce({ ok: true, status: 204 });

        await expect(patch(mockData.table, mockData.body, mockData.query)).resolves.toBeNull();
    });

    test('patch sets config.body to body if body is a string', async () => {
        const stringBody = 'This is a string body';
        await patch(mockData.table, stringBody, mockData.query);

        const [, config] = fetch.mock.calls[0];
        expect(config.body).toBe(stringBody);
    });
});

describe('api-service / caching', () => {
    const mockData = {
        table: 'test-table',
        query: { id: 123 },
    };

    test('get caches response when useCache is true', async () => {
        const responseData = { name: 'Cached Data' };

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => responseData,
        });

        const data1 = await get(mockData.table, mockData.query, { useCache: true });
        expect(data1).toEqual(responseData);

        const data2 = await get(mockData.table, mockData.query, { useCache: true });
        expect(data2).toEqual(responseData);
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('get returns valid cached data from localStorage without fetching', async () => {
        const cachedData = { id: 123, name: 'Cached item' };
        const cachedUrl = `${API_BASE_URL}/test-table?cacheCase=valid-local&id=123`;
        const cachedKey = `api_cache:${cachedUrl}`;

        vi.stubGlobal('localStorage', {
            getItem: vi.fn((key) => {
                if (key === cachedKey) {
                    return JSON.stringify({
                        data: cachedData,
                        cachedAt: Date.now(),
                    });
                }
                return null;
            }),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
        });

        const result = await get(
            'test-table',
            { id: 123, cacheCase: 'valid-local' },
            { useCache: true }
        );

        expect(result).toEqual(cachedData);
        expect(fetch).not.toHaveBeenCalled();
    });

    test('get removes invalid cached localStorage data and fetches fresh response', async () => {
        const cachedUrl = `${API_BASE_URL}/test-table?cacheCase=invalid-local&id=123`;
        const cachedKey = `api_cache:${cachedUrl}`;
        const removeItemSpy = vi.fn();
        const freshData = { id: 123, name: 'Fresh item' };

        vi.stubGlobal('localStorage', {
            getItem: vi.fn((key) => {
                if (key === cachedKey) {
                    return 'not valid json';
                }
                return null;
            }),
            setItem: vi.fn(),
            removeItem: removeItemSpy,
            clear: vi.fn(),
        });

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => freshData,
        });

        const result = await get(
            'test-table',
            { id: 123, cacheCase: 'invalid-local' },
            { useCache: true }
        );

        expect(removeItemSpy).toHaveBeenCalledWith(cachedKey);
        expect(result).toEqual(freshData);
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('get fetches again when in-memory cache entry has expired', async () => {
        vi.useFakeTimers();

        const firstResponse = { id: 1 };
        const secondResponse = { id: 2 };

        fetch
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => firstResponse,
            })
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => secondResponse,
            });

        await get('test-table', { id: 123 }, { useCache: true });

        vi.advanceTimersByTime(60 * 60 * 1000 + 1);

        const result = await get('test-table', { id: 123 }, { useCache: true });

        expect(result).toEqual(secondResponse);
        expect(fetch).toHaveBeenCalledTimes(2);

        vi.useRealTimers();
    });

    test('invalidateApiCacheEntry builds cache key with sorted query params', () => {
        const removeItemSpy = vi.fn();

        vi.stubGlobal('localStorage', {
            removeItem: removeItemSpy,
        });

        invalidateApiCacheEntry('test-table', { b: 2, a: 1 });

        expect(removeItemSpy).toHaveBeenCalledWith(
            `api_cache:${API_BASE_URL}/test-table?a=1&b=2`
        );
    });

    test('invalidateApiCacheEntry logs warning when localStorage removeItem fails', () => {
        const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const removeItemSpy = vi.fn(() => {
            throw new Error('localStorage removeItem failed');
        });

        vi.stubGlobal('localStorage', {
            removeItem: removeItemSpy,
        });

        invalidateApiCacheEntry('test-table', { id: 123 });

        const expectedUrl = `${API_BASE_URL}/test-table?id=123`;
        const expectedStorageKey = `api_cache:${expectedUrl}`;

        expect(removeItemSpy).toHaveBeenCalledWith(expectedStorageKey);
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            'Could not remove API cache entry from localStorage:',
            expect.any(Error)
        );

        consoleWarnSpy.mockRestore();
    });
});