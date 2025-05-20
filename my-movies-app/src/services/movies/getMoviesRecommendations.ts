
import api from "../api";

export const getMovieRecommendations = async (movieId: number | string, page = 1) => {
  try {
    const response = await api.get(`/movie/${movieId}/recommendations`, {
      params: {
        language: "en-US",
        page: page
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie recommendations:", error);
    throw error;
  }
};