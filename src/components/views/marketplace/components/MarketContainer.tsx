"use client";

import { PostResponse } from "@/services/vehicle.service";
import { useSearchParams } from "@/hooks/useSearchParams";
import { ProductCard } from "./ProductCard";

interface MarketContainerProps {
  posts: PostResponse[];
  isLoading: boolean;
  error: Error | null;
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export function MarketContainer({
  posts,
  isLoading,
  error,
  totalPages,
  currentPage,
  totalItems,
}: MarketContainerProps) {
  const { setPage } = useSearchParams();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 w-full">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        <p className="mt-4 text-gray-600">Cargando vehículos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 w-full bg-red-50 rounded-xl border border-red-100 p-8">
        <svg
          className="w-12 h-12 text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-medium text-red-800 mb-2">
          Error al cargar los vehículos
        </h3>
        <p className="text-red-600 text-center">{error.message}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 w-full bg-blue-50 rounded-xl border border-blue-100 p-8">
        <svg
          className="w-12 h-12 text-blue-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 12H4"
          />
        </svg>
        <h3 className="text-lg font-medium text-blue-800 mb-2">
          No se encontraron vehículos
        </h3>
        <p className="text-blue-600 text-center">
          Intenta ajustar los filtros para ver más resultados
        </p>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-700">
          {totalItems}{" "}
          {totalItems === 1 ? "vehículo encontrado" : "vehículos encontrados"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <ProductCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  currentPage === page
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
