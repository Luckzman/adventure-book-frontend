import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameHeader } from '../GameHeader';
import { GAME_CONSTANTS } from '../../../domain/game/gameConstants';

describe('GameHeader', () => {
    const defaultProps = {
        gameTitle: 'Test Adventure',
        onBack: vi.fn(),
        onSave: vi.fn(),
        onPause: vi.fn(),
        onResume: vi.fn(),
    };

    it('renders game title', () => {
        render(<GameHeader {...defaultProps} />);
        expect(screen.getByText('Test Adventure')).toBeInTheDocument();
    });

    it('displays default health values', () => {
        render(<GameHeader {...defaultProps} />);
        const healthText = screen.getByText(`${GAME_CONSTANTS.INITIAL_HEALTH}/${GAME_CONSTANTS.MAX_HEALTH}`);
        expect(healthText).toBeInTheDocument();
    });

    it('displays custom health values', () => {
        render(<GameHeader {...defaultProps} health={5} maxHealth={10} />);
        expect(screen.getByText('5/10')).toBeInTheDocument();
    });

    it('calculates health status correctly for healthy', () => {
        render(<GameHeader {...defaultProps} health={10} maxHealth={10} />);
        const healthDisplay = screen.getByTitle(/Health: 10\/10 \(100%\)/);
        expect(healthDisplay).toBeInTheDocument();
        expect(healthDisplay).toHaveClass('bg-green-100');
    });

    it('calculates health status correctly for warning', () => {
        render(<GameHeader {...defaultProps} health={6} maxHealth={10} />);
        const healthDisplay = screen.getByTitle(/Health: 6\/10 \(60%\)/);
        expect(healthDisplay).toBeInTheDocument();
        expect(healthDisplay).toHaveClass('bg-yellow-100');
    });

    it('calculates health status correctly for danger', () => {
        render(<GameHeader {...defaultProps} health={4} maxHealth={10} />);
        const healthDisplay = screen.getByTitle(/Health: 4\/10 \(40%\)/);
        expect(healthDisplay).toBeInTheDocument();
        expect(healthDisplay).toHaveClass('bg-orange-100');
    });

    it('calculates health status correctly for critical', () => {
        render(<GameHeader {...defaultProps} health={2} maxHealth={10} />);
        const healthDisplay = screen.getByTitle(/Health: 2\/10 \(20%\)/);
        expect(healthDisplay).toBeInTheDocument();
        expect(healthDisplay).toHaveClass('bg-red-100');
    });

    it('uses provided health status when given', () => {
        render(<GameHeader {...defaultProps} health={2} maxHealth={10} healthStatus="critical" />);
        const healthDisplay = screen.getByTitle(/Health: 2\/10/);
        expect(healthDisplay).toHaveClass('bg-red-100');
    });

    it('calls onBack when back button is clicked', () => {
        const onBack = vi.fn();
        render(<GameHeader {...defaultProps} onBack={onBack} />);
        const backButton = screen.getByLabelText('Back to Library');
        backButton.click();
        expect(onBack).toHaveBeenCalledTimes(1);
    });

    it('calls onSave when save button is clicked', () => {
        const onSave = vi.fn();
        render(<GameHeader {...defaultProps} onSave={onSave} />);
        const saveButton = screen.getByLabelText('Save Progress');
        saveButton.click();
        expect(onSave).toHaveBeenCalledTimes(1);
    });

    it('shows pause button when not paused', () => {
        render(<GameHeader {...defaultProps} isPaused={false} />);
        expect(screen.getByLabelText('Pause Game')).toBeInTheDocument();
        expect(screen.queryByLabelText('Resume Game')).not.toBeInTheDocument();
    });

    it('shows resume button when paused', () => {
        render(<GameHeader {...defaultProps} isPaused={true} />);
        expect(screen.getByLabelText('Resume Game')).toBeInTheDocument();
        expect(screen.queryByLabelText('Pause Game')).not.toBeInTheDocument();
    });

    it('calls onPause when pause button is clicked', () => {
        const onPause = vi.fn();
        render(<GameHeader {...defaultProps} isPaused={false} onPause={onPause} />);
        const pauseButton = screen.getByLabelText('Pause Game');
        pauseButton.click();
        expect(onPause).toHaveBeenCalledTimes(1);
    });

    it('calls onResume when resume button is clicked', () => {
        const onResume = vi.fn();
        render(<GameHeader {...defaultProps} isPaused={true} onResume={onResume} />);
        const resumeButton = screen.getByLabelText('Resume Game');
        resumeButton.click();
        expect(onResume).toHaveBeenCalledTimes(1);
    });

    it('does not show pause/resume buttons when handlers are not provided', () => {
        render(<GameHeader gameTitle="Test" onBack={vi.fn()} onSave={vi.fn()} />);
        expect(screen.queryByLabelText('Pause Game')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Resume Game')).not.toBeInTheDocument();
    });

    it('fills heart icon when health is critical', () => {
        render(<GameHeader {...defaultProps} health={1} maxHealth={10} />);
        const heartIcon = screen.getByTitle(/Health: 1\/10/).querySelector('svg');
        expect(heartIcon).toHaveAttribute('fill', 'currentColor');
    });

    it('does not fill heart icon when health is not critical', () => {
        render(<GameHeader {...defaultProps} health={10} maxHealth={10} />);
        const heartIcon = screen.getByTitle(/Health: 10\/10/).querySelector('svg');
        expect(heartIcon).toHaveAttribute('fill', 'none');
    });
});
