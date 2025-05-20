'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TrendingUp, Film, Smile, Video, Star, Search } from "lucide-react";
import { useMoviesData } from "@/hooks/useMoviesData";
import { useGuestSession } from "@/providers/GuestSessionContext";
import MovieCarousel from "@/components/MovieCarousel/MovieCarousel";
import UpcomingMoviesSection from "@/components/UpcomingMoviesSection/UpcomingMoviesSection";
import { searchMovies } from '@/services/api';

// Configuración de géneros para mostrar dinámicamente
const GENRE_DISPLAY = [
  { key: "action", title: "Action Movies", icon: <Film className="text-red-500" size={24} /> },
  { key: "comedy", title: "Comedy Movies", icon: <Smile className="text-yellow-500" size={24} /> },
  { key: "drama", title: "Drama Movies", icon: <Video className="text-blue-500" size={24} /> },
  { key: "scifi", title: "Sci-Fi Movies", icon: <Star className="text-indigo-500" size={24} /> },
];

const Home: React.FC = () => {
  const {
    trendingMovies,
    upcomingMovies,
    genreMovies,
    loading,
    error,
    trendingTimeWindow,
    setTrendingTimeWindow,
  } = useMoviesData();

  const { guestSessionId } = useGuestSession();
  const router = useRouter();

  // Search state
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await searchMovies(query, 1);
        setSearchResults(res.data.results || []);
      } catch (err) {
        setSearchResults([]);
        console.error('Search error:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);


  const handleSurprise = () => {
    
    const allMovies = [
      ...trendingMovies,
      ...upcomingMovies,
      ...Object.values(genreMovies).flat()
    ];
    if (allMovies.length === 0) return;
    const random = allMovies[Math.floor(Math.random() * allMovies.length)];
    router.push(`/movie/${random.id}`);
  };

  const handleSelectSuggestion = (id: number) => {
    setQuery("");
    setSearchResults([]);
    router.push(`/movie/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
        <strong className="font-bold">Error: </strong>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Favorites, Surprise & Search */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            {guestSessionId && (
              <Link href="/my-favorites" className="inline-flex items-center text-yellow-600 hover:text-yellow-800 font-semibold">
                <Star className="mr-1" size={20} /> My Favorites
              </Link>
            )}
            <button onClick={handleSurprise} className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded">
              Surprise Me
            </button>
          </div>
          <div className="relative w-full sm:w-1/3">
            <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
              <span className="px-3 text-gray-500"><Search size={20} /></span>
              <input
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="py-2 px-3 flex-grow outline-none"
              />
            </div>
            {query && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded shadow mt-1 z-10 max-h-60 overflow-auto">
                {searchLoading ? (
                  <li className="px-4 py-2 text-gray-500">Loading...</li>
                ) : searchResults.length > 0 ? (
                  searchResults.slice(0, 5).map((movie) => (
                    <li
                      key={movie.id}
                      onClick={() => handleSelectSuggestion(movie.id)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {movie.title}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">No results found</li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Content */}
        {query ? (
          searchLoading ? (
            <div className="text-center py-20">Searching…</div>
          ) : (
            <MovieCarousel title={`Search results for "${query}"`} movies={searchResults} icon={<Search className="text-green-500" size={24} />} />
          )
        ) : (
          <>
            <MovieCarousel
              title="Trending"
              movies={trendingMovies}
              icon={<TrendingUp className="text-red-500" size={24} />}
              filterType="trending"
              onFilterChange={(f) => setTrendingTimeWindow(f as 'day' | 'week')}
              currentFilter={trendingTimeWindow}
            />

            {GENRE_DISPLAY.map(({ key, title, icon }) => (
              <MovieCarousel key={key} title={title} movies={genreMovies[key] || []} icon={icon} />
            ))}

            <UpcomingMoviesSection movies={upcomingMovies} />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;