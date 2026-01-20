import type { GameSection } from '../../services/booksApi';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface DeadEndScreenProps {
    currentSection: GameSection | undefined;
    onRestart: () => void;
    onBackToLibrary: () => void;
}

/**
 * DeadEndScreen Component
 * Shows when player reaches a dead end (invalid reference or section without options)
 * Empathetic UX: Clear message, reason, and next actions
 */
export const DeadEndScreen = ({ currentSection, onRestart, onBackToLibrary }: DeadEndScreenProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-8 border border-[#F9ECD5] text-center">
            <div className="flex justify-center mb-4">
                <AlertTriangle className="h-16 w-16 text-amber-600" />
            </div>
            <h2 className="text-3xl font-bold text-[#433025] mb-4">Dead End</h2>
            <p className="text-lg text-stone-600 mb-2">
                Your adventure has reached a dead end. This path cannot be continued.
            </p>
            <p className="text-sm text-stone-500 mb-6">
                This may be due to an invalid reference in the book data or a section without available options.
            </p>

            {currentSection?.text && (
                <div className="mt-6 mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-stone-700 italic">"{currentSection.text}"</p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button
                    onClick={onRestart}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium cursor-pointer"
                >
                    <RotateCcw className="h-5 w-5" />
                    Restart Adventure
                </button>
                <button
                    onClick={onBackToLibrary}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-300 text-stone-900 rounded-lg hover:bg-stone-400 transition-colors font-medium cursor-pointer"
                >
                    <Home className="h-5 w-5" />
                    Back to Library
                </button>
            </div>
        </div>
    );
};
