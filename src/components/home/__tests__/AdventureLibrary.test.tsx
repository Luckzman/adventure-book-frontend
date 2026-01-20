import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdventureLibrary } from '../AdventureLibrary';
import { BooksProvider } from '../../../contexts/BooksProvider';
import * as booksApi from '../../../services/booksApi';

// Mock the booksApi module
vi.mock('../../../services/booksApi', () => ({
    fetchBooks: vi.fn(),
}));

// Mock logger to avoid console errors in tests
vi.mock('../../../utils/logger', () => ({
    logger: {
        error: vi.fn(),
    },
}));

const mockBooks = [
    {
        path: 'test1.json',
        title: 'Fantasy Adventure',
        author: 'Author 1',
        description: 'A fantasy story',
        difficulty: 'Easy' as const,
        genre: 'Fantasy',
        duration: '30 min',
        chapters: 1,
        tags: ['magic'],
    },
    {
        path: 'test2.json',
        title: 'Steampunk Mystery',
        author: 'Author 2',
        description: 'A steampunk story',
        difficulty: 'Hard' as const,
        genre: 'Steampunk Mystery',
        duration: '60 min',
        chapters: 2,
        tags: ['steampunk'],
    },
];

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
        <BooksProvider>{children}</BooksProvider>
    </BrowserRouter>
);

describe('AdventureLibrary', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(booksApi.fetchBooks).mockResolvedValue(mockBooks);
    });

    it('renders library title', () => {
        render(<AdventureLibrary />, { wrapper });
        expect(screen.getByText('The Adventure Library')).toBeInTheDocument();
    });

    it('renders search input', () => {
        render(<AdventureLibrary />, { wrapper });
        expect(screen.getByPlaceholderText('Search adventures...')).toBeInTheDocument();
    });

    it('renders genre filter buttons', () => {
        render(<AdventureLibrary />, { wrapper });
        expect(screen.getByText('Fantasy')).toBeInTheDocument();
        expect(screen.getByText('Adventure')).toBeInTheDocument();
        expect(screen.getByText('High Fantasy')).toBeInTheDocument();
        expect(screen.getByText('Steampunk Mystery')).toBeInTheDocument();
    });

    it('renders difficulty filter buttons', () => {
        render(<AdventureLibrary />, { wrapper });
        expect(screen.getByText('Easy')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toBeInTheDocument();
        expect(screen.getByText('Hard')).toBeInTheDocument();
    });

    it('updates search input value', () => {
        render(<AdventureLibrary />, { wrapper });
        const searchInput = screen.getByPlaceholderText('Search adventures...') as HTMLInputElement;
        
        fireEvent.change(searchInput, { target: { value: 'Fantasy' } });
        
        expect(searchInput.value).toBe('Fantasy');
    });

    it('toggles filter when clicked', () => {
        render(<AdventureLibrary />, { wrapper });
        const fantasyButton = screen.getByText('Fantasy');
        
        fireEvent.click(fantasyButton);
        
        // Filter button should be active
        expect(fantasyButton.closest('button')).toHaveAttribute('aria-pressed', 'true');
    });

    it('shows clear all button when filters are active', () => {
        render(<AdventureLibrary />, { wrapper });
        const fantasyButton = screen.getByText('Fantasy');
        
        fireEvent.click(fantasyButton);
        
        expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('clears all filters when clear all is clicked', () => {
        render(<AdventureLibrary />, { wrapper });
        const fantasyButton = screen.getByText('Fantasy');
        
        fireEvent.click(fantasyButton);
        expect(screen.getByText('Clear All')).toBeInTheDocument();
        
        const clearAllButton = screen.getByText('Clear All');
        fireEvent.click(clearAllButton);
        
        expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('calls onSearchChange when search value changes', () => {
        const onSearchChange = vi.fn();
        render(<AdventureLibrary onSearchChange={onSearchChange} />, { wrapper });
        const searchInput = screen.getByPlaceholderText('Search adventures...');
        
        fireEvent.change(searchInput, { target: { value: 'test' } });
        
        expect(onSearchChange).toHaveBeenCalledWith('test');
    });

    it('calls onFilterChange when filter is toggled', () => {
        const onFilterChange = vi.fn();
        render(<AdventureLibrary onFilterChange={onFilterChange} />, { wrapper });
        const fantasyButton = screen.getByText('Fantasy');
        
        fireEvent.click(fantasyButton);
        
        expect(onFilterChange).toHaveBeenCalledWith(['Fantasy']);
    });
});
