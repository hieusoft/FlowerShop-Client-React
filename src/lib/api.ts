import axios, { AxiosError } from "axios";

export const BASE_URL = "";
export const ACCESS_TOKEN_KEY = "auth-access-token";

export const apiInstance = axios.create({
    baseURL: BASE_URL
})

export function setAccessToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    apiInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

apiInstance.interceptors.request.use(
    request => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (accessToken) {
            request.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return request;
    }, 
    error => {
        return Promise.reject(error);
    }
);

apiInstance.interceptors.request.use(
    response => response,
    async (error) => {
        if (error instanceof AxiosError && error.response?.status == 401) {
            const originalRequest = error.request;
            try {
                const refresh = await axios.get("refresh", { baseURL: BASE_URL });
                const token = refresh.data.accessToken;
                setAccessToken(token);
                return apiInstance(originalRequest); 
            } catch (e) {   
                return Promise.reject(error);
            }
        } else {
            return Promise.reject(error);
        }
    }
)