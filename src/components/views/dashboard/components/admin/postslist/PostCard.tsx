"use client";

import React from "react";
import Image from "next/image";
import { PostResponse } from "@/services/vehicle.service";

type PostCardProps = {
  post: PostResponse;
  onViewDetail: (post: PostResponse) => void;
};

const PostCard = ({ post, onViewDetail }: PostCardProps) => {
  const formattedDate = new Date(post.postDate).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const vehicleImage = post.vehicle.images?.length > 0 
    ? post.vehicle.images[0].secure_url 
    : "/images/default-car.png";

  const vehicleName = `${post.vehicle.brand.name} ${post.vehicle.model.name} ${post.vehicle.version?.name || ""}`;
  
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
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-principal-blue line-clamp-1">{vehicleName}</h3>
        <p className="text-gray-600 mt-1 text-sm">
          {post.vehicle.year} | {post.vehicle.mileage.toLocaleString()} km
        </p>
        <p className="text-principal-blue font-semibold mt-2">
          {post.vehicle.currency} {post.vehicle.price.toLocaleString()}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500">{formattedDate}</span>
          <button 
            onClick={() => onViewDetail(post)}
            className="px-3 py-1 bg-secondary-blue text-white text-sm rounded hover:bg-principal-blue transition-colors"
          >
            Ver detalle
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
