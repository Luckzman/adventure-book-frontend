import { describe, it, expect } from 'vitest';
import { formatHttpError, formatNetworkError, formatErrorMessage, getErrorSuggestion } from '../errorMessages';

describe('errorMessages', () => {
    describe('formatHttpError', () => {
        it('formats 400 error', () => {
            expect(formatHttpError(400)).toBe('The request was invalid. Please try again.');
        });

        it('formats 401 error', () => {
            expect(formatHttpError(401)).toBe('You are not authorized to access this resource.');
        });

        it('formats 403 error', () => {
            expect(formatHttpError(403)).toBe('Access forbidden. You do not have permission to view this content.');
        });

        it('formats 404 error', () => {
            expect(formatHttpError(404)).toBe('The requested adventure could not be found.');
        });

        it('formats 500 error', () => {
            expect(formatHttpError(500)).toBe('The server encountered an error. Please try again in a moment.');
        });

        it('formats 502 error', () => {
            expect(formatHttpError(502)).toBe('The server is temporarily unavailable. Please try again later.');
        });

        it('formats 503 error', () => {
            expect(formatHttpError(503)).toBe('The service is temporarily unavailable. Please try again in a moment.');
        });

        it('formats 504 error', () => {
            expect(formatHttpError(504)).toBe('The server took too long to respond. Please try again.');
        });

        it('formats generic 5xx errors', () => {
            expect(formatHttpError(501)).toBe('The server encountered an error. Please try again in a moment.');
        });

        it('formats generic 4xx errors', () => {
            expect(formatHttpError(422)).toBe('There was a problem with your request. Please try again.');
        });

        it('formats unknown status codes below 400', () => {
            expect(formatHttpError(399)).toBe('An error occurred (399). Please try again.');
        });

        it('treats 999 as 5xx error', () => {
            expect(formatHttpError(999)).toBe('The server encountered an error. Please try again in a moment.');
        });
    });

    describe('formatNetworkError', () => {
        it('formats fetch errors', () => {
            expect(formatNetworkError(new Error('fetch failed'))).toBe(
                'Unable to connect to the server. Please check your internet connection and try again.'
            );
        });

        it('formats network errors', () => {
            expect(formatNetworkError(new Error('network error'))).toBe(
                'Unable to connect to the server. Please check your internet connection and try again.'
            );
        });

        it('formats timeout errors', () => {
            expect(formatNetworkError(new Error('timeout occurred'))).toBe(
                'The request took too long. Please check your connection and try again.'
            );
        });

        it('formats generic network errors', () => {
            expect(formatNetworkError(new Error('connection failed'))).toBe(
                'A network error occurred. Please check your connection and try again.'
            );
        });

        it('handles string errors', () => {
            expect(formatNetworkError('fetch error')).toBe(
                'Unable to connect to the server. Please check your internet connection and try again.'
            );
        });
    });

    describe('formatErrorMessage', () => {
        it('formats HTTP status codes from error message', () => {
            expect(formatErrorMessage(new Error('500 Internal Server Error'))).toBe(
                'The server encountered an error. Please try again in a moment.'
            );
        });

        it('formats 404 errors', () => {
            expect(formatErrorMessage(new Error('404 Not Found'))).toBe(
                'The requested adventure could not be found.'
            );
        });

        it('formats fetch errors', () => {
            expect(formatErrorMessage(new Error('Failed to fetch'))).toBe(
                'Unable to connect to the server. Please check your internet connection and try again.'
            );
        });

        it('formats network errors', () => {
            expect(formatErrorMessage(new Error('network error'))).toBe(
                'Unable to connect to the server. Please check your internet connection and try again.'
            );
        });

        it('formats generic errors', () => {
            expect(formatErrorMessage(new Error('Something went wrong'))).toBe(
                'An unexpected error occurred. Please try again.'
            );
        });

        it('handles string errors', () => {
            expect(formatErrorMessage('500 Internal Server Error')).toBe(
                'The server encountered an error. Please try again in a moment.'
            );
        });
    });

    describe('getErrorSuggestion', () => {
        it('returns suggestion for 500 errors', () => {
            expect(getErrorSuggestion(new Error('500 Internal Server Error'))).toBe(
                'This is usually a temporary issue. Please wait a moment and try again.'
            );
        });

        it('returns suggestion for network errors', () => {
            expect(getErrorSuggestion(new Error('fetch failed'))).toBe(
                'Make sure your internet connection is working and the backend server is running.'
            );
        });

        it('returns suggestion for 404 errors', () => {
            expect(getErrorSuggestion(new Error('404 not found'))).toBe(
                'The adventure may have been removed or the path is incorrect.'
            );
        });

        it('returns null for unknown errors', () => {
            expect(getErrorSuggestion(new Error('Unknown error'))).toBeNull();
        });

        it('handles string errors', () => {
            expect(getErrorSuggestion('500 Internal Server Error')).toBe(
                'This is usually a temporary issue. Please wait a moment and try again.'
            );
        });
    });
});
