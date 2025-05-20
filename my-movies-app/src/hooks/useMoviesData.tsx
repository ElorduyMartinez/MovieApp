import { useState, useEffect } from 'react';
import api from '@/services/api';
import { getUpcomingMovies } from '@/services/movies/getUpcomingMovies';
import { IMovieDetail } from '@/types/movie';

export const useMoviesData = () => {
  const [trendingMovies, setTrendingMovies] = useState<IMovieDetail[]>([]);
  const [discoverActionMovies, setDiscoverActionMovies] = useState<IMovieDetail[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<IMovieDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trendingTimeWindow, setTrendingTimeWindow] = useState<'day' | 'week'>('day');

  const fetchMovies = async () => {
    try {
      setLoading(true);
      
      // Endpoint 1: Trending movies (with time window parameter)
      const trendingResponse = await api.get(`/trending/movie/${trendingTimeWindow}`, {
        params: {
          language: "en-US",
          page: 1
        }
      });
      
      // Endpoint 2: Discover - Action movies with high votes
      const discoverResponse = await api.get('/discover/movie', {
        params: {
          language: "en-US",
          with_genres: 28, // Action genre ID
          sort_by: "vote_count.desc",
          page: 1
        }
      });
      
      // Endpoint 3: Próximos estrenos (upcoming) - usando el servicio específico
      const upcomingResponse = await getUpcomingMovies(1);
      
      setTrendingMovies(trendingResponse.data.results.slice(0, 8));
      setDiscoverActionMovies(discoverResponse.data.results.slice(0, 8));
      setUpcomingMovies(upcomingResponse.results.slice(0, 8));
      
      setError(null);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError("Could not load movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
    
    // Actualizar automáticamente los próximos estrenos cada día
    const intervalId = setInterval(() => {
      fetchMovies();
    }, 24 * 60 * 60 * 1000); // 24 horas
    
    return () => clearInterval(intervalId);
  }, [trendingTimeWindow]);

  return {
    trendingMovies,
    discoverActionMovies,
    upcomingMovies,
    loading,
    error,
    trendingTimeWindow,
    setTrendingTimeWindow
  };
};