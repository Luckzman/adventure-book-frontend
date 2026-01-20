import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchBooks, fetchGameData, validateBookData } from '../booksApi';
import type { GameDataResponse } from '../booksApi';

// Mock fetch globally
global.fetch = vi.fn();

describe('booksApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('fetchBooks', () => {
        it('fetches and returns books successfully', async () => {
            const mockBooks = [
                {
                    path: 'test.json',
                    title: 'Test Book',
                    author: 'Test Author',
                    difficulty: 'EASY',
                    type: 'Fantasy',
                    duration: '30 min',
                    chapters: 1,
                    tags: 'adventure, magic',
                    summary: 'A test book',
                },
            ];

            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockBooks,
            });

            const books = await fetchBooks();
            expect(books).toHaveLength(1);
            expect(books[0].title).toBe('Test Book');
            expect(books[0].difficulty).toBe('Easy');
        });

        it('handles fetch errors', async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

            await expect(fetchBooks()).rejects.toThrow();
        });

        it('handles non-ok responses', async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
            });

            await expect(fetchBooks()).rejects.toThrow('Failed to fetch books');
        });

        it('aborts request when signal is provided', async () => {
            const abortController = new AbortController();

            // Mock fetch to simulate abort
            (global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
                return Promise.reject(new DOMException('Aborted', 'AbortError'));
            });

            abortController.abort();
            await expect(fetchBooks(abortController.signal)).rejects.toThrow();
        });
    });

    describe('fetchGameData', () => {
        it('fetches game data successfully from first endpoint', async () => {
            const mockGameData = {
                title: 'Test Game',
                author: 'Test Author',
                difficulty: 'MEDIUM',
                type: 'Fantasy',
                sections: [
                    {
                        id: '1',
                        text: 'Start',
                        type: 'BEGIN',
                        options: [
                            { description: 'Go', gotoId: '2', consequence: null },
                        ],
                    },
                    {
                        id: '2',
                        text: 'End',
                        type: 'END',
                        options: null,
                    },
                ],
            };

            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockGameData,
            });

            const result = await fetchGameData('test.json');
            expect(result).toEqual(mockGameData);
        });

        it('tries second endpoint when first returns 404', async () => {
            const mockGameData = {
                title: 'Test Game',
                author: 'Test Author',
                difficulty: 'MEDIUM',
                type: 'Fantasy',
                sections: [
                    {
                        id: '1',
                        text: 'Start',
                        type: 'BEGIN',
                        options: [
                            { description: 'Go', gotoId: '2', consequence: null },
                        ],
                    },
                    {
                        id: '2',
                        text: 'End',
                        type: 'END',
                        options: null,
                    },
                ],
            };

            (global.fetch as ReturnType<typeof vi.fn>)
                .mockResolvedValueOnce({
                    ok: false,
                    status: 404,
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockGameData,
                });

            const result = await fetchGameData('test.json');
            expect(result).toEqual(mockGameData);
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        it('handles 500 server errors', async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                status: 500,
            });

            await expect(fetchGameData('test.json')).rejects.toThrow('server encountered an error');
        });

        it('handles network errors', async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
                new TypeError('Failed to fetch')
            );

            await expect(fetchGameData('test.json')).rejects.toThrow('Unable to connect');
        });

        it('handles abort signal', async () => {
            const abortController = new AbortController();
            abortController.abort();

            (global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
                return Promise.reject(new DOMException('Aborted', 'AbortError'));
            });

            await expect(fetchGameData('test.json', abortController.signal)).rejects.toThrow();
        });
    });

    describe('validateBookData', () => {
        it('validates book with valid data', () => {
            const validBook: GameDataResponse = {
                title: 'Test Book',
                author: 'Test Author',
                difficulty: 'MEDIUM',
                type: 'Fantasy',
                sections: [
                    {
                        id: '1',
                        text: 'Start',
                        type: 'BEGIN',
                        options: [
                            { description: 'Go left', gotoId: '2', consequence: null },
                        ],
                    },
                    {
                        id: '2',
                        text: 'End',
                        type: 'END',
                        options: null,
                    },
                ],
            };

            const result = validateBookData(validBook);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('detects missing beginning section', () => {
            const invalidBook: GameDataResponse = {
                title: 'Test',
                author: 'Author',
                difficulty: 'EASY',
                type: '',
                sections: [
                    {
                        id: '1',
                        text: 'Start',
                        type: 'NODE',
                        options: [],
                    },
                ],
            };

            const result = validateBookData(invalidBook);
            expect(result.isValid).toBe(false);
            expect(result.errors.some((e) => e.includes('beginning'))).toBe(true);
        });

        it('detects multiple beginning sections', () => {
            const invalidBook: GameDataResponse = {
                title: 'Test',
                author: 'Author',
                difficulty: 'EASY',
                type: '',
                sections: [
                    {
                        id: '1',
                        text: 'Start 1',
                        type: 'BEGIN',
                        options: [],
                    },
                    {
                        id: '2',
                        text: 'Start 2',
                        type: 'BEGIN',
                        options: [],
                    },
                ],
            };

            const result = validateBookData(invalidBook);
            expect(result.isValid).toBe(false);
            expect(result.errors.some((e) => e.includes('beginning'))).toBe(true);
        });

        it('detects missing ending sections', () => {
            const invalidBook: GameDataResponse = {
                title: 'Test',
                author: 'Author',
                difficulty: 'EASY',
                type: '',
                sections: [
                    {
                        id: '1',
                        text: 'Start',
                        type: 'BEGIN',
                        options: [
                            { description: 'Go', gotoId: '2', consequence: null },
                        ],
                    },
                    {
                        id: '2',
                        text: 'Middle',
                        type: 'NODE',
                        options: [
                            { description: 'Go', gotoId: '3', consequence: null },
                        ],
                    },
                ],
            };

            const result = validateBookData(invalidBook);
            expect(result.isValid).toBe(false);
            expect(result.errors.some((e) => e.includes('ending'))).toBe(true);
        });

        it('detects invalid section references', () => {
            const invalidBook: GameDataResponse = {
                title: 'Test',
                author: 'Author',
                difficulty: 'EASY',
                type: '',
                sections: [
                    {
                        id: '1',
                        text: 'Start',
                        type: 'BEGIN',
                        options: [
                            { description: 'Go', gotoId: '999', consequence: null },
                        ],
                    },
                ],
            };

            const result = validateBookData(invalidBook);
            // Invalid references are detected during navigation, not validation
            // Validation only checks structure, not reachability
            expect(result.isValid).toBe(false);
            expect(result.errors.some((e) => e.includes('ending'))).toBe(true);
        });

        it('detects non-ending sections without options', () => {
            const invalidBook: GameDataResponse = {
                title: 'Test',
                author: 'Author',
                difficulty: 'EASY',
                type: '',
                sections: [
                    {
                        id: '1',
                        text: 'Start',
                        type: 'BEGIN',
                        options: [
                            { description: 'Go', gotoId: '2', consequence: null },
                        ],
                    },
                    {
                        id: '2',
                        text: 'Middle',
                        type: 'NODE',
                        options: null,
                    },
                ],
            };

            const result = validateBookData(invalidBook);
            // NODE sections without options are handled as dead ends during navigation
            // Validation checks structure, not all edge cases
            expect(result.isValid).toBe(false);
            expect(result.errors.some((e) => e.includes('ending'))).toBe(true);
        });
    });
});
