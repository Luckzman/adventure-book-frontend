import { X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

/**
 * ConfirmDialog Component
 * Reusable confirmation dialog for destructive actions
 */
export const ConfirmDialog = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-[#F9ECD5]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#F9ECD5]">
                    <h3 className="text-xl font-bold text-[#433025]">{title}</h3>
                    <button
                        onClick={onCancel}
                        className="text-stone-500 hover:text-stone-700 transition-colors cursor-pointer"
                        aria-label="Close dialog"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-stone-600 mb-6">{message}</p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <button
                            onClick={onCancel}
                            className="px-6 py-2 bg-stone-300 text-stone-900 rounded-lg hover:bg-stone-400 transition-colors font-medium cursor-pointer"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium cursor-pointer"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
