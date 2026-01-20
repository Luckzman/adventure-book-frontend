import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameOverScreen } from '../GameOverScreen';
import type { GameSection } from '../../../services/booksApi';

describe('GameOverScreen', () => {
    const defaultProps = {
        currentSection: undefined,
        onRestart: vi.fn(),
        onBackToLibrary: vi.fn(),
    };

    it('renders death screen when status is died', () => {
        render(<GameOverScreen {...defaultProps} status="died" />);
        expect(screen.getByText('You Died')).toBeInTheDocument();
        expect(screen.getByText(/Your health reached zero/)).toBeInTheDocument();
    });

    it('renders end screen when status is ended', () => {
        render(<GameOverScreen {...defaultProps} status="ended" currentSection={undefined} />);
        expect(screen.getByText('The End')).toBeInTheDocument();
        expect(screen.getByText(/Your adventure has concluded successfully/)).toBeInTheDocument();
    });

    it('displays current section text when provided for death', () => {
        const section: GameSection = {
            id: '1',
            text: 'You fell into a pit',
            type: 'NODE',
            options: [],
        };
        render(<GameOverScreen {...defaultProps} status="died" currentSection={section} />);
        expect(screen.getByText('"You fell into a pit"')).toBeInTheDocument();
    });

    it('displays current section text when provided for end', () => {
        const section: GameSection = {
            id: '1',
            text: 'You found the treasure',
            type: 'END',
            options: null,
        };
        render(<GameOverScreen {...defaultProps} status="ended" currentSection={section} />);
        expect(screen.getByText('"You found the treasure"')).toBeInTheDocument();
    });

    it('calls onRestart when restart button is clicked on death screen', () => {
        const onRestart = vi.fn();
        render(<GameOverScreen {...defaultProps} status="died" onRestart={onRestart} currentSection={undefined} />);
        const restartButton = screen.getByText('Restart Adventure');
        restartButton.click();
        expect(onRestart).toHaveBeenCalledTimes(1);
    });

    it('calls onRestart when play again button is clicked on end screen', () => {
        const onRestart = vi.fn();
        render(<GameOverScreen {...defaultProps} status="ended" onRestart={onRestart} currentSection={undefined} />);
        const playAgainButton = screen.getByText('Play Again');
        playAgainButton.click();
        expect(onRestart).toHaveBeenCalledTimes(1);
    });

    it('calls onBackToLibrary when back button is clicked on death screen', () => {
        const onBackToLibrary = vi.fn();
        render(<GameOverScreen {...defaultProps} status="died" onBackToLibrary={onBackToLibrary} currentSection={undefined} />);
        const backButton = screen.getByText('Back to Library');
        backButton.click();
        expect(onBackToLibrary).toHaveBeenCalledTimes(1);
    });

    it('calls onBackToLibrary when back button is clicked on end screen', () => {
        const onBackToLibrary = vi.fn();
        render(<GameOverScreen {...defaultProps} status="ended" onBackToLibrary={onBackToLibrary} currentSection={undefined} />);
        const backButton = screen.getByText('Back to Library');
        backButton.click();
        expect(onBackToLibrary).toHaveBeenCalledTimes(1);
    });

    it('does not display section text when not provided', () => {
        render(<GameOverScreen {...defaultProps} status="died" currentSection={undefined} />);
        expect(screen.queryByText(/"/)).not.toBeInTheDocument();
    });
});
