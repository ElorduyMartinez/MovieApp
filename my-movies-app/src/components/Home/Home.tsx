'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TrendingUp, Film, Smile, Video, Star, Search, ChevronUp } from "lucide-react";
import { useMoviesData } from "@/hooks/useMoviesData";
import { useGuestSession } from "@/providers/GuestSessionContext";
import MovieCarousel from "@/components/MovieCarousel/MovieCarousel";
import UpcomingMoviesSection from "@/components/UpcomingMoviesSection/UpcomingMoviesSection";
import { searchMovies, getMovieRecommendations } from '@/services/api';

// Géneros configurados dinámicamente
const GENRE_DISPLAY = [
  { key: "action", title: "Action", icon: <Film size={20} className="text-red-500" /> },
  { key: "comedy", title: "Comedy", icon: <Smile size={20} className="text-yellow-500" /> },
  { key: "drama", title: "Drama", icon: <Video size={20} className="text-blue-500" /> },
  { key: "scifi", title: "Sci-Fi", icon: <Star size={20} className="text-indigo-500" /> },
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

  // Search
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (!query) return setSearchResults([]);
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await searchMovies(query, 1);
        setSearchResults(res.data.results || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Surprise me with recommendations
  const handleSurprise = async () => {
    const all = [
      ...trendingMovies,
      ...upcomingMovies,
      ...Object.values(genreMovies).flat(),
      ...searchResults
    ];
    if (!all.length) return;
    const base = all[Math.floor(Math.random() * all.length)];
    try {
      const recs = (await getMovieRecommendations(base.id)).data.results;
      if (recs.length) {
        const rec = recs[Math.floor(Math.random() * recs.length)];
        return router.push(`/movie/${rec.id}`);
      }
    } catch {}
    router.push(`/movie/${base.id}`);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );

  if (error) return (
    <div className="mx-4 mt-8 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
      <strong>Error:</strong> {error}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-gray-100 to-white min-h-screen">
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-gray-800">Movie Explorer</h1>
          <div className="flex items-center space-x-4">
            {guestSessionId && (
              <Link href="/my-favorites" className="flex items-center text-yellow-600 hover:text-yellow-800">
                <Star className="mr-1" /> Favorites
              </Link>
            )}
            <button
              onClick={handleSurprise}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center space-x-1"
            >
              <ChevronUp size={18} />
              <span>Surprise Me</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 space-y-12">
        {/* Search */}
        <div className="relative max-w-lg mx-auto">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for movies..."
            className="w-full border rounded-full py-2 pl-10 pr-4 outline-none shadow-sm focus:ring-2 focus:ring-blue-300"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          {query && (
            <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-auto shadow-lg">
              {searchLoading && <li className="p-2 text-gray-500">Loading...</li>}
              {!searchLoading && (!searchResults.length
                ? <li className="p-2 text-gray-500">No results found.</li>
                : searchResults.slice(0,5).map(m => (
                    <li
                      key={m.id}
                      onClick={() => { setQuery(''); setSearchResults([]); router.push(`/movie/${m.id}`)}}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >{m.title}</li>
                  )))}
            </ul>
          )}
        </div>

        {/* Trending */}
        <MovieCarousel
          title="Trending Now"
          movies={trendingMovies}
          icon={<TrendingUp className="text-red-500" size={24} />}
          filterType="trending"
          onFilterChange={f => setTrendingTimeWindow(f as 'day'|'week')}
          currentFilter={trendingTimeWindow}
        />

        {/* Genres */}
        {GENRE_DISPLAY.map(({ key, title, icon }) => (
          <MovieCarousel key={key} title={title} movies={genreMovies[key]||[]} icon={icon} />
        ))}

        {/* Upcoming */}
        <UpcomingMoviesSection movies={upcomingMovies} />
      </main>
    </div>
  );
};

export default Home;
