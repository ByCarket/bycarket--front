"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, VehicleSearchParams } from "./useSearchParams";
import {
  GetPostsResponse,
  PostResponse,
  getPosts,
} from "@/services/vehicle.service";

export interface UseVehicleSearchResult {
  isLoading: boolean;
  error: Error | null;
  posts: PostResponse[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  refetch: () => Promise<void>;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const useVehicleSearch = (): UseVehicleSearchResult => {
  const { params } = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<GetPostsResponse | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const page = params.page || 1;
      const limit = params.limit || 9;

      const filters: Record<string, any> = Object.entries({
        brandId: params.brandId,
        modelId: params.modelId,
        versionId: params.versionId,
        typeOfVehicle: params.typeOfVehicle,
        condition: params.condition,
        currency: params.currency,
        search: params.search,
        minYear: params.minYear,
        maxYear: params.maxYear,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        minMileage: params.minMileage,
        maxMileage: params.maxMileage,
        orderBy: params.orderBy,
        order: params.order,
      }).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      const response = await getPosts(page, limit, filters);
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Error al obtener los vehículos")
      );
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    isLoading,
    error,
    posts: data?.data || [],
    totalPages: data?.totalPages || 0,
    totalItems: data?.total || 0,
    currentPage: data?.page || 1,
    refetch: fetchPosts,
    hasNextPage: (data?.page || 1) < (data?.totalPages || 0),
    hasPrevPage: (data?.page || 1) > 1,
  };
};

export default useVehicleSearch;
