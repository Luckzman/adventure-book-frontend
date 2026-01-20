/**
 * AdventureCardSkeleton Component
 * Loading skeleton for adventure cards
 * Provides better perceived performance than spinner
 */

export const AdventureCardSkeleton = () => {
    return (
        <article className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full border border-[#F9ECD5] animate-pulse">
            {/* Title and Author Skeleton */}
            <div className="mb-4">
                <div className="h-7 bg-stone-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-stone-200 rounded w-1/2"></div>
            </div>

            {/* Description Skeleton */}
            <div className="mb-4 grow space-y-2">
                <div className="h-4 bg-stone-200 rounded w-full"></div>
                <div className="h-4 bg-stone-200 rounded w-full"></div>
                <div className="h-4 bg-stone-200 rounded w-5/6"></div>
            </div>

            {/* Badges Skeleton */}
            <div className="flex flex-wrap gap-2 mb-4">
                <div className="h-6 bg-stone-200 rounded-full w-16"></div>
                <div className="h-6 bg-stone-200 rounded-full w-20"></div>
            </div>

            {/* Duration and Chapters Skeleton */}
            <div className="flex items-center gap-4 mb-4">
                <div className="h-4 bg-stone-200 rounded w-24"></div>
                <div className="h-4 bg-stone-200 rounded w-20"></div>
            </div>

            {/* Tags Skeleton */}
            <div className="flex flex-wrap gap-2 mb-4">
                <div className="h-6 bg-stone-200 rounded-full w-16"></div>
                <div className="h-6 bg-stone-200 rounded-full w-20"></div>
                <div className="h-6 bg-stone-200 rounded-full w-18"></div>
            </div>

            {/* Button Skeleton */}
            <div className="h-12 bg-stone-200 rounded-lg mt-auto"></div>
        </article>
    );
};
