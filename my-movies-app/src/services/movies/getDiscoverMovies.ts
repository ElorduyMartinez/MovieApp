import api from "../api";

export const getDiscoverMovies = async (options = {}) => {
  try {
    const response = await api.get("/discover/movie", {
      params: {
        language: "en-US",
        page: 1,
        ...options
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching discover movies:", error);
    throw error;
  }
};