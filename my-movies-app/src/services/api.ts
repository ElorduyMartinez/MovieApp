import Config from "@/config";
import axios, { type InternalAxiosRequestConfig } from "axios";

// Create an Axios Instance
const api = axios.create({
  baseURL: Config.API_URL, // e.g. https://api.themoviedb.org/3
  timeout: 5000,
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Ensure headers is an object
    config.headers = config.headers || {};
    // Set authorization and accept headers
    config.headers["Authorization"] =
      `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_KEY}`;
    config.headers["Accept"] = "application/json";

    console.log("Making request to:", config.url);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

// --- Additional TMDB endpoints ---

/**
 * Search movies by title
 * @param query Search text
 * @param page Page number (default 1)
 */
export function searchMovies(query: string, page = 1) {
  return api.get('/search/movie', {
    params: {
      query,
      language: 'en-US',
      page,
    },
  });
}

/**
 * Get movie recommendations for a given movie ID
 * @param movieId TMDB movie ID
 */
export function getMovieRecommendations(movieId: number, page = 1) {
  return api.get(`/movie/${movieId}/recommendations`, {
    params: { language: 'en-US', page },
  });
}

export default api;