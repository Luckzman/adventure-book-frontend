/**
 * GameErrorBanner Component
 * Displays dismissible error banner for navigation errors
 */

interface GameErrorBannerProps {
    error: string;
    onDismiss: () => void;
}

export const GameErrorBanner = ({ error, onDismiss }: GameErrorBannerProps) => {
    return (
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
                    <p className="text-sm text-red-700">{error}</p>
                </div>
                <button
                    onClick={onDismiss}
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
    );
};
