import { useParams } from 'react-router-dom';
import { useReducer } from 'react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { GamePageSkeleton } from '../components/game/GamePageSkeleton';
import { GameOverScreen } from '../components/game/GameOverScreen';
import { DeadEndScreen } from '../components/game/DeadEndScreen';
import { GameLayout } from '../components/game/GameLayout';
import { GameContent } from '../components/game/GameContent';
import { GameErrorDisplay } from '../components/game/GameErrorDisplay';
import { gameReducer } from '../domain/game/gameReducer';
import { INITIAL_GAME_STATE } from '../domain/game/gameTypes';
import {
    selectCurrentSection,
    selectChoices,
    selectGameTitle,
    selectIsGamePaused,
    selectHealthStatus,
    selectHealthPercentage,
} from '../domain/game/gameSelectors';
import { useGameData } from '../hooks/useGameData';
import { useGameActions } from '../hooks/useGameActions';

export const GamePage = () => {
    const { gamePath } = useParams<{ gamePath: string }>();
    const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);

    // Load game data
    useGameData({ gamePath, dispatch });

    // Get all action handlers
    const {
        showBackConfirm,
        handleBack,
        handleConfirmBack,
        handleCancelBack,
        handleSave,
        handleChoiceSelect,
        handlePause,
        handleResume,
        handleRestart,
    } = useGameActions({ state, dispatch, gamePath });

    // Derive state using selectors
    const currentSection = selectCurrentSection(state);
    const choices = selectChoices(state);
    const gameTitle = selectGameTitle(state);
    const isPaused = selectIsGamePaused(state);
    const healthStatus = selectHealthStatus(state);
    const healthPercentage = selectHealthPercentage(state);

    // Shared layout props
    const layoutProps = {
        gameTitle,
        health: state.health,
        maxHealth: state.maxHealth,
        healthStatus,
        healthPercentage,
        isPaused,
        showBackConfirm,
        onBack: handleBack,
        onSave: handleSave,
        onPause: handlePause,
        onResume: handleResume,
        onConfirmBack: handleConfirmBack,
        onCancelBack: handleCancelBack,
    };

    // Show game over screen if player died or game ended
    if (state.status === 'died' || state.status === 'ended') {
        return (
            <ErrorBoundary>
                <GameLayout {...layoutProps}>
                    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-0 py-8 sm:py-12">
                        <GameOverScreen
                            status={state.status}
                            currentSection={currentSection}
                            onRestart={handleRestart}
                            onBackToLibrary={handleBack}
                        />
                    </main>
                </GameLayout>
            </ErrorBoundary>
        );
    }

    // Show dead end screen if player reached a dead end
    if (state.status === 'dead_end') {
        return (
            <ErrorBoundary>
                <GameLayout {...layoutProps}>
                    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-0 py-8 sm:py-12">
                        <ErrorBoundary>
                            <DeadEndScreen
                                currentSection={currentSection}
                                onRestart={handleRestart}
                                onBackToLibrary={handleBack}
                            />
                        </ErrorBoundary>
                    </main>
                </GameLayout>
            </ErrorBoundary>
        );
    }

    // Main game view
    return (
        <ErrorBoundary>
            <GameLayout {...layoutProps}>
                <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-0 py-8 sm:py-12">
                    {state.status === 'loading' ? (
                        <GamePageSkeleton />
                    ) : state.status === 'error' ? (
                        <GameErrorDisplay error={state.error || 'Unknown error'} onBack={handleBack} />
                    ) : (
                        <GameContent
                            gameTitle={gameTitle}
                            currentSection={currentSection}
                            choices={choices}
                            state={state}
                            onChoiceSelect={handleChoiceSelect}
                            onDismissConsequence={() => dispatch({ type: 'DISMISS_CONSEQUENCE' })}
                            onDismissError={() => dispatch({ type: 'DISMISS_ERROR' })}
                            isPaused={isPaused}
                        />
                    )}
                </main>
            </GameLayout>
        </ErrorBoundary>
    );
};
