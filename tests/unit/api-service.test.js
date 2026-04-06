import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { get } from '../../src/services/api-service.js';

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

        expect(parsedUrl.pathname).toMatch(new RegExp(`/${mockData.table}$`));
        expect(parsedUrl.searchParams.get('id')).toBe(String(mockData.query.id));
        expect(config).toMatchObject({
            method: 'GET',
            headers: {
                apikey: expect.any(String),
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
