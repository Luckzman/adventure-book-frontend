import { Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import { SearchInput } from '../common/SearchInput';
import { FilterButton } from '../common/FilterButton';
import { AdventureCardList } from './AdventureCardList';
import { AdventureCardListSkeleton } from './AdventureCardListSkeleton';
import { useBooks } from '../../hooks/useBooks';
import { type Adventure } from './AdventureCard';

interface AdventureLibraryProps {
    onSearchChange?: (value: string) => void;
    onFilterChange?: (filters: string[]) => void;
    onBeginQuest?: (adventurePath: string) => void;
}

export const AdventureLibrary = ({
    onSearchChange,
    onFilterChange,
}: AdventureLibraryProps) => {
    const [searchValue, setSearchValue] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    // Get books from context (fetched once at app level)
    const { books, isLoading, error } = useBooks();
    const adventures: Adventure[] = books;

    // Use predefined genre filters as shown in the design
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
        let filtered: Adventure[] = [...adventures];

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
    }, [searchValue, activeFilters, adventures]);

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
                <div className="mx-auto flex flex-col lg:flex-row lg:items-center justify-center max-w-4xl gap-2">
                    <div className="flex items-center gap-2 md:pb-2">
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

                    {/* Clear All Button */}
                    {activeFilters.length > 0 && (
                        <button
                            onClick={() => {
                                setActiveFilters([]);
                                onFilterChange?.([]);
                            }}
                            className="text-sm font-medium text-stone-900 hover:text-amber-700 transition-colors px-2 cursor-pointer"
                            aria-label="Clear all filters"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {/* Adventure Cards */}
                {isLoading ? (
                    <AdventureCardListSkeleton count={6} />
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-600 text-lg mb-2">Error loading adventures</p>
                        <p className="text-stone-600">{error}</p>
                    </div>
                ) : (
                    <AdventureCardList adventures={filteredAdventures} />
                )}
            </div>
        </main>
    );
};
