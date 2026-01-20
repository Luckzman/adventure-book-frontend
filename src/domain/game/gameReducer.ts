import type { GameState, GameAction } from './gameTypes';
import { INITIAL_GAME_STATE } from './gameTypes';

// Re-export for convenience
export { INITIAL_GAME_STATE, type GameAction } from './gameTypes';

/**
 * Game reducer
 * All game logic lives here - components are "dumb" and just dispatch actions
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'LOAD_GAME_START':
            return {
                ...INITIAL_GAME_STATE,
                status: 'loading',
            };

        case 'LOAD_GAME_SUCCESS': {
            const gameData = action.payload;
            const beginSection = gameData.sections.find((s) => s.type === 'BEGIN');

            if (!beginSection) {
                return {
                    ...state,
                    status: 'error',
                    error: 'Game data is invalid: No BEGIN section found.',
                };
            }

            return {
                ...state,
                gameData,
                currentSectionId: beginSection.id,
                status: 'playing',
                visitedSectionIds: new Set([beginSection.id]),
                error: null,
            };
        }

        case 'LOAD_GAME_ERROR':
            return {
                ...state,
                status: 'error',
                error: action.payload,
            };

        case 'MAKE_CHOICE': {
            const { gotoId, consequence } = action.payload;

            // Check if game is still active
            if (state.status !== 'playing') {
                return state;
            }

            // Find target section
            const targetSection = state.gameData?.sections.find((s) => s.id === gotoId);
            if (!targetSection) {
                return {
                    ...state,
                    error: `Section "${gotoId}" does not exist. This may be an invalid reference in the book data.`,
                };
            }

            // Apply consequence if present
            let newHealth = state.health;
            let lastConsequence = null;

            if (consequence && consequence.type === 'LOSE_HEALTH') {
                const healthLoss = parseInt(consequence.value, 10) || 0;
                newHealth = Math.max(0, state.health - healthLoss);
                lastConsequence = {
                    type: consequence.type,
                    value: healthLoss,
                    text: consequence.text,
                };
            }

            // Check if player died
            const isDead = newHealth <= 0;
            const isEndSection = targetSection.type === 'END';

            // Update visited sections
            const newVisitedSections = new Set(state.visitedSectionIds);
            newVisitedSections.add(gotoId);

            return {
                ...state,
                currentSectionId: gotoId,
                health: newHealth,
                visitedSectionIds: newVisitedSections,
                lastConsequence,
                status: isDead ? 'died' : isEndSection ? 'ended' : 'playing',
                error: null, // Clear error on successful navigation
            };
        }

        case 'RESET_GAME':
            return {
                ...INITIAL_GAME_STATE,
            };

        case 'DISMISS_ERROR':
            return {
                ...state,
                error: null,
            };

        case 'DISMISS_CONSEQUENCE':
            return {
                ...state,
                lastConsequence: null,
            };

        default:
            return state;
    }
}
