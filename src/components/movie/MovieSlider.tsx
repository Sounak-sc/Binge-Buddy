import React, { useRef } from 'react';
import { Movie } from '../../types/movie';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MovieSliderProps {
  movies: Movie[];
  title?: string;
}

const MovieSlider: React.FC<MovieSliderProps> = ({ movies, title }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;

    const scrollAmount = 400; // Adjust scroll amount as needed
    const currentScroll = sliderRef.current.scrollLeft;
    
    sliderRef.current.scrollTo({
      left: direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!movies || movies.length === 0) {
    return <div className="text-gray-400 py-10 text-center">No movies found</div>;
  }

  return (
    <div className="relative group">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      
      <div className="relative">
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto scrollbar-hide gap-4 pb-4 snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map(movie => (
            <div 
              key={movie.id} 
              className="flex-none w-[160px] md:w-[200px] snap-start"
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
        
        {/* Navigation Buttons */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-white cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/80"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-white cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/80"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default MovieSlider;