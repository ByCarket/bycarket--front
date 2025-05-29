"use client";

import { useState } from "react";
import Image from "next/image";
import {
  VehicleResponse,
  updateVehicle,
  uploadVehicleImages,
  deleteVehicleImage,
} from "@/services/vehicle.service";
import { showConfirm, showSuccess, showError } from "@/app/utils/Notifications";
import { useVehiclesStore } from "@/context/VehiclesContext";

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
      showSuccess("Los cambios fueron guardados correctamente");
    } catch (error) {
      showError("Error al guardar los cambios");
    }
  };

  const removeVehicle = useVehiclesStore((state) => state.removeVehicle);

  const handleDelete = async () => {
    showConfirm(
      "¿Estás seguro de eliminar este vehículo?",
      async () => {
        setIsDeleting(true);
        try {
          const success = await removeVehicle(vehicle.id);
          if (success) {
            showSuccess("Vehículo eliminado correctamente");
            onClose();
          }
        } catch (error) {
          showError("Error al eliminar el vehículo");
          setIsDeleting(false);
        }
      },
      () => {}
    );
  };

  const handleImageDelete = async (publicId: string) => {
    showConfirm("¿Estás seguro de eliminar esta imagen?", async () => {
      try {
        await deleteVehicleImage(vehicle.id, publicId);
        setVehicle((prev) => ({
          ...prev,
          images:
            prev.images?.filter((img) => img.public_id !== publicId) || [],
        }));
        showSuccess("La imagen fue eliminada correctamente");
      } catch (error) {
        showError("Error al eliminar la imagen");
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = vehicle.images || [];
  const currentImage =
    images.length > 0
      ? images[currentImageIndex].secure_url
      : "/placeholder-vehicle.jpg";
  const vehicleName = `${vehicle.brand.name} ${vehicle.model.name}${
    vehicle.version?.name ? ` ${vehicle.version.name}` : ""
  }`;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 md:p-6 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-principal-blue">
            {isEditing ? "Editando vehículo" : vehicleName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          <div>
            <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
              <Image
                src={currentImage}
                alt={vehicleName}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex overflow-x-auto gap-2 pb-2">
                {images.map((img, idx) => (
                  <div
                    key={img.public_id}
                    className={`relative w-20 h-20 flex-shrink-0 cursor-pointer overflow-hidden rounded border-2 ${
                      idx === currentImageIndex
                        ? "border-secondary-blue"
                        : "border-transparent"
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
                  >
                    <Image
                      src={img.secure_url}
                      alt={`${vehicleName} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}
            {isEditing && (
              <div className="mt-4">
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
                <div className="md:col-span-2">
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
                  <h3 className="text-lg font-medium text-principal-blue mb-4">
                    Información del vehículo
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Marca</p>
                      <p className="font-medium">{vehicle.brand.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Modelo</p>
                      <p className="font-medium">{vehicle.model.name}</p>
                    </div>
                    {vehicle.version?.name && (
                      <div>
                        <p className="text-sm text-gray-500">Versión</p>
                        <p className="font-medium">{vehicle.version.name}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Año</p>
                      <p className="font-medium">{vehicle.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Kilometraje</p>
                      <p className="font-medium">
                        {vehicle.mileage.toLocaleString()} km
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Condición</p>
                      <p className="font-medium">{vehicle.condition}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tipo de vehículo</p>
                      <p className="font-medium">{vehicle.typeOfVehicle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Precio</p>
                      <p className="font-medium">
                        {vehicle.currency} {vehicle.price.toLocaleString()}
                      </p>
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
  );
}
