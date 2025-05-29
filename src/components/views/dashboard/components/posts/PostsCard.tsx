"use client";

import { useState } from "react";
import Image from "next/image";
import { PostResponse } from "@/services/vehicle.service";

type PostsCardProps = {
  post: PostResponse;
  onDelete?: (id: string) => Promise<boolean>;
  onView?: (post: PostResponse) => void;
};

export default function PostsCard({ post, onDelete, onView }: PostsCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && confirm("¿Estás seguro de eliminar esta publicación?")) {
      setIsDeleting(true);
      const success = await onDelete(post.id);
      if (!success) {
        setIsDeleting(false);
      }
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onView) onView(post);
  };

  const vehicle = post.vehicle;
  const vehicleImage =
    vehicle.images?.length > 0
      ? vehicle.images[0].secure_url
      : "/images/default-car.png";

  const vehicleName = `${vehicle.brand.name} ${vehicle.model.name} ${
    vehicle.version?.name || ""
  }`;

  const statusColors: Record<string, string> = {
    published: "bg-green-100 text-green-800",
    active: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
    sold: "bg-red-100 text-red-800",
    inactive: "bg-gray-100 text-gray-800",
    default: "bg-blue-100 text-blue-800",
  };

  const statusText: Record<string, string> = {
    active: "Activo",
    sold: "Vendido",
    inactive: "Inactivo",
    default: post.status,
  };

  const statusClass =
    statusColors[post.status.toLowerCase()] || statusColors.default;
  const statusLabel =
    statusText[post.status.toLowerCase()] || statusText.default;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative w-full h-48">
        <Image
          src={vehicleImage}
          alt={vehicleName}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <div
          className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}
        >
          {statusLabel}
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

          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center"
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
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
