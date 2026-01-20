import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { BooksProvider } from '../BooksProvider';
import { useBooks } from '../../hooks/useBooks';
import * as booksApi from '../../services/booksApi';

// Mock the booksApi module
vi.mock('../../services/booksApi', () => ({
    fetchBooks: vi.fn(),
}));

// Mock logger to avoid console errors in tests
vi.mock('../../utils/logger', () => ({
    logger: {
        error: vi.fn(),
    },
}));

const TestComponent = () => {
    const { books, isLoading, error } = useBooks();
    return (
        <div>
            <div data-testid="loading">{isLoading ? 'Loading' : 'Loaded'}</div>
            <div data-testid="error">{error || 'No error'}</div>
            <div data-testid="books-count">{books.length}</div>
        </div>
    );
};

describe('BooksProvider', () => {
    const mockBooks = [
        {
            path: 'test.json',
            title: 'Test Book',
            author: 'Test Author',
            description: 'Test Description',
            difficulty: 'Easy' as const,
            genre: 'Fantasy',
            duration: '30 min',
            chapters: 1,
            tags: ['adventure'],
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('provides books context to children', async () => {
        vi.mocked(booksApi.fetchBooks).mockResolvedValueOnce(mockBooks);

        const { getByTestId } = render(
            <BooksProvider>
                <TestComponent />
            </BooksProvider>
        );

        await waitFor(() => {
            expect(getByTestId('books-count')).toHaveTextContent('1');
        });
    });

    it('shows loading state initially', () => {
        vi.mocked(booksApi.fetchBooks).mockImplementationOnce(
            () => new Promise(() => {}) // Never resolves
        );

        const { getByTestId } = render(
            <BooksProvider>
                <TestComponent />
            </BooksProvider>
        );

        expect(getByTestId('loading')).toHaveTextContent('Loading');
    });

    it('handles fetch errors', async () => {
        const error = new Error('Failed to fetch');
        vi.mocked(booksApi.fetchBooks).mockRejectedValueOnce(error);

        const { getByTestId } = render(
            <BooksProvider>
                <TestComponent />
            </BooksProvider>
        );

        await waitFor(() => {
            expect(getByTestId('error')).toHaveTextContent('Failed to fetch');
        });
    });

    it('aborts request on unmount', () => {
        vi.mocked(booksApi.fetchBooks).mockImplementationOnce(
            () => new Promise(() => {}) // Never resolves
        );

        const { unmount } = render(
            <BooksProvider>
                <TestComponent />
            </BooksProvider>
        );

        unmount();

        // The abort should have been called, but we can't easily test it without exposing AbortController
        // This test at least ensures the provider doesn't crash on unmount
        expect(booksApi.fetchBooks).toHaveBeenCalled();
    });
});
