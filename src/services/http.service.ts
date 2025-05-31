import axios from "axios";
import { getAuthToken } from "./storage.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const http = axios.create({
  baseURL: API_BASE_URL,
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => searchParams.append(key, val));
      } else {
        searchParams.append(key, String(value));
      }
    });

    return searchParams.toString();
  },
});

http.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    const isActivationError = response?.config?.url?.includes("/auth/activate");
    if (isActivationError) {
      return Promise.reject(error);
    }

    let message = "Error de conexión con el servidor";

    if (response?.data?.message) {
      message = response.data.message;
    } else if (response?.statusText) {
      message = response.statusText;
    }

    console.error("Error en la petición:", {
      url: response?.config?.url,
      status: response?.status,
      message,
    });

    const customError = new Error(message);
    (customError as any).response = error.response;
    return Promise.reject(customError);
  }
);

export default http;
