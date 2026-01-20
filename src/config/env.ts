/**
 * Environment configuration
 * Centralized access to environment variables with defaults
 */

export const config = {
    api: {
        baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
        timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
    },
    features: {
        enableSave: import.meta.env.VITE_ENABLE_SAVE === 'true',
    },
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
} as const;
