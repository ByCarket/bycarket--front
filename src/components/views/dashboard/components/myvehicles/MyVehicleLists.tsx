"use client";

import { useState } from "react";
import { VehicleResponse } from "@/services/vehicle.service";
import MyVehicleCard from "./MyVehicleCard";

interface MyVehicleListsProps {
  vehicles: VehicleResponse[];
  loading?: boolean;
  onDelete?: (id: string) => Promise<boolean>;
  onView?: (vehicle: VehicleResponse) => void;
  emptyMessage?: string;
}

export default function MyVehicleLists({
  vehicles,
  loading = false,
  onDelete,
  onView,
  emptyMessage = "No tienes vehículos registrados",
}: MyVehicleListsProps) {
  const [sortBy, setSortBy] = useState<string>("newest");

  if (loading) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue"></div>
        <p className="mt-4 text-secondary-blue font-medium">
          Cargando vehículos...
        </p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-secondary-blue/50 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
        <p className="text-gray-500 text-center max-w-md">{emptyMessage}</p>
      </div>
    );
  }

  const sortedVehicles = [...vehicles].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "price-high":
        return b.price - a.price;
      case "price-low":
        return a.price - b.price;
      case "year-new":
        return b.year - a.year;
      case "year-old":
        return a.year - b.year;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="text-sm text-gray-500">
          Mostrando {vehicles.length} vehículos
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-principal-blue focus:border-principal-blue"
        >
          <option value="newest">Más recientes</option>
          <option value="oldest">Más antiguos</option>
          <option value="price-high">Mayor precio</option>
          <option value="price-low">Menor precio</option>
          <option value="year-new">Año (más nuevo)</option>
          <option value="year-old">Año (más antiguo)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedVehicles.map((vehicle) => (
          <MyVehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onDelete={onDelete}
            onView={onView}
          />
        ))}
      </div>
    </div>
  );
}
