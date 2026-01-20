/**
 * Game Constants
 * Centralized constants to avoid magic numbers throughout the codebase
 */

export const GAME_CONSTANTS = {
    INITIAL_HEALTH: 10,
    MAX_HEALTH: 10,
    HEALTH_THRESHOLDS: {
        HEALTHY: 70,
        WARNING: 50,
        DANGER: 25,
    },
} as const;
