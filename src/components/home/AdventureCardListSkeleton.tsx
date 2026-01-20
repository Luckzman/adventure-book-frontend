/**
 * AdventureCardListSkeleton Component
 * Loading skeleton for adventure card list
 */

import { AdventureCardSkeleton } from './AdventureCardSkeleton';

interface AdventureCardListSkeletonProps {
    count?: number;
}

export const AdventureCardListSkeleton = ({ count = 6 }: AdventureCardListSkeletonProps) => {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, index) => (
                <AdventureCardSkeleton key={index} />
            ))}
        </div>
    );
};
