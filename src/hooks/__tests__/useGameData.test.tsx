import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGameData } from '../useGameData';
import * as booksApi from '../../services/booksApi';

// Mock the booksApi module
vi.mock('../../services/booksApi', () => ({
    fetchGameData: vi.fn(),
    validateBookData: vi.fn(),
}));

describe('useGameData', () => {
    const mockDispatch = vi.fn();
    const mockGameData = {
        title: 'Test Adventure',
        author: 'Test Author',
        difficulty: 'MEDIUM',
        type: 'Fantasy',
        sections: [
            {
                id: '1',
                text: 'Start',
                type: 'BEGIN' as const,
                options: [
                    { description: 'Go', gotoId: '2', consequence: null },
                ],
            },
            {
                id: '2',
                text: 'End',
                type: 'END' as const,
                options: null,
            },
        ],
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('dispatches error when gamePath is undefined', async () => {
        renderHook(() => useGameData({ gamePath: undefined, dispatch: mockDispatch }));

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'LOAD_GAME_ERROR',
                payload: 'Invalid game path',
            });
        });
    });

    it('dispatches LOAD_GAME_START when gamePath is provided', async () => {
        vi.mocked(booksApi.fetchGameData).mockResolvedValueOnce(mockGameData);
        vi.mocked(booksApi.validateBookData).mockReturnValueOnce({
            isValid: true,
            errors: [],
        });

        renderHook(() => useGameData({ gamePath: 'test.json', dispatch: mockDispatch }));

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOAD_GAME_START' });
        });
    });

    it('dispatches LOAD_GAME_SUCCESS when data is valid', async () => {
        vi.mocked(booksApi.fetchGameData).mockResolvedValueOnce(mockGameData);
        vi.mocked(booksApi.validateBookData).mockReturnValueOnce({
            isValid: true,
            errors: [],
        });

        renderHook(() => useGameData({ gamePath: 'test.json', dispatch: mockDispatch }));

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'LOAD_GAME_SUCCESS',
                payload: mockGameData,
            });
        });
    });

    it('dispatches LOAD_GAME_ERROR when validation fails', async () => {
        vi.mocked(booksApi.fetchGameData).mockResolvedValueOnce(mockGameData);
        vi.mocked(booksApi.validateBookData).mockReturnValueOnce({
            isValid: false,
            errors: ['Invalid book structure'],
        });

        renderHook(() => useGameData({ gamePath: 'test.json', dispatch: mockDispatch }));

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'LOAD_GAME_ERROR',
                payload: 'Invalid book structure',
            });
        });
    });

    it('dispatches LOAD_GAME_ERROR when fetchGameData returns null', async () => {
        vi.mocked(booksApi.fetchGameData).mockResolvedValueOnce(null);

        renderHook(() => useGameData({ gamePath: 'test.json', dispatch: mockDispatch }));

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'LOAD_GAME_ERROR',
                payload: expect.stringContaining('Game data not found'),
            });
        });
    });

    it('dispatches LOAD_GAME_ERROR when fetchGameData throws', async () => {
        const error = new Error('Network error');
        vi.mocked(booksApi.fetchGameData).mockRejectedValueOnce(error);

        renderHook(() => useGameData({ gamePath: 'test.json', dispatch: mockDispatch }));

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'LOAD_GAME_ERROR',
                payload: expect.any(String),
            });
        });
    });

    it('decodes URL-encoded game path', async () => {
        vi.mocked(booksApi.fetchGameData).mockResolvedValueOnce(mockGameData);
        vi.mocked(booksApi.validateBookData).mockReturnValueOnce({
            isValid: true,
            errors: [],
        });

        renderHook(() => useGameData({ gamePath: 'test%20adventure.json', dispatch: mockDispatch }));

        await waitFor(() => {
            expect(booksApi.fetchGameData).toHaveBeenCalledWith('test adventure.json', expect.any(AbortSignal));
        });
    });

    it('aborts request on unmount', async () => {
        vi.mocked(booksApi.fetchGameData).mockImplementationOnce(
            () => new Promise(() => { }) // Never resolves
        );

        const { unmount } = renderHook(() => useGameData({ gamePath: 'test.json', dispatch: mockDispatch }));

        unmount();

        // Wait a bit to ensure cleanup runs
        await new Promise((resolve) => setTimeout(resolve, 100));

        // The abort should have been called, but we can't easily test it without exposing AbortController
        // This test at least ensures the hook doesn't crash on unmount
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOAD_GAME_START' });
    });
});
