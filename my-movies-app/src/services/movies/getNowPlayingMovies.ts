import api from "../api";

export const getNowPlayingMovies = async (page = 1) => {
  const response = await api.get('/movie/now_playing', {
    params: {
      language: "en-US",
      page: page
    }
  });
  return response.data;
};