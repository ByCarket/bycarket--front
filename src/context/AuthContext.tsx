import { create } from "zustand";
import {
	loginUser,
	registerUser,
	LoginData,
	RegisterData,
	GoogleProcessLoginResponse,
} from "@/services/api.service";
import {
	setAuthToken,
	getAuthToken,
	removeAuthToken,
} from "@/services/storage.service";

interface User {
	id: string;
	name: string;
	email: string;
	role?: string;
}

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	loading: boolean;
	login: (data: LoginData) => Promise<void>;
	register: (data: RegisterData) => Promise<void>;
	logout: () => void;
	initializeAuth: () => void;
	setGoogleUser: (response: GoogleProcessLoginResponse) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	token: null,
	isAuthenticated: false,
	loading: true,

	initializeAuth: () => {
		const storedToken = getAuthToken();
		if (storedToken) {
			set({ token: storedToken, isAuthenticated: true, loading: false });
		} else {
			set({ loading: false });
		}
	},

	login: async (data: LoginData) => {
		set({ loading: true });
		try {
			const response = await loginUser(data);
			setAuthToken(response.token);
			set({
				token: response.token,
				user: response.user,
				isAuthenticated: true,
				loading: false,
			});
		} catch (error) {
			set({ loading: false });
			throw error;
		}
	},

	register: async (data: RegisterData) => {
		set({ loading: true });
		try {
			await registerUser(data);
			set({ loading: false });
		} catch (error) {
			set({ loading: false });
			throw error;
		}
	},

	logout: () => {
		removeAuthToken();
		set({ user: null, token: null, isAuthenticated: false });
	},
	
	setGoogleUser: (response: GoogleProcessLoginResponse) => {
		if (response.token && response.user) {
			set({
				token: response.token,
				user: {
					id: response.user.id,
					name: response.user.name,
					email: response.user.email,
					role: response.user.role,
				},
				isAuthenticated: true,
				loading: false,
			});
		}
	},
}));
