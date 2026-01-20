import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PauseOverlay } from '../PauseOverlay';

describe('PauseOverlay', () => {
    const defaultProps = {
        onResume: vi.fn(),
    };

    it('renders pause overlay', () => {
        render(<PauseOverlay {...defaultProps} />);
        expect(screen.getByText('Game Paused')).toBeInTheDocument();
        expect(screen.getByText("Your adventure is on hold. Take your time!")).toBeInTheDocument();
    });

    it('renders resume button', () => {
        render(<PauseOverlay {...defaultProps} />);
        const resumeButton = screen.getByText('Resume Game');
        expect(resumeButton).toBeInTheDocument();
    });

    it('calls onResume when resume button is clicked', () => {
        const onResume = vi.fn();
        render(<PauseOverlay {...defaultProps} onResume={onResume} />);
        const resumeButton = screen.getByText('Resume Game');
        resumeButton.click();
        expect(onResume).toHaveBeenCalledTimes(1);
    });

    it('renders save button when onSave is provided', () => {
        render(<PauseOverlay {...defaultProps} onSave={vi.fn()} />);
        expect(screen.getByText('Save Progress')).toBeInTheDocument();
    });

    it('does not render save button when onSave is not provided', () => {
        render(<PauseOverlay {...defaultProps} />);
        expect(screen.queryByText('Save Progress')).not.toBeInTheDocument();
    });

    it('calls onSave when save button is clicked', () => {
        const onSave = vi.fn();
        render(<PauseOverlay {...defaultProps} onSave={onSave} />);
        const saveButton = screen.getByText('Save Progress');
        saveButton.click();
        expect(onSave).toHaveBeenCalledTimes(1);
    });

    it('renders back to library button when onBackToLibrary is provided', () => {
        render(<PauseOverlay {...defaultProps} onBackToLibrary={vi.fn()} />);
        expect(screen.getByText('Back to Library')).toBeInTheDocument();
    });

    it('renders back to library button when onShowBackConfirm is provided', () => {
        render(<PauseOverlay {...defaultProps} onShowBackConfirm={vi.fn()} />);
        expect(screen.getByText('Back to Library')).toBeInTheDocument();
    });

    it('calls onBackToLibrary when back button is clicked', () => {
        const onBackToLibrary = vi.fn();
        render(<PauseOverlay {...defaultProps} onBackToLibrary={onBackToLibrary} />);
        const backButton = screen.getByText('Back to Library');
        backButton.click();
        expect(onBackToLibrary).toHaveBeenCalledTimes(1);
    });

    it('calls onShowBackConfirm when back button is clicked and onShowBackConfirm is provided', () => {
        const onShowBackConfirm = vi.fn();
        render(<PauseOverlay {...defaultProps} onShowBackConfirm={onShowBackConfirm} />);
        const backButton = screen.getByText('Back to Library');
        backButton.click();
        expect(onShowBackConfirm).toHaveBeenCalledTimes(1);
    });

    it('prioritizes onShowBackConfirm over onBackToLibrary', () => {
        const onShowBackConfirm = vi.fn();
        const onBackToLibrary = vi.fn();
        render(
            <PauseOverlay
                {...defaultProps}
                onShowBackConfirm={onShowBackConfirm}
                onBackToLibrary={onBackToLibrary}
            />
        );
        const backButton = screen.getByText('Back to Library');
        backButton.click();
        expect(onShowBackConfirm).toHaveBeenCalledTimes(1);
        expect(onBackToLibrary).not.toHaveBeenCalled();
    });

    it('does not render back to library button when neither handler is provided', () => {
        render(<PauseOverlay {...defaultProps} />);
        expect(screen.queryByText('Back to Library')).not.toBeInTheDocument();
    });
});
