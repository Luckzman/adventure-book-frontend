import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBooks } from '../useBooks';
import { BooksProvider } from '../../contexts/BooksProvider';
import { type ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
    <BooksProvider>{children}</BooksProvider>
);

describe('useBooks', () => {
    it('throws error when used outside BooksProvider', () => {
        // Suppress console.error for this test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => {
            renderHook(() => useBooks());
        }).toThrow('useBooks must be used within a BooksProvider');

        consoleSpy.mockRestore();
    });

    it('returns books context when used within BooksProvider', async () => {
        const { result } = renderHook(() => useBooks(), { wrapper });

        // Wait for initial load
        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(result.current).toHaveProperty('books');
        expect(result.current).toHaveProperty('isLoading');
        expect(result.current).toHaveProperty('error');
    });
});
