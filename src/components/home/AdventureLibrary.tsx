import { Filter } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { SearchInput } from '../common/SearchInput';
import { FilterButton } from '../common/FilterButton';
import { AdventureCardList } from './AdventureCardList';
import { Loader } from '../common/Loader';
import { fetchBooks } from '../../services/booksApi';
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
    const [adventures, setAdventures] = useState<Adventure[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch books on component mount
    useEffect(() => {
        const loadBooks = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const books = await fetchBooks();
                console.log('books', books);
                setAdventures(books);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load adventures');
                console.error('Error loading books:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadBooks();
    }, []);

    // Extract unique genres and difficulties from fetched books
    const genreFilters = useMemo(() => {
        const genres = new Set(adventures.map((adv) => adv.genre));
        return Array.from(genres).sort();
    }, [adventures]);

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
                    <div className=" flex items-center gap-2 md:pb-2">
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
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader size="lg" />
                    </div>
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
