import { useEffect, useState, useRef } from "react";

interface SearchBarProps {
  initialValue?: string;
  onSearch: (term?: string) => void;
  debounceMs?: number;
  placeholder?: string;
}

const SearchBar = ({
  initialValue = "",
  onSearch,
  debounceMs = 300,
  placeholder = "Buscar...",
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const prevSearchTermRef = useRef(initialValue);

  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (
      searchTerm !== prevSearchTermRef.current ||
      (searchTerm && !prevSearchTermRef.current)
    ) {
      const handler = setTimeout(() => {
        onSearch(searchTerm || undefined);
        prevSearchTermRef.current = searchTerm;
      }, debounceMs);
      return () => clearTimeout(handler);
    }
  }, [searchTerm, onSearch, debounceMs]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        type="search"
        className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
