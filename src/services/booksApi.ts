// Books API service
// Handles all API calls related to fetching books/adventures

export interface BookApiResponse {
    path: string;
    title: string;
    author: string;
    difficulty: string; // Can be uppercase from API (EASY, MEDIUM, HARD)
    type: string;
    duration: string;
    chapters: number;
    tags: string | string[] | null | undefined;
    summary: string;
}

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

// Use proxy path in development, or direct URL in production
const API_BASE_URL = import.meta.env.PROD
    ? 'http://localhost:8081'
    : '/api';

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
export const fetchBooks = async (): Promise<Book[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/service/books`);
        console.log('response', response);

        if (!response.ok) {
            throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
        }

        const data: BookApiResponse[] = await response.json();
        return data.map(mapApiResponseToBook);
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

/**
 * Game data response structure from API
 */
export interface GameOption {
    description: string;
    gotoId: string;
    consequence: {
        type: string;
        value: string;
        text: string;
    } | null;
}

export interface GameSection {
    id: string;
    text: string;
    type: 'BEGIN' | 'NODE' | 'END';
    options: GameOption[] | null;
}

export interface GameDataResponse {
    title: string;
    author: string;
    difficulty: string;
    type: string;
    sections: GameSection[];
}

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
export const fetchGameData = async (path: string): Promise<GameDataResponse | null> => {
    // Try different endpoint formats in order of likelihood
    const endpointFormats = [
        `${API_BASE_URL}/books/${path}`, // Standard format: /books/{path}
        `${API_BASE_URL}/service/books/${path}`, // Service format: /service/books/{path} (matches books list pattern)
    ];

    let lastError: Error | null = null;

    for (const url of endpointFormats) {
        try {
            console.log('Trying endpoint:', url);

            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                console.log('Game data received from:', url);
                return data as GameDataResponse;
            }

            // If 404, try next format
            if (response.status === 404) {
                console.log(`404 for ${url}, trying next format...`);
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
