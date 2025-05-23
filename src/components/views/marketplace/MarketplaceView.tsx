"use client";

import Sidebar from "./components/Sidebar";
import ProductCard from "./components/ProductCard";
import Pagination from "./components/pagination";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import SearchBar from "@/components/ui/SearchBar";

export default function MarketplaceView() {
  const { posts, loading, error, currentPage, totalPages, handlePageChange } =
    useFetchPosts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6">
        <SearchBar />
        <h1 className="mt-4 text-2xl font-bold text-principal-blue mb-6">
          Catálogo de vehículos
        </h1>

        {Array.isArray(posts) && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <ProductCard key={post.id} vehicle={post.vehicle} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-24 h-24 mb-6 bg-[#0d2e55] rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
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
            <h2 className="text-2xl font-bold text-[#103663] mb-3">
              No hay vehículos disponibles
            </h2>
            <p className="text-gray-600 max-w-md mb-8">
              No hay posteos aún, vuelve más tarde cuando haya vehículos
              disponibles.
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
