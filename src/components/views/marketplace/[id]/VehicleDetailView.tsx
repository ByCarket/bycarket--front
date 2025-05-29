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

  const fechaPublicacion = post?.postDate
    ? new Date(post.postDate).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    : "Fecha no disponible";

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-principal-blue text-white text-lg font-semibold">
        Cargando detalles del vehículo...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-principal-blue text-red-500 font-semibold">
        {error}
      </div>
    );

  if (!vehicle)
    return (
      <div className="flex justify-center items-center min-h-screen bg-principal-blue text-white text-lg font-semibold">
        Vehículo no encontrado.
      </div>
    );

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
    <main className="min-h-screen bg-gradient-to-t from-principal-blue/10 to-white py-12 px-6">
      {/* Sección Superior */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row bg-white gap-4 p-3 border border-gray-200 rounded-t-md rounded-br-md ">
        {/* Bloque de IMÁGENES */}
        <div className="flex-1 space-y-6 order-1 lg:order-1">
          {/* Galería de imágenes */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] ">
            {vehicle.images?.length ? (
              <>
                <Image
                  src={vehicle.images[currentImageIndex].secure_url}
                  alt={`${vehicle.brand?.name} ${vehicle.model?.name}`}
                  fill
                  priority
                  className="object-contain"
                />
                <button
                  onClick={handlePrev}
                  aria-label="Anterior"
                  className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Siguiente"
                  className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs rounded-full px-3 py-1 font-mono select-none">
                  {currentImageIndex + 1} / {vehicle.images.length}
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-400 font-semibold">
                No hay imágenes disponibles
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {vehicle.images?.length > 1 && (
            <div className="mt-4 flex justify-center flex-wrap gap-2">
              {vehicle.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative w-24 aspect-[4/3] rounded-md overflow-hidden border-2 transition ${idx === currentImageIndex
                    ? "border-principal-blue"
                    : "border-transparent"
                    }`}
                >
                  <Image
                    src={img.secure_url}
                    alt={`Miniatura ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TÍTULO + PRECIO+ CARACTERÍSTICAS */}
        <div className="lg:flex-[1] lg:max-w-sm flex flex-col gap-6 order-2 lg:order-2 ">
          <div>
            <p className="text-sm text-gray-500 mt-1">
              Publicado el {fechaPublicacion}
            </p>
            <h1 className="text-4xl font-extrabold  text-principal-blue leading-tight">
              {vehicle.brand?.name}{" "}
              <span className="text-secondary-blue">{vehicle.model?.name}</span>
            </h1>
            {vehicle.version?.name && (
              <p className="text-lg font-medium text-gray-600 mt-2">
                {vehicle.version.name}
              </p>
            )}
            <h2 className="pt-4 text-gray-900 font-semibold text-3xl">
              {vehicle.currency} {vehicle.price.toLocaleString()}
            </h2>
          </div>

          <div className="border-t border-b border-gray-200 py-4">
            <ul className="text-lg text-black space-y-2">
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
                <strong className="text-principal-blue">Kilometraje:</strong>{" "}
                {vehicle.mileage.toLocaleString()} km
              </li>
              <li>
                <strong className="text-principal-blue">Tipo:</strong>{" "}
                {vehicle.typeOfVehicle}
              </li>
            </ul>
          </div>

          {/* Modal + contacto */}
          <div className="flex flex-col gap-4 pt-3">
            <QuestionModal />
          </div>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Image
                        src="/assets/images/logo/Logoo.webp"
                        alt="logoByCarket"
                        width={40}
                        height={40}
                        className="h-20 w-20 opacity-4"
                      />  <Image
                        src="/assets/images/logo/Logoo.webp"
                        alt="logoByCarket"
                        width={40}
                        height={40}
                        className="h-20 w-20 opacity-6"
                      />  <Image
                        src="/assets/images/logo/Logoo.webp"
                        alt="logoByCarket"
                        width={40}
                        height={40}
                        className="h-20 w-20 opacity-10"
                      />  <Image
                        src="/assets/images/logo/Logoo.webp"
                        alt="logoByCarket"
                        width={40}
                        height={40}
                        className="h-20 w-20 opacity-14"
                      />
      
          </div>

        </div>
      </div>

      {/* Sección Inferior  */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 rounded items-start">
        {/* DESCRIPCIÓN */}
        <div className="flex-1 lg:w-8/12 bg-white p-6 prose max-w-none text-black pt-15 border-t-0 border border-gray-200 rounded-b-md">
          <h2 className="text-2xl font-semibold mb-6 text-principal-blue">
            Descripción
          </h2>
          <p className="whitespace-pre-line">
            {vehicle.description || "Sin descripción disponible."}
          </p>
        </div>

        {/* CONSEJOS + CONTACTO */}
        <div className="flex flex-col gap-6 mt-5 lg:w-4/12 bg-gradient-to-b from-white to-transparent rounded-t-md ">
          {/* Consejos de seguridad */}
          <div className="p-4 rounded-md">
            <h3 className="text-base font-semibold mb-2 text-principal-blue">
              Consejos de seguridad
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-800 text-sm">
              <li>
                Nunca compartas contraseñas, PIN o códigos por WhatsApp, SMS o
                email.
              </li>
              <li>
                No hagas pagos anticipados antes de ver el vehículo en persona.
              </li>
              <li>ByCarket no almacena vehículos.</li>
              <li>
                Verificá el remitente de los emails que dicen ser de ByCarket.
              </li>
              <li>Dudá de ofertas debajo del precio de mercado.</li>
            </ul>
          </div>

          {/* Contacto por email */}
          <div className="rounded-2xl text-center p-4 border-l-2 border-r-2 border-secondary-blue shadow-md">
            <p className="text-base font-semibold mb-1 text-gray-900">
              ¿Tenés dudas?
            </p>
            <p className="text-gray-700 text-sm">
              Contactanos a{" "}
              <a
                href="mailto:bycarket@gmail.com"
                className="text-principal-blue underline hover:text-principal-blue/80"
              >
                bycarket@gmail.com
              </a>{" "}
              y te nos pondremos en contacto contigo.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VehicleDetailView;
