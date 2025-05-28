"use client";

import { useState } from "react";
import { PostResponse, VehicleResponse } from "@/services/vehicle.service";

interface PostsDetailProps {
  post: PostResponse;
  onClose: () => void;
  onDelete?: (id: string) => Promise<boolean>;
}

export default function PostsDetail({
  post,
  onClose,
  onDelete,
}: PostsDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const vehicle = post.vehicle;

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-principal-blue">
            Detalles de la publicación
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
              {vehicle.images && vehicle.images.length > 0 ? (
                <div className="rounded-xl overflow-hidden shadow-md">
                  <img
                    src={vehicle.images[0].secure_url}
                    alt={`${vehicle.brand.name} ${vehicle.model.name}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ) : (
                <div className="bg-gray-200 h-64 rounded-xl grid place-items-center">
                  <p className="text-gray-500">Sin imagen</p>
                </div>
              )}

              {vehicle.images && vehicle.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {vehicle.images.slice(1, 5).map((image, index) => (
                    <div
                      key={index}
                      className="h-20 rounded-xl overflow-hidden shadow-sm"
                    >
                      <img
                        src={image.secure_url}
                        alt={`${vehicle.brand.name} ${vehicle.model.name} ${
                          index + 2
                        }`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold text-principal-blue">
                  {vehicle.brand.name} {vehicle.model.name}
                </h1>
                <span className="bg-secondary-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.status}
                </span>
              </div>

              {vehicle.version && (
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
                  <div>
                    <p className="text-gray-500 text-sm">
                      Fecha de publicación
                    </p>
                    <p className="font-medium">
                      {new Date(post.postDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Estado</p>
                    <p className="font-medium">{post.status}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-principal-blue mb-2">
                  Descripción
                </h3>
                <p className="text-gray-700">{vehicle.description}</p>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Volver
                </button>

                {onDelete && (
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors ${
                      post.status.toLowerCase() === "inactive"
                        ? "bg-principal-blue text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {isDeleting
                      ? "Publicando..."
                      : post.status.toLowerCase() === "inactive"
                      ? "Publicar"
                      : "Eliminar publicación"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
