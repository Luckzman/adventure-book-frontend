import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loader } from '../Loader';

describe('Loader', () => {
    it('renders loader', () => {
        render(<Loader />);
        const loader = screen.getByLabelText('Loading');
        expect(loader).toBeInTheDocument();
    });

    it('has loading text for screen readers', () => {
        render(<Loader />);
        const srText = screen.getByText('Loading...');
        expect(srText).toHaveClass('sr-only');
    });

    it('applies medium size by default', () => {
        render(<Loader />);
        const loader = screen.getByLabelText('Loading');
        expect(loader).toHaveClass('h-8', 'w-8');
    });

    it('applies small size', () => {
        render(<Loader size="sm" />);
        const loader = screen.getByLabelText('Loading');
        expect(loader).toHaveClass('h-4', 'w-4');
    });

    it('applies large size', () => {
        render(<Loader size="lg" />);
        const loader = screen.getByLabelText('Loading');
        expect(loader).toHaveClass('h-12', 'w-12');
    });

    it('applies custom className', () => {
        const { container } = render(<Loader className="custom-class" />);
        const wrapper = container.querySelector('.flex');
        expect(wrapper).toHaveClass('custom-class');
    });
});
