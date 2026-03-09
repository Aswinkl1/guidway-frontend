import axios, { type AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_BACKEND_API_VERSION}`,
  withCredentials: true,
  timeout: 10000,
});
