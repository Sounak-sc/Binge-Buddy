import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Movie, MovieDetails, Genre } from '../types/movie';
import { fetchGenres, fetchMoviesByGenre } from '../services/tmdbService';

interface MovieContextType {
  watchlist: Movie[];
  genres: Genre[];
  movies: Movie[];
  loading: boolean;
  activeGenre: number | null;
  userProfile: UserProfile;
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
  setActiveGenre: (genreId: number | null) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  preferences: {
    darkMode: boolean;
    notifications: boolean;
  };
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
};

interface MovieProviderProps {
  children: ReactNode;
}

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
  const { user } = useUser();
  const userId = user?.id;
  
  const [watchlist, setWatchlist] = useState<Movie[]>(() => {
    if (!userId) {
      const storedWatchlist = localStorage.getItem('watchlist');
      return storedWatchlist ? JSON.parse(storedWatchlist) : [];
    }
    // Try Clerk metadata first, fallback to localStorage if not available
    return user?.unsafeMetadata?.watchlist || 
           JSON.parse(localStorage.getItem(`watchlist_${userId}`) || '[]');
  });
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (!userId) return {
      name: 'Guest User',
      email: '',
      avatar: '',
      joinDate: new Date().toISOString(),
      preferences: {
        darkMode: true,
        notifications: true,
      }
    };
    
    const saved = localStorage.getItem(`userProfile_${userId}`);
    return saved ? JSON.parse(saved) : {
      name: user?.fullName || 'User',
      email: user?.primaryEmailAddress?.emailAddress || '',
      avatar: user?.imageUrl || '',
      joinDate: user?.createdAt || new Date().toISOString(),
      preferences: {
        darkMode: true,
        notifications: true,
      }
    };
  });
  
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeGenre, setActiveGenre] = useState<number | null>(null);

  useEffect(() => {
    if (!userId) return;
    
    const updateMetadata = async () => {
      try {
        // Only update if there are actual changes
        const currentMetadata = user?.unsafeMetadata?.watchlist || [];
        if (JSON.stringify(currentMetadata) !== JSON.stringify(watchlist)) {
          await user?.update({
            unsafeMetadata: {
              watchlist
            }
          });
        }
      } catch (error) {
        console.error('Failed to update user metadata:', error);
        // Fallback to localStorage if Clerk update fails
        localStorage.setItem(`watchlist_${userId}`, JSON.stringify(watchlist));
      }
    };
    
    // Debounce the metadata updates
    const timeoutId = setTimeout(updateMetadata, 500);
    return () => clearTimeout(timeoutId);
  }, [watchlist, userId, user]);

  useEffect(() => {
    if (!userId) return;
    localStorage.setItem(`userProfile_${userId}`, JSON.stringify(userProfile));
  }, [userProfile, userId]);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreData = await fetchGenres();
        setGenres(genreData);
      } catch (error) {
        console.error('Failed to load genres:', error);
      }
    };
    
    loadGenres();
  }, []);

  useEffect(() => {
    const loadMovies = async () => {
      if (!activeGenre) return;
      
      try {
        setLoading(true);
        const data = await fetchMoviesByGenre(activeGenre);
        setMovies(data.results);
      } catch (error) {
        console.error('Failed to load movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [activeGenre]);

  const addToWatchlist = (movie: Movie) => {
    setWatchlist(prev => {
      if (prev.some(m => m.id === movie.id)) return prev;
      const newWatchlist = [...prev, movie];
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      return newWatchlist;
    });
  };

  const removeFromWatchlist = (movieId: number) => {
    setWatchlist(prev => {
      const newWatchlist = prev.filter(movie => movie.id !== movieId);
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      return newWatchlist;
    });
  };

  const isInWatchlist = (movieId: number) => {
    return watchlist.some(movie => movie.id === movieId);
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
  };

  return (
    <MovieContext.Provider 
      value={{ 
        watchlist,
        genres,
        movies,
        loading,
        activeGenre,
        userProfile,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        setActiveGenre,
        updateUserProfile
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};