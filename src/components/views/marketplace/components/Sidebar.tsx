"use client";

import { useState, useEffect } from "react";
import { VehicleTypeEnum } from "@/enums/vehicleType.enum";
import { getBrands, Brand } from "@/services/vehicle.service";
import { useFilters, FilterState } from "@/hooks/useFilters";
import { DisplayCountEnum } from "@/enums/displayCount.enum";

interface SidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function Sidebar({ filters, onFilterChange }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [visibleVehicleTypes, setVisibleVehicleTypes] = useState(
    DisplayCountEnum.INITIAL_VEHICLE_TYPES
  );
  const [visibleBrands, setVisibleBrands] = useState(
    DisplayCountEnum.INITIAL_BRANDS
  );
  const [visiblePriceRanges, setVisiblePriceRanges] = useState(
    DisplayCountEnum.INITIAL_PRICE_RANGES
  );
  const [visibleYearRanges, setVisibleYearRanges] = useState(
    DisplayCountEnum.INITIAL_YEAR_RANGES
  );
  const [selectedFilters, setSelectedFilters] = useState<{
    priceRange?: string;
    vehicleTypes: string[];
    brands: string[];
    yearRange?: string;
  }>({
    vehicleTypes: [],
    brands: [],
  });

  const { setPriceRange, setYearRange, updateFilter, resetFilters } =
    useFilters();

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brandsData = await getBrands();
        setBrands(brandsData);
      } catch (error) {}
    };

    loadBrands();
  }, []);

  useEffect(() => {
    const vehicleTypes: string[] = [];
    const brandIds: string[] = [];

    if (filters.typeOfVehicle) {
      vehicleTypes.push(filters.typeOfVehicle);
    }

    if (filters.brandId) {
      brandIds.push(filters.brandId);
    }

    let priceRange: string | undefined;
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      if (filters.minPrice === 0 && filters.maxPrice === 5000000) {
        priceRange = "< $5M";
      } else if (
        filters.minPrice === 5000000 &&
        filters.maxPrice === 10000000
      ) {
        priceRange = "$5M - $10M";
      } else if (
        filters.minPrice === 10000000 &&
        filters.maxPrice === 15000000
      ) {
        priceRange = "$10M - $15M";
      } else if (
        filters.minPrice === 15000000 &&
        filters.maxPrice === 25000000
      ) {
        priceRange = "$15M - $25M";
      } else if (
        filters.minPrice === 25000000 &&
        filters.maxPrice === Number.MAX_SAFE_INTEGER
      ) {
        priceRange = "> $25M";
      }
    }

    let yearRange: string | undefined;
    if (filters.minYear !== undefined && filters.maxYear !== undefined) {
      const currentYear = new Date().getFullYear();
      if (filters.minYear === 2020 && filters.maxYear === currentYear) {
        yearRange = "2020 - Actual";
      } else if (filters.minYear === 2015 && filters.maxYear === 2019) {
        yearRange = "2015 - 2019";
      } else if (filters.minYear === 2010 && filters.maxYear === 2014) {
        yearRange = "2010 - 2014";
      } else if (filters.minYear === 2000 && filters.maxYear === 2009) {
        yearRange = "2000 - 2009";
      } else if (filters.minYear === 1950 && filters.maxYear === 1999) {
        yearRange = "< 2000";
      }
    }

    setSelectedFilters({
      vehicleTypes,
      brands: brandIds,
      priceRange,
      yearRange,
    });
  }, [filters]);

  const handlePriceRangeChange = (range: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedFilters((prev) => ({ ...prev, priceRange: range }));
      setPriceRange(range);
    } else if (selectedFilters.priceRange === range) {
      setSelectedFilters((prev) => ({ ...prev, priceRange: undefined }));
      setPriceRange("");
    }
  };

  const handleVehicleTypeChange = (type: string, isChecked: boolean) => {
    let newTypes = [...selectedFilters.vehicleTypes];

    if (isChecked) {
      newTypes.push(type);
    } else {
      newTypes = newTypes.filter((t) => t !== type);
    }

    setSelectedFilters((prev) => ({ ...prev, vehicleTypes: newTypes }));

    if (newTypes.length > 0) {
      updateFilter("typeOfVehicle", newTypes[0] as VehicleTypeEnum);
    } else {
      updateFilter("typeOfVehicle", undefined);
    }
  };

  const handleBrandChange = (brandId: string, isChecked: boolean) => {
    let newBrands = [...selectedFilters.brands];

    if (isChecked) {
      newBrands.push(brandId);
    } else {
      newBrands = newBrands.filter((b) => b !== brandId);
    }

    setSelectedFilters((prev) => ({ ...prev, brands: newBrands }));

    if (newBrands.length > 0) {
      updateFilter("brandId", newBrands[0]);
    } else {
      updateFilter("brandId", undefined);
    }
  };

  const handleYearRangeChange = (range: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedFilters((prev) => ({ ...prev, yearRange: range }));
      setYearRange(range);
    } else if (selectedFilters.yearRange === range) {
      setSelectedFilters((prev) => ({ ...prev, yearRange: undefined }));
      setYearRange("");
    }
  };

  const applyFilters = () => {
    const appliedFilters: FilterState = {};

    if (selectedFilters.vehicleTypes.length > 0) {
      appliedFilters.typeOfVehicle = selectedFilters
        .vehicleTypes[0] as VehicleTypeEnum;
    }

    if (selectedFilters.brands.length > 0) {
      appliedFilters.brandId = selectedFilters.brands[0];
    }

    if (selectedFilters.priceRange) {
      setPriceRange(selectedFilters.priceRange);
      switch (selectedFilters.priceRange) {
        case "< $5M":
          appliedFilters.minPrice = 0;
          appliedFilters.maxPrice = 5000000;
          break;
        case "$5M - $10M":
          appliedFilters.minPrice = 5000000;
          appliedFilters.maxPrice = 10000000;
          break;
        case "$10M - $15M":
          appliedFilters.minPrice = 10000000;
          appliedFilters.maxPrice = 15000000;
          break;
        case "$15M - $25M":
          appliedFilters.minPrice = 15000000;
          appliedFilters.maxPrice = 25000000;
          break;
        case "> $25M":
          appliedFilters.minPrice = 25000000;
          appliedFilters.maxPrice = Number.MAX_SAFE_INTEGER;
          break;
      }
    }

    if (selectedFilters.yearRange) {
      const currentYear = new Date().getFullYear();
      switch (selectedFilters.yearRange) {
        case "2020 - Actual":
          appliedFilters.minYear = 2020;
          appliedFilters.maxYear = currentYear;
          break;
        case "2015 - 2019":
          appliedFilters.minYear = 2015;
          appliedFilters.maxYear = 2019;
          break;
        case "2010 - 2014":
          appliedFilters.minYear = 2010;
          appliedFilters.maxYear = 2014;
          break;
        case "2000 - 2009":
          appliedFilters.minYear = 2000;
          appliedFilters.maxYear = 2009;
          break;
        case "< 2000":
          appliedFilters.minYear = 1950;
          appliedFilters.maxYear = 1999;
          break;
      }
    }

    onFilterChange(appliedFilters);
    setOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedFilters({
      priceRange: undefined,
      vehicleTypes: [],
      brands: [],
      yearRange: undefined,
    });
    resetFilters();
    resetVisibleCounts();
    onFilterChange({});
  };

  const priceRangeOptions = [
    "< $5M",
    "$5M - $10M",
    "$10M - $15M",
    "$15M - $25M",
    "> $25M",
  ];

  const vehicleTypeOptions = [
    { id: VehicleTypeEnum.SEDAN, label: "Sedán" },
    { id: VehicleTypeEnum.SUV, label: "SUV" },
    { id: VehicleTypeEnum.PICKUP, label: "Pick-up" },
    { id: VehicleTypeEnum.HATCHBACK, label: "Hatchback" },
    { id: VehicleTypeEnum.VAN, label: "Van" },
    { id: VehicleTypeEnum.COUPE, label: "Coupé" },
    { id: VehicleTypeEnum.CABRIOLET, label: "Cabriolet" },
    { id: VehicleTypeEnum.MINIVAN, label: "Minivan" },
    { id: VehicleTypeEnum.SPORTSCAR, label: "Deportivo" },
    { id: VehicleTypeEnum.LUXURY, label: "Lujo" },
    { id: VehicleTypeEnum.CROSSOVER, label: "Crossover" },
    { id: VehicleTypeEnum.ELECTRIC, label: "Eléctrico" },
    { id: VehicleTypeEnum.HYBRID, label: "Híbrido" },
    { id: VehicleTypeEnum.OFF_ROAD, label: "Todo Terreno" },
  ];

  const yearRangeOptions = ["23-24", "20-22", "15-19", "10-14", "<10"];

  const showMoreVehicleTypes = () =>
    setVisibleVehicleTypes((prev) =>
      Math.min(prev + 5, vehicleTypeOptions.length)
    );
  const showLessVehicleTypes = () =>
    setVisibleVehicleTypes(DisplayCountEnum.INITIAL_VEHICLE_TYPES);

  const showMoreBrands = () =>
    setVisibleBrands((prev) => Math.min(prev + 5, brands.length));
  const showLessBrands = () =>
    setVisibleBrands(DisplayCountEnum.INITIAL_BRANDS);

  const showMorePriceRanges = () =>
    setVisiblePriceRanges((prev) =>
      Math.min(prev + 5, priceRangeOptions.length)
    );
  const showLessPriceRanges = () =>
    setVisiblePriceRanges(DisplayCountEnum.INITIAL_PRICE_RANGES);

  const showMoreYearRanges = () =>
    setVisibleYearRanges((prev) => Math.min(prev + 5, yearRangeOptions.length));
  const showLessYearRanges = () =>
    setVisibleYearRanges(DisplayCountEnum.INITIAL_YEAR_RANGES);

  const resetVisibleCounts = () => {
    setVisibleVehicleTypes(DisplayCountEnum.INITIAL_VEHICLE_TYPES);
    setVisibleBrands(DisplayCountEnum.INITIAL_BRANDS);
    setVisiblePriceRanges(DisplayCountEnum.INITIAL_PRICE_RANGES);
    setVisibleYearRanges(DisplayCountEnum.INITIAL_YEAR_RANGES);
  };

  const filtersContent = (
    <div className="space-y-6">
      <div className="space-y-3">
        <FilterSection
          title="Rango de Precio (ARS)"
          name="price"
          options={priceRangeOptions.slice(0, visiblePriceRanges)}
          selectedValue={selectedFilters.priceRange}
          onChange={handlePriceRangeChange}
        />
        <div className="flex space-x-2 mt-2">
          {visiblePriceRanges < priceRangeOptions.length && (
            <button
              onClick={showMorePriceRanges}
              className="text-xs bg-white/5 hover:bg-white/10 text-white/80 hover:text-white py-1.5 px-3 rounded-md flex items-center transition-all border border-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Ver más opciones
            </button>
          )}
          {visiblePriceRanges > DisplayCountEnum.INITIAL_PRICE_RANGES && (
            <button
              onClick={showLessPriceRanges}
              className="text-xs bg-white/5 hover:bg-white/10 text-white/80 hover:text-white py-1.5 px-3 rounded-md flex items-center transition-all border border-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 12H6"
                />
              </svg>
              Ver menos opciones
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <FilterSection
          title="Tipo de Vehículo"
          name="type"
          options={vehicleTypeOptions.slice(0, visibleVehicleTypes)}
          selectedValues={selectedFilters.vehicleTypes}
          onChange={handleVehicleTypeChange}
        />
        <div className="flex space-x-2 mt-2">
          {visibleVehicleTypes < vehicleTypeOptions.length && (
            <button
              onClick={showMoreVehicleTypes}
              className="text-xs bg-white/5 hover:bg-white/10 text-white/80 hover:text-white py-1.5 px-3 rounded-md flex items-center transition-all border border-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Ver más tipos ({vehicleTypeOptions.length - visibleVehicleTypes})
            </button>
          )}
          {visibleVehicleTypes > DisplayCountEnum.INITIAL_VEHICLE_TYPES && (
            <button
              onClick={showLessVehicleTypes}
              className="text-xs bg-white/5 hover:bg-white/10 text-white/80 hover:text-white py-1.5 px-3 rounded-md flex items-center transition-all border border-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 12H6"
                />
              </svg>
              Ver menos tipos
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <FilterSection
          title="Marca"
          name="brand"
          options={brands
            .slice(0, visibleBrands)
            .map((brand) => ({ id: brand.id, label: brand.name }))}
          selectedValues={selectedFilters.brands}
          onChange={handleBrandChange}
        />
        <div className="flex space-x-2 mt-2">
          {visibleBrands < brands.length && (
            <button
              onClick={showMoreBrands}
              className="text-xs bg-white/5 hover:bg-white/10 text-white/80 hover:text-white py-1.5 px-3 rounded-md flex items-center transition-all border border-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Ver más marcas ({brands.length - visibleBrands})
            </button>
          )}
          {visibleBrands > DisplayCountEnum.INITIAL_BRANDS && (
            <button
              onClick={showLessBrands}
              className="text-xs bg-white/5 hover:bg-white/10 text-white/80 hover:text-white py-1.5 px-3 rounded-md flex items-center transition-all border border-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 12H6"
                />
              </svg>
              Ver menos marcas
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <FilterSection
          title="Año"
          name="year"
          options={yearRangeOptions.slice(0, visibleYearRanges)}
          selectedValue={selectedFilters.yearRange}
          onChange={handleYearRangeChange}
        />
        <div className="flex space-x-2 mt-2">
          {visibleYearRanges < yearRangeOptions.length && (
            <button
              onClick={showMoreYearRanges}
              className="text-xs bg-white/5 hover:bg-white/10 text-white/80 hover:text-white py-1.5 px-3 rounded-md flex items-center transition-all border border-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Ver más rangos
            </button>
          )}
          {visibleYearRanges > DisplayCountEnum.INITIAL_YEAR_RANGES && (
            <button
              onClick={showLessYearRanges}
              className="text-xs bg-white/5 hover:bg-white/10 text-white/80 hover:text-white py-1.5 px-3 rounded-md flex items-center transition-all border border-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 12H6"
                />
              </svg>
              Ver menos rangos
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="p-4 md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center w-full bg-[#facc15] text-principal-blue py-2 rounded-md font-semibold shadow-sm transition"
        >
          Filtros
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-white bg-opacity-50"
            onClick={() => setOpen(false)}
          />

          <aside className="relative w-80 bg-principal-blue text-white p-5 space-y-5 overflow-y-auto max-h-screen">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-white p-1 rounded-full hover:bg-white/10"
              aria-label="Cerrar filtros"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white">Filtros</h2>
              <p className="text-xs text-white/70 mt-1">
                Personaliza tu búsqueda
              </p>
            </div>

            {filtersContent}

            <div className="flex flex-col space-y-3 pt-2 border-t border-white/10">
              <button
                onClick={applyFilters}
                className="w-full bg-[#facc15] text-principal-blue hover:brightness-95 py-2 rounded-md font-semibold shadow-sm transition text-sm flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Aplicar Filtros
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full bg-white/10 text-white hover:bg-white/20 py-2 rounded-md font-medium transition text-sm flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Limpiar Filtros
              </button>
            </div>
          </aside>
        </div>
      )}

      <aside className="hidden md:block w-full md:w-64 bg-principal-blue text-white p-5 space-y-5 rounded-lg">
        <div className="border-b border-white/10 pb-3">
          <h2 className="text-lg font-bold text-white">Filtros</h2>
          <p className="text-xs text-white/70 mt-1">Personaliza tu búsqueda</p>
        </div>

        {filtersContent}

        <div className="flex flex-col space-y-3 pt-2 border-t border-white/10">
          <button
            onClick={applyFilters}
            className="w-full bg-[#facc15] text-principal-blue hover:brightness-95 py-2 rounded-md font-semibold shadow-sm transition text-sm flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Aplicar Filtros
          </button>
          <button
            onClick={handleResetFilters}
            className="w-full bg-white/10 text-white hover:bg-white/20 py-2 rounded-md font-medium transition text-sm flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Limpiar Filtros
          </button>
        </div>
      </aside>
    </>
  );
}

interface FilterSectionProps {
  title: string;
  name: string;
  options: Array<string | { id: string; label: string }>;
  selectedValue?: string;
  selectedValues?: string[];
  onChange: (value: string, isChecked: boolean) => void;
  minimal?: boolean;
}

function FilterSection({
  title,
  options,
  name,
  selectedValue,
  selectedValues = [],
  onChange,
  minimal = false,
}: FilterSectionProps) {
  return (
    <div>
      <h3 className="text-base font-semibold text-white mb-3 flex items-center">
        {title}
        <span className="ml-auto text-xs text-white/50 bg-white/5 px-2 py-0.5 rounded-full">
          {options.length}
        </span>
      </h3>
      <div className="space-y-3">
        {options.map((option, index) => {
          const id = typeof option === "string" ? option : option.id;
          const label = typeof option === "string" ? option : option.label;
          const isChecked = selectedValue === id || selectedValues.includes(id);

          return (
            <div className="flex items-center group" key={index}>
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id={`${name}-${index}`}
                  checked={isChecked}
                  onChange={(e) => onChange(id, e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-5 w-5 rounded-md border border-white/20 bg-white/5 peer-checked:bg-[#facc15] peer-checked:border-[#facc15] transition-all mr-3 flex items-center justify-center">
                  {isChecked && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-black"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <label
                htmlFor={`${name}-${index}`}
                className="text-white/80 group-hover:text-white cursor-pointer text-sm flex-1 truncate transition-colors"
              >
                {label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
