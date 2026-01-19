import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GameHeader } from '../components/game/GameHeader';
import { SectionView } from '../components/game/SectionView';
// import { ChoicesList } from '../components/game/ChoicesList';
import { mockGameData } from '../components/game/mockGameData';
import { fetchBookById } from '../services/booksApi';

export const GamePage = () => {
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();
    const [gameTitle, setGameTitle] = useState('Adventure');

    // Fetch book title from API
    useEffect(() => {
        const loadBook = async () => {
            if (gameId) {
                const book = await fetchBookById(gameId);
                if (book) {
                    setGameTitle(book.title);
                }
            }
        };
        loadBook();
    }, [gameId]);

    const handleBack = () => {
        navigate('/');
    };

    const handleSave = () => {
        // TODO: Implement save functionality
        console.log('Saving game progress for:', gameId);
    };



    return (
        <div className="min-h-screen bg-stone-50">
            <GameHeader gameTitle={gameTitle} onBack={handleBack} onSave={handleSave} />
            <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-0 py-8 sm:py-12">
                <SectionView title={mockGameData.title} content={mockGameData.content} />
            </main>
        </div>
    );
};
