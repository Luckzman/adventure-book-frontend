import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FilterButton } from '../FilterButton';

describe('FilterButton', () => {
    it('renders button with label', () => {
        render(<FilterButton label="Fantasy" />);
        expect(screen.getByText('Fantasy')).toBeInTheDocument();
    });

    it('has aria-pressed false when not active', () => {
        render(<FilterButton label="Fantasy" isActive={false} />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('has aria-pressed true when active', () => {
        render(<FilterButton label="Fantasy" isActive={true} />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('applies active styles when isActive is true', () => {
        render(<FilterButton label="Fantasy" isActive={true} />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-amber-300');
        expect(button).toHaveClass('text-amber-950');
    });

    it('applies inactive styles when isActive is false', () => {
        render(<FilterButton label="Fantasy" isActive={false} />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-[#F3EBE2]');
    });

    it('calls onClick when clicked', () => {
        const onClick = vi.fn();
        render(<FilterButton label="Fantasy" onClick={onClick} />);
        const button = screen.getByRole('button');
        button.click();
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('applies custom className', () => {
        render(<FilterButton label="Fantasy" className="custom-class" />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });

    it('passes additional props to button', () => {
        render(<FilterButton label="Fantasy" disabled={true} />);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });
});
