"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "@/hooks/useSearchParams";
import {
  Brand,
  Model,
  Version,
  getBrands,
  getModelsByBrand,
  getVersionsByModel,
} from "@/services/vehicle.service";
import { FiChevronDown } from "react-icons/fi";

export function Filters() {
  const {
    params,
    setBrandId,
    setModelId,
    setVersionId,
    setTypeOfVehicle,
    setCondition,
    setCurrency,
    setPriceRange,
    setYearRange,
    setMileageRange,
  } = useSearchParams();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const vehicleTypes = [
    { value: "SUV", label: "SUV" },
    { value: "PICKUP", label: "Pickup" },
    { value: "MINIVAN", label: "Minivan" },
    { value: "LIGHT_TRUCK", label: "Camioneta" },
    { value: "COUPE", label: "Coupé" },
    { value: "HATCHBACK", label: "Hatchback" },
    { value: "FURGON", label: "Furgón" },
    { value: "SEDAN", label: "Sedán" },
    { value: "VAN", label: "Van" },
    { value: "RURAL", label: "Rural" },
    { value: "CABRIOLET", label: "Cabriolet" },
    { value: "SPORTSCAR", label: "Deportivo" },
    { value: "ROADSTER", label: "Roadster" },
    { value: "ELECTRIC", label: "Eléctrico" },
    { value: "HYBRID", label: "Híbrido" },
    { value: "LUXURY", label: "Lujo" },
    { value: "OFF_ROAD", label: "Todo terreno" },
    { value: "PICKUP_TRUCK", label: "Camioneta pickup" },
    { value: "CROSSOVER", label: "Crossover" },
    { value: "COMPACT", label: "Compacto" },
  ];

  const conditions = [
    { value: "new", label: "Nuevo" },
    { value: "used", label: "Usado" },
  ];

  type CurrencyOption = {
    value: "U$D" | "AR$";
    label: string;
  };

  const currencies: CurrencyOption[] = [
    { value: "U$D", label: "Dólares (U$D)" },
    { value: "AR$", label: "Pesos (AR$)" },
  ];

  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoading(true);
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        setBrands([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      if (!params.brandId) {
        setModels([]);
        setVersions([]);
        return;
      }

      setIsLoading(true);
      try {
        const modelsData = await getModelsByBrand(params.brandId);
        setModels(modelsData);
        setVersions([]);
      } catch (error) {
        setModels([]);
        setVersions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, [params.brandId]);

  useEffect(() => {
    const fetchVersions = async () => {
      if (!params.modelId) {
        setVersions([]);
        return;
      }

      setIsLoading(true);
      try {
        const versionsData = await getVersionsByModel(params.modelId);
        setVersions(versionsData);
      } catch (error) {
        setVersions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersions();
  }, [params.modelId]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
          <svg
            className="w-4 h-4 mr-1.5 text-principal-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5.172a2 2 0 00-.586-1.414L5 12m14 9v-5.172a2 2 0 00-.586-1.414L15 12"
            />
          </svg>
          Marca
        </label>
        <div className="relative">
          <select
            className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2.5 px-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-principal-blue/20 focus:border-principal-blue transition-all duration-200 cursor-pointer"
            value={params.brandId || ""}
            onChange={(e) => setBrandId(e.target.value || undefined)}
          >
            <option value="">Todas las marcas</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id} className="text-gray-700">
                {brand.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
            <FiChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
          <svg
            className="w-4 h-4 mr-1.5 text-principal-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          Modelo
        </label>
        <div className="relative">
          <select
            className={`w-full appearance-none bg-white border ${
              !params.brandId || isLoading
                ? "border-gray-100 text-gray-400"
                : "border-gray-200 text-gray-700"
            } rounded-lg py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-principal-blue/20 focus:border-principal-blue transition-all duration-200 cursor-pointer`}
            value={params.modelId || ""}
            onChange={(e) => setModelId(e.target.value || undefined)}
            disabled={!params.brandId || isLoading}
          >
            <option value="">Todos los modelos</option>
            {models.map((model) => (
              <option key={model.id} value={model.id} className="text-gray-700">
                {model.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
            <FiChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
          <svg
            className="w-4 h-4 mr-1.5 text-principal-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          Versión
        </label>
        <div className="relative">
          <select
            className={`w-full appearance-none bg-white border ${
              !params.modelId || isLoading
                ? "border-gray-100 text-gray-400"
                : "border-gray-200 text-gray-700"
            } rounded-lg py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-principal-blue/20 focus:border-principal-blue transition-all duration-200 cursor-pointer`}
            value={params.versionId || ""}
            onChange={(e) => setVersionId(e.target.value || undefined)}
            disabled={!params.modelId || isLoading}
          >
            <option value="">Todas las versiones</option>
            {versions.map((version) => (
              <option
                key={version.id}
                value={version.id}
                className="text-gray-700"
              >
                {version.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
            <FiChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
          <svg
            className="w-4 h-4 mr-1.5 text-principal-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          Tipo de vehículo
        </label>
        <div className="relative">
          <select
            className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2.5 px-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-principal-blue/20 focus:border-principal-blue transition-all duration-200 cursor-pointer"
            value={params.typeOfVehicle || ""}
            onChange={(e) =>
              setTypeOfVehicle((e.target.value as any) || undefined)
            }
          >
            <option value="">Todos los tipos</option>
            {vehicleTypes.map((type) => (
              <option
                key={type.value}
                value={type.value}
                className="text-gray-700"
              >
                {type.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
            <FiChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <svg
            className="w-4 h-4 mr-1.5 text-principal-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Condición
        </label>
        <div className="flex gap-3">
          {conditions.map((condition) => (
            <label
              key={condition.value}
              className={`flex-1 text-center py-2.5 px-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                params.condition === condition.value
                  ? "border-principal-blue bg-principal-blue/10 text-principal-blue font-medium"
                  : "border-gray-200 hover:border-secondary-blue/70 text-gray-600 hover:text-gray-800"
              }`}
            >
              <input
                type="radio"
                name="condition"
                className="hidden"
                checked={params.condition === condition.value}
                onChange={() => setCondition(condition.value as any)}
              />
              <span className="text-sm">{condition.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <svg
            className="w-4 h-4 mr-1.5 text-principal-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Moneda
        </label>
        <div className="flex gap-3">
          {currencies.map((currency) => {
            const isSelected = params.currency === currency.value;
            return (
              <label
                key={currency.value}
                className={`flex-1 text-center py-2 px-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-principal-blue bg-principal-blue/10 text-principal-blue font-medium"
                    : "border-gray-200 hover:border-secondary-blue/70 text-gray-600 hover:text-gray-800"
                }`}
              >
                <input
                  type="radio"
                  name="currency"
                  className="hidden"
                  checked={isSelected}
                  onChange={() => setCurrency(currency.value)}
                />
                <span className="text-sm">{currency.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <svg
            className="w-4 h-4 mr-1.5 text-principal-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Rango de precios
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {params.currency === "AR$" ? "$" : "U$D"}
            </span>
            <input
              type="number"
              placeholder="Mínimo"
              value={params.minPrice || ""}
              onChange={(e) =>
                setPriceRange(
                  Number(e.target.value) || undefined,
                  params.maxPrice
                )
              }
              className="w-full rounded-xl border-2 border-gray-200 py-2.5 pl-8 pr-3 focus:border-principal-blue focus:outline-none focus:ring-2 focus:ring-secondary-blue/50 transition-all duration-200"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {params.currency === "AR$" ? "$" : "U$D"}
            </span>
            <input
              type="number"
              placeholder="Máximo"
              value={params.maxPrice || ""}
              onChange={(e) =>
                setPriceRange(
                  params.minPrice,
                  Number(e.target.value) || undefined
                )
              }
              className="w-full rounded-xl border-2 border-gray-200 py-2.5 pl-8 pr-3 focus:border-principal-blue focus:outline-none focus:ring-2 focus:ring-secondary-blue/50 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <svg
            className="w-4 h-4 mr-1.5 text-principal-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Rango de años
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Desde"
            value={params.minYear || ""}
            onChange={(e) =>
              setYearRange(Number(e.target.value) || undefined, params.maxYear)
            }
            className="w-full rounded-xl border-2 border-gray-200 py-2.5 px-3 focus:border-principal-blue focus:outline-none focus:ring-2 focus:ring-secondary-blue/50 transition-all duration-200"
          />
          <input
            type="number"
            placeholder="Hasta"
            value={params.maxYear || ""}
            onChange={(e) =>
              setYearRange(params.minYear, Number(e.target.value) || undefined)
            }
            className="w-full rounded-xl border-2 border-gray-200 py-2.5 px-3 focus:border-principal-blue focus:outline-none focus:ring-2 focus:ring-secondary-blue/50 transition-all duration-200"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <svg
            className="w-4 h-4 mr-1.5 text-principal-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6c0 1.1.9 2 2 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Kilometraje
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <input
              type="number"
              placeholder="Mínimo"
              value={params.minMileage || ""}
              onChange={(e) =>
                setMileageRange(
                  Number(e.target.value) || undefined,
                  params.maxMileage
                )
              }
              className="w-full rounded-xl border-2 border-gray-200 py-2.5 px-3 focus:border-principal-blue focus:outline-none focus:ring-2 focus:ring-secondary-blue/50 transition-all duration-200"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              km
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              placeholder="Máximo"
              value={params.maxMileage || ""}
              onChange={(e) =>
                setMileageRange(
                  params.minMileage,
                  Number(e.target.value) || undefined
                )
              }
              className="w-full rounded-xl border-2 border-gray-200 py-2.5 px-3 focus:border-principal-blue focus:outline-none focus:ring-2 focus:ring-secondary-blue/50 transition-all duration-200"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              km
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => (window.location.href = window.location.pathname)}
        className="w-full py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-gray-700 rounded-lg text-sm font-medium transition-colors mt-4"
      >
        Limpiar filtros
      </button>
    </div>
  );
}
