"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getVehicles,
  getUserVehicles,
  VehicleResponse,
  GetVehiclesResponse,
} from "@/services/vehicle.service";

export const useFetchVehicles = (
  initialPage = 1,
  initialLimit = 10,
  fetchUserVehiclesOnly = false
) => {
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchVehiclesData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (fetchUserVehiclesOnly) {
        const userVehicles = await getUserVehicles();
        setVehicles(userVehicles);
        setTotalItems(userVehicles.length);
        setTotalPages(1);
      } else {
        const data = await getVehicles(currentPage, initialLimit);
        setVehicles(data.vehicles);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);
        setCurrentPage(data.currentPage);
      }
    } catch (err) {
      setError("Error al cargar los vehículos");
    } finally {
      setLoading(false);
    }
  }, [currentPage, initialLimit, fetchUserVehiclesOnly]);

  useEffect(() => {
    fetchVehiclesData();
  }, [fetchVehiclesData]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    vehicles,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    handlePageChange,
    refetch: fetchVehiclesData,
  };
};
