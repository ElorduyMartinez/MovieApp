import api from "../api";

export const getTrendingMovies = async (page = 1, timeWindow = 'day') => {
  try {
    const response = await api.get(`/trending/movie/${timeWindow}`, {
      params: {
        language: "en-US",
        page: page
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw error;
  }
};