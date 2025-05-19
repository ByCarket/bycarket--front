"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getVehicleById, VehicleResponse } from "@/services/vehicle.service";
import Image from "next/image";

const VehicleDetailView = () => {
	const params = useParams();
	const vehicleId = params.id as string;

	const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchVehicle = async () => {
			if (!vehicleId) {
				setError("No se encontró el ID del vehículo.");
				setLoading(false);
				return;
			}
			try {
				setLoading(true);
				const vehicleData = await getVehicleById(vehicleId);
				setVehicle(vehicleData);
			} catch (err: any) {
				setError("Error al cargar los detalles del vehículo.");
			} finally {
				setLoading(false);
			}
		};

		fetchVehicle();
	}, [vehicleId]);

	if (loading) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				Cargando detalles del vehículo...
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex justify-center items-center min-h-screen text-red-500'>
				{error}
			</div>
		);
	}

	if (!vehicle) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				Vehículo no encontrado.
			</div>
		);
	}

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-3xl font-bold mb-6 text-[#103663]'>
				{vehicle.brand?.name} {vehicle.model?.name}
			</h1>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
				<div>
					{vehicle.images && vehicle.images.length > 0 ? (
						<div className='relative w-full h-96 rounded-lg overflow-hidden shadow-md'>
							<Image
								src={vehicle.images[0]}
								alt={`${vehicle.brand?.name} ${vehicle.model?.name}`}
								layout='fill'
								objectFit='cover'
							/>
						</div>
					) : (
						<div className='relative w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg shadow-md'>
							<span className='text-gray-500'>
								No hay imágenes disponibles.
							</span>
						</div>
					)}
				</div>

				<div>
					<h2 className='text-2xl font-semibold mb-4'>
						Detalles del Vehículo
					</h2>
					<div className='space-y-3 text-gray-700'>
						<p>
							<strong>Marca:</strong>{" "}
							{vehicle.brand
								? vehicle.brand.name
								: "No especificada"}
						</p>
						<p>
							<strong>Modelo:</strong>{" "}
							{vehicle.model
								? vehicle.model.name
								: "No especificado"}
						</p>
						<p>
							<strong>Versión:</strong>{" "}
							{vehicle.version
								? vehicle.version.name
								: "No especificada"}
						</p>
						<p>
							<strong>Año:</strong> {vehicle.year}
						</p>
						<p>
							<strong>Precio:</strong> $
							{vehicle.price.toLocaleString()}
						</p>
						<p>
							<strong>Kilometraje:</strong>{" "}
							{vehicle.mileage.toLocaleString()} KM
						</p>
						<p>
							<strong>Publicado el:</strong>{" "}
							{new Date(vehicle.createdAt).toLocaleDateString()}
						</p>
					</div>

					<div className='mt-6'>
						<h3 className='text-xl font-semibold mb-2'>
							Descripción
						</h3>
						<p className='text-gray-700'>{vehicle.description}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VehicleDetailView;
