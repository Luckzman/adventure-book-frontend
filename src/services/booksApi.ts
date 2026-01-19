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
    id: string;
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
        id: apiBook.path.replace('.json', ''), // Use path without extension as ID
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
 * Fetches a single book by ID
 */
export const fetchBookById = async (id: string): Promise<Book | null> => {
    try {
        const books = await fetchBooks();
        return books.find((book) => book.id === id) || null;
    } catch (error) {
        console.error('Error fetching book by ID:', error);
        return null;
    }
};
