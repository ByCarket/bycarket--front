"use client";

import { useState, useEffect } from "react";
import {
  getUserData,
  updateUserData,
  UserData,
  UpdateUserData,
  uploadUserProfileImage,
  deleteUserAccount,
} from "@/services/api.service";
import { useAuthStore } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { removeAuthToken } from "@/services/storage.service";

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const { isAuthenticated, token } = useAuthStore();
  const router = useRouter();

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await getUserData();
      if (!response || !response.data) {
        throw new Error("Respuesta inválida del servidor");
      }

      const formattedData = {
        ...response.data,
        phone: response.data.phone || undefined,
        country: response.data.country || undefined,
        city: response.data.city || undefined,
        address: response.data.address || undefined,
        image:
          response.data.image &&
          typeof response.data.image === "object" &&
          response.data.image.secure_url
            ? response.data.image.secure_url
            : typeof response.data.image === "string"
            ? response.data.image
            : undefined,
      };
      setUserData(formattedData);
    } catch (error) {
      setError("Error al obtener datos del usuario");
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchUserData();
    } else {
      setUserData(null);
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const updateUser = async (data: UpdateUserData) => {
    if (!isAuthenticated || !token)
      return { success: false, error: "No autenticado" };

    setUpdating(true);
    setError(null);

    try {
      const response = await updateUserData(data);
      if (!response || !response.data) {
        throw new Error("Respuesta inválida del servidor");
      }

      const formattedData = {
        ...response.data,
        phone: response.data.phone || undefined,
        country: response.data.country || undefined,
        city: response.data.city || undefined,
        address: response.data.address || undefined,
        image:
          response.data.image &&
          typeof response.data.image === "object" &&
          response.data.image.secure_url
            ? response.data.image.secure_url
            : typeof response.data.image === "string"
            ? response.data.image
            : undefined,
      };
      setUserData(formattedData);
      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error.message || "Error al actualizar datos del usuario";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setUpdating(false);
    }
  };

  const uploadProfileImage = async (file: File) => {
    if (!isAuthenticated || !token) {
      return { success: false, error: "No autenticado" };
    }

    setUpdating(true);
    setError(null);

    try {
      const response = await uploadUserProfileImage(file);
      if (!response || !response.data) {
        throw new Error("Respuesta inválida del servidor");
      }

      setUserData((prev) =>
        prev ? { ...prev, image: response.data.image } : null
      );

      await fetchUserData();
      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error.message || "Error al subir la imagen de perfil";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setUpdating(false);
    }
  };

  const refetch = () => {
    if (isAuthenticated && token) {
      fetchUserData();
    }
  };

  const deleteAccount = async () => {
    if (!isAuthenticated || !token)
      return { success: false, error: "No autenticado" };

    setDeleting(true);
    setError(null);

    try {
      await deleteUserAccount();
      removeAuthToken();
      router.push("/login");
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || "Error al eliminar la cuenta";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setDeleting(false);
    }
  };

  return {
    userData,
    loading,
    error,
    updating,
    deleting,
    updateUser,
    deleteAccount,
    refetch,
    uploadProfileImage,
  };
};
