"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getPosts,
  getMyPosts,
  deletePost,
  getPostById,
  PostResponse,
  GetPostsResponse,
  createPost as createPostService,
} from "@/services/vehicle.service";

export type FilterState = {
  search?: string;
  brand?: string[];
  model?: string[];
  typeOfVehicle?: string[];
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  sort?: string;
  [key: string]: string | string[] | number | undefined;
};

export const useFetchPosts = (
  initialPage = 1,
  initialLimit = 10,
  initialFilters: FilterState = {},
  fetchUserPostsOnly = false
) => {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const fetchPostsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (fetchUserPostsOnly) {
        const response = await getMyPosts();
        const postsData = Array.isArray(response)
          ? response
          : response?.data || [];
        setPosts(postsData);
        setTotalItems(postsData.length);
        setTotalPages(1);
      } else {
        const response = await getPosts(currentPage, initialLimit, filters);
        const postsData = response.data || response.vehicles || [];
        setPosts(postsData);
        setTotalItems(
          response.total || response.totalItems || postsData.length || 0
        );
        setTotalPages(response.totalPages || 1);
      }
    } catch (err) {
      setPosts([]);
      setTotalItems(0);
      setTotalPages(1);
      setError("Error al cargar las publicaciones");
    } finally {
      setLoading(false);
    }
  }, [currentPage, initialLimit, filters, fetchUserPostsOnly]);

  useEffect(() => {
    fetchPostsData();
  }, [fetchPostsData]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const removePost = async (postId: string) => {
    try {
      setLoading(true);
      await deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      return true;
    } catch (err) {
      setError("Error al eliminar la publicación");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: FilterState) => {
    const cleanFilters: FilterState = {};

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        cleanFilters[key as keyof FilterState] = value;
      }
    });

    setFilters(cleanFilters);
    setCurrentPage(1);
  };

  const createNewPost = async (data: {
    vehicleId: string;
    description?: string;
  }) => {
    try {
      setLoading(true);
      const response = await createPostService(
        data.vehicleId,
        data.description
      );
      if (!response) {
        throw new Error("No se recibió respuesta del servidor");
      }
      await fetchPostsData();
      return { success: true, data: response };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { success: false, error: err.message };
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        return {
          success: false,
          error:
            axiosError.response?.data?.message ||
            "Error al crear la publicación",
        };
      }
      return {
        success: false,
        error: "Error desconocido al crear la publicación",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    handlePageChange,
    deletePost: removePost,
    createPost: createNewPost,
    setFilters: updateFilters,
    currentFilters: filters,
    refetch: fetchPostsData,
  };
};
