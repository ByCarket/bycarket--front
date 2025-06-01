"use client";

import { useState } from "react";
import { useAuthStore } from "@/context/AuthContext";
import Image from "next/image";
import { PostResponse } from "@/services/vehicle.service";
import {
  FiX,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiDollarSign,
  FiActivity,
  FiTruck,
  FiInfo,
  FiTag,
} from "react-icons/fi";

type PostsDetailProps = {
  post: PostResponse;
  onClose: () => void;
  onDelete?: (id: string) => Promise<boolean>;
};

export default function PostsDetail({
  post,
  onClose,
  onDelete,
}: PostsDetailProps) {
  const { user } = useAuthStore();
  const isPremiumUser = user?.role === "premium" || user?.role === "admin";
  const isAdminUser = user?.role === "admin";
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const vehicle = post.vehicle;
  const images = vehicle.images || [];
  const currentImage =
    images.length > 0
      ? images[currentImageIndex].secure_url
      : "/images/default-car.png";

  const vehicleName = `${vehicle.brand.name} ${vehicle.model.name} ${
    vehicle.version?.name || ""
  }`;
  const formattedDate = new Date(post.postDate).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const statusColors: Record<string, string> = {
    published: "bg-green-100 text-green-800",
    active: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
    sold: "bg-red-100 text-red-800",
    inactive: "bg-gray-100 text-gray-800",
    default: "bg-blue-100 text-blue-800",
  };

  const statusText: Record<string, string> = {
    published: "Publicado",
    active: "Activo",
    draft: "Borrador",
    sold: "Vendido",
    inactive: "Inactivo",
    default: post.status,
  };

  const statusClass =
    statusColors[post.status.toLowerCase()] || statusColors.default;
  const statusLabel =
    statusText[post.status.toLowerCase()] || statusText.default;

  const handleDelete = async () => {
    if (!onDelete) return;

    if (confirm("¿Estás seguro de eliminar esta publicación?")) {
      setIsDeleting(true);
      const success = await onDelete(post.id);
      if (success) {
        onClose();
      } else {
        setIsDeleting(false);
      }
    }
  };

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
              <h2 className="text-2xl font-bold">{vehicleName}</h2>
              <p className="text-blue-100 opacity-90">
                Detalles de la publicación
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

        <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(95vh-120px)]">
          <div className="p-8 bg-gray-50 flex flex-col">
            <div className="relative flex-1 rounded-xl overflow-hidden bg-white shadow-lg group">
              <Image
                src={currentImage}
                alt={vehicleName}
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
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
                {images.map((image, index) => (
                  <div
                    key={image.public_id}
                    className={`relative w-20 h-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg transition-all duration-200 ${
                      index === currentImageIndex
                        ? "ring-3 ring-[#103663] scale-105"
                        : "hover:scale-105 opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image.secure_url}
                      alt={`${vehicleName} - Imagen ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-8 overflow-y-auto">
            <div className="space-y-8">
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
                  <FiTruck className="h-5 w-5" />
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
                  {vehicle.version && (
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
                    <p className="font-semibold text-[#103663] capitalize">
                      {vehicle.condition}
                    </p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <FiTag className="h-4 w-4" />
                      Tipo de vehículo
                    </p>
                    <p className="font-semibold text-[#103663]">
                      {vehicle.typeOfVehicle}
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

              <div className="bg-white border-2 border-gray-100 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-[#103663] mb-6 flex items-center gap-2">
                  <FiCalendar className="h-5 w-5" />
                  Información del post
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <FiCalendar className="h-4 w-4" />
                      Fecha de publicación
                    </p>
                    <p className="font-semibold text-[#103663]">
                      {formattedDate}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <FiTag className="h-4 w-4" />
                      Estado
                    </p>
                    <span
                      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${statusClass}`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isAdminUser && (
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                <FiX className="h-4 w-4" />
                Volver
              </button>
              {onDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all duration-200 font-medium"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="h-4 w-4" />
                      Eliminar publicación
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
