"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PostResponse } from "@/services/vehicle.service";
import PostActionButtons from "./PostActionButtons";

type PostDetailProps = {
  post: PostResponse | null;
  onClose: () => void;
  onActionSuccess: () => void;
};

const PostDetail = ({ post, onClose, onActionSuccess }: PostDetailProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!post) {
    return null;
  }

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
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-principal-blue mb-3">
                  Acciones
                </h3>
                <PostActionButtons
                  postId={post.id}
                  onActionSuccess={() => {
                    onActionSuccess();
                    onClose();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
