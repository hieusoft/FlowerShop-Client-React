
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const BASE_URL = "/api"; 
export const ACCESS_TOKEN_KEY = "auth-access-token";

interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});


export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  apiInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}


export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  delete apiInstance.defaults.headers.common["Authorization"];
}


apiInstance.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      request.headers = request.headers || {};
      request.headers["Authorization"] = `Bearer ${token}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);


apiInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config as AxiosRequestConfigWithRetry;
      if (!originalRequest || originalRequest._retry) return Promise.reject(error);

      originalRequest._retry = true;

      try {
    
        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.newAccessToken;
        setAccessToken(newAccessToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return apiInstance(originalRequest);
      } catch (e) {
        removeAccessToken();
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);