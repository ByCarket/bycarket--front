"use client";

import { useState } from "react";
import { VehicleResponse } from "@/services/vehicle.service";
import { generateVehicleDescription } from "@/services/vehicle.service";
import { FaMagic } from "react-icons/fa";

interface PostsFormProps {
  vehicle: VehicleResponse;
  onSubmit: (vehicleId: string, description?: string) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function PostsForm({
  vehicle,
  onSubmit,
  onCancel,
  loading = false,
}: PostsFormProps) {
  const [description, setDescription] = useState<string>(
    vehicle.description || ""
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(vehicle.id, description);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleGenerateDescription = async () => {
    try {
      if (!vehicle?.brand?.name || !vehicle?.model?.name) {
        console.error('Datos incompletos para generar descripción');
        return;
      }
      
      setIsGenerating(true);
      const generatedDesc = await generateVehicleDescription({
        brand: vehicle.brand.name,
        model: vehicle.model.name,
        version: vehicle.version?.name,
        year: vehicle.year,
        price: vehicle.price,
        mileage: vehicle.mileage,
        condition: vehicle.condition,
        typeOfVehicle: vehicle.typeOfVehicle,
      });
      
      if (generatedDesc) {
        setDescription(generatedDesc);
      }
    } catch (error) {
      console.error("Error en generación de descripción:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-principal-blue">
            Publicar vehículo
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 bg-principal-blue/5 p-4 rounded-xl">
            <h3 className="font-medium text-principal-blue mb-4">
              Detalles del vehículo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {vehicle.images && vehicle.images.length > 0 ? (
                  <div className="rounded-xl overflow-hidden shadow-md">
                    <img
                      src={vehicle.images[0].secure_url}
                      alt={`${vehicle.brand.name} ${vehicle.model.name}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-200 h-48 rounded-xl grid place-items-center">
                    <p className="text-gray-500">Sin imagen</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-lg text-principal-blue mb-2">
                  {vehicle.brand.name} {vehicle.model.name}
                </h4>

                {vehicle.version && (
                  <p className="text-secondary-blue mb-2">
                    {vehicle.version.name}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-principal-blue/10 text-principal-blue px-2 py-1 rounded-full text-xs">
                    {vehicle.typeOfVehicle}
                  </span>
                  <span className="bg-secondary-blue/10 text-secondary-blue px-2 py-1 rounded-full text-xs">
                    {vehicle.condition}
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {vehicle.year}
                  </span>
                </div>

                <p className="font-bold text-xl mb-2 text-principal-blue">
                  {vehicle.currency} {vehicle.price.toLocaleString()}
                </p>

                <p className="text-gray-600 text-sm">
                  {vehicle.mileage.toLocaleString()} km
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="description"
                  className="block text-principal-blue font-medium"
                >
                  Descripción (opcional)
                </label>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating || loading}
                  className="text-sm flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-secondary-blue/10 to-principal-blue/5 text-principal-blue rounded-lg hover:from-secondary-blue/20 hover:to-principal-blue/10 transition-all disabled:opacity-50 border border-secondary-blue/20"
                >
                  {isGenerating ? (
                    "Generando..."
                  ) : (
                    <>
                      <FaMagic className="text-secondary-blue" />
                      <span>Generar con IA</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal-blue focus:border-principal-blue min-h-[120px]"
                placeholder="Añade una descripción personalizada para esta publicación"
              />
              <p className="text-gray-500 text-sm mt-1">
                Puedes dejar este campo vacío para usar la descripción original
                del vehículo.
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-principal-blue text-white rounded-lg hover:bg-principal-blue/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Publicando...
                  </>
                ) : (
                  "Publicar vehículo"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
