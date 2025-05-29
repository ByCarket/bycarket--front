"use client";

import { useState } from "react";
import { useAuthStore } from "@/context/AuthContext";
import Image from "next/image";
import { PostResponse } from "@/services/vehicle.service";

type PostsDetailProps = {
  post: PostResponse;
  onClose: () => void;
  onDelete?: (id: string) => Promise<boolean>;
};

export default function PostsDetail({ post, onClose, onDelete }: PostsDetailProps) {
  const { user } = useAuthStore();
  const isPremiumUser = user?.role === "premium" || user?.role === "admin";
  const isAdminUser = user?.role === "admin";
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const vehicle = post.vehicle;
  const images = vehicle.images || [];
  const currentImage = images.length > 0 
    ? images[currentImageIndex].secure_url 
    : "/images/default-car.png";
  
  const vehicleName = `${vehicle.brand.name} ${vehicle.model.name} ${vehicle.version?.name || ""}`;
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
    default: "bg-blue-100 text-blue-800"
  };

  const statusText: Record<string, string> = {
    published: "Publicado",
    active: "Activo",
    draft: "Borrador",
    sold: "Vendido",
    inactive: "Inactivo",
    default: post.status
  };

  const statusClass = statusColors[post.status.toLowerCase()] || statusColors.default;
  const statusLabel = statusText[post.status.toLowerCase()] || statusText.default;

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

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 md:p-6 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-principal-blue">
            {vehicleName}
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
              />
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex overflow-x-auto gap-2 pb-2">
                {images.map((image, index) => (
                  <div
                    key={image.public_id}
                    className={`relative w-20 h-20 flex-shrink-0 cursor-pointer overflow-hidden rounded border-2 ${
                      index === currentImageIndex
                        ? "border-secondary-blue"
                        : "border-transparent"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image.secure_url}
                      alt={`${vehicleName} - Imagen ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-principal-blue">
                  Información del vehículo
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-500">Marca</p>
                    <p className="font-medium">{vehicle.brand.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Modelo</p>
                    <p className="font-medium">{vehicle.model.name}</p>
                  </div>
                  {vehicle.version && (
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
                    <p className="font-medium text-capitalize">
                      {vehicle.condition}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tipo de vehículo</p>
                    <p className="font-medium">{vehicle.typeOfVehicle}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Precio</p>
                    <p className="font-medium text-xl text-principal-blue">
                      {vehicle.currency} {vehicle.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-principal-blue">
                  Descripción
                </h3>
                <p className="mt-2 text-gray-700">{vehicle.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-principal-blue">
                  Información del post
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Fecha de publicación</p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Estado</p>
                  <p className="font-medium">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </p>
                </div>
              </div>

              {isAdminUser && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Volver
                    </button>
                    {onDelete && (
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className={`px-4 py-2 rounded-md text-white hover:opacity-90 transition-colors ${
                          isDeleting 
                            ? 'bg-gray-400' 
                            : post.status.toLowerCase() === 'inactive' 
                              ? 'bg-principal-blue' 
                              : 'bg-red-500'
                        }`}
                      >
                        {isDeleting ? (
                          <span className="flex items-center">
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
                            {post.status.toLowerCase() === 'inactive' ? 'Activando...' : 'Eliminando...'}
                          </span>
                        ) : post.status.toLowerCase() === 'inactive' ? (
                          'Activar publicación'
                        ) : (
                          'Eliminar publicación'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
