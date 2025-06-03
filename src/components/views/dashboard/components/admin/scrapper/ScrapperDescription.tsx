import React from "react";
import { FiSearch } from "react-icons/fi";

export default function ScrapperDescription() {
  return (
    <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 mb-6 sm:mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#103663]/10 to-[#4a77a8]/10 flex-shrink-0">
              <FiSearch className="w-5 h-5 sm:w-6 sm:h-6 text-[#103663]" />
            </div>
            <div className="flex-1 w-full">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#103663] mb-2 sm:mb-3">
                Actualización de Base de Datos
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">
                Actualiza la base de datos de vehículos con la información más
                reciente. Este proceso recopila datos actualizados de marcas,
                modelos y versiones desde fuentes externas, asegurando que tu
                catálogo siempre esté al día con las últimas especificaciones
                técnicas y precios del mercado.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#4a77a8]">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#4a77a8] flex-shrink-0"></div>
                  <span>Actualización de vehículos</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#4a77a8]">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#4a77a8] flex-shrink-0"></div>
                  <span>Datos técnicos precisos</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#4a77a8]">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#4a77a8] flex-shrink-0"></div>
                  <span>Precios actualizados</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
