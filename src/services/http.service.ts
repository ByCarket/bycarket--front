import axios from "axios";
import { getAuthToken } from "./storage.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const http = axios.create({
	baseURL: API_BASE_URL,
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
			customError.response = {
				data: { message: "Error de conexión con el servidor" },
			};
			return Promise.reject(customError);
		}

		const status = error.response.status;
		const errorData = error.response.data || {};
		const errorMessage = errorData.message || "Error desconocido";

		let message = errorMessage;

		if (status === 401) {
			message = "Error de autenticación";
		} else if (status === 400) {
			message = `Error de validación: ${errorMessage}`;
		} else if (status === 404) {
			message = `Recurso no encontrado: ${errorMessage}`;
		} else if (status === 500) {
			message = `Error del servidor (${status}): ${errorMessage}`;
		}

		const customError = new Error(message);
		customError.response = error.response;
		return Promise.reject(customError);
	}
);

export default http;
