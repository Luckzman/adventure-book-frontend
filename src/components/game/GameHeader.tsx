import { ArrowLeft, BookOpen, Save } from 'lucide-react';

interface GameHeaderProps {
    gameTitle: string;
    onBack?: () => void;
    onSave?: () => void;
}

export const GameHeader = ({ gameTitle, onBack, onSave }: GameHeaderProps) => {
    return (
        <header className="w-full py-4 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl flex md:flex-row flex-col items-start md:items-center justify-between gap-4">
                {/* Left side: Back to Library and Game Title */}
                {/* <div className="flex items-center gap-4"> */}
                {/* Back to Library Button */}
                <div className="w-full flex justify-between items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[#433025] hover:text-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
                        aria-label="Back to Library"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm font-medium">Back to Library</span>
                    </button>

                    <button
                        onClick={onSave}
                        className="flex md:hidden items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-800 font-serif hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                        aria-label="Save Progress"
                    >
                        <Save className="h-4 w-4" />
                        <span className="font-serif">Save Progress</span>
                    </button>

                </div>

                {/* Game Title Button */}
                <button
                    className="flex items-center gap-2 text-center bg-[#F3EBE2] border border-[#F3DFB7] rounded-full px-4 py-1 text-[#433025] font-serif hover:bg-[#F3DFB7] transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    aria-label="Game Title"
                >
                    <BookOpen className="h-4 w-4" />
                    <span className="font-serif">{gameTitle}</span>
                </button>
                {/* </div> */}

                {/* Save Progress Button */}
                <button
                    onClick={onSave}
                    className="hidden md:flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-800 font-serif hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    aria-label="Save Progress"
                >
                    <Save className="h-4 w-4" />
                    <span className="font-serif">Save Progress</span>
                </button>
            </div>
        </header>
    );
};
