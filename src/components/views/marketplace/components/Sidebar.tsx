"use client";

import { Filters } from "./Filters";
import { OrderBy } from "./OrderBy";

export function Sidebar() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24 transition-all duration-300 hover:shadow-xl">
      <div className="p-6 border-b border-gray-100 bg-secondary-blue">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-principal-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
          Ordenar por
        </h2>
        <OrderBy />
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-principal-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filtros
        </h2>
        <Filters />
      </div>
    </div>
  );
}
