"use client";

import { useVehicleSearch } from "@/hooks/useVehicleSearch";
import { Sidebar } from "./components/Sidebar";
import { MarketContainer } from "./components/MarketContainer";
import { SearchBar } from "@/components/ui/SearchBar";
import { useSearchParams } from "@/hooks/useSearchParams";

export default function MarketplaceView() {
  const { posts, isLoading, error, totalPages, currentPage, totalItems } =
    useVehicleSearch();
  const { setSearch } = useSearchParams();

  return (
    <div className="w-full min-h-screen bg-zinc-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 lg:mb-0">
            Marketplace
          </h1>
          <div className="w-full lg:w-96">
            <SearchBar onSearch={setSearch} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[300px] shrink-0">
            <Sidebar />
          </div>

          <div className="flex-1">
            <MarketContainer
              posts={posts}
              isLoading={isLoading}
              error={error}
              totalPages={totalPages}
              currentPage={currentPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
