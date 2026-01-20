/**
 * Tests for ChoicesList component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChoicesList, type Choice } from '../ChoicesList';

describe('ChoicesList', () => {
    const mockChoices: Choice[] = [
        {
            id: '1',
            number: 1,
            text: 'First choice',
            description: 'Description 1',
            consequence: null,
        },
        {
            id: '2',
            number: 2,
            text: 'Second choice',
            description: 'Description 2',
            requirement: 'Requires item',
            consequence: {
                type: 'LOSE_HEALTH',
                value: '3',
                text: 'You lost health',
            },
        },
    ];

    it('should render choices', () => {
        const onChoiceSelect = vi.fn();
        render(<ChoicesList choices={mockChoices} onChoiceSelect={onChoiceSelect} />);

        expect(screen.getByText('What do you choose?')).toBeInTheDocument();
        expect(screen.getByText('First choice')).toBeInTheDocument();
        expect(screen.getByText('Second choice')).toBeInTheDocument();
    });

    it('should call onChoiceSelect when choice is clicked', async () => {
        const user = userEvent.setup();
        const onChoiceSelect = vi.fn();

        render(<ChoicesList choices={mockChoices} onChoiceSelect={onChoiceSelect} />);
        const firstChoice = screen.getByLabelText(/Choice 1: First choice/);
        await user.click(firstChoice);

        expect(onChoiceSelect).toHaveBeenCalledWith('1');
    });

    it('should disable choices when disabled prop is true', () => {
        const onChoiceSelect = vi.fn();
        render(
            <ChoicesList
                choices={mockChoices}
                onChoiceSelect={onChoiceSelect}
                disabled={true}
            />
        );

        const buttons = screen.getAllByRole('button');
        buttons.forEach((button) => {
            expect(button).toBeDisabled();
        });
    });

    it('should display requirement when present', () => {
        const onChoiceSelect = vi.fn();
        render(<ChoicesList choices={mockChoices} onChoiceSelect={onChoiceSelect} />);

        expect(screen.getByText('Requires: Requires item')).toBeInTheDocument();
    });

    it('should render empty list when no choices', () => {
        const onChoiceSelect = vi.fn();
        render(<ChoicesList choices={[]} onChoiceSelect={onChoiceSelect} />);

        expect(screen.getByText('What do you choose?')).toBeInTheDocument();
        expect(screen.queryByText('First choice')).not.toBeInTheDocument();
    });
});
