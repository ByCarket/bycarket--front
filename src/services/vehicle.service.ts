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
	year: number;
	price: number;
	mileage: number;
	description: string;
	images?: File[];
}

export interface VehicleResponse {
	id: string;
	brand: Brand;
	model: Model;
	version: Version;
	year: number;
	price: number;
	mileage: number;
	description: string;
	images?: string[];
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
		year: vehicleData.year,
		price: vehicleData.price,
		mileage: vehicleData.mileage,
		description: vehicleData.description,
	};

	const response = await http.post<VehicleResponse>("/vehicles", payload);

	return response.data;
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
	const response = await http.get<VehicleResponse[]>("/vehicles");
	return response.data;
};

export const getPosts = async (
	page: number = 1,
	limit: number = 10
): Promise<GetPostsResponse> => {
	const response = await http.get<GetPostsResponse>("/posts", {
		params: { page, limit },
	});
	return response.data;
};

export const getVehicleById = async (
	vehicleId: string
): Promise<VehicleResponse> => {
	try {
		const response = await http.get<VehicleResponse>(
			`/vehicles/${vehicleId}`
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching vehicle by ID:", error);
		throw error;
	}
};
