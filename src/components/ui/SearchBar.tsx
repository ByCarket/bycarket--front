"use client";

import { useEffect, useState } from "react";

interface SearchBarProps {
  onSearch: (query: string | undefined) => void;
  placeholder?: string;
  initialValue?: string;
  debounceMs?: number;
}

export function SearchBar({
  onSearch,
  placeholder = "Buscar vehículos...",
  initialValue = "",
  debounceMs = 500,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm || undefined);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [searchTerm, onSearch, debounceMs]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        className="block w-full p-2.5 pl-10 text-sm text-gray-800 border border-gray-200 rounded-lg focus:ring-2 focus:ring-principal-blue/50 focus:border-principal-blue focus:outline-none bg-white transition-all duration-200 hover:border-gray-300"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
