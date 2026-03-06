import axios, { type AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: "",
  withCredentials: true,
  timeout: 10000,
});
