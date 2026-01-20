/**
 * GameContent Component
 * Displays the main game content (section view, choices, feedback)
 */

import { SectionView } from './SectionView';
import { ConsequenceFeedback } from './ConsequenceFeedback';
import { GameErrorBanner } from './GameErrorBanner';
import type { Choice } from './ChoicesList';
import type { GameSection } from '../../services/booksApi';
import type { GameState } from '../../domain/game/gameTypes';

interface GameContentProps {
    gameTitle: string;
    currentSection: GameSection | undefined;
    choices: Choice[];
    state: GameState;
    onChoiceSelect: (gotoId: string) => void;
    onDismissConsequence: () => void;
    onDismissError: () => void;
    isPaused: boolean;
}

export const GameContent = ({
    gameTitle,
    currentSection,
    choices,
    state,
    onChoiceSelect,
    onDismissConsequence,
    onDismissError,
    isPaused,
}: GameContentProps) => {
    if (!currentSection) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 border border-[#F9ECD5] text-center">
                <h2 className="text-2xl font-bold text-[#433025] mb-4">No Game Data Available</h2>
                <p className="text-stone-600 mb-6">
                    Unable to load game content. Please try again later.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Show consequence feedback */}
            {state.lastConsequence && (
                <ConsequenceFeedback
                    consequence={state.lastConsequence}
                    onDismiss={onDismissConsequence}
                />
            )}

            {/* Show navigation errors as an alert banner, not blocking the game */}
            {state.error && (
                <GameErrorBanner error={state.error} onDismiss={onDismissError} />
            )}

            <SectionView
                title={gameTitle}
                content={[currentSection.text]}
                choices={choices}
                onChoiceSelect={onChoiceSelect}
                disabled={isPaused}
            />
        </>
    );
};
