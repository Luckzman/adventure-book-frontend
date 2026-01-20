import type { GameSection } from '../../services/booksApi';
import { Trophy, Skull, RotateCcw } from 'lucide-react';

interface GameOverScreenProps {
    status: 'died' | 'ended';
    currentSection: GameSection | undefined;
    onRestart: () => void;
    onBackToLibrary: () => void;
}

/**
 * GameOverScreen Component
 * Shows clear end-of-game experience with empathy
 * Avoids: "Game Over."
 * Prefers: Clear message, reason for loss, next actions
 */
export const GameOverScreen = ({
    status,
    currentSection,
    onRestart,
    onBackToLibrary,
}: GameOverScreenProps) => {
    if (status === 'died') {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 border border-[#F9ECD5] text-center">
                <div className="flex justify-center mb-4">
                    <Skull className="h-16 w-16 text-red-600" />
                </div>
                <h2 className="text-3xl font-bold text-[#433025] mb-4">You Died</h2>
                <p className="text-lg text-stone-600 mb-2">
                    Your health reached zero and your adventure has come to an end.
                </p>
                {currentSection?.text && (
                    <div className="mt-6 mb-6 p-4 bg-stone-50 rounded-lg border border-stone-200">
                        <p className="text-stone-700 italic">"{currentSection.text}"</p>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <button
                        onClick={onRestart}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                    >
                        <RotateCcw className="h-5 w-5" />
                        Restart Adventure
                    </button>
                    <button
                        onClick={onBackToLibrary}
                        className="px-6 py-3 bg-stone-200 text-stone-800 rounded-lg hover:bg-stone-300 transition-colors font-medium"
                    >
                        Back to Library
                    </button>
                </div>
            </div>
        );
    }

    // Game ended successfully
    return (
        <div className="bg-white rounded-lg shadow-md p-8 border border-[#F9ECD5] text-center">
            <div className="flex justify-center mb-4">
                <Trophy className="h-16 w-16 text-amber-500" />
            </div>
            <h2 className="text-3xl font-bold text-[#433025] mb-4">The End</h2>
            <p className="text-lg text-stone-600 mb-2">Your adventure has concluded successfully.</p>
            {currentSection?.text && (
                <div className="mt-6 mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-stone-700 italic">"{currentSection.text}"</p>
                </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button
                    onClick={onRestart}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                >
                    <RotateCcw className="h-5 w-5" />
                    Play Again
                </button>
                <button
                    onClick={onBackToLibrary}
                    className="px-6 py-3 bg-stone-200 text-stone-800 rounded-lg hover:bg-stone-300 transition-colors font-medium"
                >
                    Back to Library
                </button>
            </div>
        </div>
    );
};
