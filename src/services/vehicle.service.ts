import http from "./http.service";

export interface Brand {
	id: string;
	name: string;
}

export interface Model {
	id: string;
	name: string;
	brandId: string;
}

export interface Version {
	id: string;
	name: string;
	modelId: string;
}

export interface VehicleData {
	brandId: string;
	modelId: string;
	versionId: string;
	typeOfVehicle: string;
	year: number;
	condition: string;
	currency: string;
	price: number;
	mileage: number;
	description: string;
	images: File[];
}

export interface VehicleResponse {
	id: string;
	brand: Brand;
	model: Model;
	version: Version;
	typeOfVehicle: string;
	year: number;
	condition: string;
	currency: string;
	price: number;
	mileage: number;
	description: string;
	images: { public_id: string; secure_url: string }[];
	userId: string;
	createdAt: string;
}

export interface GetVehiclesResponse {
	vehicles: VehicleResponse[];
	totalPages: number;
	totalItems: number;
	currentPage: number;
}

export interface PostResponse {
	id: string;
	vehicle: VehicleResponse;
	status: string;
	postDate: string;
}

export interface GetPostsResponse {
	data: PostResponse[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export const getBrands = async (): Promise<Brand[]> => {
	const response = await http.get<Brand[]>("/brands");
	return response.data;
};

export const getModels = async (brandId?: string): Promise<Model[]> => {
	const url = brandId ? `/models?brandId=${brandId}` : "/models";
	const response = await http.get<Model[]>(url);
	return response.data;
};

export const getVersions = async (modelId?: string): Promise<Version[]> => {
	const url = modelId ? `/versions?modelId=${modelId}` : "/versions";
	const response = await http.get<Version[]>(url);
	return response.data;
};

export const createVehicle = async (
	vehicleData: VehicleData
): Promise<VehicleResponse> => {
	const payload = {
		brandId: vehicleData.brandId,
		modelId: vehicleData.modelId,
		versionId: vehicleData.versionId,
		typeOfVehicle: vehicleData.typeOfVehicle,
		year: vehicleData.year,
		condition: vehicleData.condition,
		currency: vehicleData.currency,
		price: vehicleData.price,
		mileage: vehicleData.mileage,
		description: vehicleData.description,
	};

	const response = await http.post<any>("/vehicles", payload);
	return response.data.data;
};

export const getVehicles = async (
	page: number = 1,
	limit: number = 10
): Promise<GetVehiclesResponse> => {
	const response = await http.get<GetVehiclesResponse>("/vehicles", {
		params: { page, limit },
	});
	return response.data;
};

export const getUserVehicles = async (): Promise<VehicleResponse[]> => {
	const response = await http.get<VehicleResponse[]>("/vehicles/me");
	return response.data;
};

export const getPosts = async (
	page: number = 1,
	limit: number = 10
): Promise<GetPostsResponse> => {
	const response = await http.get<GetPostsResponse>("/posts/me", {
		params: { page, limit },
	});
	return response.data;
};

interface ApiResponse<T> {
	data: T;
	message: string;
}

export const getVehicleById = async (
	vehicleId: string
): Promise<VehicleResponse> => {
	try {
		const response = await http.get<ApiResponse<VehicleResponse>>(
			`/vehicles/${vehicleId}`
		);
		return response.data.data;
	} catch (error) {
		console.error("Error fetching vehicle by ID:", error);
		throw error;
	}
};

export const deleteVehicle = async (vehicleId: string): Promise<void> => {
	try {
		await http.delete(`/vehicles/${vehicleId}`);
	} catch (error) {
		throw error;
	}
};

export const updateVehicle = async (
	vehicleId: string,
	vehicleData: Partial<VehicleData>
): Promise<VehicleResponse> => {
	const response = await http.patch<VehicleResponse>(
		`/vehicles/${vehicleId}`,
		vehicleData
	);
	return response.data;
};

export const deletePost = async (postId: string): Promise<void> => {
	try {
		await http.delete(`/posts/${postId}`);
	} catch (error) {
		throw error;
	}
};

export const uploadVehicleImages = async (
	vehicleId: string,
	images: File[]
): Promise<void> => {
	const formData = new FormData();
	images.forEach((image) => {
		formData.append("images", image);
	});

	try {
		await http.patch(`/files/vehicle-images/${vehicleId}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	} catch (error) {
		console.error("Error uploading images:", error);
		throw error;
	}
};

export const deleteVehicleImage = async (
	vehicleId: string,
	publicId: string
): Promise<void> => {
	try {
		await http.delete(`/files/${vehicleId}/images/${publicId}`);
	} catch (error) {
		console.error("Error deleting image:", error);
		throw error;
	}
};
