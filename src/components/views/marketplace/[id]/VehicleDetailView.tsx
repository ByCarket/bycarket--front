"use client";

import { useParams } from "next/navigation";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import Image from "next/image";
import QuestionModal from "../components/QuestionModal";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const VehicleDetailView = () => {
  const params = useParams();
  const vehicleId = params.id as string;

  const { posts, loading, error } = useFetchPosts();

  const post = posts.find((p) => p.vehicle?.id === vehicleId);
  const vehicle = post?.vehicle;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-principal-blue text-white text-lg">
        Cargando detalles del vehículo...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-principal-blue text-red-400 font-semibold">
        {error}
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-principal-blue text-white text-lg">
        Vehículo no encontrado.
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? vehicle.images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === vehicle.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1.5fr] gap-8 items-start">
          {/* Imagen a la izquierda */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden relative h-[28rem] md:h-[34rem]">
            {vehicle.images && vehicle.images.length > 0 ? (
              <>
                <Image
                  src={vehicle.images[currentImageIndex].secure_url}
                  alt={`${vehicle.brand?.name} ${vehicle.model?.name}`}
                  fill // reemplaza layout="fill"
                  className="object-contain rounded-xl bg-gray-100"
                />

                <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-4 py-3 bg-gradient-to-t from-black/50 to-transparent rounded-b-xl">
                  <button
                    onClick={handlePrev}
                    className="w-10 h-10 flex items-center justify-center rounded-md bg-white text-black font-extrabold shadow hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft />
                  </button>

                  <span className="text-sm text-white">
                    Imagen {currentImageIndex + 1} de {vehicle.images.length}
                  </span>

                  <button
                    onClick={handleNext}
                    className="w-10 h-10 flex items-center justify-center rounded-md bg-white text-black font-extrabold shadow hover:bg-gray-200 transition-colors"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[28rem] bg-gray-100 text-gray-500 text-lg rounded-xl">
                No hay imágenes disponibles
              </div>
            )}
          </div>

          {/* Datos a la derecha */}
          <div className="space-y-6">
            {/* Título y versión */}
            <div className="bg-gradient-to-r from-gray-100 to-white rounded-xl shadow-md p-6 text-center md:text-left">
              <h1 className="text-4xl font-bold text-principal-blue">
                {vehicle.brand?.name} {vehicle.model?.name}
              </h1>
              <p className="text-lg text-secondary-blue mt-2">
                {vehicle.version?.name}
              </p>
            </div>

            {/* Características */}
            <div className="bg-gradient-to-r from-gray-100 to-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-principal-blue mb-4">
                Características
              </h2>
              <ul className="space-y-2 text-base">
                <li>
                  <strong className="text-principal-blue">Año:</strong>{" "}
                  {vehicle.year}
                </li>
                <li>
                  <strong className="text-principal-blue">Condición:</strong>{" "}
                  {vehicle.condition === "used"
                    ? "Usado"
                    : vehicle.condition === "new"
                    ? "Nuevo"
                    : vehicle.condition}
                </li>
                <li>
                  <strong className="text-principal-blue">Tipo:</strong>{" "}
                  {vehicle.typeOfVehicle}
                </li>
                <li>
                  <strong className="text-principal-blue">Kilometraje:</strong>{" "}
                  {vehicle.mileage.toLocaleString()} km
                </li>
              </ul>
            </div>

            {/* Precio */}
            <div className="bg-gradient-to-r from-gray-100 to-white rounded-xl shadow-md p-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-principal-blue ml-2">
                Precio
              </h2>
              <span className="text-2xl font-bold text-black">
                {vehicle.currency} {vehicle.price.toLocaleString()}
              </span>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-4">
              <QuestionModal />
              <a
                href={`https://wa.me/549XXXXXXXXXX?text=Hola, estoy interesado en el vehículo ${vehicle.brand?.name} ${vehicle.model?.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-light px-6 py-3 rounded-lg shadow transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="ml-6 w-5 h-5"
                >
                  <path d="M20.52 3.48a11.93 11.93 0 0 0-16.9 0 11.93 11.93 0 0 0-1.64 14.9L.03 23.19a.75.75 0 0 0 .99.99l4.8-1.95a11.93 11.93 0 0 0 14.9-1.64 11.93 11.93 0 0 0 0-16.9Z" />
                </svg>
                <span className="leading-none">Contactar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Descripción debajo de todo */}
        <div className="bg-gradient-to-r from-gray-100 to-white rounded-xl shadow-md p-6 mt-8 max-w-6xl mx-auto">
          <h1 className="text-xl font-semibold mb-4 text-principal-blue">
            Descripción
          </h1>
          <h2 className="whitespace-pre-line break-words text-black leading-relaxed max-h-[300px] overflow-y-auto pr-2">
            {vehicle.description}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailView;
