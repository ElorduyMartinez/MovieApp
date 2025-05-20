"use client";

import React, { useEffect, useState } from "react";
import api from "@/services/api";
import MovieList from "@/components/MovieList/MovieList";
import { getFavoriteMovies } from "@/services/accounts/getFavoriteMovies";
import { useGuestSession } from "@/providers/GuestSessionContext";
import Link from "next/link";
import MovieCard from "@/components/MovieCard/MovieCard";

interface IMovie {
    id: number;
    title: string;
    vote_average: number;
    poster_path: string;
    release_date: string;
    overview: string;
}

const FavoritesPage: React.FC = () => {
    const [favoriteMovies, setFavoriteMovies] = useState<IMovie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const { guestSessionId } = useGuestSession();

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!guestSessionId) {
                // Si no hay sesión de invitado, intentar cargar favoritos desde localStorage
                const storedFavorites = localStorage.getItem("favoriteMovieIds");
                if (storedFavorites) {
                    const favoriteIds: number[] = JSON.parse(storedFavorites);
                    // Aquí podrías hacer llamadas a la API para obtener detalles de cada película
                    // O simplemente mostrar un mensaje informando que se requiere sesión de invitado
                    setLoading(false);
                    return;
                }
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await api.get(`/account/${guestSessionId}/favorite/movies`, {
                    params: {
                        language: "en-US",
                        page: page,
                        sort_by: "created_at.desc"
                    }
                });
                
                setFavoriteMovies(response.data.results);
                setTotalPages(response.data.total_pages);
                setError(null);
            } catch (err) {
                console.error("Error fetching favorites:", err);
                setError("Could not load favorite movies");
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [guestSessionId, page]);

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
            window.scrollTo(0, 0);
        }
    };

    // Función para remover una película de favoritos
    const handleRemoveFavorite = async (movieId: number) => {
        if (!guestSessionId) return;

        try {
            await api.post(`/account/${guestSessionId}/favorite`, {
                media_type: "movie",
                media_id: movieId,
                favorite: false
            });

            // Actualiza la lista de favoritos eliminando la película
            setFavoriteMovies(prevMovies => 
                prevMovies.filter(movie => movie.id !== movieId)
            );

            // Actualiza también localStorage si lo estás usando
            const storedFavorites = localStorage.getItem("favoriteMovieIds");
            if (storedFavorites) {
                const favoriteIds: number[] = JSON.parse(storedFavorites);
                const updatedFavorites = favoriteIds.filter(id => id !== movieId);
                localStorage.setItem("favoriteMovieIds", JSON.stringify(updatedFavorites));
            }
        } catch (err) {
            console.error("Error removing favorite:", err);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <h1 className="text-4xl font-bold mb-8">Favorite Movies</h1>
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <h1 className="text-4xl font-bold mb-8">Favorite Movies</h1>
                <div className="text-red-500 text-center p-4">{error}</div>
            </div>
        );
    }

    if (favoriteMovies.length === 0) {
        return (
            <div className="p-8">
                <h1 className="text-4xl font-bold mb-8">Favorite Movies</h1>
                <div className="text-center p-8 bg-gray-100 rounded-lg">
                    <p className="text-xl mb-4">You don't have any favorite movies yet.</p>
                    <Link href="/popular" className="text-blue-600 hover:text-blue-800 font-semibold">
                        Explore popular movies
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Favorite Movies</h1>
            
            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {favoriteMovies.map((movie) => (
                    <div key={movie.id} className="relative">
                        <Link
                            href={{
                                pathname: `/movie/${movie.id}`,
                                query: { from: "favorites" },
                            }}
                            className="block h-full"
                        >
                            <MovieCard
                                title={movie.title}
                                voteAverage={movie.vote_average}
                                posterPath={movie.poster_path}
                                releaseYear={movie.release_date ? new Date(movie.release_date).getFullYear() : 0}
                                description={movie.overview}
                            />
                        </Link>
                        <button
                            onClick={() => handleRemoveFavorite(movie.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none"
                            aria-label="Remove from favorites"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
            
            {/* Pagination controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-10 space-x-4">
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded font-medium ${
                            page === 1 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        Previous
                    </button>
                    
                    <span className="text-gray-700">
                        Page {page} of {totalPages}
                    </span>
                    
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded font-medium ${
                            page === totalPages 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;