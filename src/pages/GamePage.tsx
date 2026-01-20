import { useParams, useNavigate } from 'react-router-dom';
import { useReducer, useEffect } from 'react';
import { GameHeader } from '../components/game/GameHeader';
import { SectionView } from '../components/game/SectionView';
import { Loader } from '../components/common/Loader';
import { fetchGameData, validateBookData } from '../services/booksApi';
import { gameReducer } from '../domain/game/gameReducer';
import { INITIAL_GAME_STATE } from '../domain/game/gameTypes';
import {
    selectCurrentSection,
    selectChoices,
    selectGameTitle,
    selectIsGameActive,
} from '../domain/game/gameSelectors';
import { ConsequenceFeedback } from '../components/game/ConsequenceFeedback';
import { GameOverScreen } from '../components/game/GameOverScreen';

export const GamePage = () => {
    const { gamePath } = useParams<{ gamePath: string }>();
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);

    // Fetch book title and game data from API
    useEffect(() => {
        const loadGameData = async () => {
            if (!gamePath) {
                dispatch({
                    type: 'LOAD_GAME_ERROR',
                    payload: 'Invalid game path',
                });
                return;
            }

            dispatch({ type: 'LOAD_GAME_START' });

            try {
                // Decode the path from URL
                const decodedPath = decodeURIComponent(gamePath);

                // Fetch game data
                const data = await fetchGameData(decodedPath);
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
                        dispatch({
                            type: 'LOAD_GAME_ERROR',
                            payload: errorMessage,
                        });
                        return;
                    }

                    dispatch({
                        type: 'LOAD_GAME_SUCCESS',
                        payload: data,
                    });
                } else {
                    dispatch({
                        type: 'LOAD_GAME_ERROR',
                        payload: `Game data not found for "${decodedPath}". The adventure may not be available or the server may be down.`,
                    });
                }
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : 'An unexpected error occurred while loading the game.';
                dispatch({
                    type: 'LOAD_GAME_ERROR',
                    payload: errorMessage,
                });
                console.error('Error loading game data:', err);
            }
        };

        loadGameData();
    }, [gamePath]);

    const handleBack = () => {
        dispatch({ type: 'DISMISS_ERROR' });
        navigate('/');
    };

    const handleSave = () => {
        // TODO: Implement save functionality
        console.log('Saving game progress for:', gamePath);
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

    // Show game over screen if player died or game ended
    if (state.status === 'died' || state.status === 'ended') {
        return (
            <div className="min-h-screen bg-stone-50">
                <GameHeader
                    gameTitle={gameTitle}
                    health={state.health}
                    maxHealth={state.maxHealth}
                    onBack={handleBack}
                    onSave={handleSave}
                />
                <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-0 py-8 sm:py-12">
                    <GameOverScreen
                        status={state.status}
                        health={state.health}
                        currentSection={currentSection}
                        onRestart={handleRestart}
                        onBackToLibrary={handleBack}
                    />
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50">
            <GameHeader
                gameTitle={gameTitle}
                health={state.health}
                maxHealth={state.maxHealth}
                onBack={handleBack}
                onSave={handleSave}
            />
            <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-0 py-8 sm:py-12">
                {state.status === 'loading' ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader size="lg" />
                    </div>
                ) : state.status === 'error' ? (
                    <div className="bg-white rounded-lg shadow-md p-8 border border-[#F9ECD5]">
                        <h2 className="text-2xl font-bold text-[#433025] mb-4 text-center">Error Loading Game</h2>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-800 font-semibold mb-2">Validation Errors:</p>
                            <pre className="text-sm text-red-700 whitespace-pre-wrap font-mono">{state.error}</pre>
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
    );
};
