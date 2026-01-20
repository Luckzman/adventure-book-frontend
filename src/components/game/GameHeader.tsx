import { ArrowLeft, BookOpen, Save, Heart } from 'lucide-react';

interface GameHeaderProps {
    gameTitle: string;
    health?: number;
    maxHealth?: number;
    onBack?: () => void;
    onSave?: () => void;
}

export const GameHeader = ({ gameTitle, health = 10, maxHealth = 10, onBack, onSave }: GameHeaderProps) => {
    // Derive health status for visual feedback
    const healthPercentage = Math.round((health / maxHealth) * 100);
    const getHealthStatus = (): 'healthy' | 'warning' | 'danger' | 'critical' => {
        if (healthPercentage >= 70) return 'healthy';
        if (healthPercentage >= 50) return 'warning';
        if (healthPercentage >= 25) return 'danger';
        return 'critical';
    };

    const healthStatus = getHealthStatus();
    const healthColorClasses = {
        healthy: 'bg-green-500 text-white',
        warning: 'bg-yellow-500 text-white',
        danger: 'bg-orange-500 text-white',
        critical: 'bg-red-600 text-white',
    };

    const healthBgClasses = {
        healthy: 'bg-green-100',
        warning: 'bg-yellow-100',
        danger: 'bg-orange-100',
        critical: 'bg-red-100',
    };
    return (
        <header className="w-full py-4 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl flex md:flex-row flex-col items-start md:items-center justify-between gap-4">
                {/* Left side: Back to Library and Game Title */}
                {/* <div className="flex items-center gap-4"> */}
                {/* Back to Library Button */}
                <div className="flex justify-between items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[#433025] hover:text-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
                        aria-label="Back to Library"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm font-medium">Back to Library</span>
                    </button>

                    {/* <button
                        onClick={onSave}
                        className="flex md:hidden items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-800 font-serif hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                        aria-label="Save Progress"
                    >
                        <Save className="h-4 w-4" />
                        <span className="font-serif">Save Progress</span>
                    </button> */}

                </div>

                {/* Game Title and Health */}
                <div className="flex items-center gap-4">
                    {/* Game Title Button */}
                    <button
                        className="flex items-center gap-2 text-center bg-[#F3EBE2] border border-[#F3DFB7] rounded-full px-4 py-1 text-[#433025] font-serif hover:bg-[#F3DFB7] transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                        aria-label="Game Title"
                    >
                        <BookOpen className="h-4 w-4" />
                        <span className="font-serif">{gameTitle}</span>
                    </button>

                    {/* Health Display with Visual Feedback */}
                    <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${healthBgClasses[healthStatus]} border-opacity-30`}
                    >
                        <Heart
                            className={`h-4 w-4 ${healthColorClasses[healthStatus]}`}
                            fill={healthStatus === 'critical' ? 'currentColor' : 'none'}
                        />
                        <span className={`text-sm font-semibold ${healthColorClasses[healthStatus]}`}>
                            {health}/{maxHealth}
                        </span>
                    </div>
                </div>

                {/* Save Progress Button */}
                <button
                    onClick={onSave}
                    className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-800 font-serif hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    aria-label="Save Progress"
                >
                    <Save className="h-4 w-4" />
                    <span className="font-serif">Save Progress</span>
                </button>
            </div>
        </header>
    );
};
