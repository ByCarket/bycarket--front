"use client";

import { useState } from "react";
import Image from "next/image";
import { PostResponse } from "@/services/vehicle.service";
import { useSpinner } from "@/context/SpinnerContext";

type PostsCardProps = {
  post: PostResponse;
  onDelete?: (id: string) => Promise<boolean>;
  onView?: (post: PostResponse) => void;
  isDeleting?: boolean;
};

export default function PostsCard({
  post,
  onDelete,
  onView,
  isDeleting = false,
}: PostsCardProps) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(post.id);
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
        <div className={`absolute top-2 right-2 flex space-x-1`}>
          {onView && (
            <button
              onClick={handleView}
              className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Ver detalles"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`p-1.5 rounded-full shadow-md transition-colors ${
                isDeleting
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-white hover:bg-red-50"
              }`}
              aria-label={isDeleting ? "Eliminando..." : "Eliminar"}
            >
              {isDeleting ? (
                <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
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
              className={`px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center`}
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
