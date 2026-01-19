import { Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import { SearchInput } from '../common/SearchInput';
import { FilterButton } from '../common/FilterButton';
import { AdventureCardList } from './AdventureCardList';
import { mockAdventures } from './mockAdventures';
import { type Adventure } from './AdventureCard';

interface AdventureLibraryProps {
    onSearchChange?: (value: string) => void;
    onFilterChange?: (filters: string[]) => void;
    onBeginQuest?: (adventureId: string) => void;
}

export const AdventureLibrary = ({
    onSearchChange,
    onFilterChange,
    onBeginQuest,
}: AdventureLibraryProps) => {
    const [searchValue, setSearchValue] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    const genreFilters = ['Fantasy', 'Adventure', 'High Fantasy', 'Steampunk Mystery'];
    const difficultyFilters = ['Easy', 'Medium', 'Hard'];

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        onSearchChange?.(value);
    };

    const handleFilterToggle = (filter: string) => {
        const newFilters = activeFilters.includes(filter)
            ? activeFilters.filter((f) => f !== filter)
            : [...activeFilters, filter];
        setActiveFilters(newFilters);
        onFilterChange?.(newFilters);
    };

    // Filter adventures based on search and active filters
    const filteredAdventures = useMemo(() => {
        let filtered: Adventure[] = [...mockAdventures];

        // Apply search filter
        if (searchValue.trim()) {
            const searchLower = searchValue.toLowerCase();
            filtered = filtered.filter(
                (adventure) =>
                    adventure.title.toLowerCase().includes(searchLower) ||
                    adventure.author.toLowerCase().includes(searchLower) ||
                    adventure.description.toLowerCase().includes(searchLower) ||
                    adventure.tags.some((tag) => tag.toLowerCase().includes(searchLower))
            );
        }

        // Apply active filters
        if (activeFilters.length > 0) {
            filtered = filtered.filter((adventure) => {
                return (
                    activeFilters.includes(adventure.genre) ||
                    activeFilters.includes(adventure.difficulty)
                );
            });
        }

        return filtered;
    }, [searchValue, activeFilters]);

    return (
        <main className="w-full bg-stone-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Title Section */}
                <div className="mb-8 flex items-center justify-center gap-3">
                    {/* <BookStackIcon className="h-6 w-6" /> */}
                    <h2 className="text-3xl font-bold text-[#433025] sm:text-4xl md:text-5xl">
                        <span className="font-serif">The Adventure Library</span>
                    </h2>
                </div>

                {/* Subtitle */}
                <p className="mx-auto mb-8 max-w-2xl text-center text-base text-stone-600 sm:text-lg">
                    Choose your next adventure from our collection of interactive tales. Each book
                    offers unique paths and multiple endings based on your choices.
                </p>

                {/* Search Bar */}
                <div className="mx-auto mb-8 max-w-2xl">
                    <SearchInput
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder="Search adventures..."
                        aria-label="Search adventures"
                    />
                </div>

                {/* Filters Section */}
                <div className="mx-auto flex items-center justify-center max-w-4xl gap-2">
                    <div className=" flex items-center gap-2">
                        <Filter className="h-4 w-4 text-stone-600" aria-hidden="true" />
                        <span className="text-sm font-medium text-stone-700">Filters:</span>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-2">
                        {genreFilters.map((filter) => (
                            <FilterButton
                                key={filter}
                                label={filter}
                                isActive={activeFilters.includes(filter)}
                                onClick={() => handleFilterToggle(filter)}
                                aria-label={`Filter by ${filter}`}
                            />
                        ))}
                        {difficultyFilters.map((filter) => (
                            <FilterButton
                                key={filter}
                                label={filter}
                                isActive={activeFilters.includes(filter)}
                                onClick={() => handleFilterToggle(filter)}
                                aria-label={`Filter by ${filter}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Adventure Cards */}
                <AdventureCardList
                    adventures={filteredAdventures}
                    onBeginQuest={onBeginQuest}
                />
            </div>
        </main>
    );
};
