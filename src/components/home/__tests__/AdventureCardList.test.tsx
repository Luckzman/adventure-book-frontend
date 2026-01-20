import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdventureCardList } from '../AdventureCardList';
import type { Adventure } from '../AdventureCard';

const mockAdventures: Adventure[] = [
    {
        path: 'test1.json',
        title: 'Adventure 1',
        author: 'Author 1',
        description: 'Description 1',
        difficulty: 'Easy',
        genre: 'Fantasy',
        duration: '30 min',
        chapters: 1,
        tags: ['tag1'],
    },
    {
        path: 'test2.json',
        title: 'Adventure 2',
        author: 'Author 2',
        description: 'Description 2',
        difficulty: 'Medium',
        genre: 'Adventure',
        duration: '60 min',
        chapters: 2,
        tags: ['tag2'],
    },
];

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>{children}</BrowserRouter>
);

describe('AdventureCardList', () => {
    it('renders all adventure cards', () => {
        render(<AdventureCardList adventures={mockAdventures} />, { wrapper });
        expect(screen.getByText('Adventure 1')).toBeInTheDocument();
        expect(screen.getByText('Adventure 2')).toBeInTheDocument();
    });

    it('renders empty message when adventures array is empty', () => {
        render(<AdventureCardList adventures={[]} />, { wrapper });
        expect(screen.getByText(/No adventures found/)).toBeInTheDocument();
    });

    it('renders correct number of cards', () => {
        const { container } = render(<AdventureCardList adventures={mockAdventures} />, { wrapper });
        const cards = container.querySelectorAll('article');
        expect(cards).toHaveLength(2);
    });
});
