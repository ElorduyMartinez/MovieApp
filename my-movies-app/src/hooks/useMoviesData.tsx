// src/hooks/useMoviesData.ts
import { useState, useEffect } from "react";
import api from "@/services/api";
import { getUpcomingMovies } from "@/services/movies/getUpcomingMovies";
import { IMovieDetail } from "@/types/movie";

interface GenreConfig {
  id: number;
  key: string;       // uso interno para el record
  title: string;     // texto para mostrar
}

const GENRES: GenreConfig[] = [
  { id: 28, key: "action", title: "Action" },
  { id: 35, key: "comedy", title: "Comedy" },
  { id: 18, key: "drama", title: "Drama" },
  { id: 878, key: "scifi", title: "Sci-Fi" },
  // añade más géneros si quieres
];

export const useMoviesData = () => {
  const [trendingMovies, setTrendingMovies] = useState<IMovieDetail[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<IMovieDetail[]>([]);
  const [genreMovies, setGenreMovies] = useState<
    Record<string, IMovieDetail[]>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trendingTimeWindow, setTrendingTimeWindow] = 
    useState<"day" | "week">("day");

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1) Trending
      const trendingReq = api.get(
        `/trending/movie/${trendingTimeWindow}`,
        { params: { language: "en-US", page: 1 } }
      );

      // 2) Upcoming
      const upcomingReq = getUpcomingMovies(1);

      // 3) Para cada género, un discover
      const genreReqs = GENRES.map((g) =>
        api.get("/discover/movie", {
          params: {
            language: "en-US",
            with_genres: g.id,
            sort_by: "vote_count.desc",
            page: 1,
          },
        })
      );

      // Esperamos todo en paralelo
      const [
        trendingRes,
        upcomingRes,
        ...genreResArray
      ] = await Promise.all([trendingReq, upcomingReq, ...genreReqs]);

      setTrendingMovies(trendingRes.data.results.slice(0, 8));
      setUpcomingMovies(upcomingRes.results.slice(0, 8));

      // Construimos el record { action: [...], comedy: [...], … }
      const newGenreMovies: Record<string, IMovieDetail[]> = {};
      genreResArray.forEach((res, idx) => {
        const key = GENRES[idx].key;
        newGenreMovies[key] = res.data.results.slice(0, 8);
      });
      setGenreMovies(newGenreMovies);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Could not load movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();

    // Refrescar cada 24h
    const id = setInterval(fetchAll, 24 * 60 * 60 * 1000);
    return () => clearInterval(id);
  }, [trendingTimeWindow]);

  return {
    loading,
    error,
    trendingMovies,
    upcomingMovies,
    genreMovies,            // accedes: genreMovies['action'], ['comedy'], …
    trendingTimeWindow,
    setTrendingTimeWindow,
  };
};
