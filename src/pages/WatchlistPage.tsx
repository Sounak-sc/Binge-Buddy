import React from 'react';
import { Link } from 'react-router-dom';
import { useMovieContext } from '../context/MovieContext';
import MovieCard from '../components/movie/MovieCard';
import { Bookmark } from 'lucide-react';

const WatchlistPage: React.FC = () => {
  const { watchlist } = useMovieContext();
  
  React.useEffect(() => {
    document.title = 'My Watchlist | BingeBuddy';
    
    return () => {
      document.title = 'BingeBuddy';
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-32">
      <h1 className="text-3xl font-bold mb-2">My Watchlist</h1>
      <p className="text-gray-400 mb-8">
        Keep track of movies you want to watch later
      </p>
      
      {watchlist.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-lg">
          <Bookmark size={48} className="mx-auto text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your watchlist is empty</h2>
          <p className="text-gray-400 mb-6">
            Start adding movies to your watchlist to keep track of what you want to watch later.
          </p>
          <Link 
            to="/"
            className="bg-blue-600 hover:bg-blue-700 transition-colors py-3 px-8 rounded-full font-semibold inline-block"
          >
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {watchlist.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;