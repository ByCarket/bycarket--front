"use client";

import { useRouter } from "next/navigation";

export default function BuySection() {
  const router = useRouter();

  return (
    <section className="relative w-full bg-gray-50 py-16 px-6 overflow-hidden">
      {/* Fondo azul oscuro en el 50% derecho con curva inferior izquierda */}
      <div className="hidden md:block absolute top-0 right-0 w-1/2 h-full bg-[#103663] rounded-bl-[200px] z-0" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-20">
        {/* Bloque de texto */}
        <div className="w-full md:w-1/2 text-center md:text-left px-4">
          <h3 className="text-[#4A77A8] font-semibold text-lg mb-1">COMPRA</h3>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 leading-snug">
            Compra el vehículo
            <br />
            de tus{" "}
            <span className="italic font-extrabold text-[#4A77A8]">sueños</span>
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto md:mx-0">
            Encuentra las mejores ofertas y acompáñanos en cada paso hasta que
            estés al volante de tu próximo auto.
          </p>

          <button
            onClick={() => router.push("/")}
            className="bg-[#4A77A8] hover:bg-[#35678c] text-white font-semibold px-6 py-3 rounded-2xl shadow transition"
          >
            Compra
          </button>
        </div>

        {/* Imagen */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
          <div className="w-72 h-48 sm:w-80 sm:h-56 md:w-96 md:h-64 bg-[#C0D1E4] text-[#103663] rounded-3xl shadow-lg flex items-center justify-center text-base sm:text-lg font-medium text-center ml-4 md:ml-8">
            [ Imagen de compra ]
          </div>
        </div>
      </div>
    </section>
  );
}
