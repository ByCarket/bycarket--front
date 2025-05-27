"use client";

import { useState } from "react";
import { PostResponse } from "@/services/vehicle.service";
import Image from "next/image";

interface PostsCardProps {
  post: PostResponse;
  onDelete?: (id: string) => Promise<boolean>;
  onView?: (post: PostResponse) => void;
}

export default function PostsCard({ post, onDelete, onView }: PostsCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const handleView = () => {
    if (onView) {
      onView(post);
    }
  };

  const vehicle = post.vehicle;
  const mainImage =
    vehicle.images && vehicle.images.length > 0
      ? vehicle.images[0].secure_url
      : "/placeholder-vehicle.jpg";

  const statusColors: Record<string, string> = {
    published: "bg-green-500",
    draft: "bg-yellow-500",
    sold: "bg-red-500",
    default: "bg-secondary-blue",
  };

  const statusColor =
    statusColors[post.status.toLowerCase()] || statusColors.default;

  return (
    <div
      className="rounded-xl overflow-hidden shadow-lg transition-all duration-300 bg-white hover:shadow-xl cursor-pointer"
      style={{
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
        transition: "transform 0.3s ease-in-out",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={mainImage}
          alt={`${vehicle.brand.name} ${vehicle.model.name}`}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />
        <div
          className={`absolute top-3 right-3 ${statusColor} text-white px-3 py-1 rounded-full text-xs font-medium`}
        >
          {post.status}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-principal-blue/80 to-transparent h-16"></div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl text-principal-blue">
            {vehicle.brand.name} {vehicle.model.name}
          </h3>
          <p className="font-bold text-lg text-secondary-blue">
            {vehicle.year}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="bg-principal-blue/10 text-principal-blue px-2 py-1 rounded-full text-xs">
            {vehicle.typeOfVehicle}
          </span>
          <span className="bg-secondary-blue/10 text-secondary-blue px-2 py-1 rounded-full text-xs">
            {vehicle.condition}
          </span>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
            {vehicle.mileage.toLocaleString()} km
          </span>
        </div>

        <p className="font-bold text-2xl mb-3 text-principal-blue">
          {vehicle.currency} {vehicle.price.toLocaleString()}
        </p>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {vehicle.description}
        </p>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onView) onView(post);
            }}
            className="bg-principal-blue text-white px-4 py-2 rounded-lg hover:bg-principal-blue/90 transition-colors duration-200"
          >
            Ver detalles
          </button>

          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 disabled:opacity-50 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              {isDeleting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-500"
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
                  Eliminando
                </span>
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
