import { Clock, BookOpen, Star } from 'lucide-react';

export interface Adventure {
    id: string;
    title: string;
    author: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    genre: string;
    duration: string;
    chapters: number;
    tags: string[];
}

interface AdventureCardProps {
    adventure: Adventure;
    onBeginQuest?: (adventureId: string) => void;
}

const getDifficultyColor = (difficulty: Adventure['difficulty']) => {
    console.log('difficulty', difficulty);
    switch (difficulty) {
        case 'Easy':
            return 'bg-[#DDFCE7] border border-[#87EDAE] text-[#196337]';
        case 'Medium':
            return 'bg-[#FFF2C9] border border-[#FFD15A] text-[#933F16]';
        case 'Hard':
            return 'bg-[#FFE1E1] border border-[#FDA4A5] text-[#A22C2F]';
        default:
            return 'bg-stone-200 border border-stone-400 text-[#433025]';
    }
};

export const AdventureCard = ({ adventure, onBeginQuest }: AdventureCardProps) => {
    console.log('adventure', adventure);
    const handleBeginQuest = () => {
        onBeginQuest?.(adventure.id);
    };

    return (
        <article className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full transition-shadow hover:shadow-lg border border-[#F9ECD5]">
            {/* Title and Author */}
            <div className="mb-4">
                <h3 className="text-2xl font-bold text-[#433025] mb-1">{adventure.title}</h3>
                <p className="text-sm text-[#433025]">by {adventure.author}</p>
            </div>

            {/* Description */}
            <p className="text-[#433025] mb-4 flex-grow leading-relaxed">{adventure.description}</p>

            {/* Badges Row */}
            <div className="flex flex-wrap gap-2 mb-4">
                {/* Difficulty Badge */}
                <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${getDifficultyColor(adventure.difficulty)}`}
                >
                    {adventure.difficulty}
                </span>

                {/* Genre Badge */}
                <span className="rounded-full px-3 py-1 text-xs font-bold bg-[#F3EBE2] border border-[#F3DFB7] text-[#433025]">
                    {adventure.genre}
                </span>
            </div>

            {/* Duration and Chapters */}
            <div className="flex items-center gap-4 mb-4 text-[#433025] text-sm">
                <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{adventure.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    <span>{adventure.chapters} chapters</span>
                </div>
            </div>

            {/* Tags */}
            {adventure.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {adventure.tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full px-3 py-1 text-xs font-bold bg-[#E4DFDC] text-[#433025]"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Begin Quest Button */}
            <button
                onClick={handleBeginQuest}
                className="w-full bg-gradient-to-r from-[#C18033] to-[#EFBF4E] text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:from-[#EFBF4E] hover:to-[#C18033] transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 mt-auto"
            >
                <Star className="h-5 w-5" />
                <span className="text-white font-bold">Begin Quest</span>
            </button>
        </article>
    );
};
