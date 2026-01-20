import { Header } from '../components/home/Header';
import { AdventureLibrary } from '../components/home/AdventureLibrary';
import { useBooks } from '../contexts/BooksContext';

export const HomePage = () => {
    const { books, isLoading } = useBooks();
    const adventureCount = isLoading ? 0 : books.length;

    return (
        <>
            <Header adventureCount={adventureCount} />
            <AdventureLibrary />
        </>
    );
};
