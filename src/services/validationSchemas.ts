/**
 * Zod validation schemas for API responses
 * Provides runtime type safety and validation
 */

import { z } from 'zod';

/**
 * Schema for book API response
 */
export const BookApiResponseSchema = z.object({
    path: z.string().min(1, 'Path is required'),
    title: z.string().min(1, 'Title is required'),
    author: z.string().min(1, 'Author is required'),
    difficulty: z.string(), // Can be uppercase from API (EASY, MEDIUM, HARD)
    type: z.string(),
    duration: z.string(),
    chapters: z.number().int().positive(),
    tags: z.union([z.string(), z.array(z.string()), z.null(), z.undefined()]),
    summary: z.string(),
});

/**
 * Schema for array of book API responses
 */
export const BooksApiResponseSchema = z.array(BookApiResponseSchema);

/**
 * Schema for game option
 */
export const GameOptionSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    gotoId: z.string().min(1, 'gotoId is required'),
    consequence: z
        .object({
            type: z.string(),
            value: z.string(),
            text: z.string(),
        })
        .nullable(),
});

/**
 * Schema for game section
 */
export const GameSectionSchema = z.object({
    id: z.string().min(1, 'Section ID is required'),
    text: z.string(),
    type: z.enum(['BEGIN', 'NODE', 'END']),
    options: z.array(GameOptionSchema).nullable(),
});

/**
 * Schema for game data response
 */
export const GameDataResponseSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    author: z.string().min(1, 'Author is required'),
    difficulty: z.string(),
    type: z.union([z.string(), z.null()]).transform((val) => val ?? ''), // Allow string or null, default to empty string
    sections: z.array(GameSectionSchema).min(1, 'At least one section is required'),
});

/**
 * Type exports derived from schemas
 */
export type BookApiResponse = z.infer<typeof BookApiResponseSchema>;
export type BooksApiResponse = z.infer<typeof BooksApiResponseSchema>;
export type GameOption = z.infer<typeof GameOptionSchema>;
export type GameSection = z.infer<typeof GameSectionSchema>;
export type GameDataResponse = z.infer<typeof GameDataResponseSchema>;
