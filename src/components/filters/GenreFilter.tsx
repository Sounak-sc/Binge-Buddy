import React from 'react';
import { Genre } from '../../types/movie';

interface GenreFilterProps {
  genres: Genre[];
  activeGenre: number | null;
  onGenreChange: (genreId: number | null) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ genres, activeGenre, onGenreChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Filter by Genre</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onGenreChange(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeGenre === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All
        </button>
        
        {genres.slice(0, 12).map(genre => (
          <button
            key={genre.id}
            onClick={() => onGenreChange(genre.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeGenre === genre.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;