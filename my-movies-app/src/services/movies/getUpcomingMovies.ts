import api from "../api";

export const getUpcomingMovies = async (page = 1) => {
  try {
    // Get today's date
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    // Make the API call to get upcoming movies
    const response = await api.get('/discover/movie', {
      params: {
        language: "en-US",
        page: page,
        include_adult: false,
        include_video: false,
        sort_by: "primary_release_date.asc", // Sort by release date ascending
        "primary_release_date.gte": formattedDate, // Only include movies releasing today or later
        with_release_type: "2|3", // Only include theatrical releases
        "vote_count.gte": 1 // Include movies with any vote count
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    throw error;
  }
};