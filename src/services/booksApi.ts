// Books API service
// Handles all API calls related to fetching books/adventures

import { logger } from '../utils/logger';
import {
    BooksApiResponseSchema,
    GameDataResponseSchema,
    type BookApiResponse,
    type GameDataResponse,
    type GameSection,
} from './validationSchemas';

export type { BookApiResponse, GameDataResponse };

export interface Book {
    path: string; // Original path from API (e.g., "the-lost-temple.json")
    title: string;
    author: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    genre: string;
    duration: string;
    chapters: number;
    tags: string[];
}

import { config } from '../config/env';

// Use environment variable or default to /api (which uses Vite proxy in dev)
const API_BASE_URL = config.api.baseUrl;

/**
 * Normalizes tags to an array format
 */
const normalizeTags = (tags: string | string[] | null | undefined): string[] => {
    if (!tags) {
        return [];
    }
    if (Array.isArray(tags)) {
        return tags.map((tag) => (typeof tag === 'string' ? tag.trim() : String(tag).trim())).filter(Boolean);
    }
    if (typeof tags === 'string') {
        return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    }
    return [];
};

/**
 * Maps API response to Book interface
 */
const mapApiResponseToBook = (apiBook: BookApiResponse): Book => {
    // Transform uppercase difficulty to title case
    const normalizedDifficulty = apiBook.difficulty.toLowerCase();
    let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';

    if (normalizedDifficulty === 'easy') {
        difficulty = 'Easy';
    } else if (normalizedDifficulty === 'medium') {
        difficulty = 'Medium';
    } else if (normalizedDifficulty === 'hard') {
        difficulty = 'Hard';
    }

    return {
        path: apiBook.path, // Preserve original path for API calls
        title: apiBook.title,
        author: apiBook.author,
        description: apiBook.summary,
        difficulty,
        genre: apiBook.type,
        duration: apiBook.duration,
        chapters: apiBook.chapters,
        tags: normalizeTags(apiBook.tags),
    };
};

/**
 * Fetches all books from the API
 */
export const fetchBooks = async (signal?: AbortSignal): Promise<Book[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/service/books`, { signal });

        if (!response.ok) {
            throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
        }

        const rawData = await response.json();

        // Validate API response structure
        try {
            const validatedData = BooksApiResponseSchema.parse(rawData);
            return validatedData.map(mapApiResponseToBook);
        } catch (validationError) {
            // If validation fails, provide helpful error message
            logger.error('Books data validation failed:', validationError);
            throw new Error(
                'Invalid books data format received from server. Please contact support if this issue persists.'
            );
        }
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            logger.debug('Books fetch was aborted');
            throw error;
        }
        logger.error('Error fetching books:', error);
        throw error;
    }
};

/**
 * Re-export types from validation schemas
 */
export type { GameOption, GameSection } from './validationSchemas';

/**
 * Validation result for book data
 */
export interface BookValidationResult {
    isValid: boolean;
    errors: string[];
}

/**
 * Validates book data for critical errors that prevent the game from starting:
 * - Book has none, or more than one beginning
 * - Book has no ending (but can have multiple)
 * 
 * Note: This only validates critical structure. Invalid gotoIds and sections without options
 * are handled at runtime when the user tries to navigate to them.
 */
export const validateBookData = (bookData: GameDataResponse): BookValidationResult => {
    const errors: string[] = [];
    const { sections } = bookData;

    if (!sections || sections.length === 0) {
        return {
            isValid: false,
            errors: ['Book has no sections.'],
        };
    }

    // 1. Check for BEGIN sections: must have exactly one
    const beginSections = sections.filter((section) => section.type === 'BEGIN');
    if (beginSections.length === 0) {
        errors.push('Book has no beginning section.');
        return { isValid: false, errors }; // Can't start game without BEGIN
    } else if (beginSections.length > 1) {
        errors.push(`Book has ${beginSections.length} beginning sections (must have exactly one).`);
        return { isValid: false, errors }; // Can't start game with multiple BEGIN
    }

    // 2. Check that at least one END section exists (doesn't need to be reachable)
    const endSections = sections.filter((section) => section.type === 'END');
    if (endSections.length === 0) {
        errors.push('Book has no ending section.');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Validates if a section exists for navigation
 * Returns error message if section doesn't exist, null if it exists
 * Note: We allow navigation to sections even if they have null options - we just won't show choices
 */
export const validateSectionForNavigation = (
    section: GameSection | undefined,
    sectionId: string
): string | null => {
    if (!section) {
        return `Section "${sectionId}" does not exist. This may be an invalid reference in the book data.`;
    }

    // Section exists - allow navigation even if it has null/empty options
    // We'll handle displaying the section content appropriately in the UI
    return null;
}

/**
 * Fetches game data for a specific book by path
 * Tries multiple endpoint formats to handle different backend configurations
 */
export const fetchGameData = async (path: string, signal?: AbortSignal): Promise<GameDataResponse | null> => {
    // Try different endpoint formats in order of likelihood
    const endpointFormats = [
        `${API_BASE_URL}/books/${path}`, // Standard format: /books/{path}
        `${API_BASE_URL}/service/books/${path}`, // Service format: /service/books/{path} (matches books list pattern)
    ];

    let lastError: Error | null = null;

    for (const url of endpointFormats) {
        try {
            const response = await fetch(url, { signal });

            if (response.ok) {
                const rawData = await response.json();

                // Validate API response structure
                try {
                    // Use safeParse to get better error handling
                    const validationResult = GameDataResponseSchema.safeParse(rawData);

                    if (!validationResult.success) {
                        // Log validation errors for debugging
                        logger.error('Game data validation failed:', validationResult.error.format());
                        throw new Error(
                            `Invalid game data format received from server. The adventure "${path}" may be corrupted.`
                        );
                    }

                    logger.debug('Game data received from:', url);
                    return validationResult.data;
                } catch (error) {
                    // Re-throw if it's already our error
                    if (error instanceof Error && error.message.includes('Invalid game data format')) {
                        throw error;
                    }
                    // If validation fails, provide helpful error message
                    logger.error('Game data validation failed:', error);
                    throw new Error(
                        `Invalid game data format received from server. The adventure "${path}" may be corrupted.`
                    );
                }
            }

            // If 404, try next format
            if (response.status === 404) {
                logger.debug(`404 for ${url}, trying next format...`);
                lastError = new Error(`Game not found: The adventure "${path}" could not be found on the server.`);
                continue;
            }

            // For other HTTP errors, create user-friendly error message
            const status = response.status;

            let errorMessage: string;
            if (status >= 500) {
                errorMessage = `The server encountered an error (${status}). Please try again in a moment.`;
            } else if (status === 404) {
                errorMessage = `The adventure "${path}" could not be found.`;
            } else {
                errorMessage = `Unable to load the adventure (${status}). Please try again.`;
            }

            throw new Error(errorMessage);
        } catch (error) {
            // Handle abort errors
            if (error instanceof Error && error.name === 'AbortError') {
                logger.debug('Game data fetch was aborted');
                throw error;
            }

            // Network errors should be thrown immediately (can't retry)
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Unable to connect to the server. Please check your internet connection and ensure the backend server is running.');
            }

            // If it's an Error we threw (not a 404), re-throw it
            if (error instanceof Error && !error.message.includes('404') && !error.message.includes('Game not found')) {
                throw error;
            }

            // Save the error for the last attempt
            if (error instanceof Error) {
                lastError = error;
            }
        }
    }

    // If all formats failed with 404, throw a clear error
    throw lastError || new Error(`Game not found: The adventure "${path}" could not be found on the server.`);
};
