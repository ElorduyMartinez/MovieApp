import Config from "@/config";
import axios from "axios";
// Create an Axios Instance 
const api = axios.create({
    baseURL: Config.API_URL,
    timeout: 5000,
});
//Request Interceptor
api.interceptors.request.use(
(config) => {
    const newConfig = { ...config };
    newConfig.headers.Authorization =  `Bearer ${
        process.env.NEXT_PUBLIC_MOVIE_API_KEY
    }`;
    newConfig.headers.accept = "application/json";
    console.log("Making request to: ", newConfig.url);
    return newConfig
},
(error) => {
    console.error("Request error: ", error);
    return Promise.reject(error);
}
);
//Responsse Interceptor

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Response error: ", error)
        return Promise.reject(error);
    }
);
export default api;