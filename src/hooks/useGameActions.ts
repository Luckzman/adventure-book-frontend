/**
 * Custom hook for game action handlers
 * Centralizes all game-related actions and navigation
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGameData } from '../services/booksApi';
import { selectIsGameActive, selectCurrentSection } from '../domain/game/gameSelectors';
import type { GameState, GameAction } from '../domain/game/gameTypes';
import { showSaveNotification } from '../utils/notifications';

interface UseGameActionsProps {
    state: GameState;
    dispatch: React.Dispatch<GameAction>;
    gamePath: string | undefined;
}

export const useGameActions = ({ state, dispatch, gamePath }: UseGameActionsProps) => {
    const navigate = useNavigate();
    const [showBackConfirm, setShowBackConfirm] = useState(false);

    const handleBack = useCallback(() => {
        // Show confirmation dialog if game is in progress
        if (state.status === 'playing' || state.status === 'paused') {
            setShowBackConfirm(true);
        } else {
            // No confirmation needed if game hasn't started or already ended
            dispatch({ type: 'DISMISS_ERROR' });
            navigate('/');
        }
    }, [state.status, dispatch, navigate]);

    const handleConfirmBack = useCallback(() => {
        setShowBackConfirm(false);
        dispatch({ type: 'DISMISS_ERROR' });
        navigate('/');
    }, [dispatch, navigate]);

    const handleCancelBack = useCallback(() => {
        setShowBackConfirm(false);
    }, []);

    const handleSave = useCallback(() => {
        showSaveNotification();
    }, []);

    const handleChoiceSelect = useCallback(
        (gotoId: string) => {
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
        },
        [state, dispatch]
    );

    const handlePause = useCallback(() => {
        dispatch({ type: 'PAUSE_GAME' });
    }, [dispatch]);

    const handleResume = useCallback(() => {
        dispatch({ type: 'RESUME_GAME' });
    }, [dispatch]);

    const handleRestart = useCallback(() => {
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
    }, [dispatch, gamePath]);

    return {
        showBackConfirm,
        handleBack,
        handleConfirmBack,
        handleCancelBack,
        handleSave,
        handleChoiceSelect,
        handlePause,
        handleResume,
        handleRestart,
    };
};
