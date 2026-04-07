import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { get, patch, API_BASE_URL, API_ANON_KEY } from '../../src/services/api-service.js';

beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ ok: true }),
    });
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
                apikey: API_ANON_KEY,
                'Content-Type': 'application/json',
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
