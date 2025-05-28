"use client";

import { useState } from "react";
import { VehicleResponse } from "@/services/vehicle.service";
import MyVehicleLists from "./myvehicles/MyVehicleLists";
import MyVehicleDetails from "./myvehicles/MyVehicleDetails";
import { useRouter } from "next/navigation";
import { useFetchVehicles } from "@/hooks/useFetchVehicles";

export default function VehiclesContent() {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleResponse | null>(null);
  const { vehicles } = useFetchVehicles();
  const router = useRouter();

  const handleViewDetails = (vehicle: VehicleResponse) => {
    setSelectedVehicle(vehicle);
  };

  const handleDeleteVehicle = async (id: string): Promise<boolean> => {
    try {
      return true;
    } catch (error) {
      console.error("Error deleting vehicle:", error);
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

      <MyVehicleLists
        vehicles={vehicles}
        loading={false}
        onView={handleViewDetails}
        onDelete={handleDeleteVehicle}
      />

      {selectedVehicle && (
        <MyVehicleDetails
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onUpdate={handleUpdateVehicle}
        />
      )}
    </div>
  );
}
