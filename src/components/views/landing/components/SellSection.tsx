"use client";

import { useRouter } from "next/navigation";

export default function SellSection() {
  const router = useRouter();

  return (
    <section className="relative w-full bg-white overflow-hidden">
      {/* Fondo azul con curva inferior derecha solo en pantallas md+ */}
      <div className="hidden md:block absolute top-0 left-0 w-2/4 h-full bg-[#4A77A8] rounded-br-[200px] z-0" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-20 gap-30">
        {/* Imagen */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="w-72 h-48 sm:w-80 sm:h-56 md:w-96 md:h-64 bg-[#C0D1E4] text-[#103663] rounded-3xl shadow-lg flex items-center justify-center text-base sm:text-lg font-medium text-center ml-4 md:ml-8">
            [ Imagen de venta ]
          </div>
        </div>

        {/* Texto */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h3 className="text-[#4A77A8] font-semibold text-lg mb-1">VENTA</h3>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#103663] mb-3 leading-snug">
            Vende tu vehículo sin
            <br />
            esfuerzo{" "}
            <span className="italic font-extrabold text-[#4A77A8]">alguno</span>
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto md:mx-0">
            Simplificamos tu venta con tecnología inteligente y procesos
            rápidos, para que no pierdas tiempo ni oportunidades.
          </p>

          <button
            onClick={() => router.push("/")}
            className="bg-[#103663] hover:bg-[#0c2c50] text-white font-semibold px-6 py-3 rounded-2xl shadow transition"
          >
            Vende
          </button>
        </div>
      </div>
    </section>
  );
}
