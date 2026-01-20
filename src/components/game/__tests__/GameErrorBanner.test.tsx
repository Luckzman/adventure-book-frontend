import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameErrorBanner } from '../GameErrorBanner';

describe('GameErrorBanner', () => {
    const defaultProps = {
        onDismiss: vi.fn(),
    };

    it('renders error banner', () => {
        render(<GameErrorBanner {...defaultProps} error="Navigation error" />);
        expect(screen.getByText('Navigation Error')).toBeInTheDocument();
        expect(screen.getByText('Navigation error')).toBeInTheDocument();
    });

    it('calls onDismiss when dismiss button is clicked', () => {
        const onDismiss = vi.fn();
        render(<GameErrorBanner onDismiss={onDismiss} error="Test error" />);
        const dismissButton = screen.getByLabelText('Dismiss error');
        dismissButton.click();
        expect(onDismiss).toHaveBeenCalledTimes(1);
    });
});
