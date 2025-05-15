import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../services/tmdbService';
import { Movie } from '../types/movie';
import MovieCard from '../components/movie/MovieCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Search } from 'lucide-react';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!query) return;
    
    document.title = `Search: ${query} | BingeBuddy`;

    const performSearch = async (page: number) => {
      try {
        setIsLoading(true);
        const data = await searchMovies(query, page);
        
        if (page === 1) {
          setMovies(data.results);
        } else {
          setMovies(prev => [...prev, ...data.results]);
        }
        
        setTotalResults(data.total_results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error('Error searching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch(currentPage);

    return () => {
      document.title = 'BingeBuddy';
    };
  }, [query, currentPage]);

  const loadMoreResults = () => {
    if (currentPage < totalPages && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold mb-4">Search for Movies</h1>
        <p>Enter a movie title in the search bar above to find movies.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-400">
          Found {totalResults} results
        </p>
      </div>
      
      {isLoading && currentPage === 1 ? (
        <LoadingSpinner fullScreen={false} />
      ) : movies.length === 0 ? (
        <div className="text-center py-12">
          <Search size={48} className="mx-auto text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Results Found</h2>
          <p className="text-gray-400">
            We couldn't find any movies matching "{query}". Try different keywords.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          
          {currentPage < totalPages && (
            <div className="mt-10 text-center">
              <button
                onClick={loadMoreResults}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 transition-colors py-3 px-8 rounded-full font-semibold disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Load More Results'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResultsPage;