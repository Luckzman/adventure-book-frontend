import { AlertCircle, X } from 'lucide-react';

interface ConsequenceFeedbackProps {
    consequence: {
        type: string;
        value: number;
        text: string;
    };
    onDismiss: () => void;
}

/**
 * ConsequenceFeedback Component
 * Shows explicit feedback when player loses health
 */
export const ConsequenceFeedback = ({ consequence, onDismiss }: ConsequenceFeedbackProps) => {
    if (consequence.type !== 'LOSE_HEALTH') {
        return null;
    }

    return (
        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4 animate-pulse-once">
            <div className="flex items-start gap-3">
                <div className="shrink-0">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                    <p className="text-orange-800 font-semibold mb-1">
                        You lost {consequence.value} health point{consequence.value !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-orange-700">{consequence.text}</p>
                </div>
                <button
                    onClick={onDismiss}
                    className="shrink-0 text-orange-600 hover:text-orange-800 transition-colors"
                    aria-label="Dismiss"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};
