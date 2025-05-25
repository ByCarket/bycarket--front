"use client";

import { useEffect, useState } from "react";
import {
	getUserVehicles,
	VehicleResponse,
	deleteVehicle,
	updateVehicle,
	getBrands,
	getModels,
	getVersions,
	Brand,
	Model,
	Version,
	VehicleData,
	uploadVehicleImages,
	deleteVehicleImage,
	getVehicleById
} from "@/services/vehicle.service";
import { useRouter } from "next/navigation";
import {
	Car as CarIcon,
	Pencil as PencilIcon,
	Trash as TrashIcon,
	X as XIcon,
	Save as SaveIcon,
} from "lucide-react";

import { useRef } from "react";
import Image from "next/image";

export default function VehiclesContent() {
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);

	const [editingImages, setEditingImages] = useState<{ public_id: string; secure_url: string }[]>([]);
	const [imageLoading, setImageLoading] = useState(false);
	const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [deleting, setDeleting] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [editingVehicle, setEditingVehicle] = useState<string | null>(null);
	const [updating, setUpdating] = useState(false);
	const [formData, setFormData] = useState<Partial<VehicleData>>({});
	const [brands, setBrands] = useState<Brand[]>([]);
	const [models, setModels] = useState<Model[]>([]);
	const [versions, setVersions] = useState<Version[]>([]);
	const router = useRouter();

	const fetchVehicles = async () => {
		try {
			setLoading(true);
			const userVehicles = await getUserVehicles();
			setVehicles(userVehicles);
		} catch (err: any) {
			setError("Error al cargar tus vehículos");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchVehicles();
		fetchBrands();
	}, []);

	const fetchBrands = async () => {
		try {
			const data = await getBrands();
			setBrands(data);
		} catch (err) {
			setError("Error al cargar las marcas");
		}
	};

	const fetchModels = async (brandId: string) => {
		try {
			const data = await getModels(brandId);
			setModels(data);
		} catch (err) {
			setError("Error al cargar los modelos");
		}
	};

	const fetchVersions = async (modelId: string) => {
		try {
			const data = await getVersions(modelId);
			setVersions(data);
		} catch (err) {
			setError("Error al cargar las versiones");
		}
	};

	const handleAddVehicle = () => {
		router.push("/dashboard?tab=register-vehicle");
	};

	const handleEditVehicle = async (vehicle: VehicleResponse) => {
	setSelectedImageIndex(0);
		setEditingImages(vehicle.images || []);
		setEditingVehicle(vehicle.id);
		setFormData({
			brandId: vehicle.brand.id,
			modelId: vehicle.model.id,
			versionId: vehicle.version.id,
			year: vehicle.year,
			price: vehicle.price,
			mileage: vehicle.mileage,
			description: vehicle.description,
		});

		await fetchModels(vehicle.brand.id);
		await fetchVersions(vehicle.model.id);
	};

	useEffect(() => {
	if (editingImages.length === 0) setSelectedImageIndex(0);
	else if (selectedImageIndex >= editingImages.length) setSelectedImageIndex(0);
}, [editingImages]);

