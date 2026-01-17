import axios from "axios";
import { AuthResponse } from "../model/response/AuthResponse";

export const API_URL = "http://localhost:5000/api";
const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Отправляет cookies при каждом запросе
});

// Добавляем интерсептор для запросов
$api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    // Пропускаем для самого /refresh запроса
    if (originalRequest.url?.includes("/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      try {
        const response = await $api.get<AuthResponse>("/refresh", {
          withCredentials: true,
        });
        localStorage.setItem("token", response.data.accessToken);
        return $api.request(originalRequest);
      } catch (error) {
        localStorage.removeItem("token");
        console.log("Не авторизован");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  },
);
export default $api;
