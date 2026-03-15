import { store } from "@/app/store/store";
import { logout, setCredentials } from "@/features/auth/redux/UserAuthSlice";
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_BACKEND_API_VERSION}`,
  withCredentials: true,
  timeout: 10000,
});

// set the authheader to the request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store?.getState()?.auth?.token;
    console.log("token", token);
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// check the responce for 401 error and handle it

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry: boolean;
    };

    if (error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    console.log("helooo");
    originalRequest._retry = true;

    try {
      const { data } = await api.post("/refresh");
      console.log(data);
      store.dispatch(
        setCredentials({
          token: data.result.accessToken,
          role: data.result.role,
        }),
      );

      api.defaults.headers.common["Authorization"] =
        `Bearer ${data.accessToken}`;
      if (originalRequest.headers) {
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
      }

      return api(originalRequest);
    } catch (error) {
      console.log("i a rediretin you becasue of token exp");
      store.dispatch(logout());
      window.location.href = "/auth/login";
      return Promise.reject(error);
    }
  },
);
