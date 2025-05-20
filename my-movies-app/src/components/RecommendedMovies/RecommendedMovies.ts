// RecommendedMovies.ts
import React, { useEffect, useState } from "react";
import Link from "next/link";
import MovieCard from "@/components/MovieCard/MovieCard";
import Config from "@/config";
import  api from "@/services/api";

interface IMovie {
    id: number;
    title: string;
    vote_average: number;
    poster_path: string;
    release_date: string;
    overview: string;
}

interface IRecommendedMoviesProps {
    movieId: string | number;
}

const RecommendedMovies: React.FC<IRecommendedMoviesProps> = ({ movieId }) => {
    const [recommendedMovies, setRecommendedMovies] = useState<IMovie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchRecommendedMovies = async () => {
            try {
                setLoading(true);
                
                // Usar la instancia de API que ya está configurada con tu token Bearer
                const response = await api.get(`/movie/${movieId}/recommendations`, {
                    params: {
                        language: "en-US",
                        page: 1
                    }
                });
                
                console.log("Recommendations obtained:", response.data);
                
                if (response.data && response.data.results) {
                    setRecommendedMovies(response.data.results.slice(0, 10));
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching recommended movies:', err);
                setError("Could not load recommendations");
            } finally {
                setLoading(false);
            }
        };

        if (movieId) {
            fetchRecommendedMovies();
        }
    }, [movieId]);

    if (loading) {
        return React.createElement("div", { className: "mt-10 p-8" }, [
            React.createElement("h2", { className: "text-2xl font-bold mb-4", key: "title" }, "Recommended Movies"),
            React.createElement("div", { className: "flex justify-center items-center h-40", key: "loader" }, 
                React.createElement("div", { className: "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" })
            )
        ]);
    }

    if (error || recommendedMovies.length === 0) {
        return React.createElement("div", { className: "mt-10 p-8" }, [
            React.createElement("h2", { className: "text-2xl font-bold mb-4", key: "title" }, "Recommended Movies"),
            React.createElement("p", { className: "text-gray-600 text-center", key: "message" }, 
                error || "No recommendations are available for this film."
            )
        ]);
    }

    return React.createElement("div", { className: "mt-10 p-8" }, [
        React.createElement("h2", { className: "text-2xl font-bold mb-4", key: "title" }, "Recommended Movies"),
        React.createElement("div", { className: "relative", key: "carousel-container" }, 
            React.createElement("div", { className: "overflow-x-auto pb-4" }, 
                React.createElement("div", { className: "flex space-x-6" }, 
                    recommendedMovies.map(movie => 
                        React.createElement("div", { key: movie.id, className: "w-[200px] flex-shrink-0" },
                            React.createElement(Link, { 
                                href: { pathname: `/movie/${movie.id}` },
                                className: "block h-full"
                            }, 
                                React.createElement(MovieCard, {
                                    title: movie.title,
                                    voteAverage: movie.vote_average,
                                    posterPath: movie.poster_path,
                                    releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
                                    description: movie.overview
                                })
                            )
                        )
                    )
                )
            )
        )
    ]);
};

export default RecommendedMovies