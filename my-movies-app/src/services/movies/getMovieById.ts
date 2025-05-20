import api from "../api";

export const getMovieById = async (id: string) => {
    try {
    const { data } = await api.get(`/movie/${id}`);
    return data;
    }
    catch (error) {
        throw error;
    }
};
