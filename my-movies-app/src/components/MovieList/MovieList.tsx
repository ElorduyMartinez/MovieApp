import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MovieCard from "@/components/MovieCard/MovieCard";
import api from "@/services/api"; 

interface IMovie {
    id: number;
    title: string;
    vote_average: number;
    poster_path: string;
    release_date: string;
    overview: string;
}

interface IMovieListProps {
    movies: IMovie[];
    loading: boolean;
    pageType: "popular" | "now-playing" | "top-rated";
    title: string;
}

const MovieList: React.FC<IMovieListProps> = ({ movies, loading, pageType, title }) => {
    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">{title}</h1>
            
            {/* Loading indicator */}
            {loading && (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}
            
            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {movies?.map((movie) => (
                    <Link
                        key={movie.id}
                        href={{
                            pathname: `/movie/${movie.id}`,
                            query: { from: pageType },
                        }}
                        className="block h-full"
                    >
                        <MovieCard
                            title={movie.title}
                            voteAverage={movie.vote_average}
                            posterPath={movie.poster_path}
                            releaseYear={new Date(movie.release_date).getFullYear()}
                            description={movie.overview}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MovieList;