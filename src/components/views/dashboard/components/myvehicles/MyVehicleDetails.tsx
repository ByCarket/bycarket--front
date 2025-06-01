"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FiX,
  FiEdit3,
  FiSave,
  FiTrash2,
  FiUpload,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiDollarSign,
  FiActivity,
  FiTruck,
  FiInfo,
} from "react-icons/fi";
import {
  VehicleResponse,
  updateVehicle,
  uploadVehicleImages,
  deleteVehicleImage,
  getVehicleById,
} from "@/services/vehicle.service";
import { showConfirm, showSuccess, showError } from "@/app/utils/Notifications";
import { useVehiclesStore } from "@/context/VehiclesContext";
import { useSpinner } from "@/context/SpinnerContext";

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
  const { setLoading } = useSpinner();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

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
    setLoading(true);
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

        const refreshedVehicle = await getVehicleById(vehicle.id);

        setVehicle(refreshedVehicle);
        setNewImages([]);
        setIsUploading(false);
        onUpdate(refreshedVehicle);
      } else {
        onUpdate(updatedVehicle);
      }

      setIsEditing(false);
      showSuccess("Los cambios fueron guardados correctamente");
      onClose();
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      showError("Error al guardar los cambios. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const removeVehicle = useVehiclesStore((state) => state.removeVehicle);

  const handleDelete = () => {
    showConfirm("¿Estás seguro de eliminar este vehículo?", async () => {
      setLoading(true);
      try {
        const success = await removeVehicle(vehicle.id);
        if (success) {
          showSuccess("Vehículo eliminado correctamente");
          onClose();
        }
      } catch (error) {
        showError("Error al eliminar el vehículo");
      } finally {
        setLoading(false);
      }
    });
  };

  const handleImageDelete = (publicId: string) => {
    showConfirm("¿Estás seguro de eliminar esta imagen?", async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-[#103663] to-[#4a77a8] px-8 py-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                {isEditing ? "Editando vehículo" : vehicleName}
              </h2>
              <p className="text-blue-100 opacity-90">
                {isEditing
                  ? "Modifica los detalles de tu vehículo"
                  : "Detalles del vehículo"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 bg-gray-50 flex flex-col">
              <div className="relative flex-1 rounded-xl overflow-hidden bg-white shadow-lg group">
                <Image
                  src={currentImage}
                  alt={vehicleName}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <FiChevronLeft className="h-5 w-5 text-[#103663]" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <FiChevronRight className="h-5 w-5 text-[#103663]" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            idx === currentImageIndex
                              ? "bg-[#103663] scale-125"
                              : "bg-white/60 hover:bg-white/80"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-6 flex overflow-x-auto gap-3 pb-2">
                  {images.map((img, idx) => (
                    <div
                      key={img.public_id}
                      className={`relative w-20 h-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg transition-all duration-200 ${
                        idx === currentImageIndex
                          ? "ring-3 ring-[#103663] scale-105"
                          : "hover:scale-105 opacity-70 hover:opacity-100"
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
                      {isEditing && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageDelete(img.public_id);
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <FiX className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {isEditing && (
                <div className="mt-6">
                  <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-[#4a77a8] rounded-xl cursor-pointer hover:bg-blue-50 transition-colors group">
                    <div className="text-center">
                      <FiUpload className="h-8 w-8 text-[#4a77a8] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[#4a77a8] font-medium">
                        Subir nuevas imágenes
                      </span>
                    </div>
                    <input
                      type="file"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                  {isUploading && (
                    <div className="mt-3 flex items-center gap-2 text-[#4a77a8]">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#4a77a8] border-t-transparent"></div>
                      <span className="text-sm">Subiendo imágenes...</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-8 overflow-y-auto">
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-[#103663]">
                        <FiTruck className="h-4 w-4" />
                        Marca
                      </label>
                      <input
                        type="text"
                        name="brand.name"
                        value={vehicle.brand.name}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#4a77a8] focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-[#103663]">
                        <FiTruck className="h-4 w-4" />
                        Modelo
                      </label>
                      <input
                        type="text"
                        name="model.name"
                        value={vehicle.model.name}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#4a77a8] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-[#103663]">
                        <FiInfo className="h-4 w-4" />
                        Versión
                      </label>
                      <input
                        type="text"
                        name="version.name"
                        value={vehicle.version?.name || ""}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#4a77a8] focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-[#103663]">
                        <FiCalendar className="h-4 w-4" />
                        Año
                      </label>
                      <input
                        type="number"
                        name="year"
                        value={vehicle.year}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#4a77a8] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-[#103663]">
                        <FiDollarSign className="h-4 w-4" />
                        Precio
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={vehicle.price}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#4a77a8] focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-[#103663]">
                        <FiDollarSign className="h-4 w-4" />
                        Moneda
                      </label>
                      <select
                        name="currency"
                        value={vehicle.currency}
                        onChange={handleSelectChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#4a77a8] focus:outline-none transition-colors"
                      >
                        <option value="U$D">USD</option>
                        <option value="AR$">ARS</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-[#103663]">
                        <FiActivity className="h-4 w-4" />
                        Kilometraje
                      </label>
                      <input
                        type="number"
                        name="mileage"
                        value={vehicle.mileage}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#4a77a8] focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-[#103663]">
                        <FiTruck className="h-4 w-4" />
                        Tipo de vehículo
                      </label>
                      <select
                        name="typeOfVehicle"
                        value={vehicle.typeOfVehicle}
                        onChange={handleSelectChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#4a77a8] focus:outline-none transition-colors"
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
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#103663]">
                      <FiInfo className="h-4 w-4" />
                      Condición
                    </label>
                    <select
                      name="condition"
                      value={vehicle.condition}
                      onChange={handleSelectChange}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#4a77a8] focus:outline-none transition-colors"
                    >
                      <option value="new">Nuevo</option>
                      <option value="used">Usado</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#103663]">
                      <FiInfo className="h-4 w-4" />
                      Descripción
                    </label>
                    <textarea
                      name="description"
                      value={vehicle.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#4a77a8] focus:outline-none transition-colors resize-none"
                      placeholder="Describe las características especiales de tu vehículo..."
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-gradient-to-r from-[#103663] to-[#4a77a8] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      {vehicle.typeOfVehicle}
                    </span>
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                      {vehicle.condition === "new" ? "Nuevo" : "Usado"}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                      {vehicle.year}
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-[#103663] to-[#4a77a8] text-white p-6 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <FiDollarSign className="h-8 w-8" />
                      <div>
                        <p className="text-blue-100 text-sm">Precio</p>
                        <p className="text-4xl font-bold">
                          {vehicle.currency} {vehicle.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-100 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-[#103663] mb-6 flex items-center gap-2">
                      <FiInfo className="h-5 w-5" />
                      Información del vehículo
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <FiTruck className="h-4 w-4" />
                          Marca
                        </p>
                        <p className="font-semibold text-[#103663]">
                          {vehicle.brand.name}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <FiTruck className="h-4 w-4" />
                          Modelo
                        </p>
                        <p className="font-semibold text-[#103663]">
                          {vehicle.model.name}
                        </p>
                      </div>
                      {vehicle.version?.name && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <FiInfo className="h-4 w-4" />
                            Versión
                          </p>
                          <p className="font-semibold text-[#103663]">
                            {vehicle.version.name}
                          </p>
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <FiCalendar className="h-4 w-4" />
                          Año
                        </p>
                        <p className="font-semibold text-[#103663]">
                          {vehicle.year}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <FiActivity className="h-4 w-4" />
                          Kilometraje
                        </p>
                        <p className="font-semibold text-[#103663]">
                          {vehicle.mileage.toLocaleString()} km
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <FiInfo className="h-4 w-4" />
                          Condición
                        </p>
                        <p className="font-semibold text-[#103663]">
                          {vehicle.condition === "new" ? "Nuevo" : "Usado"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {vehicle.description && (
                    <div className="bg-gray-50 p-6 rounded-2xl">
                      <h3 className="font-bold text-[#103663] mb-3 flex items-center gap-2">
                        <FiInfo className="h-5 w-5" />
                        Descripción
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {vehicle.description}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 sticky bottom-0">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-wrap gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#103663] to-[#4a77a8] text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 font-medium"
                  >
                    <FiSave className="h-4 w-4" />
                    Guardar cambios
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-6 py-2 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                  >
                    <FiX className="h-4 w-4" />
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#103663] to-[#4a77a8] text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
                >
                  <FiEdit3 className="h-4 w-4" />
                  Editar vehículo
                </button>
              )}
            </div>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all duration-200 font-medium"
            >
              <FiTrash2 className="h-4 w-4" />
              {isDeleting ? "Eliminando..." : "Eliminar vehículo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
