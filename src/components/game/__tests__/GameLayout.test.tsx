import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameLayout } from '../GameLayout';

describe('GameLayout', () => {
    const defaultProps = {
        gameTitle: 'Test Adventure',
        health: 10,
        maxHealth: 10,
        healthStatus: 'healthy' as const,
        healthPercentage: 100,
        isPaused: false,
        showBackConfirm: false,
        onBack: vi.fn(),
        onSave: vi.fn(),
        onPause: vi.fn(),
        onResume: vi.fn(),
        onConfirmBack: vi.fn(),
        onCancelBack: vi.fn(),
        children: <div>Test Content</div>,
    };

    it('renders game header', () => {
        render(<GameLayout {...defaultProps} />);
        expect(screen.getByText('Test Adventure')).toBeInTheDocument();
    });

    it('renders children content', () => {
        render(<GameLayout {...defaultProps} />);
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('shows pause overlay when isPaused is true', () => {
        render(<GameLayout {...defaultProps} isPaused={true} />);
        expect(screen.getByText('Game Paused')).toBeInTheDocument();
    });

    it('does not show pause overlay when isPaused is false', () => {
        render(<GameLayout {...defaultProps} isPaused={false} />);
        expect(screen.queryByText('Game Paused')).not.toBeInTheDocument();
    });

    it('shows confirmation dialog when showBackConfirm is true', () => {
        render(<GameLayout {...defaultProps} showBackConfirm={true} />);
        expect(screen.getByText('Leave Adventure?')).toBeInTheDocument();
    });

    it('does not show confirmation dialog when showBackConfirm is false', () => {
        render(<GameLayout {...defaultProps} showBackConfirm={false} />);
        expect(screen.queryByText('Leave Adventure?')).not.toBeInTheDocument();
    });

    it('calls onConfirmBack when confirm button is clicked', () => {
        const onConfirmBack = vi.fn();
        render(<GameLayout {...defaultProps} showBackConfirm={true} onConfirmBack={onConfirmBack} />);
        const confirmButton = screen.getByText('Leave Adventure');
        confirmButton.click();
        expect(onConfirmBack).toHaveBeenCalledTimes(1);
    });

    it('calls onCancelBack when cancel button is clicked', () => {
        const onCancelBack = vi.fn();
        render(<GameLayout {...defaultProps} showBackConfirm={true} onCancelBack={onCancelBack} />);
        const cancelButton = screen.getByText('Continue Playing');
        cancelButton.click();
        expect(onCancelBack).toHaveBeenCalledTimes(1);
    });
});
