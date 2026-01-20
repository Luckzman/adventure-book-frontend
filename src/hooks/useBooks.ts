import { useContext } from 'react';
import { BooksContext } from '../contexts/booksContext';

/**
 * Custom hook to access books context
 * Throws error if used outside BooksProvider
 */
export const useBooks = () => {
    const context = useContext(BooksContext);
    if (context === undefined) {
        throw new Error('useBooks must be used within a BooksProvider');
    }
    return context;
};
