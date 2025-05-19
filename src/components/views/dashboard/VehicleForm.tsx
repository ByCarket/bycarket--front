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

	const validationSchema = Yup.object({
		brandId: Yup.string().required("La marca es obligatoria"),
		modelId: Yup.string().required("El modelo es obligatorio"),
		versionId: Yup.string().required("La versión es obligatoria"),
		year: Yup.number()
			.required("El año es obligatorio")
			.min(1900, "El año debe ser mayor a 1900")
			.max(
				new Date().getFullYear() + 1,
				`El año no puede ser mayor a ${new Date().getFullYear() + 1}`
			),
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
	});

	const formik = useFormik<VehicleData>({
		initialValues: {
			brandId: "",
			modelId: "",
			versionId: "",
			year: new Date().getFullYear(),
			price: 0,
			mileage: 0,
			description: "",
			images: [],
		},
		validationSchema,
		onSubmit: async (values) => {
			await submitVehicle(values);
		},
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files);
			formik.setFieldValue("images", [
				...(formik.values.images || []),
				...filesArray,
			]);

			const newPreviewUrls = filesArray.map((file) =>
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

	const handleBrandSelect = (brandId: string, brandName: string) => {
		formik.setFieldValue("brandId", brandId);
		setBrandSearch(brandName);
		setShowBrandDropdown(false);
		handleBrandChange(brandId);
		formik.setFieldValue("modelId", "");
		formik.setFieldValue("versionId", "");
		setModelSearch("");
		setVersionSearch("");
	};

	const handleModelSelect = (modelId: string, modelName: string) => {
		formik.setFieldValue("modelId", modelId);
		setModelSearch(modelName);
		setShowModelDropdown(false);
		handleModelChange(modelId);
		formik.setFieldValue("versionId", "");
		setVersionSearch("");
	};

	const handleVersionSelect = (versionId: string, versionName: string) => {
		formik.setFieldValue("versionId", versionId);
		setVersionSearch(versionName);
		setShowVersionDropdown(false);
	};

	return (
		<div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
			<h1 className='text-3xl font-light text-principal-blue mb-6 text-center'>
				Registrar Vehículo
			</h1>

			{error && (
				<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
					{error}
				</div>
			)}

			{success && (
				<div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
					¡Vehículo registrado exitosamente!
				</div>
			)}

			<form onSubmit={formik.handleSubmit} className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='relative' ref={brandDropdownRef}>
						<label
							htmlFor='brandSearch'
							className='block text-sm font-medium text-gray-700 mb-1'>
							Marca
						</label>
						<div className='relative'>
							<input
								id='brandSearch'
								type='text'
								value={brandSearch}
								onChange={(e) => {
									setBrandSearch(e.target.value);
									setShowBrandDropdown(true);
								}}
								onFocus={() => setShowBrandDropdown(true)}
								placeholder='Buscar marca...'
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue'
							/>
							<Search className='absolute right-3 top-2.5 h-5 w-5 text-gray-400' />
						</div>
						{showBrandDropdown && (
							<div className='absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto'>
								{filteredBrands.length > 0 ? (
									filteredBrands.map((brand) => (
										<div
											key={brand.id}
											className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
											onClick={() =>
												handleBrandSelect(
													brand.id,
													brand.name
												)
											}>
											{brand.name}
										</div>
									))
								) : (
									<div className='px-4 py-2 text-gray-500'>
										No se encontraron marcas
									</div>
								)}
							</div>
						)}
						{formik.touched.brandId && formik.errors.brandId ? (
							<div className='text-red-500 text-xs mt-1'>
								{formik.errors.brandId}
							</div>
						) : null}
					</div>

					<div className='relative' ref={modelDropdownRef}>
						<label
							htmlFor='modelSearch'
							className='block text-sm font-medium text-gray-700 mb-1'>
							Modelo
						</label>
						<div className='relative'>
							<input
								id='modelSearch'
								type='text'
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
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue disabled:bg-gray-100'
							/>
							<Search className='absolute right-3 top-2.5 h-5 w-5 text-gray-400' />
						</div>
						{showModelDropdown && selectedBrand && (
							<div className='absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto'>
								{filteredModels.length > 0 ? (
									filteredModels.map((model) => (
										<div
											key={model.id}
											className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
											onClick={() =>
												handleModelSelect(
													model.id,
													model.name
												)
											}>
											{model.name}
										</div>
									))
								) : (
									<div className='px-4 py-2 text-gray-500'>
										No se encontraron modelos
									</div>
								)}
							</div>
						)}
						{formik.touched.modelId && formik.errors.modelId ? (
							<div className='text-red-500 text-xs mt-1'>
								{formik.errors.modelId}
							</div>
						) : null}
					</div>

					<div className='relative' ref={versionDropdownRef}>
						<label
							htmlFor='versionSearch'
							className='block text-sm font-medium text-gray-700 mb-1'>
							Versión
						</label>
						<div className='relative'>
							<input
								id='versionSearch'
								type='text'
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
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue disabled:bg-gray-100'
							/>
							<Search className='absolute right-3 top-2.5 h-5 w-5 text-gray-400' />
						</div>
						{showVersionDropdown && selectedModel && (
							<div className='absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto'>
								{filteredVersions.length > 0 ? (
									filteredVersions.map((version) => (
										<div
											key={version.id}
											className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
											onClick={() =>
												handleVersionSelect(
													version.id,
													version.name
												)
											}>
											{version.name}
										</div>
									))
								) : (
									<div className='px-4 py-2 text-gray-500'>
										No se encontraron versiones
									</div>
								)}
							</div>
						)}
						{formik.touched.versionId && formik.errors.versionId ? (
							<div className='text-red-500 text-xs mt-1'>
								{formik.errors.versionId}
							</div>
						) : null}
					</div>

					<div>
						<label
							htmlFor='year'
							className='block text-sm font-medium text-gray-700 mb-1'>
							Año
						</label>
						<input
							id='year'
							name='year'
							type='number'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.year}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue'
						/>
						{formik.touched.year && formik.errors.year ? (
							<div className='text-red-500 text-xs mt-1'>
								{formik.errors.year}
							</div>
						) : null}
					</div>

					<div>
						<label
							htmlFor='price'
							className='block text-sm font-medium text-gray-700 mb-1'>
							Precio (USD)
						</label>
						<input
							id='price'
							name='price'
							type='number'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.price}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue'
						/>
						{formik.touched.price && formik.errors.price ? (
							<div className='text-red-500 text-xs mt-1'>
								{formik.errors.price}
							</div>
						) : null}
					</div>

					<div>
						<label
							htmlFor='mileage'
							className='block text-sm font-medium text-gray-700 mb-1'>
							Kilometraje
						</label>
						<input
							id='mileage'
							name='mileage'
							type='number'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.mileage}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue'
						/>
						{formik.touched.mileage && formik.errors.mileage ? (
							<div className='text-red-500 text-xs mt-1'>
								{formik.errors.mileage}
							</div>
						) : null}
					</div>
				</div>

				<div>
					<label
						htmlFor='description'
						className='block text-sm font-medium text-gray-700 mb-1'>
						Descripción
					</label>
					<textarea
						id='description'
						name='description'
						rows={4}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.description}
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue'
					/>
					{formik.touched.description && formik.errors.description ? (
						<div className='text-red-500 text-xs mt-1'>
							{formik.errors.description}
						</div>
					) : null}
				</div>

				<div>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Imágenes (opcional)
					</label>
					<div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md'>
						<div className='space-y-1 text-center'>
							<Upload className='mx-auto h-12 w-12 text-gray-400' />
							<div className='flex text-sm text-gray-600'>
								<label
									htmlFor='file-upload'
									className='relative cursor-pointer bg-white rounded-md font-medium text-principal-blue hover:text-secondary-blue'>
									<span>Subir imágenes</span>
									<input
										id='file-upload'
										name='file-upload'
										type='file'
										multiple
										accept='image/*'
										className='sr-only'
										ref={fileInputRef}
										onChange={handleFileChange}
									/>
								</label>
								<p className='pl-1'>o arrastra y suelta</p>
							</div>
							<p className='text-xs text-gray-500'>
								PNG, JPG, GIF hasta 10MB
							</p>
						</div>
					</div>

					{previewImages.length > 0 && (
						<div className='mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
							{previewImages.map((src, index) => (
								<div key={index} className='relative'>
									<Image
										src={src}
										alt={`Preview ${index}`}
										className='h-24 w-full object-cover rounded-md'
										width={100}
										height={100}
									/>
									<button
										type='button'
										onClick={() => removeImage(index)}
										className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1'>
										<X className='h-4 w-4' />
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				<div className='flex justify-end'>
					<button
						type='submit'
						disabled={loading}
						className='px-6 py-2 bg-principal-blue hover:bg-secondary-blue text-white font-medium rounded-md transition duration-300 disabled:opacity-50'>
						{loading ? "Registrando..." : "Registrar Vehículo"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default VehicleForm;
