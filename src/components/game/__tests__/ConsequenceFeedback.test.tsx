import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConsequenceFeedback } from '../ConsequenceFeedback';

describe('ConsequenceFeedback', () => {
    const defaultProps = {
        onDismiss: vi.fn(),
    };

    it('renders nothing when consequence type is not LOSE_HEALTH', () => {
        const { container } = render(
            <ConsequenceFeedback
                {...defaultProps}
                consequence={{ type: 'GAIN_HEALTH', value: 5, text: 'You gained health' }}
            />
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders feedback when consequence type is LOSE_HEALTH', () => {
        render(
            <ConsequenceFeedback
                {...defaultProps}
                consequence={{ type: 'LOSE_HEALTH', value: 3, text: 'You were injured' }}
            />
        );
        expect(screen.getByText(/You lost 3 health points/)).toBeInTheDocument();
        expect(screen.getByText('You were injured')).toBeInTheDocument();
    });

    it('uses singular form for 1 health point', () => {
        render(
            <ConsequenceFeedback
                {...defaultProps}
                consequence={{ type: 'LOSE_HEALTH', value: 1, text: 'You were injured' }}
            />
        );
        expect(screen.getByText(/You lost 1 health point$/)).toBeInTheDocument();
    });

    it('uses plural form for multiple health points', () => {
        render(
            <ConsequenceFeedback
                {...defaultProps}
                consequence={{ type: 'LOSE_HEALTH', value: 5, text: 'You were injured' }}
            />
        );
        expect(screen.getByText(/You lost 5 health points/)).toBeInTheDocument();
    });

    it('calls onDismiss when dismiss button is clicked', () => {
        const onDismiss = vi.fn();
        render(
            <ConsequenceFeedback
                onDismiss={onDismiss}
                consequence={{ type: 'LOSE_HEALTH', value: 3, text: 'You were injured' }}
            />
        );
        const dismissButton = screen.getByLabelText('Dismiss');
        dismissButton.click();
        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('displays consequence text', () => {
        render(
            <ConsequenceFeedback
                {...defaultProps}
                consequence={{ type: 'LOSE_HEALTH', value: 3, text: 'The pirate lunges at you' }}
            />
        );
        expect(screen.getByText('The pirate lunges at you')).toBeInTheDocument();
    });
});
