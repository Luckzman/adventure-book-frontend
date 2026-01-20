/**
 * Tests for validation schemas
 * Tests zod validation for API responses
 */

import { describe, it, expect } from 'vitest';
import {
    BookApiResponseSchema,
    BooksApiResponseSchema,
    GameDataResponseSchema,
    GameSectionSchema,
    GameOptionSchema,
} from '../validationSchemas';

describe('validationSchemas', () => {
    describe('BookApiResponseSchema', () => {
        it('should validate valid book response', () => {
            const validBook = {
                path: 'test-book.json',
                title: 'Test Book',
                author: 'Test Author',
                difficulty: 'MEDIUM',
                type: 'Fantasy',
                duration: '30-45 min',
                chapters: 5,
                tags: 'adventure, fantasy',
                summary: 'A test book',
            };

            const result = BookApiResponseSchema.safeParse(validBook);
            expect(result.success).toBe(true);
        });

        it('should validate book with array tags', () => {
            const bookWithArrayTags = {
                path: 'test.json',
                title: 'Test',
                author: 'Author',
                difficulty: 'EASY',
                type: 'Fantasy',
                duration: '30 min',
                chapters: 3,
                tags: ['adventure', 'fantasy'],
                summary: 'Summary',
            };

            const result = BookApiResponseSchema.safeParse(bookWithArrayTags);
            expect(result.success).toBe(true);
        });

        it('should reject invalid book (missing required field)', () => {
            const invalidBook = {
                path: 'test.json',
                // Missing title
                author: 'Author',
                difficulty: 'MEDIUM',
                type: 'Fantasy',
                duration: '30 min',
                chapters: 3,
                tags: 'tags',
                summary: 'Summary',
            };

            const result = BookApiResponseSchema.safeParse(invalidBook);
            expect(result.success).toBe(false);
        });
    });

    describe('BooksApiResponseSchema', () => {
        it('should validate array of books', () => {
            const books = [
                {
                    path: 'book1.json',
                    title: 'Book 1',
                    author: 'Author 1',
                    difficulty: 'EASY',
                    type: 'Fantasy',
                    duration: '30 min',
                    chapters: 3,
                    tags: 'tags',
                    summary: 'Summary 1',
                },
                {
                    path: 'book2.json',
                    title: 'Book 2',
                    author: 'Author 2',
                    difficulty: 'HARD',
                    type: 'Adventure',
                    duration: '60 min',
                    chapters: 5,
                    tags: ['tag1', 'tag2'],
                    summary: 'Summary 2',
                },
            ];

            const result = BooksApiResponseSchema.safeParse(books);
            expect(result.success).toBe(true);
        });
    });

    describe('GameOptionSchema', () => {
        it('should validate option with consequence', () => {
            const option = {
                description: 'Go to next section',
                gotoId: '2',
                consequence: {
                    type: 'LOSE_HEALTH',
                    value: '3',
                    text: 'You lost health',
                },
            };

            const result = GameOptionSchema.safeParse(option);
            expect(result.success).toBe(true);
        });

        it('should validate option without consequence', () => {
            const option = {
                description: 'Go to next section',
                gotoId: '2',
                consequence: null,
            };

            const result = GameOptionSchema.safeParse(option);
            expect(result.success).toBe(true);
        });

        it('should reject invalid option (missing description)', () => {
            const invalidOption = {
                gotoId: '2',
                consequence: null,
            };

            const result = GameOptionSchema.safeParse(invalidOption);
            expect(result.success).toBe(false);
        });
    });

    describe('GameSectionSchema', () => {
        it('should validate BEGIN section', () => {
            const section = {
                id: '1',
                text: 'Beginning',
                type: 'BEGIN',
                options: [
                    {
                        description: 'Choice 1',
                        gotoId: '2',
                        consequence: null,
                    },
                ],
            };

            const result = GameSectionSchema.safeParse(section);
            expect(result.success).toBe(true);
        });

        it('should validate END section with null options', () => {
            const section = {
                id: '3',
                text: 'End',
                type: 'END',
                options: null,
            };

            const result = GameSectionSchema.safeParse(section);
            expect(result.success).toBe(true);
        });

        it('should reject invalid section type', () => {
            const invalidSection = {
                id: '1',
                text: 'Test',
                type: 'INVALID',
                options: null,
            };

            const result = GameSectionSchema.safeParse(invalidSection);
            expect(result.success).toBe(false);
        });
    });

    describe('GameDataResponseSchema', () => {
        it('should validate game data with string type', () => {
            const gameData = {
                title: 'Test Adventure',
                author: 'Test Author',
                difficulty: 'MEDIUM',
                type: 'Fantasy',
                sections: [
                    {
                        id: '1',
                        text: 'Start',
                        type: 'BEGIN',
                        options: [
                            {
                                description: 'Go to 2',
                                gotoId: '2',
                                consequence: null,
                            },
                        ],
                    },
                ],
            };

            const result = GameDataResponseSchema.safeParse(gameData);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.type).toBe('Fantasy');
            }
        });

        it('should validate game data with null type and transform to empty string', () => {
            const gameData = {
                title: 'Test Adventure',
                author: 'Test Author',
                difficulty: 'MEDIUM',
                type: null,
                sections: [
                    {
                        id: '1',
                        text: 'Start',
                        type: 'BEGIN',
                        options: null,
                    },
                ],
            };

            const result = GameDataResponseSchema.safeParse(gameData);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.type).toBe('');
            }
        });

        it('should reject game data without sections', () => {
            const invalidGameData = {
                title: 'Test',
                author: 'Author',
                difficulty: 'MEDIUM',
                type: '',
                sections: [],
            };

            const result = GameDataResponseSchema.safeParse(invalidGameData);
            expect(result.success).toBe(false);
        });

        it('should reject game data with missing title', () => {
            const invalidGameData = {
                author: 'Author',
                difficulty: 'MEDIUM',
                type: '',
                sections: [
                    {
                        id: '1',
                        text: 'Start',
                        type: 'BEGIN',
                        options: null,
                    },
                ],
            };

            const result = GameDataResponseSchema.safeParse(invalidGameData);
            expect(result.success).toBe(false);
        });
    });
});
