/**
 * GameLayout Component
 * Wraps game content with header, pause overlay, and confirmation dialog
 * Reduces duplication across different game states
 */

import type { ReactNode } from 'react';
import { GameHeader } from './GameHeader';
import { PauseOverlay } from './PauseOverlay';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface GameLayoutProps {
    gameTitle: string;
    health: number;
    maxHealth: number;
    healthStatus: 'healthy' | 'warning' | 'danger' | 'critical';
    healthPercentage: number;
    isPaused: boolean;
    showBackConfirm: boolean;
    onBack: () => void;
    onSave: () => void;
    onPause: () => void;
    onResume: () => void;
    onConfirmBack: () => void;
    onCancelBack: () => void;
    children: ReactNode;
}

export const GameLayout = ({
    gameTitle,
    health,
    maxHealth,
    healthStatus,
    healthPercentage,
    isPaused,
    showBackConfirm,
    onBack,
    onSave,
    onPause,
    onResume,
    onConfirmBack,
    onCancelBack,
    children,
}: GameLayoutProps) => {
    return (
        <div className="min-h-screen bg-stone-50">
            <GameHeader
                gameTitle={gameTitle}
                health={health}
                maxHealth={maxHealth}
                healthStatus={healthStatus}
                healthPercentage={healthPercentage}
                isPaused={isPaused}
                onBack={onBack}
                onSave={onSave}
                onPause={onPause}
                onResume={onResume}
            />
            {/* Show pause overlay when game is paused */}
            {isPaused && (
                <PauseOverlay
                    onResume={onResume}
                    onSave={onSave}
                    onShowBackConfirm={onBack}
                />
            )}
            {/* Confirmation dialog for back to library */}
            <ConfirmDialog
                isOpen={showBackConfirm}
                title="Leave Adventure?"
                message="Returning to the library will cause you to lose your current game progress. Are you sure you want to continue?"
                confirmText="Leave Adventure"
                cancelText="Continue Playing"
                onConfirm={onConfirmBack}
                onCancel={onCancelBack}
            />
            {children}
        </div>
    );
};
