import api from "../api";

export const getGuestSession = async () => {
    try {
        const { data } = await api.get("/authentication/guest_session/new");
        return data;
    } catch (error) {
        throw error;
    }
};