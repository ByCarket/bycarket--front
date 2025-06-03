"use client";

import { useState } from "react";
import {
  FiEye,
  FiTrash2,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEdit3,
} from "react-icons/fi";
import { PostResponse } from "@/services/vehicle.service";

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
  const [imageError, setImageError] = useState(false);

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
    vehicle.images && vehicle.images.length > 0 && !imageError
      ? vehicle.images[0].secure_url
      : "https://images.unsplash.com/photo-1494976688153-c14fd6dc2c32?w=400&h=300&fit=crop";

  const vehicleName = `${vehicle.brand.name} ${vehicle.model.name} ${
    vehicle.version?.name || ""
  }`.trim();

  const getStatusConfig = (status: string) => {
    const configs = {
      published: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: FiCheckCircle,
        label: "Publicado",
      },
      active: {
        bg: "bg-green-300",
        text: "text-black",
        border: "border-black",
        icon: FiCheckCircle,
        label: "Activo",
      },
      draft: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-black",
        icon: FiEdit3,
        label: "Borrador",
      },
      sold: {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-black",
        icon: FiCheckCircle,
        label: "Vendido",
      },
      inactive: {
        bg: "bg-gray-300",
        text: "text-black",
        border: "border-black",
        icon: FiXCircle,
        label: "Inactivo",
      },
    };

    return (
      configs[status.toLowerCase() as keyof typeof configs] || {
        bg: "bg-yellow-300",
        text: "text-black",
        border: "border-black",
        icon: FiClock,
        label: status,
      }
    );
  };

  const statusConfig = getStatusConfig(post.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all duration-500 transform hover:-translate-y-1">
      <div className="relative">
        <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
          <img
            src={vehicleImage}
            alt={vehicleName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="absolute top-4 left-4">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
          >
            <StatusIcon className="w-3 h-3" />
            {statusConfig.label}
          </div>
        </div>

        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          {onView && (
            <button
              onClick={handleView}
              className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Ver detalles"
            >
              <FiEye className="w-4 h-4 text-slate-600" />
            </button>
          )}
        
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-[#103663] transition-colors duration-300">
            {vehicleName}
          </h3>

          <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              {vehicle.year}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              {vehicle.mileage.toLocaleString()} km
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              {vehicle.condition}
            </span>
          </div>

          <div className="text-2xl font-bold text-[#103663] mb-1">
            {vehicle.currency} {vehicle.price.toLocaleString()}
          </div>
        </div>


      </div>
    </div>
  );
}
