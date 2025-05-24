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
  const [visibleVehicleTypes, setVisibleVehicleTypes] = useState(DisplayCountEnum.INITIAL_VEHICLE_TYPES);
  const [visibleBrands, setVisibleBrands] = useState(DisplayCountEnum.INITIAL_BRANDS);
  const [visiblePriceRanges, setVisiblePriceRanges] = useState(DisplayCountEnum.INITIAL_PRICE_RANGES);
  const [visibleYearRanges, setVisibleYearRanges] = useState(DisplayCountEnum.INITIAL_YEAR_RANGES);
  const [selectedFilters, setSelectedFilters] = useState<{
    priceRange?: string;
    vehicleTypes: string[];
    brands: string[];
    yearRange?: string;
  }>({
    vehicleTypes: [],
    brands: [],
  });

  const { setPriceRange, setYearRange, updateFilter, resetFilters } = useFilters(filters);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brandsData = await getBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error("Error loading brands:", error);
      }
    };

    loadBrands();
  }, []);

  const handlePriceRangeChange = (range: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedFilters(prev => ({ ...prev, priceRange: range }));
      setPriceRange(range);
    } else if (selectedFilters.priceRange === range) {
      setSelectedFilters(prev => ({ ...prev, priceRange: undefined }));
      setPriceRange("");
    }
  };

  const handleVehicleTypeChange = (type: string, isChecked: boolean) => {
    let newTypes = [...selectedFilters.vehicleTypes];
    
    if (isChecked) {
      newTypes.push(type);
    } else {
      newTypes = newTypes.filter(t => t !== type);
    }
    
    setSelectedFilters(prev => ({ ...prev, vehicleTypes: newTypes }));
    
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
      newBrands = newBrands.filter(b => b !== brandId);
    }
    
    setSelectedFilters(prev => ({ ...prev, brands: newBrands }));
    
    if (newBrands.length > 0) {
      updateFilter("brandId", newBrands[0]);
    } else {
      updateFilter("brandId", undefined);
    }
  };

  const handleYearRangeChange = (range: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedFilters(prev => ({ ...prev, yearRange: range }));
      setYearRange(range);
    } else if (selectedFilters.yearRange === range) {
      setSelectedFilters(prev => ({ ...prev, yearRange: undefined }));
      setYearRange("");
    }
  };

  const applyFilters = () => {
    onFilterChange(filters);
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

  const showAllVehicleTypes = () => setVisibleVehicleTypes(vehicleTypeOptions.length);
  const showLessVehicleTypes = () => setVisibleVehicleTypes(DisplayCountEnum.INITIAL_VEHICLE_TYPES);
  
  const showAllBrands = () => setVisibleBrands(brands.length);
  const showLessBrands = () => setVisibleBrands(DisplayCountEnum.INITIAL_BRANDS);
  
  const showAllPriceRanges = () => setVisiblePriceRanges(priceRangeOptions.length);
  const showLessPriceRanges = () => setVisiblePriceRanges(DisplayCountEnum.INITIAL_PRICE_RANGES);
  
  const showAllYearRanges = () => setVisibleYearRanges(yearRangeOptions.length);
  const showLessYearRanges = () => setVisibleYearRanges(DisplayCountEnum.INITIAL_YEAR_RANGES);

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
        {visiblePriceRanges < priceRangeOptions.length ? (
          <button 
            onClick={showAllPriceRanges}
            className="text-xs text-white/70 hover:text-white flex items-center mt-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Ver más opciones
          </button>
        ) : (
          <button 
            onClick={showLessPriceRanges}
            className="text-xs text-white/70 hover:text-white flex items-center mt-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            Ver menos opciones
          </button>
        )}
      </div>

      <div className="space-y-3">
        <FilterSection
          title="Tipo de Vehículo"
          name="type"
          options={vehicleTypeOptions.slice(0, visibleVehicleTypes)}
          selectedValues={selectedFilters.vehicleTypes}
          onChange={handleVehicleTypeChange}
        />
        {visibleVehicleTypes < vehicleTypeOptions.length ? (
          <button 
            onClick={showAllVehicleTypes}
            className="text-xs text-white/70 hover:text-white flex items-center mt-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Ver más tipos ({vehicleTypeOptions.length - visibleVehicleTypes})
          </button>
        ) : (
          <button 
            onClick={showLessVehicleTypes}
            className="text-xs text-white/70 hover:text-white flex items-center mt-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            Ver menos tipos
          </button>
        )}
      </div>

      <div className="space-y-3">
        <FilterSection
          title="Marca"
          name="brand"
          options={brands.slice(0, visibleBrands).map(brand => ({ id: brand.id, label: brand.name }))}
          selectedValues={selectedFilters.brands}
          onChange={handleBrandChange}
        />
        {visibleBrands < brands.length ? (
          <button 
            onClick={showAllBrands}
            className="text-xs text-white/70 hover:text-white flex items-center mt-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Ver más marcas ({brands.length - visibleBrands})
          </button>
        ) : (
          <button 
            onClick={showLessBrands}
            className="text-xs text-white/70 hover:text-white flex items-center mt-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            Ver menos marcas
          </button>
        )}
      </div>

      <div className="space-y-3">
        <FilterSection
          title="Año"
          name="year"
          options={yearRangeOptions.slice(0, visibleYearRanges)}
          selectedValue={selectedFilters.yearRange}
          onChange={handleYearRangeChange}
        />
        {visibleYearRanges < yearRangeOptions.length ? (
          <button 
            onClick={showAllYearRanges}
            className="text-xs text-white/70 hover:text-white flex items-center mt-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Ver más rangos
          </button>
        ) : (
          <button 
            onClick={showLessYearRanges}
            className="text-xs text-white/70 hover:text-white flex items-center mt-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            Ver menos rangos
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="p-4 md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center w-full bg-[#facc15] text-[#103663] py-2 rounded-md font-semibold shadow-sm transition"
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

          <aside className="relative w-80 bg-[#103663] text-white p-5 space-y-5 overflow-y-auto max-h-screen">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-white p-1 rounded-full hover:bg-white/10"
              aria-label="Cerrar filtros"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white">Filtros</h2>
              <p className="text-xs text-white/70 mt-1">Personaliza tu búsqueda</p>
            </div>

            {filtersContent}

            <div className="flex flex-col space-y-3 pt-2 border-t border-white/10">
              <button
                onClick={applyFilters}
                className="w-full bg-[#facc15] text-[#103663] hover:brightness-95 py-2 rounded-md font-semibold shadow-sm transition text-sm flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Aplicar Filtros
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full bg-white/10 text-white hover:bg-white/20 py-2 rounded-md font-medium transition text-sm flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpiar Filtros
              </button>
            </div>
          </aside>
        </div>
      )}

      <aside className="hidden md:block w-full md:w-64 bg-[#103663] text-white p-5 space-y-5 rounded-lg">
        <div className="border-b border-white/10 pb-3">
          <h2 className="text-lg font-bold text-white">Filtros</h2>
          <p className="text-xs text-white/70 mt-1">Personaliza tu búsqueda</p>
        </div>
        
        {filtersContent}
        
        <div className="flex flex-col space-y-3 pt-2 border-t border-white/10">
          <button 
            onClick={applyFilters}
            className="w-full bg-[#facc15] text-[#103663] hover:brightness-95 py-2 rounded-md font-semibold shadow-sm transition text-sm flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Aplicar Filtros
          </button>
          <button
            onClick={handleResetFilters}
            className="w-full bg-white/10 text-white hover:bg-white/20 py-2 rounded-md font-medium transition text-sm flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
      <h3 className="text-base font-semibold text-white mb-2 flex items-center">
        {title}
        <span className="ml-auto text-xs text-white/50">{options.length}</span>
      </h3>
      <div className={minimal ? "" : "space-y-2"}>
        {options.map((option, index) => {
          const id = typeof option === "string" ? option : option.id;
          const label = typeof option === "string" ? option : option.label;
          const isChecked = selectedValue === id || selectedValues.includes(id);
          
          return (
            <div className="flex items-center" key={index}>
              <input
                type="checkbox"
                id={`${name}-${index}`}
                checked={isChecked}
                onChange={(e) => onChange(id, e.target.checked)}
                className="mr-2 h-4 w-4 rounded border-white/30 text-[#facc15] focus:ring-[#facc15] focus:ring-opacity-25 hover:cursor-pointer"
              />
              <label
                htmlFor={`${name}-${index}`}
                className="text-white hover:text-white/80 cursor-pointer text-sm flex-1 truncate"
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
