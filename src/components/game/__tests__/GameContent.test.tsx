import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameContent } from '../GameContent';
import type { GameState } from '../../../domain/game/gameTypes';
import { INITIAL_GAME_STATE } from '../../../domain/game/gameTypes';

describe('GameContent', () => {
    const defaultProps = {
        gameTitle: 'Test Adventure',
        currentSection: {
            id: '1',
            text: 'You are at the start',
            type: 'BEGIN' as const,
            options: [],
        },
        choices: [],
        state: INITIAL_GAME_STATE,
        onChoiceSelect: vi.fn(),
        onDismissConsequence: vi.fn(),
        onDismissError: vi.fn(),
        isPaused: false,
    };

    it('renders section view when currentSection is provided', () => {
        render(<GameContent {...defaultProps} />);
        expect(screen.getByText('Test Adventure')).toBeInTheDocument();
        expect(screen.getByText('You are at the start')).toBeInTheDocument();
    });

    it('displays no game data message when currentSection is undefined', () => {
        render(<GameContent {...defaultProps} currentSection={undefined} />);
        expect(screen.getByText('No Game Data Available')).toBeInTheDocument();
        expect(screen.getByText(/Unable to load game content/)).toBeInTheDocument();
    });

    it('displays consequence feedback when lastConsequence exists', () => {
        const stateWithConsequence: GameState = {
            ...INITIAL_GAME_STATE,
            lastConsequence: {
                type: 'LOSE_HEALTH',
                value: 3,
                text: 'You were injured',
            },
        };
        render(<GameContent {...defaultProps} state={stateWithConsequence} />);
        expect(screen.getByText(/You lost 3 health points/)).toBeInTheDocument();
    });

    it('displays error banner when error exists', () => {
        const stateWithError: GameState = {
            ...INITIAL_GAME_STATE,
            error: 'Navigation error occurred',
        };
        render(<GameContent {...defaultProps} state={stateWithError} />);
        expect(screen.getByText('Navigation Error')).toBeInTheDocument();
        expect(screen.getByText('Navigation error occurred')).toBeInTheDocument();
    });

    it('passes disabled prop to SectionView when paused', () => {
        const choices = [
            {
                id: '1',
                number: 1,
                text: 'First choice',
                description: 'Choose this',
            },
        ];
        render(<GameContent {...defaultProps} choices={choices} isPaused={true} />);
        const choiceButton = screen.getByText('First choice').closest('button');
        expect(choiceButton).toBeDisabled();
    });

    it('calls onDismissConsequence when consequence is dismissed', () => {
        const onDismissConsequence = vi.fn();
        const stateWithConsequence: GameState = {
            ...INITIAL_GAME_STATE,
            lastConsequence: {
                type: 'LOSE_HEALTH',
                value: 3,
                text: 'You were injured',
            },
        };
        render(
            <GameContent
                {...defaultProps}
                state={stateWithConsequence}
                onDismissConsequence={onDismissConsequence}
            />
        );
        const dismissButton = screen.getByLabelText('Dismiss');
        dismissButton.click();
        expect(onDismissConsequence).toHaveBeenCalledTimes(1);
    });

    it('calls onDismissError when error is dismissed', () => {
        const onDismissError = vi.fn();
        const stateWithError: GameState = {
            ...INITIAL_GAME_STATE,
            error: 'Navigation error occurred',
        };
        render(
            <GameContent {...defaultProps} state={stateWithError} onDismissError={onDismissError} />
        );
        const dismissButton = screen.getByLabelText('Dismiss error');
        dismissButton.click();
        expect(onDismissError).toHaveBeenCalledTimes(1);
    });
});
