import { AdventureCard, type Adventure } from './AdventureCard';

interface AdventureCardListProps {
    adventures: Adventure[];
    onBeginQuest?: (adventureId: string) => void;
}

export const AdventureCardList = ({ adventures, onBeginQuest }: AdventureCardListProps) => {
    if (adventures.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-stone-600 text-lg">No adventures found. Try adjusting your search or filters.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {adventures.map((adventure) => (
                <AdventureCard
                    key={adventure.id}
                    adventure={adventure}
                    onBeginQuest={onBeginQuest}
                />
            ))}
        </div>
    );
};
