"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery.length) {
      router.push(`/autos?search=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-2xl mx-auto flex items-center gap-3"
    >
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar vehículos por marca, modelo o versión..."
        className="flex-1 px-4 py-2 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-principal-blue transition"
      />
      <button
        type="submit"
        className="p-2 rounded-full bg-principal-blue hover:bg-secondary-blue transition"
        aria-label="Buscar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="white"
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l.1.115 3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;
