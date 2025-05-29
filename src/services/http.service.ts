import axios from "axios";
import { getAuthToken } from "./storage.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const http = axios.create({
	baseURL: API_BASE_URL,
	paramsSerializer: params => {
		const searchParams = new URLSearchParams();
		
		Object.entries(params).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				value.forEach(val => searchParams.append(key, val));
			} else {
				searchParams.append(key, String(value));
			}
		});
		
		return searchParams.toString();
	}
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
		if (!error.response) {
			const customError = new Error("Error de conexión con el servidor");
			(customError as any).response = {
				data: { message: "Error de conexión con el servidor" },
			};
			return Promise.reject(customError);
		}

		const status = error.response.status;
		const errorData = error.response.data || {};
		const errorMessage = errorData.message || "Error desconocido";

		let message = errorMessage;

		if (status === 401) {
			message = "Credenciales inválidas";
		} else if (status === 400) {
			message = errorMessage || "Error de validación";
		} else if (status === 404) {
			message = errorMessage || "Recurso no encontrado";
		} else if (status === 500) {
			message = errorMessage || `Error del servidor (${status})`;
		}

		const customError = new Error(message);
		(customError as any).response = error.response;
		return Promise.reject(customError);
	}
);

export default http;
