// api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const BASE_URL = "http://54.254.156.167:8080";
export const ACCESS_TOKEN_KEY = "auth-access-token";

// mở rộng config để thêm _retry
interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // gửi cookie HTTP-only
});

// set access token vào localStorage + header
export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  apiInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// remove access token khi logout hoặc refresh fail
export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  delete apiInstance.defaults.headers.common["Authorization"];
}

// interceptor request: tự động thêm access token nếu có
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

// interceptor response: tự động refresh khi 401
apiInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config as AxiosRequestConfigWithRetry;
      if (!originalRequest || originalRequest._retry) return Promise.reject(error);

      originalRequest._retry = true;

      try {
        // gọi refresh token (cookie HTTP-only sẽ tự gửi)
        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        setAccessToken(newAccessToken);

        // retry request cũ với access token mới
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
