import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../../types/movie';
import { getImageUrl } from '../../services/tmdbService';
import { Star, Plus, Check } from 'lucide-react';
import { useMovieContext } from '../../context/MovieContext';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, className = '' }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useMovieContext();
  const inWatchlist = isInWatchlist(movie.id);
  
  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  
  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div className={`group relative rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl ${className}`}>
      <Link to={`/movie/${movie.id}`} className="block h-full">
        <div className="aspect-[2/3] bg-gray-800 relative">
          {posterUrl ? (
            <img 
              src={posterUrl} 
              alt={movie.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
              No Image
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <h3 className="text-lg font-semibold line-clamp-2">{movie.title}</h3>
            
            <div className="flex items-center mt-2 text-sm text-gray-300">
              {releaseYear && <span className="mr-3">{releaseYear}</span>}
              {movie.vote_average > 0 && (
                <span className="flex items-center">
                  <Star size={14} className="text-yellow-400 mr-1" />
                  {movie.vote_average.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
      
      <button
        onClick={handleWatchlistToggle}
        className={`absolute top-3 right-3 p-2 rounded-full ${
          inWatchlist 
            ? 'bg-blue-600 text-white' 
            : 'bg-black/60 text-white hover:bg-blue-600 backdrop-blur-sm'
        } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
      >
        {inWatchlist ? <Check size={16} /> : <Plus size={16} />}
      </button>
    </div>
  );
};

export default MovieCard;