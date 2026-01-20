/**
 * Tests for gameReducer
 * Tests all game state transitions and business logic
 */

import { describe, it, expect } from 'vitest';
import { gameReducer, INITIAL_GAME_STATE } from '../gameReducer';
import type { GameState, GameAction } from '../gameTypes';
import type { GameDataResponse } from '../../../services/booksApi';

describe('gameReducer', () => {
    describe('LOAD_GAME_START', () => {
        it('should reset state and set status to loading', () => {
            const state: GameState = {
                ...INITIAL_GAME_STATE,
                status: 'playing',
                health: 5,
                currentSectionId: '1',
            };

            const action: GameAction = { type: 'LOAD_GAME_START' };
            const result = gameReducer(state, action);

            expect(result.status).toBe('loading');
            expect(result.health).toBe(INITIAL_GAME_STATE.health);
            expect(result.currentSectionId).toBeNull();
        });
    });

    describe('LOAD_GAME_SUCCESS', () => {
        const mockGameData: GameDataResponse = {
            title: 'Test Adventure',
            author: 'Test Author',
            difficulty: 'MEDIUM',
            type: '',
            sections: [
                {
                    id: '1',
                    text: 'Beginning',
                    type: 'BEGIN',
                    options: [
                        {
                            description: 'Go to section 2',
                            gotoId: '2',
                            consequence: null,
                        },
                    ],
                },
                {
                    id: '2',
                    text: 'Middle',
                    type: 'NODE',
                    options: [
                        {
                            description: 'Go to end',
                            gotoId: '3',
                            consequence: null,
                        },
                    ],
                },
                {
                    id: '3',
                    text: 'End',
                    type: 'END',
                    options: null,
                },
            ],
        };

        it('should load game data and set initial section', () => {
            const action: GameAction = {
                type: 'LOAD_GAME_SUCCESS',
                payload: mockGameData,
            };
            const result = gameReducer(INITIAL_GAME_STATE, action);

            expect(result.gameData).toEqual(mockGameData);
            expect(result.currentSectionId).toBe('1');
            expect(result.status).toBe('playing');
            expect(result.visitedSectionIds.has('1')).toBe(true);
            expect(result.error).toBeNull();
        });

        it('should set error if no BEGIN section exists', () => {
            const invalidGameData: GameDataResponse = {
                ...mockGameData,
                sections: [
                    {
                        id: '1',
                        text: 'No begin',
                        type: 'NODE',
                        options: null,
                    },
                ],
            };

            const action: GameAction = {
                type: 'LOAD_GAME_SUCCESS',
                payload: invalidGameData,
            };
            const result = gameReducer(INITIAL_GAME_STATE, action);

            expect(result.status).toBe('error');
            expect(result.error).toContain('No BEGIN section found');
        });
    });

    describe('LOAD_GAME_ERROR', () => {
        it('should set error status and message', () => {
            const action: GameAction = {
                type: 'LOAD_GAME_ERROR',
                payload: 'Failed to load game',
            };
            const result = gameReducer(INITIAL_GAME_STATE, action);

            expect(result.status).toBe('error');
            expect(result.error).toBe('Failed to load game');
        });
    });

    describe('PAUSE_GAME', () => {
        it('should pause game when playing', () => {
            const state: GameState = {
                ...INITIAL_GAME_STATE,
                status: 'playing',
            };

            const action: GameAction = { type: 'PAUSE_GAME' };
            const result = gameReducer(state, action);

            expect(result.status).toBe('paused');
        });

        it('should not pause if not playing', () => {
            const state: GameState = {
                ...INITIAL_GAME_STATE,
                status: 'paused',
            };

            const action: GameAction = { type: 'PAUSE_GAME' };
            const result = gameReducer(state, action);

            expect(result.status).toBe('paused'); // Unchanged
        });
    });

    describe('RESUME_GAME', () => {
        it('should resume game when paused', () => {
            const state: GameState = {
                ...INITIAL_GAME_STATE,
                status: 'paused',
            };

            const action: GameAction = { type: 'RESUME_GAME' };
            const result = gameReducer(state, action);

            expect(result.status).toBe('playing');
        });

        it('should not resume if not paused', () => {
            const state: GameState = {
                ...INITIAL_GAME_STATE,
                status: 'playing',
            };

            const action: GameAction = { type: 'RESUME_GAME' };
            const result = gameReducer(state, action);

            expect(result.status).toBe('playing'); // Unchanged
        });
    });

    describe('MAKE_CHOICE', () => {
        const gameStateWithData: GameState = {
            ...INITIAL_GAME_STATE,
            status: 'playing',
            health: 10,
            maxHealth: 10,
            gameData: {
                title: 'Test',
                author: 'Author',
                difficulty: 'MEDIUM',
                type: '',
                sections: [
                    {
                        id: '1',
                        text: 'Start',
                        type: 'BEGIN',
                        options: [
                            {
                                description: 'Go to 2',
                                gotoId: '2',
                                consequence: null,
                            },
                        ],
                    },
                    {
                        id: '2',
                        text: 'Middle',
                        type: 'NODE',
                        options: [
                            {
                                description: 'Go to 3',
                                gotoId: '3',
                                consequence: null,
                            },
                        ],
                    },
                    {
                        id: '3',
                        text: 'End',
                        type: 'END',
                        options: null,
                    },
                ],
            },
            currentSectionId: '1',
        };

        it('should navigate to target section', () => {
            const action: GameAction = {
                type: 'MAKE_CHOICE',
                payload: {
                    gotoId: '2',
                    consequence: null,
                },
            };
            const result = gameReducer(gameStateWithData, action);

            expect(result.currentSectionId).toBe('2');
            expect(result.visitedSectionIds.has('2')).toBe(true);
            expect(result.status).toBe('playing');
        });

        it('should apply health loss consequence', () => {
            const action: GameAction = {
                type: 'MAKE_CHOICE',
                payload: {
                    gotoId: '2',
                    consequence: {
                        type: 'LOSE_HEALTH',
                        value: '3',
                        text: 'You lost health',
                    },
                },
            };
            const result = gameReducer(gameStateWithData, action);

            expect(result.health).toBe(7);
            expect(result.lastConsequence).toEqual({
                type: 'LOSE_HEALTH',
                value: 3,
                text: 'You lost health',
            });
        });

        it('should set status to died when health reaches zero', () => {
            const lowHealthState: GameState = {
                ...gameStateWithData,
                health: 2,
            };

            const action: GameAction = {
                type: 'MAKE_CHOICE',
                payload: {
                    gotoId: '2',
                    consequence: {
                        type: 'LOSE_HEALTH',
                        value: '5',
                        text: 'You died',
                    },
                },
            };
            const result = gameReducer(lowHealthState, action);

            expect(result.health).toBe(0);
            expect(result.status).toBe('died');
        });

        it('should set status to ended when reaching END section', () => {
            const action: GameAction = {
                type: 'MAKE_CHOICE',
                payload: {
                    gotoId: '3',
                    consequence: null,
                },
            };
            const result = gameReducer(gameStateWithData, action);

            expect(result.status).toBe('ended');
            expect(result.currentSectionId).toBe('3');
        });

        it('should set status to dead_end for NODE section with no options', () => {
            const stateWithDeadEnd: GameState = {
                ...gameStateWithData,
                gameData: {
                    ...gameStateWithData.gameData!,
                    sections: [
                        ...gameStateWithData.gameData!.sections,
                        {
                            id: '4',
                            text: 'Dead end',
                            type: 'NODE',
                            options: null,
                        },
                    ],
                },
            };

            const action: GameAction = {
                type: 'MAKE_CHOICE',
                payload: {
                    gotoId: '4',
                    consequence: null,
                },
            };
            const result = gameReducer(stateWithDeadEnd, action);

            expect(result.status).toBe('dead_end');
        });

        it('should set status to dead_end for invalid section reference', () => {
            const action: GameAction = {
                type: 'MAKE_CHOICE',
                payload: {
                    gotoId: '999',
                    consequence: null,
                },
            };
            const result = gameReducer(gameStateWithData, action);

            expect(result.status).toBe('dead_end');
            expect(result.error).toContain('does not exist');
        });

        it('should not process choice if game is not playing', () => {
            const pausedState: GameState = {
                ...gameStateWithData,
                status: 'paused',
            };

            const action: GameAction = {
                type: 'MAKE_CHOICE',
                payload: {
                    gotoId: '2',
                    consequence: null,
                },
            };
            const result = gameReducer(pausedState, action);

            expect(result.status).toBe('paused');
            expect(result.currentSectionId).toBe('1'); // Unchanged
        });
    });

    describe('RESET_GAME', () => {
        it('should reset to initial state', () => {
            const state: GameState = {
                ...INITIAL_GAME_STATE,
                status: 'playing',
                health: 5,
                currentSectionId: '1',
            };

            const action: GameAction = { type: 'RESET_GAME' };
            const result = gameReducer(state, action);

            expect(result).toEqual(INITIAL_GAME_STATE);
        });
    });

    describe('DISMISS_ERROR', () => {
        it('should clear error', () => {
            const state: GameState = {
                ...INITIAL_GAME_STATE,
                error: 'Some error',
            };

            const action: GameAction = { type: 'DISMISS_ERROR' };
            const result = gameReducer(state, action);

            expect(result.error).toBeNull();
        });
    });

    describe('DISMISS_CONSEQUENCE', () => {
        it('should clear last consequence', () => {
            const state: GameState = {
                ...INITIAL_GAME_STATE,
                lastConsequence: {
                    type: 'LOSE_HEALTH',
                    value: 3,
                    text: 'Lost health',
                },
            };

            const action: GameAction = { type: 'DISMISS_CONSEQUENCE' };
            const result = gameReducer(state, action);

            expect(result.lastConsequence).toBeNull();
        });
    });
});
