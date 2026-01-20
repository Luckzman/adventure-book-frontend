import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
    it('renders button with children', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('applies primary variant by default', () => {
        render(<Button>Test</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-amber-600');
    });

    it('applies secondary variant', () => {
        render(<Button variant="secondary">Test</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-stone-300');
    });

    it('applies outline variant', () => {
        render(<Button variant="outline">Test</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('border-2');
        expect(button).toHaveClass('border-amber-600');
    });

    it('applies medium size by default', () => {
        render(<Button>Test</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('px-4', 'py-2', 'text-base');
    });

    it('applies small size', () => {
        render(<Button size="sm">Test</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('applies large size', () => {
        render(<Button size="lg">Test</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
    });

    it('forwards ref to button element', () => {
        const ref = vi.fn();
        render(<Button ref={ref}>Test</Button>);
        const button = screen.getByRole('button');
        expect(ref).toHaveBeenCalledWith(button);
    });

    it('passes additional props to button', () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Test</Button>);
        const button = screen.getByRole('button');
        button.click();
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('applies disabled prop', () => {
        render(<Button disabled={true}>Test</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('applies custom className', () => {
        render(<Button className="custom-class">Test</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });
});
