"use client";

import { useState, useEffect } from "react";
import {
	getVehicles,
	GetVehiclesResponse,
	VehicleResponse,
} from "@/services/vehicle.service";

export const useFetchVehicles = (
	initialPage: number = 1,
	initialLimit: number = 10
) => {
	const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);

	useEffect(() => {
		const fetchVehiclesData = async () => {
			try {
				setLoading(true);
				setError(null);
				const data: GetVehiclesResponse = await getVehicles(
					currentPage,
					initialLimit
				);
				setVehicles(data.vehicles);
				setTotalPages(data.totalPages);
				setTotalItems(data.totalItems);
				setCurrentPage(data.currentPage);
			} catch (err: any) {
				setError(
					"Hubo un error al cargar los vehículos. Inténtalo de nuevo más tarde. Uwaa~"
				);
			} finally {
				setLoading(false);
			}
		};

		fetchVehiclesData();
	}, [currentPage, initialLimit]);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	return {
		vehicles,
		loading,
		error,
		currentPage,
		totalPages,
		totalItems,
		handlePageChange,
	};
};
