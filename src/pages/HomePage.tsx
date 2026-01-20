import { Header } from '../components/home/Header';
import { AdventureLibrary } from '../components/home/AdventureLibrary';
import { useBooks } from '../hooks/useBooks';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

export const HomePage = () => {
    const { books, isLoading } = useBooks();
    const adventureCount = isLoading ? 0 : books.length;

    return (
        <ErrorBoundary>
            <Header adventureCount={adventureCount} />
            <ErrorBoundary>
                <AdventureLibrary />
            </ErrorBoundary>
        </ErrorBoundary>
    );
};
