import api from "../api";

export const getPopularMovies = async (page = 1) => {
  const response = await api.get('/movie/popular', {
    params: {
      language: "en-US",
      page: page
    }
  });
  return response.data;
};