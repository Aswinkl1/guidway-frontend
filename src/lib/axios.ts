import { store } from "@/app/store/store";
import { logout, setCredentials } from "@/features/auth/redux/UserAuthSlice";
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}`,
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
    const status = error.response.status;
    if (status === 404 || status === 500) {
      window.dispatchEvent(
        new CustomEvent("nav-error", {
          detail: { status },
        }),
      );
    }
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry: boolean;
    };

    if (error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    if (originalRequest.url === "/refresh") {
      return Promise.reject(error);
    }
    console.log("helooo");
    originalRequest._retry = true;

    try {
      console.log("this is happening");
      const { data } = await api.get("/refresh");
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
