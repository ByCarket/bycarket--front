"use client";

import { useParams } from "next/navigation";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import Image from "next/image";
import QuestionModal from "../components/QuestionModal";

const VehicleDetailView = () => {
  const params = useParams();
  const vehicleId = params.id as string;

  const { posts, loading, error } = useFetchPosts();

  const post = posts.find((p) => p.vehicle?.id === vehicleId);
  const vehicle = post?.vehicle;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#103663] text-white text-lg">
        Cargando detalles del vehículo...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#103663] text-red-400 font-semibold">
        {error}
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#103663] text-white text-lg">
        Vehículo no encontrado.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-gray-200 shadow-md rounded-xl p-6 text-center">
          <h1 className="text-4xl font-bold text-[#2d4059]">
            {vehicle.brand?.name} {vehicle.model?.name}
          </h1>
          <p className="text-lg text-gray-600 mt-2">{vehicle.version?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative h-96">
              {vehicle.images && vehicle.images?.length > 0 ? (
                <Image
                  src={vehicle.images[0].secure_url}
                  alt={`${vehicle.brand?.name} ${vehicle.model?.name}`}
                  layout="fill"
                  objectFit="cover"
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500 text-lg">
                  No hay imágenes disponibles
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Características */}
            <div className="bg-gray-100 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-[#2d4059] mb-4">
                Características
              </h2>
              <ul className="space-y-2 text-base text-gray-700">
                <li>
                  <strong>Año:</strong> {vehicle.year}
                </li>
                <li>
                  <strong>Condición:</strong> {vehicle.condition}
                </li>
                <li>
                  <strong>Tipo:</strong> {vehicle.typeOfVehicle}
                </li>
                <li>
                  <strong>Kilometraje:</strong>{" "}
                  {vehicle.mileage.toLocaleString()} km
                </li>
                <li></li>
              </ul>
            </div>
            <div>
              <strong>Precio:</strong>{" "}
              <span className="text-xl font-bold text-green-600">
                {vehicle.currency} {vehicle.price.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-4">
              <QuestionModal />
              <a
                href={`https://wa.me/549XXXXXXXXXX?text=Hola, estoy interesado en el vehículo ${vehicle.brand?.name} ${vehicle.model?.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path d="M20.52 3.48a11.93 11.93 0 0 0-16.9 0 11.93 11.93 0 0 0-1.64 14.9L.03 23.19a.75.75 0 0 0 .99.99l4.8-1.95a11.93 11.93 0 0 0 14.9-1.64 11.93 11.93 0 0 0 0-16.9Z" />
                </svg>
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="bg-gray-100 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-[#2d4059]">
            Descripción
          </h3>
          <p className="whitespace-pre-line break-words text-gray-700 leading-relaxed max-h-[300px] overflow-y-auto pr-2">
            {vehicle.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailView;
