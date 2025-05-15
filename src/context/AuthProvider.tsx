"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "./AuthContext";

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const initializeAuth = useAuthStore((state) => state.initializeAuth);
	const loading = useAuthStore((state) => state.loading);

	useEffect(() => {
		initializeAuth();
	}, [initializeAuth]);

	if (loading) {
		return <div>Loading...</div>;
	}

	return <>{children}</>;
};