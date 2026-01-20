/**
 * Tests for game selectors
 * Tests all derived state calculations
 */

import { describe, it, expect } from 'vitest';
import {
    selectCurrentSection,
    selectHealthPercentage,
    selectHealthStatus,
    selectChoices,
    selectIsGameActive,
    selectIsGamePaused,
    selectGameTitle,
} from '../gameSelectors';
import type { GameState } from '../gameTypes';
import { INITIAL_GAME_STATE } from '../gameTypes';

describe('gameSelectors', () => {
    const mockGameState: GameState = {
        ...INITIAL_GAME_STATE,
        gameData: {
            title: 'Test Adventure',
            author: 'Test Author',
            difficulty: 'MEDIUM',
            type: '',
            sections: [
                {
                    id: '1',
                    text: 'Section 1',
                    type: 'BEGIN',
                    options: [
                        {
                            description: 'Choice 1',
                            gotoId: '2',
                            consequence: {
                                type: 'LOSE_HEALTH',
                                value: '2',
                                text: 'You lost health',
                            },
                        },
                        {
                            description: 'Choice 2',
                            gotoId: '3',
                            consequence: null,
                        },
                    ],
                },
                {
                    id: '2',
                    text: 'Section 2',
                    type: 'NODE',
                    options: null,
                },
            ],
        },
        currentSectionId: '1',
        health: 8,
        maxHealth: 10,
    };

    describe('selectCurrentSection', () => {
        it('should return current section when available', () => {
            const result = selectCurrentSection(mockGameState);
            expect(result?.id).toBe('1');
            expect(result?.text).toBe('Section 1');
        });

        it('should return undefined when no game data', () => {
            const state: GameState = {
                ...INITIAL_GAME_STATE,
                currentSectionId: '1',
            };
            const result = selectCurrentSection(state);
            expect(result).toBeUndefined();
        });

        it('should return undefined when no current section ID', () => {
            const state: GameState = {
                ...mockGameState,
                currentSectionId: null,
            };
            const result = selectCurrentSection(state);
            expect(result).toBeUndefined();
        });
    });

    describe('selectHealthPercentage', () => {
        it('should calculate correct percentage', () => {
            const result = selectHealthPercentage(mockGameState);
            expect(result).toBe(80); // 8/10 * 100
        });

        it('should return 0 when maxHealth is 0', () => {
            const state: GameState = {
                ...mockGameState,
                maxHealth: 0,
            };
            const result = selectHealthPercentage(state);
            expect(result).toBe(0);
        });

        it('should handle full health', () => {
            const state: GameState = {
                ...mockGameState,
                health: 10,
                maxHealth: 10,
            };
            const result = selectHealthPercentage(state);
            expect(result).toBe(100);
        });
    });

    describe('selectHealthStatus', () => {
        it('should return healthy for >= 70%', () => {
            const state: GameState = {
                ...mockGameState,
                health: 8,
                maxHealth: 10,
            };
            const result = selectHealthStatus(state);
            expect(result).toBe('healthy');
        });

        it('should return warning for >= 50% and < 70%', () => {
            const state: GameState = {
                ...mockGameState,
                health: 5,
                maxHealth: 10,
            };
            const result = selectHealthStatus(state);
            expect(result).toBe('warning');
        });

        it('should return danger for >= 25% and < 50%', () => {
            const state: GameState = {
                ...mockGameState,
                health: 3,
                maxHealth: 10,
            };
            const result = selectHealthStatus(state);
            expect(result).toBe('danger');
        });

        it('should return critical for < 25%', () => {
            const state: GameState = {
                ...mockGameState,
                health: 2,
                maxHealth: 10,
            };
            const result = selectHealthStatus(state);
            expect(result).toBe('critical');
        });
    });

    describe('selectChoices', () => {
        it('should return formatted choices', () => {
            const result = selectChoices(mockGameState);
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                id: '2',
                number: 1,
                text: 'Choice 1',
                description: 'You lost health',
                requirement: undefined,
                consequence: {
                    type: 'LOSE_HEALTH',
                    value: '2',
                    text: 'You lost health',
                },
            });
        });

        it('should return empty array when no options', () => {
            const state: GameState = {
                ...mockGameState,
                currentSectionId: '2',
            };
            const result = selectChoices(state);
            expect(result).toEqual([]);
        });

        it('should return empty array when no current section', () => {
            const state: GameState = {
                ...mockGameState,
                currentSectionId: null,
            };
            const result = selectChoices(state);
            expect(result).toEqual([]);
        });
    });

    describe('selectIsGameActive', () => {
        it('should return true when playing', () => {
            const state: GameState = {
                ...mockGameState,
                status: 'playing',
            };
            const result = selectIsGameActive(state);
            expect(result).toBe(true);
        });

        it('should return false when not playing', () => {
            const state: GameState = {
                ...mockGameState,
                status: 'paused',
            };
            const result = selectIsGameActive(state);
            expect(result).toBe(false);
        });
    });

    describe('selectIsGamePaused', () => {
        it('should return true when paused', () => {
            const state: GameState = {
                ...mockGameState,
                status: 'paused',
            };
            const result = selectIsGamePaused(state);
            expect(result).toBe(true);
        });

        it('should return false when not paused', () => {
            const state: GameState = {
                ...mockGameState,
                status: 'playing',
            };
            const result = selectIsGamePaused(state);
            expect(result).toBe(false);
        });
    });

    describe('selectGameTitle', () => {
        it('should return game title', () => {
            const result = selectGameTitle(mockGameState);
            expect(result).toBe('Test Adventure');
        });

        it('should return empty string when no game data', () => {
            const state: GameState = {
                ...INITIAL_GAME_STATE,
            };
            const result = selectGameTitle(state);
            expect(result).toBe('');
        });
    });
});
