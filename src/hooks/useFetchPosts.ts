import { useState, useEffect, useCallback } from "react";
import {
  getPosts,
  GetPostsResponse,
  PostResponse,
} from "@/services/vehicle.service";
import { FilterState } from "./useVehicleFilters";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export const useFetchPosts = (
  initialPage: number = 1,
  initialLimit: number = 10,
  filters: FilterState = {}
) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<FilterState>(filters);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", currentPage.toString());
    params.set("limit", initialLimit.toString());

    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          params.delete(key);
          value.forEach((val) => params.append(key, val.toString()));
        } else {
          params.set(key, value.toString());
        }
      } else {
        params.delete(key);
      }
    });

    router.replace(`${pathname}?${params.toString()}`);
  }, [
    pathname,
    router,
    searchParams,
    currentPage,
    initialLimit,
    currentFilters,
  ]);

  const fetchPostsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const normalizedFilters = { ...currentFilters };

      if (normalizedFilters.search === "") {
        delete normalizedFilters.search;
      }

      const response = await getPosts(
        currentPage,
        initialLimit,
        normalizedFilters
      );
      setPosts(response.data || []);
      setTotalItems(response.total || 0);
      setTotalPages(response.totalPages || 1);
    } catch (err: any) {
      setPosts([]);
      setTotalItems(0);
      setTotalPages(1);
      setError(null);
    } finally {
      setLoading(false);
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  }, [currentPage, initialLimit, currentFilters]);

  useEffect(() => {
    if (!isInitialLoad) {
      fetchPostsData();
      updateUrlParams();
    }
  }, [fetchPostsData, updateUrlParams, isInitialLoad]);

  useEffect(() => {
    fetchPostsData();
  }, []);

  useEffect(() => {
    if (
      Object.keys(filters).length > 0 ||
      Object.keys(currentFilters).length > 0
    ) {
      setCurrentFilters(filters);
      setCurrentPage(1);
    }
  }, [filters]);

  useEffect(() => {
    if (isInitialLoad) {
      const page = searchParams.get("page");
      if (page && !isNaN(Number(page))) {
        setCurrentPage(Number(page));
      }
    }
  }, [searchParams, isInitialLoad]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const setFilters = (newFilters: FilterState) => {
    const cleanFilters: FilterState = {};
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        cleanFilters[key as keyof FilterState] = value;
      }
    });

    setCurrentFilters(cleanFilters);
    setCurrentPage(1);
  };

  return {
    posts,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    handlePageChange,
    setFilters,
    currentFilters,
  };
};
