import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { showSaveNotification } from '../notifications';

describe('notifications', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        vi.useFakeTimers();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.useRealTimers();
    });

    describe('showSaveNotification', () => {
        it('creates and displays notification', () => {
            showSaveNotification();
            const notification = document.querySelector('.fixed.top-4.right-4');
            expect(notification).toBeInTheDocument();
            expect(notification?.textContent).toContain('Save Feature Coming Soon');
        });

        it('removes notification after 4 seconds', () => {
            showSaveNotification();
            expect(document.querySelector('.fixed.top-4.right-4')).toBeInTheDocument();

            vi.advanceTimersByTime(4000);
            vi.advanceTimersByTime(300); // Wait for animation

            expect(document.querySelector('.fixed.top-4.right-4')).not.toBeInTheDocument();
        });

        it('adds slide-out animation before removing', () => {
            showSaveNotification();
            const notification = document.querySelector('.fixed.top-4.right-4') as HTMLElement;
            expect(notification).toBeInTheDocument();

            vi.advanceTimersByTime(4000);
            expect(notification?.classList.contains('animate-slide-out')).toBe(true);
        });

        it('notification contains correct content', () => {
            showSaveNotification();
            const notification = document.querySelector('.fixed.top-4.right-4');
            expect(notification?.textContent).toContain('Save Feature Coming Soon');
            expect(notification?.textContent).toContain("We're working on adding the ability to save your progress!");
        });

        it('notification has correct styling classes', () => {
            showSaveNotification();
            const notification = document.querySelector('.fixed.top-4.right-4');
            expect(notification).toHaveClass('bg-amber-600');
            expect(notification).toHaveClass('text-white');
            expect(notification).toHaveClass('z-50');
        });
    });
});
