import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchBooks, type Book } from '../services/booksApi';

/**
 * Books Context
 * Provides books data to all components without prop drilling
 * Fetches books once and shares across the application
 */

interface BooksContextValue {
    books: Book[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const BooksContext = createContext<BooksContextValue | undefined>(undefined);

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

    const loadBooks = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedBooks = await fetchBooks();
            setBooks(fetchedBooks);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load adventures';
            setError(errorMessage);
            console.error('Error loading books:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadBooks();
    }, []);

    const value: BooksContextValue = {
        books,
        isLoading,
        error,
        refetch: loadBooks,
    };

    return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
};

/**
 * Custom hook to access books context
 * Throws error if used outside BooksProvider
 */
export const useBooks = (): BooksContextValue => {
    const context = useContext(BooksContext);
    if (context === undefined) {
        throw new Error('useBooks must be used within a BooksProvider');
    }
    return context;
};
