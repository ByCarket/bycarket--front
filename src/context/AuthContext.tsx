import { create } from "zustand";
import {
  loginUser,
  registerUser,
  LoginData,
  RegisterData,
  GoogleProcessLoginResponse,
  getUserData,
} from "@/services/api.service";
import {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
} from "@/services/storage.service";
import { signOut } from "next-auth/react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "premium" | "admin";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginData) => Promise<any>;
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

      getUserData()
        .then((response) => {
          if (response && response.data) {
            set({
              user: {
                id: response.data.id,
                name: response.data.name,
                email: response.data.email,
                role: (response.data.role || "user") as
                  | "user"
                  | "premium"
                  | "admin",
              },
            });
          }
        })
        .catch(() => {});
    } else {
      set({ loading: false });
    }
  },

  login: async (data: LoginData) => {
    set({ loading: true });
    try {
      const response: any = await loginUser(data);
      setAuthToken(response.token);

      set({
        token: response.token,
        user: {
          id: response.user?.id || "",
          name: response.user?.name || "Usuario",
          email: response.user?.email || "",
          role: (response.user?.role as "user" | "premium" | "admin") || "user",
        },
        isAuthenticated: true,
        loading: false,
      });

      return response;
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
    signOut();
  },

  setGoogleUser: (response: GoogleProcessLoginResponse) => {
    if (response.token && response.user) {
      setAuthToken(response.token);
      set({
        token: response.token,
        user: {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: (response.user.role as "user" | "premium" | "admin") || "user",
        },
        isAuthenticated: true,
        loading: false,
      });
    }
  },
}));
