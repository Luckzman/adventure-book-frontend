/**
 * Error message utilities
 * Converts technical error messages into user-friendly ones
 */

/**
 * Formats HTTP error messages into user-friendly text
 */
export const formatHttpError = (status: number): string => {
    switch (status) {
        case 400:
            return 'The request was invalid. Please try again.';
        case 401:
            return 'You are not authorized to access this resource.';
        case 403:
            return 'Access forbidden. You do not have permission to view this content.';
        case 404:
            return 'The requested adventure could not be found.';
        case 500:
            return 'The server encountered an error. Please try again in a moment.';
        case 502:
            return 'The server is temporarily unavailable. Please try again later.';
        case 503:
            return 'The service is temporarily unavailable. Please try again in a moment.';
        case 504:
            return 'The server took too long to respond. Please try again.';
        default:
            if (status >= 500) {
                return 'The server encountered an error. Please try again in a moment.';
            }
            if (status >= 400) {
                return 'There was a problem with your request. Please try again.';
            }
            return `An error occurred (${status}). Please try again.`;
    }
};

/**
 * Formats network errors into user-friendly text
 */
export const formatNetworkError = (error: Error | string): string => {
    const errorMessage = typeof error === 'string' ? error : error.message;

    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        return 'Unable to connect to the server. Please check your internet connection and try again.';
    }

    if (errorMessage.includes('timeout')) {
        return 'The request took too long. Please check your connection and try again.';
    }

    return 'A network error occurred. Please check your connection and try again.';
};

/**
 * Formats generic error messages into user-friendly text
 */
export const formatErrorMessage = (error: Error | string): string => {
    const errorMessage = typeof error === 'string' ? error : error.message;

    // Check for HTTP status codes in the error message
    const httpStatusMatch = errorMessage.match(/(\d{3})\s+([A-Za-z\s]+)/);
    if (httpStatusMatch) {
        const status = parseInt(httpStatusMatch[1], 10);
        return formatHttpError(status);
    }

    // Check for network errors
    if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
        return formatNetworkError(errorMessage);
    }

    // Check for specific error patterns
    if (errorMessage.includes('500')) {
        return 'The server encountered an error. Please try again in a moment.';
    }

    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        return 'The requested adventure could not be found.';
    }

    // Return a generic friendly message for unknown errors
    return 'An unexpected error occurred. Please try again.';
};

/**
 * Gets a helpful suggestion based on the error type
 */
export const getErrorSuggestion = (error: Error | string): string | null => {
    const errorMessage = typeof error === 'string' ? error : error.message;

    if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
        return 'This is usually a temporary issue. Please wait a moment and try again.';
    }

    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        return 'Make sure your internet connection is working and the backend server is running.';
    }

    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        return 'The adventure may have been removed or the path is incorrect.';
    }

    return null;
};
