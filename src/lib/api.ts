
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { accessSync } from "fs";
import { redirect } from "next/dist/server/api-utils";

export const API_ROOT =  process.env.NEXT_PUBLIC_API_ROOT;
export const ACCESS_TOKEN_KEY = "auth-access-token";

interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const clientApiInstance = axios.create({
  baseURL: "/api/",
  withCredentials: true, 
});
export const serverApiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ROOT
})

export function getApiInstance() {
  try {
    // Test for client
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    window;
    return clientApiInstance;
  } catch {
    return serverApiInstance;
  }
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  clientApiInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function getUserClaims(): null | Record<string, string> {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) return null;
  return JSON.parse(atob(token.split(".")[1]));
}

export function removeAccessToken() {
  delete localStorage[ACCESS_TOKEN_KEY];
  delete clientApiInstance.defaults.headers.common["Authorization"];
}


clientApiInstance.interceptors.request.use(
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


clientApiInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;

    
    if (
      originalRequest?.url?.includes("/api/auth/login") ||
      originalRequest?.url?.includes("/api/auth/register") ||
      originalRequest?.url?.includes("/api/auth/verify") ||
      originalRequest?.url?.includes("/api/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      if (!originalRequest || originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.newAccessToken;
        setAccessToken(newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] =
          `Bearer ${newAccessToken}`;

        return clientApiInstance(originalRequest);
      } catch (e) {
        removeAccessToken();
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);
