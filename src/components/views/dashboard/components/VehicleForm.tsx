"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useVehicleForm } from "@/hooks/useVehicleForm";
import { VehicleData } from "@/services/vehicle.service";
import { Search, Upload, X } from "lucide-react";
import Image from "next/image";

const VehicleForm: React.FC = () => {
  const {
    brands,
    models,
    versions,
    loading,
    error,
    success,
    selectedBrand,
    selectedModel,
    handleBrandChange,
    handleModelChange,
    submitVehicle,
    getModelsByBrand,
    getVersionsByModel,
  } = useVehicleForm();

  const [brandSearch, setBrandSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [versionSearch, setVersionSearch] = useState("");
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const brandDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const versionDropdownRef = useRef<HTMLDivElement>(null);

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(modelSearch.toLowerCase())
  );

  const filteredVersions = versions.filter((version) =>
    version.name.toLowerCase().includes(versionSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        brandDropdownRef.current &&
        !brandDropdownRef.current.contains(event.target as Node)
      ) {
        setShowBrandDropdown(false);
      }
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(event.target as Node)
      ) {
        setShowModelDropdown(false);
      }
      if (
        versionDropdownRef.current &&
        !versionDropdownRef.current.contains(event.target as Node)
      ) {
        setShowVersionDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [imageError, setImageError] = useState<string>("");

  const validationSchema = Yup.object({
    brandId: Yup.string().required("La marca es obligatoria"),
    modelId: Yup.string().required("El modelo es obligatorio"),
    versionId: Yup.string().required("La versión es obligatoria"),
    typeOfVehicle: Yup.string().required("El tipo de vehículo es obligatorio"),
    year: Yup.number()
      .required("El año es obligatorio")
      .min(1900, "El año debe ser mayor a 1900")
      .max(
        new Date().getFullYear() + 1,
        `El año no puede ser mayor a ${new Date().getFullYear() + 1}`
      ),
    condition: Yup.string().required("La condición es obligatoria"),
    currency: Yup.string().required("La moneda es obligatoria"),
    price: Yup.number()
      .required("El precio es obligatorio")
      .min(1, "El precio debe ser mayor a 0"),
    mileage: Yup.number()
      .required("El kilometraje es obligatorio")
      .min(0, "El kilometraje no puede ser negativo"),
    description: Yup.string()
      .required("La descripción es obligatoria")
      .min(10, "La descripción debe tener al menos 10 caracteres")
      .max(500, "La descripción no puede exceder los 500 caracteres"),
    images: Yup.array()
      .min(1, "Debes subir al menos una imagen")
      .required("Debes subir al menos una imagen"),
  });

  const formik = useFormik<VehicleData>({
    initialValues: {
      brandId: "",
      modelId: "",
      versionId: "",
      typeOfVehicle: "SUV",
      year: new Date().getFullYear(),
      condition: "new",
      currency: "",
      price: 0,
      mileage: 0,
      description: "",
      images: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await submitVehicle(values);
        formik.resetForm();
        setBrandSearch("");
        setModelSearch("");
        setVersionSearch("");
        setPreviewImages([]);
      } catch (err) {
        console.error(err);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles = filesArray.filter((file) => file.size <= 1024 * 1024);

      if (validFiles.length !== filesArray.length) {
        setImageError("Algunas imágenes superan 1MB y no fueron incluidas");
      }

      const totalImages = [...(formik.values.images || []), ...validFiles];

      if (totalImages.length > 6) {
        setImageError("Solo puedes subir un máximo de 6 imágenes");
        return;
      }

      formik.setFieldValue("images", totalImages);
      setImageError("");

      const newPreviewUrls = validFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages([...previewImages, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formik.values.images ? [...formik.values.images] : [];
    newImages.splice(index, 1);
    formik.setFieldValue("images", newImages);

    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  const handleBrandSelect = async (brandId: string, brandName: string) => {
    formik.setFieldValue("brandId", brandId);
    formik.setFieldValue("modelId", "");
    formik.setFieldValue("versionId", "");
    setBrandSearch(brandName);
    setShowBrandDropdown(false);
    const models = await getModelsByBrand(brandId);
    handleBrandChange(brandId, models);
  };

  const handleModelSelect = async (modelId: string, modelName: string) => {
    formik.setFieldValue("modelId", modelId);
    formik.setFieldValue("versionId", "");
    setModelSearch(modelName);
    setShowModelDropdown(false);
    const versions = await getVersionsByModel(modelId);
    handleModelChange(modelId, versions);
  };

  const handleVersionSelect = (versionId: string, versionName: string) => {
    formik.setFieldValue("versionId", versionId);
    setVersionSearch(versionName);
    setShowVersionDropdown(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-light text-principal-blue mb-6 text-center">
        Registrar Vehículo
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ¡Vehículo registrado exitosamente!
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative" ref={brandDropdownRef}>
            <label
              htmlFor="brandSearch"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Marca
            </label>
            <div className="relative">
              <input
                id="brandSearch"
                type="text"
                value={brandSearch}
                onChange={(e) => {
                  setBrandSearch(e.target.value);
                  setShowBrandDropdown(true);
                }}
                onFocus={() => setShowBrandDropdown(true)}
                placeholder="Buscar marca..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {showBrandDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
                {filteredBrands.length > 0 ? (
                  filteredBrands.map((brand) => (
                    <div
                      key={brand.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleBrandSelect(brand.id, brand.name)}
                    >
                      {brand.name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">
                    No se encontraron marcas
                  </div>
                )}
              </div>
            )}
            {formik.touched.brandId && formik.errors.brandId ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.brandId}
              </div>
            ) : null}
          </div>

          <div className="relative" ref={modelDropdownRef}>
            <label
              htmlFor="modelSearch"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Modelo
            </label>
            <div className="relative">
              <input
                id="modelSearch"
                type="text"
                value={modelSearch}
                onChange={(e) => {
                  setModelSearch(e.target.value);
                  setShowModelDropdown(true);
                }}
                onFocus={() => {
                  if (selectedBrand) {
                    setShowModelDropdown(true);
                  }
                }}
                placeholder={
                  selectedBrand
                    ? "Buscar modelo..."
                    : "Selecciona una marca primero"
                }
                disabled={!selectedBrand}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue disabled:bg-gray-100"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {showModelDropdown && selectedBrand && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
                {filteredModels.length > 0 ? (
                  filteredModels.map((model) => (
                    <div
                      key={model.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleModelSelect(model.id, model.name)}
                    >
                      {model.name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">
                    No se encontraron modelos
                  </div>
                )}
              </div>
            )}
            {formik.touched.modelId && formik.errors.modelId ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.modelId}
              </div>
            ) : null}
          </div>

          <div className="relative" ref={versionDropdownRef}>
            <label
              htmlFor="versionSearch"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Versión
            </label>
            <div className="relative">
              <input
                id="versionSearch"
                type="text"
                value={versionSearch}
                onChange={(e) => {
                  setVersionSearch(e.target.value);
                  setShowVersionDropdown(true);
                }}
                onFocus={() => {
                  if (selectedModel) {
                    setShowVersionDropdown(true);
                  }
                }}
                placeholder={
                  selectedModel
                    ? "Buscar versión..."
                    : "Selecciona un modelo primero"
                }
                disabled={!selectedModel}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue disabled:bg-gray-100"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {showVersionDropdown && selectedModel && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
                {filteredVersions.length > 0 ? (
                  filteredVersions.map((version) => (
                    <div
                      key={version.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        handleVersionSelect(version.id, version.name);
                        setShowVersionDropdown(false);
                        setVersionSearch(version.name);
                      }}
                    >
                      {version.name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">
                    No se encontraron versiones
                  </div>
                )}
              </div>
            )}
            {formik.touched.versionId && formik.errors.versionId ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.versionId}
              </div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="typeOfVehicle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tipo de Vehículo
            </label>
            <select
              id="typeOfVehicle"
              name="typeOfVehicle"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.typeOfVehicle}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue"
            >
              <option value="SUV">SUV</option>
              <option value="SEDAN">Sedan</option>
              <option value="HATCHBACK">Hatchback</option>
              <option value="PICKUP_TRUCK">Pickup</option>
              <option value="COUPE">Coupe</option>
              <option value="CONVERTIBLE">Convertible</option>
              <option value="WAGON">Wagon</option>
              <option value="VAN">Van</option>
              <option value="LUXURY">Lujo</option>
              <option value="OFF_ROAD">Todo Terreno</option>
              <option value="CROSSOVER">Crossover</option>
              <option value="COMPACT">Compacto</option>
            </select>
            {formik.touched.typeOfVehicle && formik.errors.typeOfVehicle ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.typeOfVehicle}
              </div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Año
            </label>
            <input
              id="year"
              name="year"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.year}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue"
            />
            {formik.touched.year && formik.errors.year ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.year}
              </div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="condition"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Condición
            </label>
            <select
              id="condition"
              name="condition"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.condition}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue"
            >
              <option value="new">Nuevo</option>
              <option value="used">Usado</option>
            </select>
            {formik.touched.condition && formik.errors.condition ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.condition}
              </div>
            ) : null}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Moneda <span className="text-red-500">*</span>
            </label>
            <select
              id="currency"
              name="currency"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.currency}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue"
            >
              <option value="">Seleccione una moneda</option>
              <option value="U$D">Dólares (U$D)</option>
              <option value="AR$">Pesos Argentinos (AR$)</option>
            </select>
            {formik.touched.currency && formik.errors.currency ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.currency}
              </div>
            ) : null}
          </div>

          <div className="flex space-x-4">
            <div className="w-1/3">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Precio
              </label>
              <input
                id="price"
                name="price"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.price}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue"
              />
              {formik.touched.price && formik.errors.price ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.price}
                </div>
              ) : null}
            </div>
            <div className="w-2/3">
              <label
                htmlFor="mileage"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Kilometraje
              </label>
              <input
                id="mileage"
                name="mileage"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.values.condition === "new"}
                value={formik.values.mileage}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                  formik.values.condition === "new"
                    ? "bg-gray-100 border-gray-200 text-gray-400"
                    : "border-gray-300 focus:ring-secondary-blue"
                }`}
              />
              {formik.touched.mileage && formik.errors.mileage ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.mileage}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue"
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.description}
            </div>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imágenes <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[...Array(6)].map((_, index) => {
              const hasImage = index < previewImages.length;
              return (
                <div
                  key={index}
                  className={`relative border-2 ${
                    hasImage
                      ? "border-green-400"
                      : "border-gray-300 border-dashed"
                  } rounded-md aspect-square flex items-center justify-center overflow-hidden ${
                    !hasImage && "cursor-pointer hover:bg-gray-50"
                  }`}
                  onClick={() => !hasImage && fileInputRef.current?.click()}
                >
                  {hasImage ? (
                    <>
                      <Image
                        src={previewImages[index]}
                        alt={`Imagen ${index + 1}`}
                        className="object-cover w-full h-full"
                        width={150}
                        height={150}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">
                        {index === 0
                          ? "Imagen principal*"
                          : `Imagen ${index + 1}`}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <input
            id="file-upload"
            name="file-upload"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/jpg,image/webp"
            className="sr-only"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
            <p>Formatos: JPG, JPEG, PNG o WEBP</p>
            <p>Máximo: 1MB por imagen</p>
          </div>

          {(imageError || (formik.touched.images && formik.errors.images)) && (
            <div className="text-red-500 text-xs mt-1">
              {imageError ||
                (typeof formik.errors.images === "string"
                  ? formik.errors.images
                  : "Debes subir al menos una imagen")}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-principal-blue hover:bg-secondary-blue text-white font-medium rounded-md transition duration-300 disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Registrar Vehículo"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
