import type { GameState } from './gameTypes';
import type { GameSection } from '../../services/booksApi';
import { GAME_CONSTANTS } from './gameConstants';

/**
 * Get current section data
 * Derived from currentSectionId and gameData
 */
export const selectCurrentSection = (state: GameState): GameSection | undefined => {
    if (!state.gameData || !state.currentSectionId) {
        return undefined;
    }
    return state.gameData.sections.find((section) => section.id === state.currentSectionId);
};

/**
 * Get health percentage (0-100)
 * Derived from health and maxHealth
 */
export const selectHealthPercentage = (state: GameState): number => {
    if (state.maxHealth === 0) return 0;
    return Math.round((state.health / state.maxHealth) * 100);
};

/**
 * Get health status for visual feedback
 * Derived from health percentage
 */
export const selectHealthStatus = (
    state: GameState
): 'healthy' | 'warning' | 'danger' | 'critical' => {
    const percentage = selectHealthPercentage(state);
    const { HEALTHY, WARNING, DANGER } = GAME_CONSTANTS.HEALTH_THRESHOLDS;

    if (percentage >= HEALTHY) return 'healthy';
    if (percentage >= WARNING) return 'warning';
    if (percentage >= DANGER) return 'danger';
    return 'critical';
};

/**
 * Get choices for current section
 * Derived from current section options
 */
export const selectChoices = (state: GameState) => {
    const currentSection = selectCurrentSection(state);
    if (!currentSection?.options) {
        return [];
    }

    return currentSection.options.map((option, index) => ({
        id: option.gotoId,
        number: index + 1,
        text: option.description,
        description: option.consequence ? option.consequence.text : '',
        requirement: undefined,
        consequence: option.consequence,
    }));
};

/**
 * Check if game is active (can make choices)
 */
export const selectIsGameActive = (state: GameState): boolean => {
    return state.status === 'playing';
};

/**
 * Check if game is paused
 */
export const selectIsGamePaused = (state: GameState): boolean => {
    return state.status === 'paused';
};

/**
 * Get game title
 * Derived from gameData
 */
export const selectGameTitle = (state: GameState): string => {
    return state.gameData?.title || '';
};
