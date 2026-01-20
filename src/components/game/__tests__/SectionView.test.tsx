import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionView } from '../SectionView';

describe('SectionView', () => {
    const defaultProps = {
        title: 'Test Section',
        content: ['First paragraph', 'Second paragraph'],
        choices: [],
        onChoiceSelect: vi.fn(),
    };

    it('renders section title', () => {
        render(<SectionView {...defaultProps} />);
        expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    it('renders all content paragraphs', () => {
        render(<SectionView {...defaultProps} />);
        expect(screen.getByText('First paragraph')).toBeInTheDocument();
        expect(screen.getByText('Second paragraph')).toBeInTheDocument();
    });

    it('renders choices when provided', () => {
        const choices = [
            {
                id: '1',
                number: 1,
                text: 'First choice',
                description: 'Choose this',
            },
            {
                id: '2',
                number: 2,
                text: 'Second choice',
                description: 'Or this',
            },
        ];
        render(<SectionView {...defaultProps} choices={choices} />);
        expect(screen.getByText('First choice')).toBeInTheDocument();
        expect(screen.getByText('Second choice')).toBeInTheDocument();
    });

    it('does not render choices list when choices array is empty', () => {
        render(<SectionView {...defaultProps} choices={[]} />);
        expect(screen.queryByText('What do you choose?')).not.toBeInTheDocument();
    });

    it('does not show border when there are no choices', () => {
        const { container } = render(<SectionView {...defaultProps} choices={[]} />);
        const contentDiv = container.querySelector('.space-y-4');
        expect(contentDiv).not.toHaveClass('border-b');
    });

    it('shows border when there are choices', () => {
        const choices = [
            {
                id: '1',
                number: 1,
                text: 'First choice',
                description: 'Choose this',
            },
        ];
        const { container } = render(<SectionView {...defaultProps} choices={choices} />);
        const contentDiv = container.querySelector('.space-y-4');
        expect(contentDiv).toHaveClass('border-b');
    });

    it('passes disabled prop to ChoicesList', () => {
        const choices = [
            {
                id: '1',
                number: 1,
                text: 'First choice',
                description: 'Choose this',
            },
        ];
        render(<SectionView {...defaultProps} choices={choices} disabled={true} />);
        const choiceButton = screen.getByText('First choice').closest('button');
        expect(choiceButton).toBeDisabled();
    });
});
