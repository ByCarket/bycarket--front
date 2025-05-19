"use client";

import { useEffect, useState } from "react";
import { getUserVehicles } from "@/services/vehicle.service";
import VehicleItem from "./components/VehicleItem";
import { VehicleResponse } from "@/services/vehicle.service";
import { createPost } from "@/services/api.service";
import { useRouter } from "next/navigation";

const MyVehiclesView = () => {
	const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchVehicles = async () => {
			try {
				setLoading(true);
				const userVehicles = await getUserVehicles();
				setVehicles(userVehicles);
			} catch (err: any) {
				setError("Error al cargar tus vehículos. Uwaa~");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchVehicles();
	}, []);

	const handlePostVehicle = async (vehicleId: string) => {
		try {
			await createPost(vehicleId);
			alert("¡Vehículo publicado con éxito!");
		} catch (err: any) {
			alert("Yamete~ Hubo un error al publicar el vehículo.");
			console.error(err);
		}
	};

	const handleViewDetails = (vehicleId: string) => {
		router.push(`/marketplace/${vehicleId}`);
	};

	if (loading) {
		return <div>Cargando tus vehículos... 🌸</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	if (vehicles.length === 0) {
		return <div>No tienes vehiculos subidos</div>;
	}

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-6'>Mis Vehículos</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{vehicles.map((vehicle) => (
					<VehicleItem
						key={vehicle.id}
						vehicle={vehicle}
						onPost={handlePostVehicle}
						onViewDetails={handleViewDetails}
					/>
				))}
			</div>
		</div>
	);
};

export default MyVehiclesView;