const handleCancelEdit = () => {
		setEditingImages([]);
		setEditingVehicle(null);
		setFormData({});
	};

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;

		if (name === "brandId") {
			fetchModels(value);
			setFormData({
				...formData,
				brandId: value,
				modelId: "",
				versionId: "",
			});
		} else if (name === "modelId") {
			fetchVersions(value);
			setFormData({
				...formData,
				modelId: value,
				versionId: "",
			});
		} else if (name === "year" || name === "price" || name === "mileage") {
			setFormData({
				...formData,
				[name]: Number(value),
			});
		} else {
			setFormData({
				...formData,
				[name]: value,
			});
		}
	};

	const handleDeleteImage = async (publicId: string) => {
	if (!editingVehicle) return;
	setImageLoading(true);
	let removed = false;
	try {
		await deleteVehicleImage(editingVehicle, publicId);
		removed = true;
	} catch {
		removed = false;
	}
	setEditingImages(prev => prev.filter(img => img.public_id !== publicId));
	if (selectedImageIndex > 0 && selectedImageIndex >= editingImages.length - 1) setSelectedImageIndex(selectedImageIndex - 1);
	setImageLoading(false);
};

	const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
	if (!editingVehicle || !e.target.files) return;
	setImageLoading(true);
	const files = Array.from(e.target.files);
	try {
		await uploadVehicleImages(editingVehicle, files);
		const updated = await getVehicleById(editingVehicle);
		const merged = [...editingImages];
		updated.images.forEach(img => {
			if (!merged.some(i => i.public_id === img.public_id)) merged.push(img);
		});
		setEditingImages(merged.slice(0, 5));
		if (merged.length > 0) setSelectedImageIndex(merged.length - 1);
	} finally {
		setImageLoading(false);
	}
};

	const handleSaveVehicle = async (vehicleId: string) => {
		try {
			setUpdating(true);
			setError(null);

			await updateVehicle(vehicleId, formData);

			setSuccessMessage("Vehículo actualizado correctamente");
			setEditingVehicle(null);
			fetchVehicles();

			setTimeout(() => {
				setSuccessMessage(null);
			}, 3000);
		} catch (err: any) {
			setError("Error al actualizar el vehículo");
			setTimeout(() => {
				setError(null);
			}, 3000);
		} finally {
			setUpdating(false);
		}
	};

	const handleDeleteVehicle = async (vehicleId: string) => {
		if (
			window.confirm("¿Estás seguro que deseas eliminar este vehículo?")
		) {
			try {
				setDeleting(vehicleId);
				await deleteVehicle(vehicleId);
				setSuccessMessage("Vehículo eliminado correctamente");
				setVehicles(vehicles.filter((v) => v.id !== vehicleId));

				setTimeout(() => {
					setSuccessMessage(null);
				}, 3000);
			} catch (err: any) {
				setError("Error al eliminar el vehículo");
				setTimeout(() => {
					setError(null);
				}, 3000);
			} finally {
				setDeleting(null);
			}
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-[300px]'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue'></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='bg-red-50 border border-red-200 rounded-lg p-4 my-4'>
				<p className='text-red-600'>{error}</p>
			</div>
		);
	}

	if (vehicles.length === 0) {
		return (
			<div>
				<div className='flex justify-between items-center border-b pb-4 mb-6'>
					<h1 className='text-2xl font-bold text-principal-blue'>
						Mis vehículos
					</h1>
					<button
						onClick={handleAddVehicle}
						className='px-4 py-2 bg-principal-blue text-white rounded-md hover:bg-secondary-blue transition-colors'>
						Añadir vehículo
					</button>
				</div>
				<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4'>
					<p className='text-yellow-600'>
						No tienes vehículos registrados
					</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className='flex justify-between items-center border-b pb-4 mb-6'>
				<h1 className='text-2xl font-bold text-principal-blue'>
					Mis vehículos
				</h1>
				<button
					onClick={handleAddVehicle}
					className='px-4 py-2 bg-principal-blue text-white rounded-md hover:bg-secondary-blue transition-colors'>
					Añadir vehículo
				</button>
			</div>

			{successMessage && (
				<div className='bg-green-50 border border-green-200 rounded-lg p-4 my-4'>
					<p className='text-green-600'>{successMessage}</p>
				</div>
			)}

			{error && (
				<div className='bg-red-50 border border-red-200 rounded-lg p-4 my-4'>
					<p className='text-red-600'>{error}</p>
				</div>
			)}

			<div className='grid gap-4'>
				{vehicles.map((vehicle) => (
					<div
						key={vehicle.id}
						className='bg-white p-6 rounded-lg border border-gray-200 flex flex-col gap-4'>
						{editingVehicle === vehicle.id ? (
							<div className='space-y-4'>
								<div className='flex justify-between items-center'>
									<h3 className='font-semibold text-lg'>
										Editar vehículo
									</h3>
									<button
										onClick={handleCancelEdit}
										className='p-2 text-gray-500 hover:text-red-500'>
										<XIcon className='w-5 h-5' />
									</button>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<label className='block text-sm text-gray-500 mb-1'>
											Marca
										</label>
										<select
											name='brandId'
											value={formData.brandId || ""}
											onChange={handleInputChange}
											className='w-full p-2 border border-gray-300 rounded-md'>
											<option value=''>
												Seleccionar marca
											</option>
											{brands.map((brand) => (
												<option
													key={brand.id}
													value={brand.id}>
													{brand.name}
												</option>
											))}
										</select>
									</div>

									<div>
										<label className='block text-sm text-gray-500 mb-1'>
											Modelo
										</label>
										<select
											name='modelId'
											value={formData.modelId || ""}
											onChange={handleInputChange}
											className='w-full p-2 border border-gray-300 rounded-md'
											disabled={!formData.brandId}>
											<option value=''>
												Seleccionar modelo
											</option>
											{models.map((model) => (
												<option
													key={model.id}
													value={model.id}>
													{model.name}
												</option>
											))}
										</select>
									</div>

									<div>
										<label className='block text-sm text-gray-500 mb-1'>
											Versión
										</label>
										<select
											name='versionId'
											value={formData.versionId || ""}
											onChange={handleInputChange}
											className='w-full p-2 border border-gray-300 rounded-md'
											disabled={!formData.modelId}>
											<option value=''>
												Seleccionar versión
											</option>
											{versions.map((version) => (
												<option
													key={version.id}
													value={version.id}>
													{version.name}
												</option>
											))}
										</select>
									</div>

									<div>
										<label className='block text-sm text-gray-500 mb-1'>
											Año
										</label>
										<input
											type='number'
											name='year'
											value={formData.year || ""}
											onChange={handleInputChange}
											className='w-full p-2 border border-gray-300 rounded-md'
										/>
									</div>

									<div>
										<label className='block text-sm text-gray-500 mb-1'>
											Precio
										</label>
										<input
											type='number'
											name='price'
											value={formData.price || ""}
											onChange={handleInputChange}
											className='w-full p-2 border border-gray-300 rounded-md'
										/>
									</div>

									<div>
										<label className='block text-sm text-gray-500 mb-1'>
											Kilometraje
										</label>
										<input
											type='number'
											name='mileage'
											value={formData.mileage || ""}
											onChange={handleInputChange}
											className='w-full p-2 border border-gray-300 rounded-md'
										/>
									</div>
								</div>

								<div>
									<label className='block text-sm text-gray-500 mb-1'>
										Descripción
									</label>
									<textarea
										name='description'
										value={formData.description || ""}
										onChange={handleInputChange}
										className='w-full p-2 border border-gray-300 rounded-md'
										rows={3}
									/>
								</div>

								<div className='flex justify-end'>
									<button
										onClick={() =>
											handleSaveVehicle(vehicle.id)
										}
										disabled={updating}
										className='px-4 py-2 bg-principal-blue text-white rounded-md hover:bg-secondary-blue transition-colors flex items-center gap-2'>
										{updating ? (
											<>
												<div className='animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white'></div>
												<span>Guardando...</span>
											</>
										) : (
											<>
												<SaveIcon className='w-5 h-5' />
												<span>Guardar cambios</span>
											</>
										)}
									</button>
								</div>
								<div className='flex flex-col gap-4 mt-6'>
    {editingImages.length > 0 && (
        <div className='flex flex-col md:flex-row gap-6'>
            <div className='w-full md:w-2/5 flex flex-col items-center'>
                <div className='w-full rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200' style={{ minHeight: 180, maxHeight: 320 }}>
                    <Image
                        src={editingImages[selectedImageIndex]?.secure_url}
                        alt='Vista previa'
                        width={480}
                        height={320}
                        className='object-contain w-full h-auto max-h-80 rounded-lg transition-all duration-200 shadow-sm'
                        priority
                    />
                </div>
                <div className='mt-3 flex gap-2 overflow-x-auto scrollbar-thin w-full justify-center'>
                    {editingImages.map((img, idx) => (
                        <div
                            key={img.public_id}
                            className={`relative border-2 rounded-md cursor-pointer transition-all duration-150 ${selectedImageIndex === idx ? 'border-principal-blue ring-2 ring-principal-blue' : 'border-gray-200'}`}
                            style={{ minWidth: 64, minHeight: 44 }}
                            onClick={() => setSelectedImageIndex(idx)}
                        >
                            <Image
                                src={img.secure_url}
                                alt='Miniatura'
                                width={64}
                                height={44}
                                className='object-cover w-16 h-11 rounded-md'
                            />
                            <button
                                type='button'
                                disabled={imageLoading}
                                onClick={e => { e.stopPropagation(); handleDeleteImage(img.public_id); }}
                                className='absolute -top-2 -right-2 bg-white rounded-full p-1 text-red-500 shadow hover:scale-110 transition-all'
                                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
                            >
                                <svg width='16' height='16' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M3 6h18'/><path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'/><path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'/></svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex-1 flex flex-col justify-end items-center md:items-start'>
                {editingImages.length < 5 && (
                    <button
                        type='button'
                        className='px-4 py-2 bg-principal-blue text-white rounded-md hover:bg-secondary-blue transition-colors w-max shadow'
                        disabled={imageLoading}
                        onClick={() => inputRef.current?.click()}
                    >
                        Subir más fotos?
                    </button>
                )}
                <input
                    ref={inputRef}
                    type='file'
                    multiple
                    accept='image/*'
                    disabled={imageLoading}
                    onChange={handleAddImages}
                    className='hidden'
                />
            </div>
        </div>
    )}
    {editingImages.length === 0 && (
        <div className='flex flex-col items-center gap-2'>
            <div className='w-24 h-20 bg-gray-100 rounded flex items-center justify-center border border-gray-200'>
                <span className='text-gray-400 text-xs'>Sin imágenes</span>
            </div>
            <button
                type='button'
                className='px-4 py-2 bg-principal-blue text-white rounded-md hover:bg-secondary-blue transition-colors w-max shadow'
                disabled={imageLoading}
                onClick={() => inputRef.current?.click()}
            >
                Subir fotos
            </button>
            <input
                ref={inputRef}
                type='file'
                multiple
                accept='image/*'
                disabled={imageLoading}
                onChange={handleAddImages}
                className='hidden'
            />
        </div>
    )}
</div>
							</div>
						) : (
							<div className='flex flex-col md:flex-row md:items-center gap-4'>
								<div className='w-16 h-16 bg-secondary-blue rounded-md flex items-center justify-center text-white'>
									<CarIcon className='w-8 h-8' />
								</div>

								<div className='flex-1'>
									<h3 className='font-semibold text-lg'>
										{vehicle.brand.name}{" "}
										{vehicle.model.name}
									</h3>
									<div className='grid grid-cols-2 md:grid-cols-4 gap-2 mt-2'>
										<div>
											<p className='text-xs text-gray-500'>
												Año
											</p>
											<p>{vehicle.year}</p>
										</div>
										<div>
											<p className='text-xs text-gray-500'>
												Versión
											</p>
											<p>{vehicle.version.name}</p>
										</div>
										<div>
											<p className='text-xs text-gray-500'>
												Kilometraje
											</p>
											<p>
												{vehicle.mileage.toLocaleString()}{" "}
												KM
											</p>
										</div>
										<div>
											<p className='text-xs text-gray-500'>
												Precio
											</p>
											<p>
												$
												{vehicle.price.toLocaleString()}
											</p>
										</div>
									</div>
								</div>

								<div className='flex gap-2'>
									<button
										onClick={() =>
											handleEditVehicle(vehicle)
										}
										className='p-2 text-gray-500 hover:text-principal-blue'>
										<PencilIcon className='w-5 h-5' />
									</button>
									<button
										onClick={() =>
											handleDeleteVehicle(vehicle.id)
										}
										disabled={deleting === vehicle.id}
										className='p-2 text-gray-500 hover:text-red-500 disabled:opacity-50'>
										{deleting === vehicle.id ? (
											<div className='animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-500'></div>
										) : (
											<TrashIcon className='w-5 h-5' />
										)}
									</button>
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

interface SvgProps {
	className?: string;
	[key: string]: any;
}

function Car(props: SvgProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path d='M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2' />
			<circle cx='7' cy='17' r='2' />
			<path d='M9 17h6' />
			<circle cx='17' cy='17' r='2' />
		</svg>
	);
}

function Pencil(props: SvgProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z' />
			<path d='m15 5 4 4' />
		</svg>
	);
}

function Trash(props: SvgProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path d='M3 6h18' />
			<path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
			<path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
		</svg>
	);
}
