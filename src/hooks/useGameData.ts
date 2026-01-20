import { useEffect } from 'react';
import { fetchGameData, validateBookData } from '../services/booksApi';
import { formatErrorMessage, getErrorSuggestion } from '../utils/errorMessages';
import { logger } from '../utils/logger';
import type { GameAction } from '../domain/game/gameTypes';

interface UseGameDataProps {
    gamePath: string | undefined;
    dispatch: React.Dispatch<GameAction>;
}

export const useGameData = ({ gamePath, dispatch }: UseGameDataProps) => {
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
    }, [gamePath, dispatch]);
};
