import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '../logger';

describe('logger', () => {
    let consoleLogSpy: ReturnType<typeof vi.spyOn>;
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
    let consoleDebugSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
        consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('logger.log', () => {
        it('logs in development mode', () => {
            logger.log('test message');
            expect(consoleLogSpy).toHaveBeenCalledWith('test message');
        });

        it('logs multiple arguments', () => {
            logger.log('message', { data: 'test' }, 123);
            expect(consoleLogSpy).toHaveBeenCalledWith('message', { data: 'test' }, 123);
        });
    });

    describe('logger.warn', () => {
        it('warns in development mode', () => {
            logger.warn('warning message');
            expect(consoleWarnSpy).toHaveBeenCalledWith('warning message');
        });

        it('warns with multiple arguments', () => {
            logger.warn('warning', { data: 'test' });
            expect(consoleWarnSpy).toHaveBeenCalledWith('warning', { data: 'test' });
        });
    });

    describe('logger.error', () => {
        it('always logs errors', () => {
            logger.error('error message');
            expect(consoleErrorSpy).toHaveBeenCalledWith('error message');
        });

        it('logs errors with multiple arguments', () => {
            const error = new Error('test error');
            logger.error('Error occurred:', error);
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error occurred:', error);
        });
    });

    describe('logger.debug', () => {
        it('debugs in development mode', () => {
            logger.debug('debug message');
            expect(consoleDebugSpy).toHaveBeenCalledWith('debug message');
        });

        it('debugs with multiple arguments', () => {
            logger.debug('debug', { data: 'test' }, 123);
            expect(consoleDebugSpy).toHaveBeenCalledWith('debug', { data: 'test' }, 123);
        });
    });
});
