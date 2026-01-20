import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GameHeader } from '../components/game/GameHeader';
import { SectionView } from '../components/game/SectionView';
// import { ChoicesList } from '../components/game/ChoicesList';
import { Loader } from '../components/common/Loader';
import {
    fetchGameData,
    validateBookData,
    validateSectionForNavigation,
    type GameDataResponse,
    type GameSection,
} from '../services/booksApi';

export const GamePage = () => {
    const { gamePath } = useParams<{ gamePath: string }>();
    const navigate = useNavigate();
    const [gameData, setGameData] = useState<GameDataResponse | null>(null);
    const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch book title and game data from API
    useEffect(() => {
        const loadGameData = async () => {
            if (!gamePath) {
                setError('Invalid game path');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // Decode the path from URL
                const decodedPath = decodeURIComponent(gamePath);

                // Fetch game data
                const data = await fetchGameData(decodedPath);
                if (data) {
                    // Validate book data
                    const validation = validateBookData(data);
                    if (!validation.isValid) {
                        const errorMessage = validation.errors.length === 1
                            ? validation.errors[0]
                            : `Invalid book data:\n\n${validation.errors.map((err, idx) => `${idx + 1}. ${err}`).join('\n')}`;
                        setError(errorMessage);
                        setIsLoading(false);
                        return;
                    }

                    setGameData(data);
                    // Find and set the BEGIN section as the starting point
                    const beginSection = data.sections.find((section) => section.type === 'BEGIN');
                    if (beginSection) {
                        setCurrentSectionId(beginSection.id);
                    } else {
                        // This shouldn't happen if validation passed, but handle it anyway
                        setError('Game data is invalid: No BEGIN section found.');
                    }
                } else {
                    setError(`Game data not found for "${decodedPath}". The adventure may not be available or the server may be down.`);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while loading the game.';
                setError(errorMessage);
                console.error('Error loading game data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadGameData();
    }, [gamePath]);

    const handleBack = () => {
        setError(null);
        navigate('/');
    };

    const handleSave = () => {
        // TODO: Implement save functionality
        console.log('Saving game progress for:', gamePath);
    };

    const handleChoiceSelect = (gotoId: string) => {
        if (!gameData) return;

        // Find the selected option to check for consequences
        const currentSection = gameData.sections.find((s) => s.id === currentSectionId);
        const selectedOption = currentSection?.options?.find((opt) => opt.gotoId === gotoId);

        // Find the target section
        const nextSection = gameData.sections.find((s) => s.id === gotoId);

        // Validate the target section exists before navigating
        const validationError = validateSectionForNavigation(nextSection, gotoId);
        if (validationError) {
            // Section doesn't exist - show error and don't navigate
            setError(validationError);
            return;
        }

        // Clear any previous errors since we're successfully navigating
        setError(null);

        // TODO: Handle consequences (health loss, etc.)
        if (selectedOption?.consequence) {
            console.log('Consequence:', selectedOption.consequence);
            // TODO: Apply consequence (e.g., reduce health)
        }

        // Navigate to the next section (even if it has null options - we'll display the content)
        if (nextSection) {
            setCurrentSectionId(gotoId);
        }
    };

    // Get current section data
    const currentSection: GameSection | undefined = gameData?.sections.find(
        (section) => section.id === currentSectionId
    );

    // Convert options to choices format for ChoicesList
    const choices = currentSection?.options?.map((option, index) => ({
        id: option.gotoId,
        number: index + 1,
        text: option.description,
        description: option.consequence ? option.consequence.text : '',
        requirement: undefined,
    })) || [];

    return (
        <div className="min-h-screen bg-stone-50">
            <GameHeader gameTitle={gameData?.title || ''} onBack={handleBack} onSave={handleSave} />
            <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-0 py-8 sm:py-12">
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader size="lg" />
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-lg shadow-md p-8 border border-[#F9ECD5]">
                        <h2 className="text-2xl font-bold text-[#433025] mb-4 text-center">Error Loading Game</h2>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-800 font-semibold mb-2">Validation Errors:</p>
                            <pre className="text-sm text-red-700 whitespace-pre-wrap font-mono">{error}</pre>
                        </div>
                        <div className="text-center">
                            <button
                                onClick={handleBack}
                                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                            >
                                Back to Library
                            </button>
                        </div>
                    </div>
                ) : gameData && currentSection ? (
                    <>
                        {/* Show navigation errors as an alert banner, not blocking the game */}
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0">
                                        <svg
                                            className="h-5 w-5 text-red-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-red-800 font-semibold mb-1">Navigation Error</p>
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                    <button
                                        onClick={() => setError(null)}
                                        className="shrink-0 text-red-600 hover:text-red-800"
                                        aria-label="Dismiss error"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                        <SectionView
                            title={gameData.title || ''}
                            content={[currentSection.text]}
                            choices={choices}
                            onChoiceSelect={handleChoiceSelect}
                        />
                        {currentSection.type === 'END' && (
                            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                                <p className="text-lg font-semibold text-[#433025]">The End</p>
                                <p className="text-sm text-[#92827A] mt-2">Your adventure has concluded.</p>
                                <button
                                    onClick={handleBack}
                                    className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                                >
                                    Back to Library
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 border border-[#F9ECD5] text-center">
                        <h2 className="text-2xl font-bold text-[#433025] mb-4">No Game Data Available</h2>
                        <p className="text-stone-600 mb-6">Unable to load game content. Please try again later.</p>
                        <button
                            onClick={handleBack}
                            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                        >
                            Back to Library
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};
