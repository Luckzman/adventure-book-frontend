import { useNavigate } from 'react-router-dom';
import { Header } from '../components/home/Header';
import { AdventureLibrary } from '../components/home/AdventureLibrary';

export const HomePage = () => {
    const navigate = useNavigate();

    const handleBeginQuest = (adventureId: string) => {
        navigate(`/game/${adventureId}`);
    };

    return (
        <>
            <Header adventureCount={4} />
            <AdventureLibrary onBeginQuest={handleBeginQuest} />
        </>
    );
};
