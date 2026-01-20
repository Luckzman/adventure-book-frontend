import { createContext } from 'react';
import type { Book } from '../services/booksApi';

/**
 * Books Context Value Interface
 */
export interface BooksContextValue {
    books: Book[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Books Context
 * Provides books data to all components without prop drilling
 */
export const BooksContext = createContext<BooksContextValue | undefined>(undefined);
