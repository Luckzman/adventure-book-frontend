import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { fetchBooks, type Book } from '../services/booksApi';
import { BooksContext, type BooksContextValue } from './booksContext';
import { logger } from '../utils/logger';

interface BooksProviderProps {
    children: ReactNode;
}

/**
 * BooksProvider Component
 * Fetches books once and provides them via context
 */
export const BooksProvider = ({ children }: BooksProviderProps) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadBooks = useCallback(async (signal?: AbortSignal) => {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedBooks = await fetchBooks(signal);

            // Only update state if not aborted
            if (!signal?.aborted) {
                setBooks(fetchedBooks);
            }
        } catch (err) {
            // Don't update state if request was aborted
            if (err instanceof Error && err.name === 'AbortError') {
                return;
            }

            const errorMessage = err instanceof Error ? err.message : 'Failed to load adventures';
            setError(errorMessage);
            logger.error('Error loading books:', err);
        } finally {
            // Only update loading state if not aborted
            if (!signal?.aborted) {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        const abortController = new AbortController();

        loadBooks(abortController.signal);

        // Cleanup: abort request if component unmounts
        return () => {
            abortController.abort();
        };
    }, [loadBooks]);

    const value: BooksContextValue = {
        books,
        isLoading,
        error,
        refetch: loadBooks,
    };

    return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
};
