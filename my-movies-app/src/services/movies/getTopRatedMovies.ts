import api from "../api";

export const getTopRatedMovies = async (page = 1) => {
  const response = await api.get('/movie/top_rated', {
    params: {
      language: "en-US",
      page: page
    }
  });
  return response.data;
};