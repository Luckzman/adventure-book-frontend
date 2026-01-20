import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DeadEndScreen } from '../DeadEndScreen';
import type { GameSection } from '../../../services/booksApi';

describe('DeadEndScreen', () => {
    const defaultProps = {
        currentSection: undefined,
        onRestart: vi.fn(),
        onBackToLibrary: vi.fn(),
    };

    it('renders dead end screen', () => {
        render(<DeadEndScreen {...defaultProps} />);
        expect(screen.getByText('Dead End')).toBeInTheDocument();
        expect(screen.getByText(/Your adventure has reached a dead end/)).toBeInTheDocument();
    });

    it('displays current section text when provided', () => {
        const section: GameSection = {
            id: '1',
            text: 'You reached a dead end',
            type: 'NODE',
            options: null,
        };
        render(<DeadEndScreen {...defaultProps} currentSection={section} />);
        expect(screen.getByText('"You reached a dead end"')).toBeInTheDocument();
    });

    it('does not display section text when not provided', () => {
        render(<DeadEndScreen {...defaultProps} currentSection={undefined} />);
        expect(screen.queryByText(/"/)).not.toBeInTheDocument();
    });

    it('calls onRestart when restart button is clicked', () => {
        const onRestart = vi.fn();
        render(<DeadEndScreen {...defaultProps} onRestart={onRestart} currentSection={undefined} />);
        const restartButton = screen.getByText('Restart Adventure');
        restartButton.click();
        expect(onRestart).toHaveBeenCalledTimes(1);
    });

    it('calls onBackToLibrary when back button is clicked', () => {
        const onBackToLibrary = vi.fn();
        render(<DeadEndScreen {...defaultProps} onBackToLibrary={onBackToLibrary} currentSection={undefined} />);
        const backButton = screen.getByText('Back to Library');
        backButton.click();
        expect(onBackToLibrary).toHaveBeenCalledTimes(1);
    });
});
