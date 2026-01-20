import { Play, Home, Save } from 'lucide-react';

interface PauseOverlayProps {
    onResume: () => void;
    onSave?: () => void;
    onBackToLibrary?: () => void;
    onShowBackConfirm?: () => void;
}

/**
 * PauseOverlay Component
 * Shows when game is paused, blocking all game interactions
 * Provides clear options: Resume, Save, or Return to Library
 */
export const PauseOverlay = ({
    onResume,
    onSave,
    onBackToLibrary,
    onShowBackConfirm,
}: PauseOverlayProps) => {
    const handleBackClick = () => {
        if (onShowBackConfirm) {
            onShowBackConfirm();
        } else if (onBackToLibrary) {
            onBackToLibrary();
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 border border-[#F9ECD5]">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                        <Play className="h-8 w-8 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#433025] mb-2">Game Paused</h2>
                    <p className="text-stone-600">Your adventure is on hold. Take your time!</p>
                </div>

                <div className="space-y-3">
                    {/* Resume Button */}
                    <button
                        onClick={onResume}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium cursor-pointer"
                    >
                        <Play className="h-5 w-5" />
                        Resume Game
                    </button>

                    {/* Save Progress Button */}
                    {onSave && (
                        <button
                            onClick={onSave}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border border-stone-400 text-stone-900 rounded-lg hover:bg-stone-50 transition-colors font-medium cursor-pointer"
                        >
                            <Save className="h-5 w-5" />
                            Save Progress
                        </button>
                    )}

                    {/* Back to Library Button */}
                    {(onBackToLibrary || onShowBackConfirm) && (
                        <button
                            onClick={handleBackClick}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-stone-300 text-stone-900 rounded-lg hover:bg-stone-400 transition-colors font-medium cursor-pointer"
                        >
                            <Home className="h-5 w-5" />
                            Back to Library
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
