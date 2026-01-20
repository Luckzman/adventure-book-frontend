import { BookOpen, Sparkles } from 'lucide-react';

interface HeaderProps {
    adventureCount?: number;
}

export const Header = ({ adventureCount = 4 }: HeaderProps) => {
    return (
        <header
            className="relative w-full overflow-hidden bg-linear-to-br from-amber-950 via-amber-900 to-amber-950"
            role="banner"
        >
            {/* Background pattern overlay */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
                aria-hidden="true"
            />

            {/* Warm glow effect from left */}
            <div
                className="absolute left-0 top-0 h-full w-1/3 bg-linear-to-r from-amber-600/20 to-transparent blur-3xl"
                aria-hidden="true"
            />

            {/* Content container */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                <div className="flex flex-col items-center text-center">
                    {/* Main title with sparkles */}
                    <div className="mb-6 flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
                        <Sparkles className="h-6 w-6 text-yellow-400 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                        <h1 className="text-4xl font-bold tracking-tight text-yellow-400 sm:text-5xl md:text-6xl lg:text-7xl">
                            <span className="font-serif">Adventure Awaits</span>
                        </h1>
                        <Sparkles className="h-6 w-6 text-yellow-400 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                    </div>

                    {/* Description paragraph */}
                    <p className="mx-auto max-w-3xl text-base leading-relaxed text-white sm:text-lg md:text-xl lg:text-xl">
                        Embark on epic quests where every choice shapes your destiny. Explore
                        mystical realms, solve ancient mysteries, and become the hero of your
                        own story.
                    </p>

                    {/* Adventure count with icons */}
                    <div className="mt-8 flex items-center justify-center gap-2 sm:gap-3">
                        <BookOpen className="h-5 w-5 text-yellow-400 sm:h-6 sm:w-6" />
                        <span className="text-xs font-medium text-white sm:text-sm md:text-base">
                            {adventureCount === 0
                                ? 'Loading Adventures...'
                                : `${adventureCount} Epic ${adventureCount === 1 ? 'Adventure' : 'Adventures'} Available`}
                        </span>
                        <Sparkles className="h-5 w-5 text-yellow-400 sm:h-6 sm:w-6" />
                    </div>
                </div>
            </div>
        </header>
    );
};
