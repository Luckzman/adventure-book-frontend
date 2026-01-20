import { ArrowLeft, BookOpen, Save, Heart, Pause, Play } from 'lucide-react';
import { GAME_CONSTANTS } from '../../domain/game/gameConstants';

interface GameHeaderProps {
    gameTitle: string;
    health?: number;
    maxHealth?: number;
    healthStatus?: 'healthy' | 'warning' | 'danger' | 'critical';
    healthPercentage?: number;
    isPaused?: boolean;
    onBack?: () => void;
    onSave?: () => void;
    onPause?: () => void;
    onResume?: () => void;
}

export const GameHeader = ({
    gameTitle,
    health = GAME_CONSTANTS.INITIAL_HEALTH,
    maxHealth = GAME_CONSTANTS.MAX_HEALTH,
    healthStatus: healthStatusProp,
    healthPercentage: healthPercentageProp,
    isPaused = false,
    onBack,
    onSave,
    onPause,
    onResume,
}: GameHeaderProps) => {
    // Use provided health status/percentage or calculate from health values
    const healthPercentage = healthPercentageProp ?? Math.round((health / maxHealth) * 100);

    // Derive health status if not provided
    const getHealthStatus = (): 'healthy' | 'warning' | 'danger' | 'critical' => {
        const { HEALTHY, WARNING, DANGER } = GAME_CONSTANTS.HEALTH_THRESHOLDS;
        if (healthPercentage >= HEALTHY) return 'healthy';
        if (healthPercentage >= WARNING) return 'warning';
        if (healthPercentage >= DANGER) return 'danger';
        return 'critical';
    };

    const healthStatus = healthStatusProp ?? getHealthStatus();
    const healthColorClasses = {
        healthy: 'text-green-500',
        warning: 'text-yellow-500',
        danger: 'text-orange-500',
        critical: 'text-red-600',
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
                        className="flex items-center gap-2 text-stone-800 hover:text-amber-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
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
                        className="flex items-center gap-2 text-center bg-[#F3EBE2] border border-[#F3DFB7] rounded-full px-4 py-1 text-stone-900 font-serif hover:bg-[#F3DFB7] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                        aria-label="Game Title"
                    >
                        <BookOpen className="h-4 w-4" />
                        <span className="font-serif">{gameTitle}</span>
                    </button>

                    {/* Health Display with Visual Feedback */}
                    <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-400 transition-all ${healthBgClasses[healthStatus]}`}
                        title={`Health: ${health}/${maxHealth} (${healthPercentage}%)`}
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

                {/* Pause/Resume and Save Progress Buttons */}
                <div className="flex items-center gap-3">
                    {/* Pause/Resume Button */}
                    {onPause && onResume && (
                        <button
                            onClick={isPaused ? onResume : onPause}
                            className="flex items-center gap-2 bg-white border border-stone-400 rounded-lg px-4 py-2 text-stone-900 font-serif hover:bg-stone-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                            aria-label={isPaused ? 'Resume Game' : 'Pause Game'}
                        >
                            {isPaused ? (
                                <>
                                    <Play className="h-4 w-4" />
                                    <span className="font-serif">Resume</span>
                                </>
                            ) : (
                                <>
                                    <Pause className="h-4 w-4" />
                                    <span className="font-serif">Pause</span>
                                </>
                            )}
                        </button>
                    )}

                    {/* Save Progress Button */}
                    <button
                        onClick={onSave}
                        className="flex items-center gap-2 bg-white border border-stone-400 rounded-lg px-4 py-2 text-stone-900 font-serif hover:bg-stone-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                        aria-label="Save Progress"
                    >
                        <Save className="h-4 w-4" />
                        <span className="font-serif">Save Progress</span>
                    </button>
                </div>
            </div>
        </header>
    );
};
