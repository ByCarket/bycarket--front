"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserVehicles, VehicleResponse } from "@/services/vehicle.service";

export const useFetchVehicles = (initialPage = 1, initialLimit = 10) => {
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchVehiclesData = useCallback(async () => {
    const userVehicles = await getUserVehicles();
    setVehicles(userVehicles);
    setTotalItems(userVehicles.length);
    setTotalPages(1);
  }, []);

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
    loading: false,
    currentPage,
    totalPages,
    totalItems,
    handlePageChange,
    refetch: fetchVehiclesData,
  };
};
