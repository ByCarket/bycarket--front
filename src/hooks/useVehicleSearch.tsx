"use client";

import { useEffect, useState } from "react";
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
}

export const useVehicleSearch = (): UseVehicleSearchResult => {
  const { params } = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<GetPostsResponse | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const page = params.page || 1;
      const limit = params.limit || 10;
      const filters: Record<string, any> = {};

      if (params.brandId) filters.brandId = params.brandId;
      if (params.modelId) filters.modelId = params.modelId;
      if (params.versionId) filters.versionId = params.versionId;
      if (params.typeOfVehicle) filters.typeOfVehicle = params.typeOfVehicle;
      if (params.condition) filters.condition = params.condition;
      if (params.currency) filters.currency = params.currency;
      if (params.search) filters.search = params.search;
      if (params.minYear) filters.minYear = params.minYear;
      if (params.maxYear) filters.maxYear = params.maxYear;
      if (params.minPrice) filters.minPrice = params.minPrice;
      if (params.maxPrice) filters.maxPrice = params.maxPrice;
      if (params.minMileage) filters.minMileage = params.minMileage;
      if (params.maxMileage) filters.maxMileage = params.maxMileage;
      if (params.orderBy) filters.orderBy = params.orderBy;
      if (params.order) filters.order = params.order;

      const response = await getPosts(page, limit, filters);
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Error al obtener los vehículos")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [params]);

  return {
    isLoading,
    error,
    posts: data?.data || [],
    totalPages: data?.totalPages || 0,
    totalItems: data?.total || 0,
    currentPage: data?.page || 1,
    refetch: fetchPosts,
  };
};

export default useVehicleSearch;
