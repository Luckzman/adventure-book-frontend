import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

describe('Header', () => {
    it('renders header with title', () => {
        render(<Header />);
        expect(screen.getByText('Adventure Awaits')).toBeInTheDocument();
    });

    it('displays adventure count when provided', () => {
        render(<Header adventureCount={5} />);
        expect(screen.getByText('5 Epic Adventures Available')).toBeInTheDocument();
    });

    it('displays singular form for 1 adventure', () => {
        render(<Header adventureCount={1} />);
        expect(screen.getByText('1 Epic Adventure Available')).toBeInTheDocument();
    });

    it('displays loading message when count is 0', () => {
        render(<Header adventureCount={0} />);
        expect(screen.getByText('Loading Adventures...')).toBeInTheDocument();
    });

    it('uses default adventure count of 4', () => {
        render(<Header />);
        expect(screen.getByText('4 Epic Adventures Available')).toBeInTheDocument();
    });

    it('renders description text', () => {
        render(<Header />);
        expect(screen.getByText(/Embark on epic quests/)).toBeInTheDocument();
    });
});
