import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieDetails, getImageUrl } from '../services/tmdbService';
import { MovieDetails } from '../types/movie';
import { useMovieContext } from '../context/MovieContext';
import MovieSlider from '../components/movie/MovieSlider';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Play, Plus, Check, Clock, Star, Calendar, Users, X } from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useMovieContext();
  
  const movieId = parseInt(id || '0');
  const inWatchlist = isInWatchlist(movieId);

  useEffect(() => {
    // Load YouTube IFrame API
    const loadYouTubeAPI = () => {
      return new Promise<void>((resolve) => {
        if (window.YT) {
          resolve();
          return;
        }
        
        window.onYouTubeIframeAPIReady = () => {
          resolve();
        };
        
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      });
    };
    
    const setupTrailer = async () => {
      if (!movie?.videos?.results?.length) return;
      
      const trailer = movie.videos.results.find(
        video => video.site === 'YouTube' && video.type === 'Trailer' && video.official
      ) || movie.videos.results.find(
        video => video.site === 'YouTube' && video.type === 'Trailer'
      ) || movie.videos.results[0];
      
      if (trailer?.key) {
        await loadYouTubeAPI();
        initializePlayer(trailer.key);
      }
    };
    
    setupTrailer();
    
    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [movie?.videos?.results]);

  const initializePlayer = (videoId: string) => {
    const newPlayer = new window.YT.Player('background-trailer', {
      videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        mute: 1,
        loop: 1,
        playlist: videoId,
        showinfo: 0,
        rel: 0,
        modestbranding: 1
      },
      events: {
        onReady: (event: any) => {
          event.target.playVideo();
          event.target.mute();
        }
      }
    });
    setPlayer(newPlayer);
  };

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await fetchMovieDetails(parseInt(id));
        setMovie(data);
        
        document.title = `${data.title} | BingeBuddy`;
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();

    return () => {
      document.title = 'BingeBuddy';
    };
  }, [id]);

  const handleWatchlistToggle = () => {
    if (!movie) return;
    
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const handleTrailerClick = () => {
    setShowTrailer(true);
  };

  const closeTrailer = () => {
    setShowTrailer(false);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
        <p>Sorry, we couldn't find the movie you're looking for.</p>
      </div>
    );
  }

  const trailer = movie.videos?.results?.find(
    video => video.site === 'YouTube' && video.type === 'Trailer' && video.official
  ) || movie.videos?.results?.find(
    video => video.site === 'YouTube' && video.type === 'Trailer'
  );

  const backdropUrl = getImageUrl(movie.backdrop_path, 'original');
  const posterUrl = getImageUrl(movie.poster_path, 'w500');

  return (
    <div className="pb-16 md:relative md:z-10">
      {/* Semi-transparent background for desktop */}
      <div className="hidden md:block fixed inset-0 bg-gray-900/80 z-[5]" />
      {/* Hero Section */}
      <div className="relative pt-16 h-[70vh] md:h-screen">
        <div className="absolute inset-0 overflow-hidden">
          {trailer ? (
            <div id="background-trailer" className="w-full h-full md:h-[70vh] md:absolute md:top-0 md:left-0 md:z-0" />
          ) : (
            backdropUrl && (
              <img 
                src={backdropUrl} 
                alt={movie.title}
                className="w-full h-full object-cover object-top"
              />
            )
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-gray-900/40 to-gray-900" />
        </div>
        
        <div className="relative container mx-auto px-4 pt-12 md:pt-20 md:z-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Poster */}
            <div className="shrink-0 w-28 sm:w-40 md:w-64 mx-auto md:mx-0 mb-3 md:mb-0">
              {posterUrl ? (
                <img 
                  src={posterUrl} 
                  alt={movie.title}
                  className="w-full rounded-lg shadow-2xl"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            
            {/* Movie Info */}
            <div className="flex-grow mt-1 md:mt-0 text-center md:text-left">
              <h1 className="text-xl md:text-3xl lg:text-5xl font-bold mb-2">{movie.title}</h1>
              
              {movie.tagline && (
                <p className="text-xs md:text-base text-blue-400 italic mb-3 md:mb-4">{movie.tagline}</p>
              )}
              
              {/* Movie Meta */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 md:gap-x-6 gap-y-1 md:gap-y-2 mb-4 md:mb-6 text-gray-300 text-xs md:text-base">
                {movie.release_date && (
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1 md:hidden" />
                    <Calendar size={16} className="mr-1 hidden md:inline" />
                    {new Date(movie.release_date).getFullYear()}
                  </div>
                )}
                
                {movie.runtime > 0 && (
                  <div className="flex items-center">
                    <Clock size={12} className="mr-1 md:hidden" />
                    <Clock size={16} className="mr-1 hidden md:inline" />
                    {formatRuntime(movie.runtime)}
                  </div>
                )}
                
                {movie.vote_average > 0 && (
                  <div className="flex items-center">
                    <Star size={12} className="text-yellow-400 mr-1 md:hidden" />
                    <Star size={16} className="text-yellow-400 mr-1 hidden md:inline" />
                    {movie.vote_average.toFixed(1)} ({movie.vote_count.toLocaleString()} votes)
                  </div>
                )}
              </div>
              
              {/* Genres */}
              <div className="mb-4 md:mb-6">
                <div className="flex flex-wrap justify-center md:justify-start gap-1 md:gap-2">
                  {movie.genres.map(genre => (
                    <span 
                      key={genre.id}
                      className="px-2 py-0.5 md:px-3 md:py-1 bg-gray-800 rounded-full text-xs md:text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="text-xs md:text-base text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto md:mx-0">
                {movie.overview}
              </p>
              
              {/* Streaming Platforms */}
               <div className="mb-16 md:mb-20">  {/* Increased spacing */}
                  <h3 className="text-sm md:text-base font-semibold mb-3 md:mb-4">Where to Watch</h3>
                 
                 {movie["watch/providers"]?.results?.US ? (
                   <div>
                     {movie["watch/providers"].results.US?.flatrate && (
                       <div className="mb-3 md:mb-4">
                         <h4 className="text-xs md:text-sm text-gray-400 mb-1 md:mb-2">Stream</h4>
                         <div className="flex flex-wrap gap-2 md:gap-4">
                           {movie["watch/providers"].results.US.flatrate.map(provider => (
                             <a 
                               key={provider.provider_id} 
                               href={movie["watch/providers"]?.results?.US?.link || '#'}
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-blue-400 hover:text-blue-300 text-xs md:text-sm"
                             >
                               {provider.provider_name}
                             </a>
                           ))}
                         </div>
                       </div>
                     )}
                     
                     <div className="flex flex-row gap-8">  {/* Horizontal layout for Rent and Buy */}
                       {movie["watch/providers"].results.US?.rent && (
                         <div className="mb-3 md:mb-4">
                           <h4 className="text-xs md:text-sm text-gray-400 mb-1 md:mb-2">Rent</h4>
                           <div className="flex flex-wrap gap-2 md:gap-4">
                             {movie["watch/providers"].results.US.rent.map(provider => (
                               <a 
                                 key={provider.provider_id} 
                                 href={movie["watch/providers"]?.results?.US?.link || '#'}
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="text-blue-400 hover:text-blue-300 text-xs md:text-sm"
                               >
                                 {provider.provider_name}
                               </a>
                             ))}
                           </div>
                         </div>
                       )}
                       
                       {movie["watch/providers"].results.US?.buy && (
                         <div className="mb-3 md:mb-4">
                           <h4 className="text-xs md:text-sm text-gray-400 mb-1 md:mb-2">Buy</h4>
                           <div className="flex flex-wrap gap-2 md:gap-4">
                             {movie["watch/providers"].results.US.buy.map(provider => (
                               <a 
                                 key={provider.provider_id} 
                                 href={movie["watch/providers"]?.results?.US?.link || '#'}
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="text-blue-400 hover:text-blue-300 text-xs md:text-sm"
                               >
                                 {provider.provider_name}
                               </a>
                             ))}
                           </div>
                         </div>
                       )}
                     </div>
                     
                     <a 
                       href={movie["watch/providers"].results.US?.link} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-400 hover:text-blue-300 text-xs md:text-sm inline-flex items-center mt-2"
                     >
                       View all watching options
                     </a>
                   </div>
                 ) : (
                   <p className="text-gray-400 text-xs md:text-sm">No streaming information available for this movie.</p>
                 )}
               </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {trailer && (
                  <button 
                    onClick={handleTrailerClick}
                    className="bg-blue-600 hover:bg-blue-700 transition-colors py-2 px-4 md:py-3 md:px-6 rounded-full flex items-center justify-center gap-2 font-semibold"
                  >
                    <Play size={18} />
                    Watch Trailer
                  </button>
                )}
                
                <button 
                  onClick={handleWatchlistToggle}
                  className={`py-2 px-4 md:py-3 md:px-6 rounded-full flex items-center justify-center gap-2 font-semibold transition-colors ${
                    inWatchlist 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {inWatchlist ? (
                    <>
                      <Check size={18} />
                      In Watchlist
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Add to Watchlist
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Info */}
      <div className="container mx-auto px-4 mt-80 md:mt-72 relative md:z-10">
        {/* Trailer */}
        {showTrailer && trailer && (
          <div className="mb-6 w-full mx-auto">
            <div className="relative w-full aspect-video max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
              <iframe
                title={`${movie.title} trailer`}
                id="trailer-player"
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
              <button
                onClick={closeTrailer}
                className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black/90 transition-colors"
                aria-label="Close trailer"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
        
        {/* Cast */}
        {movie.credits?.cast?.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Cast</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
              {movie.credits.cast.slice(0, 6).map(person => (
                <div key={person.id} className="text-center mt-2 md:mt-0">
                  <div className="aspect-square w-14 h-14 md:w-full md:h-full rounded-full overflow-hidden bg-gray-800 mb-1 md:mb-2 mx-auto">
                    {person.profile_path ? (
                      <img 
                        src={getImageUrl(person.profile_path, 'w185')} 
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users size={18} className="text-gray-600" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-medium text-xs md:text-base truncate">{person.name}</h4>
                  <p className="text-xs md:text-sm text-gray-400 truncate">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Recommendations */}
        {movie.recommendations?.results?.length > 0 && (
          <section className="mb-12 md:mb-16">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Recommendations</h2>
            <MovieSlider movies={movie.recommendations.results} />
          </section>
        )}
        
        {/* Similar Movies */}
        {movie.similar?.results?.length > 0 && (
          <section className="mb-12 md:mb-16">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Similar Movies</h2>
            <MovieSlider movies={movie.similar.results} />
          </section>
        )}
      </div>
      
      {/* Trailer Modal removed - now shown in Similar Movies section */}
      
      {/* Footer removed as requested */}
    </div>
  );
};

export default MovieDetailsPage;