'use client';
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Heart, HeartCrack } from "lucide-react";
import { IMovieDetail } from "@/types/MovieDetail";
import { getMovieById } from "@/services/movies/getMovieById";
import { markAsFavorite } from "@/services/accounts/markAsFavorite";
import { useGuestSession } from "@/providers/GuestSessionContext";
import Config from "@/config";
import RecommendedMovies from "@/components/RecommendedMovies/RecommendedMovies";
import { getWatchProviders } from "@/services/api";

const MovieDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [movie, setMovie] = useState<IMovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [providers, setProviders] = useState<
    { provider_id: number; provider_name: string; logo_path: string }[]
  >([]);
  const { guestSessionId } = useGuestSession();
  const [providerLink, setProviderLink] = useState<string>("");

  useEffect(() => {
    if (!id || Array.isArray(id)) return;
    setLoading(true);
  
    getMovieById(id)
      .then(data => {
        setMovie(data);
        return data.id;
      })
      .then(movieId =>
        getWatchProviders(movieId, "MX").then(regionData => {
          console.log("Watch providers (MX):", regionData);
  
          // Guardar el enlace genérico
          setProviderLink(regionData.link ?? "");
  
          // Combinar todas las categorías
          const all = [
            ...(regionData.flatrate ?? []),
            ...(regionData.rent     ?? []),
            ...(regionData.buy      ?? []),
          ];
  
          // Eliminar duplicados por provider_id
          const unique = Array.from(
            new Map(all.map(p => [p.provider_id, p])).values()
          );
  
          setProviders(unique);
        })
      )
      .catch(() => setError("Failed to load movie."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const stored = JSON.parse(
      localStorage.getItem("favoriteMovieIds") || "[]"
    );
    setIsFavorite(stored.includes(Number(id)));
  }, [id]);

  const toggleFavorite = async () => {
    if (!movie || !guestSessionId) return;
    const nextState = !isFavorite;
    try {
      await markAsFavorite(movie.id, nextState, guestSessionId);
      setIsFavorite(nextState);
      const stored = JSON.parse(
        localStorage.getItem("favoriteMovieIds") || "[]"
      );
      const updated = nextState
        ? [...new Set([...stored, movie.id])]
        : stored.filter((mid: number) => mid !== movie.id);
      localStorage.setItem("favoriteMovieIds", JSON.stringify(updated));
    } catch {
      console.error("Favorite toggle failed");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  if (error || !movie)
    return (
      <div className="container mx-auto p-6 text-center text-red-600">
        {error || "Movie not found."}
        <button
          onClick={() => router.back()}
          className="mt-4 inline-flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="mr-1" /> Go Back
        </button>
      </div>
    );

  const releaseDate = new Date(movie.release_date).toLocaleDateString();
  const formatMoney = (amt: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amt);

  return (
    <div className="bg-gray-50">
      <div className="relative h-96">
        <Image
          src={`${Config.IMAGE_SOURCE}${movie.backdrop_path || movie.poster_path}`}
          alt={movie.title}
          fill
          className="object-cover brightness-75"
          unoptimized
          priority
        />
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90 transition"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold drop-shadow-lg">{movie.title}</h1>
          {movie.tagline && (
            <p className="italic drop-shadow-md">{movie.tagline}</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="relative h-0 pb-[150%] rounded-lg overflow-hidden shadow-lg">
              <Image
                src={`${Config.IMAGE_SOURCE}${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>

            <button
              onClick={toggleFavorite}
              className="mt-4 w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-md text-white font-semibold transition"
              style={{
                backgroundColor: isFavorite ? "#e53e3e" : "#ecc94b",
              }}
            >
              {isFavorite ? <HeartCrack /> : <Heart />}{" "}
              {isFavorite ? "Remove Favorite" : "Add Favorite"}
            </button>

            <>
  <h3 className="mt-6 mb-2 text-lg font-semibold text-gray-800">
    Dónde verla
  </h3>

  {providers.length > 0 ? (
    <div className="flex flex-wrap gap-2 mb-2">
      {providers.map((p) => (
        <Image
          key={p.provider_id}
          src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
          alt={p.provider_name}
          width={32}
          height={32}
          priority
        />
      ))}
    </div>
  ) : (
    <p className="text-gray-500 mb-2">
      No disponible en streaming/digital en esta región.
    </p>
  )}

  {providerLink && (
    <a
      href={providerLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block text-blue-600 hover:underline"
    >
      Ver proveedores en TMDB
    </a>
  )}
</>
          </div>

          <div className="md:flex-1 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                {movie.overview}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Details</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>
                    <strong>Release:</strong> {releaseDate}
                  </li>
                  <li>
                    <strong>Runtime:</strong> {movie.runtime} min
                  </li>
                  <li>
                    <strong>Genres:</strong>{" "}
                    {movie.genres.map((g) => g.name).join(", ")}
                  </li>
                  <li>
                    <strong>Language:</strong>{" "}
                    {movie.spoken_languages
                      .map((l) => l.english_name)
                      .join(", ")}
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Production</h3>
                <ul className="text-gray-600 space-y-1">
                  {movie.budget > 0 && (
                    <li>
                      <strong>Budget:</strong> {formatMoney(movie.budget)}
                    </li>
                  )}
                  {movie.revenue > 0 && (
                    <li>
                      <strong>Revenue:</strong> {formatMoney(movie.revenue)}
                    </li>
                  )}
                  <li>
                    <strong>Companies:</strong>{" "}
                    {movie.production_companies
                      .map((c) => c.name)
                      .join(", ")}
                  </li>
                  <li>
                    <strong>Countries:</strong>{" "}
                    {movie.production_countries.map((c) => c.name).join(", ")}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <RecommendedMovies movieId={movie.id} />
      </div>
    </div>
  );
};

export default MovieDetailPage;
