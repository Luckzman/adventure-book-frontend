import { useParams, useNavigate } from 'react-router-dom';
import { useReducer, useEffect, useState } from 'react';
import { GameHeader } from '../components/game/GameHeader';
import { SectionView } from '../components/game/SectionView';
import { GamePageSkeleton } from '../components/game/GamePageSkeleton';
import { fetchGameData, validateBookData } from '../services/booksApi';
import { gameReducer } from '../domain/game/gameReducer';
import { INITIAL_GAME_STATE } from '../domain/game/gameTypes';
import {
    selectCurrentSection,
    selectChoices,
    selectGameTitle,
    selectIsGameActive,
    selectIsGamePaused,
    selectHealthStatus,
    selectHealthPercentage,
} from '../domain/game/gameSelectors';
import { ConsequenceFeedback } from '../components/game/ConsequenceFeedback';
import { GameOverScreen } from '../components/game/GameOverScreen';
import { DeadEndScreen } from '../components/game/DeadEndScreen';
import { PauseOverlay } from '../components/game/PauseOverlay';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { formatErrorMessage, getErrorSuggestion } from '../utils/errorMessages';
import { logger } from '../utils/logger';

export const GamePage = () => {
    const { gamePath } = useParams<{ gamePath: string }>();
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);
    const [showBackConfirm, setShowBackConfirm] = useState(false);

    // Fetch book title and game data from API
    useEffect(() => {
        const abortController = new AbortController();
        let isMounted = true;

        const loadGameData = async () => {
            if (!gamePath) {
                if (isMounted) {
                    dispatch({
                        type: 'LOAD_GAME_ERROR',
                        payload: 'Invalid game path',
                    });
                }
                return;
            }

            if (isMounted) {
                dispatch({ type: 'LOAD_GAME_START' });
            }

            try {
                // Decode the path from URL
                const decodedPath = decodeURIComponent(gamePath);

                // Fetch game data with abort signal
                const data = await fetchGameData(decodedPath, abortController.signal);

                // Don't update state if component unmounted or request was aborted
                if (!isMounted || abortController.signal.aborted) {
                    return;
                }

                if (data) {
                    // Validate book data
                    const validation = validateBookData(data);
                    if (!validation.isValid) {
                        const errorMessage =
                            validation.errors.length === 1
                                ? validation.errors[0]
                                : `Invalid book data:\n\n${validation.errors
                                    .map((err, idx) => `${idx + 1}. ${err}`)
                                    .join('\n')}`;
                        if (isMounted) {
                            dispatch({
                                type: 'LOAD_GAME_ERROR',
                                payload: errorMessage,
                            });
                        }
                        return;
                    }

                    if (isMounted) {
                        dispatch({
                            type: 'LOAD_GAME_SUCCESS',
                            payload: data,
                        });
                    }
                } else {
                    if (isMounted) {
                        dispatch({
                            type: 'LOAD_GAME_ERROR',
                            payload: `Game data not found for "${decodedPath}". The adventure may not be available or the server may be down.`,
                        });
                    }
                }
            } catch (err) {
                // Don't handle errors if request was aborted or component unmounted
                if (abortController.signal.aborted || !isMounted) {
                    return;
                }

                // Format error message to be user-friendly
                const rawError = err instanceof Error ? err : new Error(String(err));
                const friendlyMessage = formatErrorMessage(rawError);
                const suggestion = getErrorSuggestion(rawError);

                const errorMessage = suggestion
                    ? `${friendlyMessage}\n\n${suggestion}`
                    : friendlyMessage;

                if (isMounted) {
                    dispatch({
                        type: 'LOAD_GAME_ERROR',
                        payload: errorMessage,
                    });
                }
                logger.error('Error loading game data:', err);
            }
        };

        loadGameData();

        // Cleanup: abort fetch request and mark component as unmounted
        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, [gamePath]);

    const handleBack = () => {
        // Show confirmation dialog if game is in progress
        if (state.status === 'playing' || state.status === 'paused') {
            setShowBackConfirm(true);
        } else {
            // No confirmation needed if game hasn't started or already ended
            dispatch({ type: 'DISMISS_ERROR' });
            navigate('/');
        }
    };

    const handleConfirmBack = () => {
        setShowBackConfirm(false);
        dispatch({ type: 'DISMISS_ERROR' });
        navigate('/');
    };

    const handleCancelBack = () => {
        setShowBackConfirm(false);
    };

    const handleSave = () => {
        // Show notification that save feature is coming soon
        // TODO: Implement save functionality when API endpoint is available
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-amber-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-slide-in';
        notification.innerHTML = `
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
                <p class="font-semibold">Save Feature Coming Soon</p>
                <p class="text-sm text-amber-100">We're working on adding the ability to save your progress!</p>
            </div>
        `;
        document.body.appendChild(notification);

        // Remove notification after 4 seconds
        setTimeout(() => {
            notification.classList.add('animate-slide-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    };

    // Intent-driven action: UI doesn't know game rules
    const handleChoiceSelect = (gotoId: string) => {
        if (!selectIsGameActive(state)) return;

        const currentSection = selectCurrentSection(state);
        const selectedOption = currentSection?.options?.find((opt) => opt.gotoId === gotoId);

        // Dispatch intent - reducer handles all game logic
        dispatch({
            type: 'MAKE_CHOICE',
            payload: {
                gotoId,
                consequence: selectedOption?.consequence || null,
            },
        });
    };

    const handlePause = () => {
        dispatch({ type: 'PAUSE_GAME' });
    };

    const handleResume = () => {
        dispatch({ type: 'RESUME_GAME' });
    };

    const handleRestart = () => {
        dispatch({ type: 'RESET_GAME' });
        // Reload game data
        if (gamePath) {
            const decodedPath = decodeURIComponent(gamePath);
            fetchGameData(decodedPath).then((data) => {
                if (data) {
                    dispatch({
                        type: 'LOAD_GAME_SUCCESS',
                        payload: data,
                    });
                }
            });
        }
    };

    // Derive state using selectors
    const currentSection = selectCurrentSection(state);
    const choices = selectChoices(state);
    const gameTitle = selectGameTitle(state);
    const isPaused = selectIsGamePaused(state);
    const healthStatus = selectHealthStatus(state);
    const healthPercentage = selectHealthPercentage(state);

    // Show game over screen if player died or game ended
    if (state.status === 'died' || state.status === 'ended') {
        return (
            <div className="min-h-screen bg-stone-50">
                <GameHeader
                    gameTitle={gameTitle}
                    health={state.health}
                    maxHealth={state.maxHealth}
                    healthStatus={healthStatus}
                    healthPercentage={healthPercentage}
                    isPaused={isPaused}
                    onBack={handleBack}
                    onSave={handleSave}
                    onPause={handlePause}
                    onResume={handleResume}
                />
                {/* Show pause overlay when game is paused */}
                {isPaused && (
                    <PauseOverlay
                        onResume={handleResume}
                        onSave={handleSave}
                        onShowBackConfirm={handleBack}
                    />
                )}
                {/* Confirmation dialog for back to library */}
                <ConfirmDialog
                    isOpen={showBackConfirm}
                    title="Leave Adventure?"
                    message="Returning to the library will cause you to lose your current game progress. Are you sure you want to continue?"
                    confirmText="Leave Adventure"
                    cancelText="Continue Playing"
                    onConfirm={handleConfirmBack}
                    onCancel={handleCancelBack}
                />
                <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-0 py-8 sm:py-12">
                    <GameOverScreen
                        status={state.status}
                        currentSection={currentSection}
                        onRestart={handleRestart}
                        onBackToLibrary={handleBack}
                    />
                </main>
            </div>
        );
    }

    // Show dead end screen if player reached a dead end
    if (state.status === 'dead_end') {
        return (
            <ErrorBoundary>
                <div className="min-h-screen bg-stone-50">
                    <GameHeader
                        gameTitle={gameTitle}
                        health={state.health}
                        maxHealth={state.maxHealth}
                        healthStatus={healthStatus}
                        healthPercentage={healthPercentage}
                        isPaused={isPaused}
                        onBack={handleBack}
                        onSave={handleSave}
                        onPause={handlePause}
                        onResume={handleResume}
                    />
                    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-0 py-8 sm:py-12">
                        <ErrorBoundary>
                            <DeadEndScreen
                                currentSection={currentSection}
                                onRestart={handleRestart}
                                onBackToLibrary={handleBack}
                            />
                        </ErrorBoundary>
                    </main>
                </div>
            </ErrorBoundary>
        );
    }

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-stone-50">
                <GameHeader
                    gameTitle={gameTitle}
                    health={state.health}
                    maxHealth={state.maxHealth}
                    healthStatus={healthStatus}
                    healthPercentage={healthPercentage}
                    isPaused={isPaused}
                    onBack={handleBack}
                    onSave={handleSave}
                    onPause={handlePause}
                    onResume={handleResume}
                />
                {/* Show pause overlay when game is paused */}
                {isPaused && (
                    <PauseOverlay
                        onResume={handleResume}
                        onSave={handleSave}
                        onShowBackConfirm={handleBack}
                    />
                )}
                {/* Confirmation dialog for back to library */}
                <ConfirmDialog
                    isOpen={showBackConfirm}
                    title="Leave Adventure?"
                    message="Returning to the library will cause you to lose your current game progress. Are you sure you want to continue?"
                    confirmText="Leave Adventure"
                    cancelText="Continue Playing"
                    onConfirm={handleConfirmBack}
                    onCancel={handleCancelBack}
                />
                <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-0 py-8 sm:py-12">
                    {state.status === 'loading' ? (
                        <GamePageSkeleton />
                    ) : state.status === 'error' ? (
                        <div className="bg-white rounded-lg shadow-md p-8 border border-[#F9ECD5]">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                                    <svg
                                        className="h-8 w-8 text-red-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-[#433025] mb-2">Unable to Load Adventure</h2>
                                <p className="text-stone-600">We encountered a problem loading this adventure.</p>
                                <p className="text-sm text-red-700 whitespace-pre-wrap font-mono mt-2 border border-red-200 rounded-lg p-2 max-w-md mx-auto">{state.error}</p>
                            </div>
                            <div className="text-center">
                                <button
                                    onClick={handleBack}
                                    className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                                >
                                    Back to Library
                                </button>
                            </div>
                        </div>
                    ) : currentSection ? (
                        <>
                            {/* Show consequence feedback */}
                            {state.lastConsequence && (
                                <ConsequenceFeedback
                                    consequence={state.lastConsequence}
                                    onDismiss={() => dispatch({ type: 'DISMISS_CONSEQUENCE' })}
                                />
                            )}

                            {/* Show navigation errors as an alert banner, not blocking the game */}
                            {state.error && (
                                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="shrink-0">
                                            <svg
                                                className="h-5 w-5 text-red-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-red-800 font-semibold mb-1">Navigation Error</p>
                                            <p className="text-sm text-red-700">{state.error}</p>
                                        </div>
                                        <button
                                            onClick={() => dispatch({ type: 'DISMISS_ERROR' })}
                                            className="shrink-0 text-red-600 hover:text-red-800"
                                            aria-label="Dismiss error"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                            <SectionView
                                title={gameTitle}
                                content={[currentSection.text]}
                                choices={choices}
                                onChoiceSelect={handleChoiceSelect}
                                disabled={isPaused}
                            />
                        </>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 border border-[#F9ECD5] text-center">
                            <h2 className="text-2xl font-bold text-[#433025] mb-4">No Game Data Available</h2>
                            <p className="text-stone-600 mb-6">Unable to load game content. Please try again later.</p>
                            <button
                                onClick={handleBack}
                                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                            >
                                Back to Library
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </ErrorBoundary>
    );
};
