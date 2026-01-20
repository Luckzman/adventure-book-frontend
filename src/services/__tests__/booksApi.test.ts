/**
 * Tests for booksApi validation and utility functions
 */

import { describe, it, expect } from 'vitest';
import { validateBookData } from '../booksApi';
import type { GameDataResponse } from '../booksApi';

describe('booksApi', () => {
    describe('validateBookData', () => {
        it('should validate book with one BEGIN and one END', () => {
            const validBook: GameDataResponse = {
                title: 'Test',
                author: 'Author',
                difficulty: 'MEDIUM',
                type: '',
                sections: [
                    {
                        id: '1',
                        text: 'Start',
                        type: 'BEGIN',
                        options: [
                            {
                                description: 'Go to end',
                                gotoId: '2',
                                consequence: null,
                            },
                        ],
                    },
                    {
                        id: '2',
                        text: 'End',
                        type: 'END',
                        options: null,
                    },
                ],
            };

            const result = validateBookData(validBook);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should reject book with no BEGIN section', () => {
            const invalidBook: GameDataResponse = {
                title: 'Test',
                author: 'Author',
                difficulty: 'MEDIUM',
                type: '',
                sections: [
                    {
                        id: '1',
                        text: 'No begin',
                        type: 'NODE',
                        options: null,
                    },
                ],
            };

            const result = validateBookData(invalidBook);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Book has no beginning section.');
        });

        it('should reject book with multiple BEGIN sections', () => {
            const invalidBook: GameDataResponse = {
                title: 'Test',
                author: 'Author',
                difficulty: 'MEDIUM',
                type: '',
                sections: [
                    {
                        id: '1',
                        text: 'Begin 1',
                        type: 'BEGIN',
                        options: null,
                    },
                    {
                        id: '2',
                        text: 'Begin 2',
                        type: 'BEGIN',
                        options: null,
                    },
                ],
            };

            const result = validateBookData(invalidBook);
            expect(result.isValid).toBe(false);
            expect(result.errors[0]).toContain('beginning sections');
        });

        it('should reject book with no END section', () => {
            const invalidBook: GameDataResponse = {
                title: 'Test',
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

            const result = validateBookData(invalidBook);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Book has no ending section.');
        });

        it('should accept book with multiple END sections', () => {
            const validBook: GameDataResponse = {
                title: 'Test',
                author: 'Author',
                difficulty: 'MEDIUM',
                type: '',
                sections: [
                    {
                        id: '1',
                        text: 'Start',
                        type: 'BEGIN',
                        options: [
                            {
                                description: 'Go to end 1',
                                gotoId: '2',
                                consequence: null,
                            },
                            {
                                description: 'Go to end 2',
                                gotoId: '3',
                                consequence: null,
                            },
                        ],
                    },
                    {
                        id: '2',
                        text: 'End 1',
                        type: 'END',
                        options: null,
                    },
                    {
                        id: '3',
                        text: 'End 2',
                        type: 'END',
                        options: null,
                    },
                ],
            };

            const result = validateBookData(validBook);
            expect(result.isValid).toBe(true);
        });
    });
});
