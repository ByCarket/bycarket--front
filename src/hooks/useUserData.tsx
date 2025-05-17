"use client";

import { useState, useEffect } from "react";
import { getUserData, UserData } from "@/services/api.service";
import { useAuth } from "./useAuth";

export const useUserData = () => {
	const [userData, setUserData] = useState<UserData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const { isAuthenticated } = useAuth();

	const fetchUserData = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await getUserData();
			setUserData(response.data);
		} catch {
			setError("Error al obtener datos del usuario");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			fetchUserData();
		} else {
			setUserData(null);
			setLoading(false);
		}
	}, [isAuthenticated]);

	const refetch = () => {
		if (isAuthenticated) {
			fetchUserData();
		}
	};

	return { userData, loading, error, refetch };
};

// Ejemplo de uso:
// userData.phone, userData.email, etc