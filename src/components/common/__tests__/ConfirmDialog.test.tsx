/**
 * Tests for ConfirmDialog component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialog } from '../ConfirmDialog';

describe('ConfirmDialog', () => {
    const defaultProps = {
        isOpen: true,
        title: 'Test Title',
        message: 'Test message',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        onConfirm: vi.fn(),
        onCancel: vi.fn(),
    };

    it('should render dialog content', () => {
        render(<ConfirmDialog {...defaultProps} />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should call onConfirm when confirm button is clicked', async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn();

        render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);
        const confirmButton = screen.getByText('Confirm');
        await user.click(confirmButton);

        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when cancel button is clicked', async () => {
        const user = userEvent.setup();
        const onCancel = vi.fn();

        render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);
        const cancelButton = screen.getByText('Cancel');
        await user.click(cancelButton);

        expect(onCancel).toHaveBeenCalledTimes(1);
    });


    it('should use custom button text', () => {
        render(
            <ConfirmDialog
                {...defaultProps}
                confirmText="Delete"
                cancelText="Keep"
            />
        );
        expect(screen.getByText('Delete')).toBeInTheDocument();
        expect(screen.getByText('Keep')).toBeInTheDocument();
    });
});
