"use client";

import { useState } from "react";
import { VehicleResponse } from "@/services/vehicle.service";
import MyVehicleLists from "./myvehicles/MyVehicleLists";
import MyVehicleDetails from "./myvehicles/MyVehicleDetails";
import { useRouter } from "next/navigation";
import { useVehicles } from "@/hooks/useVehicles";

export default function VehiclesContent() {
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { vehicles, loading, deleteVehicle, refetch } = useVehicles();
  const router = useRouter();

  const handleViewDetails = (vehicle: VehicleResponse) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleDeleteVehicle = async (id: string): Promise<boolean> => {
    try {
      const success = await deleteVehicle(id);
      if (success && selectedVehicle?.id === id) {
        setSelectedVehicle(null);
      }
      return success;
    } catch (error) {
      return false;
    }
  };

  const handleUpdateVehicle = (updatedVehicle: VehicleResponse) => {
    setSelectedVehicle(updatedVehicle);
  };

  const handleAddVehicle = () => {
    router.push("/dashboard?tab=register-vehicle");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-principal-blue">
          Mis vehículos
        </h1>
        <button
          onClick={handleAddVehicle}
          className="px-4 py-2 bg-principal-blue text-white rounded-md hover:bg-principal-blue/90 transition-colors"
        >
          Añadir vehículo
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No tienes vehículos registrados.</p>
          <button
            onClick={handleAddVehicle}
            className="mt-4 px-4 py-2 bg-principal-blue text-white rounded-md hover:bg-principal-blue/90 transition-colors"
          >
            Añadir tu primer vehículo
          </button>
        </div>
      ) : (
        <>
          <MyVehicleLists
            vehicles={vehicles}
            loading={loading}
            onView={handleViewDetails}
            onDelete={handleDeleteVehicle}
          />
          {isModalOpen && selectedVehicle && (
            <MyVehicleDetails
              vehicle={selectedVehicle}
              onClose={() => {
                setIsModalOpen(false);
                setTimeout(() => setSelectedVehicle(null), 300);
              }}
              onUpdate={handleUpdateVehicle}
            />
          )}
        </>
      )}
    </div>
  );
}
