"use client";

import { useState, useEffect } from "react";
import {
  VehicleResponse,
  updateVehicle,
  deleteVehicle,
  uploadVehicleImages,
  deleteVehicleImage,
} from "@/services/vehicle.service";
import { useRouter } from "next/navigation";

export default function MyVehicleDetails({
  vehicle: initialVehicle,
  onClose,
  onUpdate,
}: {
  vehicle: VehicleResponse;
  onClose: () => void;
  onUpdate: (updatedVehicle: VehicleResponse) => void;
}) {
  const [vehicle, setVehicle] = useState(initialVehicle);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedVehicle = await updateVehicle(vehicle.id, {
        brandId: vehicle.brand.id,
        modelId: vehicle.model.id,
        versionId: vehicle.version?.id,
        year: vehicle.year,
        price: vehicle.price,
        currency: vehicle.currency,
        mileage: vehicle.mileage,
        typeOfVehicle: vehicle.typeOfVehicle,
        condition: vehicle.condition,
        description: vehicle.description,
      });

      if (newImages.length > 0) {
        setIsUploading(true);
        await uploadVehicleImages(vehicle.id, newImages);
        setIsUploading(false);
      }

      onUpdate(updatedVehicle);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de eliminar este vehículo?")) {
      setIsDeleting(true);
      try {
        await deleteVehicle(vehicle.id);
        onClose();
        router.refresh();
      } catch (error) {
        setIsDeleting(false);
      }
    }
  };

  const handleImageDelete = async (publicId: string) => {
    if (confirm("¿Eliminar esta imagen?")) {
      try {
        await deleteVehicleImage(vehicle.id, publicId);
        setVehicle((prev) => ({
          ...prev,
          images:
            prev.images?.filter((img) => img.public_id !== publicId) || [],
        }));
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const mainImage =
    vehicle.images?.[0]?.secure_url || "/placeholder-vehicle.jpg";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-principal-blue">
            {isEditing ? "Editando vehículo" : "Detalles del vehículo"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="rounded-xl overflow-hidden shadow-md mb-4">
                <img
                  src={mainImage}
                  alt={`${vehicle.brand.name} ${vehicle.model.name}`}
                  className="w-full h-64 object-cover"
                />
              </div>

              {isEditing && (
                <div className="mb-4">
                  <input
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                    className="w-full p-2 border rounded"
                    accept="image/*"
                  />
                  {isUploading && (
                    <p className="text-sm text-gray-500 mt-2">
                      Subiendo imágenes...
                    </p>
                  )}
                </div>
              )}

              {vehicle.images && vehicle.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {vehicle.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.secure_url}
                        alt={`${vehicle.brand.name} ${vehicle.model.name} ${
                          index + 1
                        }`}
                        className="h-20 w-full object-cover rounded"
                      />
                      {isEditing && (
                        <button
                          onClick={() => handleImageDelete(image.public_id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
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
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marca
                    </label>
                    <input
                      type="text"
                      name="brand.name"
                      value={vehicle.brand.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modelo
                    </label>
                    <input
                      type="text"
                      name="model.name"
                      value={vehicle.model.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Versión
                    </label>
                    <input
                      type="text"
                      name="version.name"
                      value={vehicle.version?.name || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Año
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={vehicle.year}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={vehicle.price}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Moneda
                    </label>
                    <select
                      name="currency"
                      value={vehicle.currency}
                      onChange={handleSelectChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="USD">USD</option>
                      <option value="ARS">ARS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kilometraje
                    </label>
                    <input
                      type="number"
                      name="mileage"
                      value={vehicle.mileage}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de vehículo
                    </label>
                    <select
                      name="typeOfVehicle"
                      value={vehicle.typeOfVehicle}
                      onChange={handleSelectChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="SUV">SUV</option>
                      <option value="PICKUP">Pickup</option>
                      <option value="MINIVAN">Minivan</option>
                      <option value="LIGHT_TRUCK">Camioneta</option>
                      <option value="COUPE">Coupé</option>
                      <option value="HATCHBACK">Hatchback</option>
                      <option value="FURGON">Furgón</option>
                      <option value="SEDAN">Sedán</option>
                      <option value="VAN">Van</option>
                      <option value="RURAL">Rural</option>
                      <option value="CABRIOLET">Cabriolet</option>
                      <option value="SPORTSCAR">Deportivo</option>
                      <option value="ROADSTER">Roadster</option>
                      <option value="ELECTRIC">Eléctrico</option>
                      <option value="HYBRID">Híbrido</option>
                      <option value="LUXURY">Lujo</option>
                      <option value="OFF_ROAD">Todo terreno</option>
                      <option value="PICKUP_TRUCK">Camioneta pickup</option>
                      <option value="CROSSOVER">Crossover</option>
                      <option value="COMPACT">Compacto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condición
                    </label>
                    <select
                      name="condition"
                      value={vehicle.condition}
                      onChange={handleSelectChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="nuevo">Nuevo</option>
                      <option value="usado">Usado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      name="description"
                      value={vehicle.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-bold text-principal-blue">
                      {vehicle.brand.name} {vehicle.model.name}
                    </h1>
                  </div>

                  {vehicle.version?.name && (
                    <p className="text-secondary-blue mb-4">
                      {vehicle.version.name}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="bg-principal-blue/10 text-principal-blue px-3 py-1 rounded-full text-sm">
                      {vehicle.typeOfVehicle}
                    </span>
                    <span className="bg-secondary-blue/10 text-secondary-blue px-3 py-1 rounded-full text-sm">
                      {vehicle.condition}
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                      {vehicle.year}
                    </span>
                  </div>

                  <p className="text-3xl font-bold mb-6 text-principal-blue">
                    {vehicle.currency} {vehicle.price.toLocaleString()}
                  </p>

                  <div className="mb-6 bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-medium text-principal-blue mb-2">
                      Detalles
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500 text-sm">Kilometraje</p>
                        <p className="font-medium">
                          {vehicle.mileage.toLocaleString()} km
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Año</p>
                        <p className="font-medium">{vehicle.year}</p>
                      </div>
                    </div>
                  </div>

                  {vehicle.description && (
                    <div className="mb-6">
                      <h3 className="font-medium text-principal-blue mb-2">
                        Descripción
                      </h3>
                      <p className="text-gray-700">{vehicle.description}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={isUploading}
                        className="px-6 py-2 bg-principal-blue text-white rounded-lg hover:bg-principal-blue/90 transition-colors disabled:opacity-50"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-principal-blue text-white rounded-lg hover:bg-principal-blue/90 transition-colors"
                    >
                      Editar
                    </button>
                  )}
                </div>

                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  {isDeleting ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
