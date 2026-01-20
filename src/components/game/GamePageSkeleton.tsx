/**
 * GamePageSkeleton Component
 * Loading skeleton for game page content
 * Mimics the structure of SectionView with title, content, and choices
 */

export const GamePageSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-[#F9ECD5] animate-pulse">
            {/* Section Title Skeleton */}
            <div className="mb-6">
                <div className="h-10 bg-stone-200 rounded w-3/4 mx-auto"></div>
            </div>

            {/* Content Paragraphs Skeleton */}
            <div className="space-y-4 mb-8 pb-8 border-b border-[#F9ECD5]">
                <div className="h-4 bg-stone-200 rounded w-full"></div>
                <div className="h-4 bg-stone-200 rounded w-full"></div>
                <div className="h-4 bg-stone-200 rounded w-5/6"></div>
                <div className="h-4 bg-stone-200 rounded w-full"></div>
                <div className="h-4 bg-stone-200 rounded w-4/5"></div>
            </div>

            {/* Choices Section Skeleton */}
            <div className="mt-8">
                <div className="h-6 bg-stone-200 rounded w-48 mb-4"></div>
                <div className="space-y-4">
                    {/* Choice 1 */}
                    <div className="bg-white rounded-lg shadow-md p-5 border border-[#F9ECD5]">
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 w-9 h-6 bg-stone-300 rounded-full"></div>
                            <div className="grow space-y-2">
                                <div className="h-5 bg-stone-200 rounded w-3/4"></div>
                                <div className="h-4 bg-stone-200 rounded w-full"></div>
                                <div className="h-4 bg-stone-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    </div>

                    {/* Choice 2 */}
                    <div className="bg-white rounded-lg shadow-md p-5 border border-[#F9ECD5]">
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 w-9 h-6 bg-stone-300 rounded-full"></div>
                            <div className="grow space-y-2">
                                <div className="h-5 bg-stone-200 rounded w-4/5"></div>
                                <div className="h-4 bg-stone-200 rounded w-full"></div>
                                <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>

                    {/* Choice 3 */}
                    <div className="bg-white rounded-lg shadow-md p-5 border border-[#F9ECD5]">
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 w-9 h-6 bg-stone-300 rounded-full"></div>
                            <div className="grow space-y-2">
                                <div className="h-5 bg-stone-200 rounded w-2/3"></div>
                                <div className="h-4 bg-stone-200 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
