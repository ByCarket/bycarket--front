"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserVehicles, VehicleResponse } from "@/services/vehicle.service";

export const useFetchVehicles = () => {
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehiclesData = useCallback(async () => {
    try {
      setLoading(true);
      const vehs = await getUserVehicles();
      setVehicles(Array.isArray(vehs) ? vehs : []);
    } catch (error) {
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehiclesData();
  }, [fetchVehiclesData]);

  return {
    vehicles,
    loading,
    refetch: fetchVehiclesData,
  };
};
