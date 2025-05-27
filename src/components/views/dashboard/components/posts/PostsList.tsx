"use client";

import { useState } from "react";
import { PostResponse } from "@/services/vehicle.service";
import PostsCard from "./PostsCard";

interface PostsListProps {
  posts: PostResponse[];
  loading?: boolean;
  onDelete?: (id: string) => Promise<boolean>;
  onView?: (post: PostResponse) => void;
  emptyMessage?: string;
}

export default function PostsList({
  posts,
  loading = false,
  onDelete,
  onView,
  emptyMessage = "No hay publicaciones disponibles",
}: PostsListProps) {
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  if (loading) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue"></div>
        <p className="mt-4 text-secondary-blue font-medium">
          Cargando publicaciones...
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-secondary-blue/50 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <p className="text-gray-500 text-center max-w-md">{emptyMessage}</p>
      </div>
    );
  }

  const filteredPosts = posts.filter((post) => {
    if (filter === "all") return true;
    return post.status.toLowerCase() === filter.toLowerCase();
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.postDate).getTime() - new Date(a.postDate).getTime();
      case "oldest":
        return new Date(a.postDate).getTime() - new Date(b.postDate).getTime();
      case "price-high":
        return b.vehicle.price - a.vehicle.price;
      case "price-low":
        return a.vehicle.price - b.vehicle.price;
      case "year-new":
        return b.vehicle.year - a.vehicle.year;
      case "year-old":
        return a.vehicle.year - b.vehicle.year;
      default:
        return 0;
    }
  });

  const statusCounts = posts.reduce((acc, post) => {
    const status = post.status.toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-principal-blue text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Todos ({posts.length})
          </button>
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-secondary-blue text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-principal-blue focus:border-principal-blue"
        >
          <option value="newest">Más recientes</option>
          <option value="oldest">Más antiguos</option>
          <option value="price-high">Mayor precio</option>
          <option value="price-low">Menor precio</option>
          <option value="year-new">Año (más nuevo)</option>
          <option value="year-old">Año (más antiguo)</option>
        </select>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="w-full py-8 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-gray-500">
            No hay publicaciones con el filtro seleccionado
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPosts.map((post) => (
            <PostsCard
              key={post.id}
              post={post}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  );
}
