import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameErrorDisplay } from '../GameErrorDisplay';

describe('GameErrorDisplay', () => {
    const defaultProps = {
        onBack: vi.fn(),
    };

    it('renders error display', () => {
        render(<GameErrorDisplay {...defaultProps} error="Test error" />);
        expect(screen.getByText('Unable to Load Adventure')).toBeInTheDocument();
        expect(screen.getByText(/We encountered a problem loading this adventure/)).toBeInTheDocument();
    });

    it('displays error message', () => {
        render(<GameErrorDisplay {...defaultProps} error="Failed to fetch game data" />);
        expect(screen.getByText('Failed to fetch game data')).toBeInTheDocument();
    });

    it('calls onBack when back button is clicked', () => {
        const onBack = vi.fn();
        render(<GameErrorDisplay onBack={onBack} error="Test error" />);
        const backButton = screen.getByText('Back to Library');
        backButton.click();
        expect(onBack).toHaveBeenCalledTimes(1);
    });
});
