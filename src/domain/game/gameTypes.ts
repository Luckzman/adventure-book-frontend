import type { GameDataResponse } from '../../services/booksApi';

/**
 * Game state interface
 * Follows domain-driven design: game logic is separate from UI
 */
export interface GameState {
    // Game data
    gameData: GameDataResponse | null;
    currentSectionId: string | null;

    // Player state
    health: number;
    maxHealth: number;

    // Game state
    status: 'loading' | 'playing' | 'paused' | 'ended' | 'died' | 'dead_end' | 'error';
    error: string | null;

    // Visited sections for progression tracking (derived state)
    visitedSectionIds: Set<string>;

    // Last consequence applied (for feedback)
    lastConsequence: {
        type: string;
        value: number;
        text: string;
    } | null;
}

/**
 * Game actions
 * Intent-driven actions - UI doesn't know game rules
 */
export type GameAction =
    | { type: 'LOAD_GAME_START' }
    | { type: 'LOAD_GAME_SUCCESS'; payload: GameDataResponse }
    | { type: 'LOAD_GAME_ERROR'; payload: string }
    | {
        type: 'MAKE_CHOICE';
        payload: {
            gotoId: string;
            consequence: {
                type: string;
                value: string;
                text: string;
            } | null;
        };
    }
    | { type: 'PAUSE_GAME' }
    | { type: 'RESUME_GAME' }
    | { type: 'RESET_GAME' }
    | { type: 'DISMISS_ERROR' }
    | { type: 'DISMISS_CONSEQUENCE' };

/**
 * Initial game state
 */
export const INITIAL_GAME_STATE: GameState = {
    gameData: null,
    currentSectionId: null,
    health: 10,
    maxHealth: 10,
    status: 'loading',
    error: null,
    visitedSectionIds: new Set(),
    lastConsequence: null,
};
