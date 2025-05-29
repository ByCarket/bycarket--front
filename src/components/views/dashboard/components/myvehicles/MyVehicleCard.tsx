"use client";

import { useState } from "react";
import Image from "next/image";
import { VehicleResponse } from "@/services/vehicle.service";
import { showConfirm, showSuccess, showError } from "@/app/utils/Notifications";
import { useVehiclesStore } from "@/context/VehiclesContext";

interface MyVehicleCardProps {
  vehicle: VehicleResponse;
  onView?: (vehicle: VehicleResponse) => void;
  onDelete?: (id: string) => Promise<boolean>;
}

export default function MyVehicleCard({ vehicle, onView, onDelete }: MyVehicleCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const removeVehicle = useVehiclesStore((state) => state.removeVehicle);
  const fetchUserVehicles = useVehiclesStore((state) => state.fetchUserVehicles);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    showConfirm(
      "¿Estás seguro de eliminar este vehículo?",
      async () => {
        setIsDeleting(true);
        try {
          let success;
          if (onDelete) {
            success = await onDelete(vehicle.id);
          } else {
            success = await removeVehicle(vehicle.id);
            if (success) await fetchUserVehicles();
          }
          if (success) {
            showSuccess("Vehículo eliminado correctamente");
          }
        } catch (error) {
          showError("Error al eliminar el vehículo");
        } finally {
          setIsDeleting(false);
        }
      }
    );
  };

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onView) onView(vehicle);
  };

  const mainImage =
    vehicle.images && vehicle.images.length > 0
      ? vehicle.images[0].secure_url
      : "/placeholder-vehicle.jpg";
  const vehicleName = `${vehicle.brand.name} ${vehicle.model.name}`;

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
      onClick={handleView}
    >
      <div className="relative w-full h-48">
        <img
          src={mainImage}
          alt={vehicleName}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {vehicle.typeOfVehicle}
          </span>
          {vehicle.condition === "Nuevo" ? (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              {vehicle.condition}
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {vehicle.condition}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-principal-blue line-clamp-1">
          {vehicleName}
        </h3>

        <p className="text-gray-600 mt-1 text-sm">
          {vehicle.year} | {vehicle.mileage.toLocaleString()} km |{" "}
          {vehicle.condition}
        </p>

        <p className="text-principal-blue font-semibold mt-2">
          {vehicle.currency} {vehicle.price.toLocaleString()}
        </p>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={handleView}
            className="px-3 py-1 bg-secondary-blue text-white text-sm rounded hover:bg-principal-blue transition-colors"
          >
            Ver detalle
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1 text-sm rounded transition-colors bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 flex items-center"
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Eliminando
              </>
            ) : (
              "Eliminar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
