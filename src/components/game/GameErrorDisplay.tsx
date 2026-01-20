/**
 * GameErrorDisplay Component
 * Displays error state when game fails to load
 */

interface GameErrorDisplayProps {
    error: string;
    onBack: () => void;
}

export const GameErrorDisplay = ({ error, onBack }: GameErrorDisplayProps) => {
    return (
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
                <p className="text-sm text-red-700 whitespace-pre-wrap font-mono mt-2 border border-red-200 rounded-lg p-2 max-w-md mx-auto">
                    {error}
                </p>
            </div>
            <div className="text-center">
                <button
                    onClick={onBack}
                    className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors cursor-pointer"
                >
                    Back to Library
                </button>
            </div>
        </div>
    );
};
