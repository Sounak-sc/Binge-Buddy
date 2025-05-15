import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../../types/movie';
import { getImageUrl } from '../../services/tmdbService';
import { Play, Plus } from 'lucide-react';
import { useMovieContext } from '../../context/MovieContext';

interface HeroBannerProps {
  movies: Movie[];
}

const HeroBanner: React.FC<HeroBannerProps> = ({ movies }) => {
  const { addToWatchlist, isInWatchlist } = useMovieContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentMovie = movies[currentIndex];
  const backdropUrl = getImageUrl(currentMovie.backdrop_path, 'original');
  const releaseYear = currentMovie.release_date ? new Date(currentMovie.release_date).getFullYear() : '';
  
  const handleAddToWatchlist = () => {
    addToWatchlist(currentMovie);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
  };

  // Setup auto-sliding
  useEffect(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 10000); // 10 seconds
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [currentIndex, movies.length]);

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        {backdropUrl && (
          <img 
            src={backdropUrl} 
            alt={currentMovie.title}
            className="w-full h-full object-cover object-center transition-opacity duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
      </div>
      
      {/* No navigation buttons or indicators as per requirement */}
      
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              {currentMovie.title}
            </h1>
            
            <div className="flex items-center mb-4 text-gray-300">
              <span className="mr-3">{releaseYear}</span>
              <span className="mr-3 text-yellow-400">★ {currentMovie.vote_average.toFixed(1)}</span>
            </div>
            
            <p className="text-lg text-gray-200 mb-6 line-clamp-3 md:line-clamp-none max-w-2xl">
              {currentMovie.overview}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to={`/movie/${currentMovie.id}`}
                className="bg-blue-600 hover:bg-blue-700 transition-colors py-3 px-8 rounded-full flex items-center justify-center gap-2 font-semibold"
              >
                <Play size={18} />
                Watch Trailer
              </Link>
              
              {!isInWatchlist(currentMovie.id) && (
                <button 
                  onClick={handleAddToWatchlist}
                  className="bg-gray-800 hover:bg-gray-700 transition-colors py-3 px-8 rounded-full flex items-center justify-center gap-2 font-semibold border border-gray-700"
                >
                  <Plus size={18} />
                  Add to Watchlist
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;