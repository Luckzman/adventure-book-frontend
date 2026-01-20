import { Header } from '../components/home/Header';
import { AdventureLibrary } from '../components/home/AdventureLibrary';

export const HomePage = () => {

    return (
        <>
            <Header adventureCount={4} />
            <AdventureLibrary />
        </>
    );
};
