"use client";
import { useEffect, useState } from "react";
import { IMovieDetail } from "@/types/MovieDetail";
import Image from "next/image";
import { getMovieById } from "@/services/movies/getMovieById";
import { markAsFavorite } from "@/services/accounts/markAsFavorite";
import { useGuestSession } from "@/providers/GuestSessionContext";
import { useParams } from "next/navigation";
import Config from "@/config";
import RecommendedMovies from "@/components/RecommendedMovies/RecommendedMovies";

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<IMovieDetail | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { guestSessionId } = useGuestSession();

  // Cargar detalles de la película
  useEffect(() => {
    if (!id || typeof id !== "string") return;
    
    const fetchMovie = async (): Promise<void> => {
      setLoading(true);
      try {
        const data = await getMovieById(id);
        setMovie(data);
      } catch (err) {
        console.error("Error fetching movie", err);
        setError("Could not load movie.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovie();
  }, [id]);

  // Verificar si está en favoritos (localStorage)
  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const storedFavorites = localStorage.getItem("favoriteMovieIds");
    const favoriteIds: number[] = storedFavorites
      ? JSON.parse(storedFavorites)
      : [];
    setIsFavorite(favoriteIds.includes(Number(id)));
  }, [id]);

  // Marcar o desmarcar como favorito
  const handleToggleFavorite = async (): Promise<void> => {
    if (!guestSessionId || !movie) return;
    const newFavoriteState = !isFavorite;
    try {
      await markAsFavorite(movie.id, newFavoriteState, guestSessionId);
      setIsFavorite(newFavoriteState);
      const storedFavorites = localStorage.getItem("favoriteMovieIds");
      const favoriteIds: number[] = storedFavorites
        ? JSON.parse(storedFavorites)
        : [];
      const updatedFavorites = newFavoriteState
        ? [...new Set([...favoriteIds, movie.id])]
        : favoriteIds.filter((id) => id !== movie.id);
      localStorage.setItem(
        "favoriteMovieIds",
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  if (loading) return <div>Loading movie...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>No movie found.</div>;

  // Formatear la fecha de lanzamiento
  const releaseDate = new Date(movie.release_date).toLocaleDateString();
  
  // Formatear el presupuesto y los ingresos
  const formatMoney = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="flex-shrink-0 w-full md:w-80">
          <Image
            src={`${Config.IMAGE_SOURCE}${movie.poster_path}`}
            alt={movie.title}
            className="rounded-lg w-full object-cover"
            width={400}
            height={600}
          />
        </div>
        
        {/* Content */}
        <div className="flex-grow">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          
          {movie.tagline && (
            <p className="text-lg italic text-gray-500 mb-4">"{movie.tagline}"</p>
          )}
          
          <p className="text-lg mb-8">{movie.overview}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* Details Column */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Details</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Release Date:</span> {releaseDate}
                </div>
                <div>
                  <span className="font-medium">RunTime:</span> {movie.runtime} minutes
                </div>
                <div>
                  <span className="font-medium">Genres:</span> {movie.genres.map(genre => genre.name).join(', ')}
                </div>
                <div>
                  <span className="font-medium">Original Language:</span> {movie.spoken_languages.map(lang => lang.english_name).join(', ')}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {movie.status}
                </div>
              </div>
            </div>
            
            {/* Production Column */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Production</h2>
              <div className="space-y-3">
                {movie.budget > 0 && (
                  <div>
                    <span className="font-medium">Budget:</span> {formatMoney(movie.budget)}
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div>
                    <span className="font-medium">Revenue:</span> {formatMoney(movie.revenue)}
                  </div>
                )}
                <div>
                  <span className="font-medium">Production Companies:</span> {movie.production_companies.map(company => company.name).join(', ')}
                </div>
                <div>
                  <span className="font-medium">Production Countries:</span> {movie.production_countries.map(country => country.name).join(', ')}
                </div>
              </div>
            </div>
          </div>
          
          {/* Rating */}
          <div className="mt-8 flex items-center">
            <div className="bg-yellow-500 text-white text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center mr-4">
              {movie.vote_average.toFixed(1)}
            </div>
            <div>
              <p className="text-lg">User Rating</p>
              <p className="text-gray-500">{movie.vote_count} votes</p>
            </div>
          </div>
          
          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className={`mt-6 px-6 py-3 rounded ${
              isFavorite
                ? "bg-red-500 hover:bg-red-600"
                : "bg-yellow-500 hover:bg-yellow-600"
            } text-white font-bold`}
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>
      </div>
      {/* Recommended Movies */}
      <RecommendedMovies movieId={movie.id} />
    </div>
  );
};

export default MovieDetailPage;