import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	getBrands,
	getModelsByBrand,
	getVersionsByModel,
	createVehicle,
	Brand,
	Model,
	Version,
	VehicleData,
	uploadVehicleImages,
} from "@/services/vehicle.service";

export const useVehicleForm = () => {
	const router = useRouter();
	const [brands, setBrands] = useState<Brand[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const [selectedBrand, setSelectedBrand] = useState<string>("");
	const [selectedModel, setSelectedModel] = useState<string>("");
	const [filteredModels, setFilteredModels] = useState<Model[]>([]);
	const [filteredVersions, setFilteredVersions] = useState<Version[]>([]);

	useEffect(() => {
		const fetchBrands = async () => {
			try {
				const data = await getBrands();
				setBrands(data);
			} catch (err) {
				setError("Error al cargar las marcas");
			}
		};

		fetchBrands();
	}, []);

	const handleBrandChange = (brandId: string, models: Model[] = []) => {
		setSelectedBrand(brandId);
		setSelectedModel("");
		setFilteredModels(models);
		setFilteredVersions([]);
	};

	const handleModelChange = (modelId: string, versions: Version[] = []) => {
		setSelectedModel(modelId);
		setFilteredVersions(versions);
	};

	const submitVehicle = async (vehicleData: VehicleData) => {
		setLoading(true);
		setError(null);

		try {
			const createdVehicle = await createVehicle(vehicleData);

			if (vehicleData.images && vehicleData.images.length > 0) {
				try {
					await uploadVehicleImages(
						createdVehicle.id,
						vehicleData.images
					);
				} catch (uploadError) {
					setError("Error al subir las imágenes del vehículo");
					return;
				}
			}

			setSuccess(true);
			router.push("/dashboard");
		} catch (createError) {
			setError("Error al crear el vehículo");
		} finally {
			setLoading(false);
		}
	};

	return {
		brands,
		models: filteredModels,
		versions: filteredVersions,
		loading,
		error,
		success,
		selectedBrand,
		selectedModel,
		getModelsByBrand,
		getVersionsByModel,
		handleBrandChange,
		handleModelChange,
		submitVehicle,
	};
};
