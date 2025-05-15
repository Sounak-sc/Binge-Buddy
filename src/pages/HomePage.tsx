import React, { useState, useEffect } from 'react';
import { Movie } from '../types/movie';
import { fetchTrendingMovies, fetchPopularMovies, fetchTopRatedMovies, fetchNowPlayingMovies } from '../services/tmdbService';
import MovieSlider from '../components/movie/MovieSlider';
import HeroBanner from '../components/home/HeroBanner';
import GenreFilter from '../components/filters/GenreFilter';
import { useMovieContext } from '../context/MovieContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage: React.FC = () => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [newlyAdded, setNewlyAdded] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const { genres } = useMovieContext();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const [trendingData, popularData, topRatedData, newlyAddedData] = await Promise.all([
          fetchTrendingMovies(),
          fetchPopularMovies(),
          fetchTopRatedMovies(),
          fetchNowPlayingMovies()
        ]);
        
        setTrending(trendingData);
        setPopular(popularData.results);
        setTopRated(topRatedData.results);
        setNewlyAdded(newlyAddedData.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Filter movies by selected genre
  const filterMoviesByGenre = (movies: Movie[]) => {
    if (!activeGenre) return movies;
    return movies.filter(movie => movie.genre_ids.includes(activeGenre));
  };

  const handleGenreChange = (genreId: number | null) => {
    setActiveGenre(genreId);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pb-10">
      {trending.length > 0 && (
        <HeroBanner movies={trending.slice(0, 10)} />
      )}
      
      <div className="container mx-auto px-4 mt-8">
        <div className="mb-8">
          <GenreFilter 
            genres={genres} 
            activeGenre={activeGenre} 
            onGenreChange={handleGenreChange} 
          />
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Trending Now</h2>
          <MovieSlider movies={filterMoviesByGenre(trending)} />
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Newly Added</h2>
          <MovieSlider movies={filterMoviesByGenre(newlyAdded)} />
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Popular Movies</h2>
          <MovieSlider movies={filterMoviesByGenre(popular)} />
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Top Rated</h2>
          <MovieSlider movies={filterMoviesByGenre(topRated)} />
        </section>
      </div>
    </div>
  );
};

export default HomePage;