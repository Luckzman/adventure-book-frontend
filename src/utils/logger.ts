/**
 * Logger utility
 * Centralized logging that respects environment
 * In production, only errors are logged
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
    /**
     * Log informational messages (development only)
     */
    log: (...args: unknown[]): void => {
        if (isDevelopment) {
            console.log(...args);
        }
    },

    /**
     * Log warnings (development only)
     */
    warn: (...args: unknown[]): void => {
        if (isDevelopment) {
            console.warn(...args);
        }
    },

    /**
     * Log errors (always logged, even in production)
     * In production, these should be sent to error tracking service
     */
    error: (...args: unknown[]): void => {
        console.error(...args);
        // TODO: In production, send to error tracking service (e.g., Sentry)
        // if (import.meta.env.PROD) {
        //     errorTrackingService.captureException(args);
        // }
    },

    /**
     * Log debug messages (development only)
     */
    debug: (...args: unknown[]): void => {
        if (isDevelopment) {
            console.debug(...args);
        }
    },
};
