import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdventureCard, type Adventure } from '../AdventureCard';

const mockAdventure: Adventure = {
    path: 'test-adventure.json',
    title: 'Test Adventure',
    author: 'Test Author',
    description: 'A test adventure description',
    difficulty: 'Easy',
    genre: 'Fantasy',
    duration: '30 min',
    chapters: 5,
    tags: ['adventure', 'magic'],
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>{children}</BrowserRouter>
);

describe('AdventureCard', () => {
    it('renders adventure card with all information', () => {
        render(<AdventureCard adventure={mockAdventure} />, { wrapper });
        expect(screen.getByText('Test Adventure')).toBeInTheDocument();
        expect(screen.getByText('by Test Author')).toBeInTheDocument();
        expect(screen.getByText('A test adventure description')).toBeInTheDocument();
    });

    it('displays difficulty badge', () => {
        render(<AdventureCard adventure={mockAdventure} />, { wrapper });
        expect(screen.getByText('Easy')).toBeInTheDocument();
    });

    it('displays genre badge', () => {
        render(<AdventureCard adventure={mockAdventure} />, { wrapper });
        expect(screen.getByText('Fantasy')).toBeInTheDocument();
    });

    it('displays duration and chapters', () => {
        render(<AdventureCard adventure={mockAdventure} />, { wrapper });
        expect(screen.getByText('30 min')).toBeInTheDocument();
        expect(screen.getByText('5 chapters')).toBeInTheDocument();
    });

    it('displays all tags', () => {
        render(<AdventureCard adventure={mockAdventure} />, { wrapper });
        expect(screen.getByText('adventure')).toBeInTheDocument();
        expect(screen.getByText('magic')).toBeInTheDocument();
    });

    it('does not display tags section when tags array is empty', () => {
        const adventureWithoutTags = { ...mockAdventure, tags: [] };
        render(<AdventureCard adventure={adventureWithoutTags} />, { wrapper });
        expect(screen.queryByText('adventure')).not.toBeInTheDocument();
    });

    it('renders begin quest button', () => {
        render(<AdventureCard adventure={mockAdventure} />, { wrapper });
        expect(screen.getByLabelText('Begin quest: Test Adventure')).toBeInTheDocument();
        expect(screen.getByText('Begin Quest')).toBeInTheDocument();
    });

    it('applies correct difficulty colors for Easy', () => {
        const { container } = render(<AdventureCard adventure={mockAdventure} />, { wrapper });
        const easyBadge = screen.getByText('Easy');
        expect(easyBadge).toHaveClass('bg-[#DDFCE7]');
    });

    it('applies correct difficulty colors for Medium', () => {
        const mediumAdventure = { ...mockAdventure, difficulty: 'Medium' as const };
        render(<AdventureCard adventure={mediumAdventure} />, { wrapper });
        const mediumBadge = screen.getByText('Medium');
        expect(mediumBadge).toHaveClass('bg-[#FFF2C9]');
    });

    it('applies correct difficulty colors for Hard', () => {
        const hardAdventure = { ...mockAdventure, difficulty: 'Hard' as const };
        render(<AdventureCard adventure={hardAdventure} />, { wrapper });
        const hardBadge = screen.getByText('Hard');
        expect(hardBadge).toHaveClass('bg-[#FFE1E1]');
    });
});
