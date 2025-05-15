import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMovieContext } from '../context/MovieContext';
import MovieCard from '../components/movie/MovieCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Filter, SlidersHorizontal } from 'lucide-react';

const ExplorePage = () => {
  const { movies, loading, genres, activeGenre, setActiveGenre } = useMovieContext();
  const [showFilters, setShowFilters] = useState(false);

  const handleGenreClick = (genreId: number | null) => {
    setActiveGenre(genreId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-24 md:py-32"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Explore Movies</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition-colors"
        >
          <SlidersHorizontal size={18} />
          Filters
        </motion.button>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-8"
        >
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} />
              <h2 className="text-lg font-semibold">Genre Filter</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleGenreClick(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeGenre === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All Genres
              </button>
              {genres.map(genre => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreClick(genre.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeGenre === genre.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner fullScreen={false} />
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-xl">
          <Filter size={48} className="mx-auto text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Movies Found</h2>
          <p className="text-gray-400">
            Try selecting a different genre or removing filters
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
        >
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExplorePage;