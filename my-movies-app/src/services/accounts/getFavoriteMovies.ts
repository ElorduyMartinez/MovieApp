
import api from "../api";

export const getFavoriteMovies = async (guestSessionId: string) => {
    try {
        const { data } = await api.get(
            `/account/${guestSessionId}/favorite/movies?language=en-US&page=1&sort_by=created_at.asc`
        );
        return data;
    } catch (error) {
        throw error;
    }
};
