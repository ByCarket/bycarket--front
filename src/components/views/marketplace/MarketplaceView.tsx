"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ProductCard from "./components/ProductCard";
import Pagination from "./components/pagination";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import SearchBar from "@/components/ui/SearchBar";
import { FilterState } from "@/hooks/useFilters";
import { OrderByPostsEnum } from "@/enums/orderByPosts.enum";
import { OrderDirectionEnum } from "@/enums/order.enum";

export default function MarketplaceView() {
  const [filters, setFilters] = useState<FilterState>({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const { posts, loading, error, currentPage, totalPages, handlePageChange } =
    useFetchPosts(1, 10, filters);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setIsMobileFilterOpen(false);
  };

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query || undefined }));
  };

  const handleSort = (orderBy: OrderByPostsEnum, order: OrderDirectionEnum) => {
    setFilters((prev) => ({ ...prev, orderBy, order }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#103663]"></div>
          <p className="text-[#103663] font-medium">Cargando vehículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <Sidebar filters={filters} onFilterChange={handleFilterChange} />
        </div>
      )}
      <div className="hidden md:block">
        <Sidebar filters={filters} onFilterChange={handleFilterChange} />
      </div>

      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} initialQuery={filters.search} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#103663]">
              Catálogo de vehículos
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {Array.isArray(posts) ? posts.length : 0} resultado
              {Array.isArray(posts) && posts.length !== 1 ? "s" : ""} encontrado
              {Array.isArray(posts) && posts.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden flex items-center justify-center bg-[#facc15] text-[#103663] py-2 px-4 rounded-md font-semibold shadow-sm transition text-sm"
            >
              Filtros
            </button>

            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
              <label
                htmlFor="sort"
                className="text-xs text-gray-500 bg-gray-50 h-full px-3 py-2 border-r border-gray-300"
              >
                Ordenar por
              </label>
              <select
                id="sort"
                className="text-sm py-2 px-3 border-0 focus:ring-0 focus:outline-none"
                onChange={(e) => {
                  const [orderBy, order] = e.target.value.split(":");
                  handleSort(
                    orderBy as OrderByPostsEnum,
                    order as OrderDirectionEnum
                  );
                }}
                defaultValue={`${
                  filters.orderBy || OrderByPostsEnum.POST_DATE
                }:${filters.order || OrderDirectionEnum.DESC}`}
              >
                <option
                  value={`${OrderByPostsEnum.POST_DATE}:${OrderDirectionEnum.DESC}`}
                >
                  Más recientes
                </option>
                <option
                  value={`${OrderByPostsEnum.POST_DATE}:${OrderDirectionEnum.ASC}`}
                >
                  Más antiguos
                </option>
                <option
                  value={`${OrderByPostsEnum.PRICE}:${OrderDirectionEnum.ASC}`}
                >
                  Menor precio
                </option>
                <option
                  value={`${OrderByPostsEnum.PRICE}:${OrderDirectionEnum.DESC}`}
                >
                  Mayor precio
                </option>
                <option
                  value={`${OrderByPostsEnum.YEAR}:${OrderDirectionEnum.DESC}`}
                >
                  Año (más nuevo)
                </option>
                <option
                  value={`${OrderByPostsEnum.YEAR}:${OrderDirectionEnum.ASC}`}
                >
                  Año (más antiguo)
                </option>
              </select>
            </div>
          </div>
        </div>

        {Array.isArray(posts) && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ProductCard key={post.id} vehicle={post.vehicle} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl shadow-sm border border-gray-100 mt-4">
            <div className="w-20 h-20 mb-6 bg-[#103663] rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#103663] mb-2">
              No hay vehículos disponibles
            </h2>
            <p className="text-gray-500 max-w-md">
              No hay posteos que coincidan con los filtros seleccionados.
            </p>
            <p className="mt-4 text-xs text-gray-400">
              Utiliza el botón "Filtros" para cambiar los criterios de búsqueda
            </p>
          </div>
        )}

        {Array.isArray(posts) && posts.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </main>
    </div>
  );
}
