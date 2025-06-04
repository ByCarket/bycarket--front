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
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isActive: boolean;
  loading: boolean;
  login: (data: LoginData) => Promise<any>;
  register: (data: RegisterData) => Promise<{ email: string }>;
  logout: () => void;
  initializeAuth: () => void;
  setGoogleUser: (response: GoogleProcessLoginResponse) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isActive: false,
  loading: true,

  initializeAuth: () => {
    const storedToken = getAuthToken();
    if (storedToken) {
      set({ token: storedToken, isAuthenticated: true });

      getUserData()
        .then((userData) => {
          set({ user: userData, loading: false });
        })
        .catch(() => {
          set({ loading: false });
        });
    } else {
      set({ loading: false });
    }
  },

  login: async (data: LoginData) => {
    set({ loading: true });
    try {
      const response: any = await loginUser(data);
      setAuthToken(response.token);

      const userData = {
        id: response.user?.id || "",
        name: response.user?.name || "Usuario",
        email: response.user?.email || "",
        role: (response.user?.role as "user" | "premium" | "admin") || "user",
        isActive: response.user?.isActive || false,
      };

      set({
        token: response.token,
        user: userData,
        isAuthenticated: true,
        isActive: userData.isActive,
        loading: false,
      });

      return { ...response, user: userData };
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ loading: true });
    try {
      const response = await registerUser(data);
      set({ loading: false });
      return { email: data.email };
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    removeAuthToken();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isActive: false,
      loading: false,
    });
    signOut({ callbackUrl: "/login" });
  },

  setGoogleUser: (response: GoogleProcessLoginResponse) => {
    const userData = {
      id: response.user?.id || "",
      name: response.user?.name || "Usuario",
      email: response.user?.email || "",
      role: (response.user?.role as "user" | "premium" | "admin") || "user",
      isActive: response.user?.isActive || true,
    };

    set({
      user: userData,
      token: response.token,
      isAuthenticated: true,
      isActive: userData.isActive,
      loading: false,
    });
  },
}));
