import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	getBrands,
	getModels,
	getVersions,
	createVehicle,
	Brand,
	Model,
	Version,
	VehicleData,
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

	useEffect(() => {
		const fetchModels = async () => {
			if (selectedBrand) {
				try {
					const data = await getModels(selectedBrand);
					setFilteredModels(data);
				} catch (err) {
					setError("Error al cargar los modelos");
				}
			} else {
				setFilteredModels([]);
			}
		};

		fetchModels();
	}, [selectedBrand]);

	useEffect(() => {
		const fetchVersions = async () => {
			if (selectedModel) {
				try {
					const data = await getVersions(selectedModel);
					setFilteredVersions(data);
				} catch (err) {
					setError("Error al cargar las versiones");
				}
			} else {
				setFilteredVersions([]);
			}
		};

		fetchVersions();
	}, [selectedModel]);

	const handleBrandChange = (brandId: string) => {
		setSelectedBrand(brandId);
		setSelectedModel("");
		setFilteredVersions([]);
	};

	const handleModelChange = (modelId: string) => {
		setSelectedModel(modelId);
	};

	const submitVehicle = async (vehicleData: VehicleData) => {
		setLoading(true);
		setError(null);

		try {
			await createVehicle(vehicleData);
			setSuccess(true);
			router.push("/dashboard");
		} catch (err) {
			setError("Error al registrar el vehículo");
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
		handleBrandChange,
		handleModelChange,
		submitVehicle,
	};
};
