import { Movie, MovieDetails, SearchResults, Genre } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Helper function for API requests
const fetchFromTMDB = async (endpoint: string, params = {}) => {
  const queryParams = new URLSearchParams(params);
  
  const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status}`);
  }
  
  return await response.json();
};

// Get image URL with specified size
export const getImageUrl = (path: string | null, size = 'w500') => {
  if (!path) return undefined;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Fetch trending movies
export const fetchTrendingMovies = async (timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> => {
  const data = await fetchFromTMDB(`/trending/movie/${timeWindow}`);
  return data.results;
};

// Fetch popular movies
export const fetchPopularMovies = async (page = 1): Promise<SearchResults> => {
  return await fetchFromTMDB('/movie/popular', { page: page.toString() });
};

// Fetch top rated movies
export const fetchTopRatedMovies = async (page = 1): Promise<SearchResults> => {
  return await fetchFromTMDB('/movie/top_rated', { page: page.toString() });
};

// Fetch now playing movies
export const fetchNowPlayingMovies = async (page = 1): Promise<SearchResults> => {
  return await fetchFromTMDB('/movie/now_playing', { page: page.toString() });
};

// Fetch upcoming movies
export const fetchUpcomingMovies = async (page = 1): Promise<SearchResults> => {
  return await fetchFromTMDB('/movie/upcoming', { page: page.toString() });
};

// Fetch movie details by ID
export const fetchMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  return await fetchFromTMDB(`/movie/${movieId}`, {
    append_to_response: 'videos,credits,similar,recommendations,watch/providers'
  });
};

// Search movies
export const searchMovies = async (query: string, page = 1): Promise<SearchResults> => {
  return await fetchFromTMDB('/search/movie', { query, page: page.toString() });
};

// Fetch movies by genre with improved pagination and sorting
export const fetchMoviesByGenre = async (
  genreId: number, 
  page = 1, 
  sortBy = 'popularity.desc'
): Promise<SearchResults> => {
  return await fetchFromTMDB('/discover/movie', { 
    with_genres: genreId.toString(),
    page: page.toString(),
    sort_by: sortBy,
    'vote_count.gte': '100', // Only include movies with at least 100 votes
    'vote_average.gte': '5.0' // Only include movies with rating of 5 or higher
  });
};

// Fetch all genres
export const fetchGenres = async (): Promise<Genre[]> => {
  const data = await fetchFromTMDB('/genre/movie/list');
  return data.genres;
};

// Fetch movie trailer
export const fetchMovieTrailer = async (movieId: number): Promise<string | null> => {
  const data = await fetchFromTMDB(`/movie/${movieId}/videos`);
  
  // Find official trailers first
  const officialTrailers = data.results.filter(
    (video: any) => video.type === 'Trailer' && video.site === 'YouTube' && video.official
  );
  
  if (officialTrailers.length > 0) {
    return officialTrailers[0].key;
  }
  
  // If no official trailers, find any trailer
  const anyTrailers = data.results.filter(
    (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
  );
  
  if (anyTrailers.length > 0) {
    return anyTrailers[0].key;
  }
  
  return null;
};