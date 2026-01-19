import { useParams, useNavigate } from 'react-router-dom';
import { GameHeader } from '../components/game/GameHeader';
import { SectionView } from '../components/game/SectionView';
// import { ChoicesList } from '../components/game/ChoicesList';
import { mockGameData } from '../components/game/mockGameData';
import { mockAdventures } from '../components/home/mockAdventures';

export const GamePage = () => {
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();

    // Find the adventure by ID to get the title
    const adventure = mockAdventures.find((adv) => adv.id === gameId);
    const gameTitle = adventure?.title || 'Adventure';

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
