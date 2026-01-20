import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SearchInput } from '../SearchInput';

describe('SearchInput', () => {
    it('renders search input', () => {
        render(<SearchInput />);
        const input = screen.getByRole('searchbox');
        expect(input).toBeInTheDocument();
    });

    it('uses default placeholder', () => {
        render(<SearchInput />);
        const input = screen.getByPlaceholderText('Search adventures...');
        expect(input).toBeInTheDocument();
    });

    it('uses custom placeholder', () => {
        render(<SearchInput placeholder="Custom placeholder" />);
        const input = screen.getByPlaceholderText('Custom placeholder');
        expect(input).toBeInTheDocument();
    });

    it('forwards ref to input element', () => {
        const ref = vi.fn();
        render(<SearchInput ref={ref} />);
        const input = screen.getByRole('searchbox');
        expect(ref).toHaveBeenCalledWith(input);
    });

    it('passes additional props to input', () => {
        render(<SearchInput value="test" onChange={vi.fn()} />);
        const input = screen.getByRole('searchbox') as HTMLInputElement;
        expect(input.value).toBe('test');
    });

    it('applies custom className', () => {
        const { container } = render(<SearchInput className="custom-class" />);
        const wrapper = container.querySelector('.relative');
        expect(wrapper).toHaveClass('custom-class');
    });
});
