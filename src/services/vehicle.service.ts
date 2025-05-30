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

export type PostStatus = "Pending" | "Approved" | "Rejected" | "Inactive";

export interface PostResponse {
  id: string;
  vehicle: VehicleResponse;
  status: PostStatus;
  postDate: string;
}

export interface GetPostsResponse {
  data: PostResponse[];
  vehicles?: PostResponse[];
  total: number;
  totalItems?: number;
  page: number;
  currentPage?: number;
  limit: number;
  totalPages: number;
  status?: PostStatus;
}

export const getBrands = async (): Promise<Brand[]> => {
  const response = await http.get<Brand[]>("/brands");
  return response.data;
};

export const getModels = async (brandId?: string): Promise<Model[]> => {
  const url = brandId ? `/brands/${brandId}/models` : "/models";
  const response = await http.get<Model[]>(url);
  return response.data;
};

export const getModelsByBrand = async (brandId: string): Promise<Model[]> => {
  const response = await http.get<{ models: Model[] }>(`/brands/${brandId}`);
  return response.data.models || [];
};

export const getVersions = async (modelId?: string): Promise<Version[]> => {
  const url = modelId ? `/models/${modelId}/versions` : "/versions";
  const response = await http.get<Version[]>(url);
  return response.data;
};

export const getVersionsByModel = async (
  modelId: string
): Promise<Version[]> => {
  const response = await http.get<{ versions: Version[] }>(
    `/models/${modelId}`
  );
  return response.data.versions || [];
};

export const createVehicle = async (
  vehicleData: VehicleData
): Promise<VehicleResponse> => {
  const formData = new FormData();

  formData.append("brandId", vehicleData.brandId);
  formData.append("modelId", vehicleData.modelId);
  formData.append("versionId", vehicleData.versionId);
  formData.append("typeOfVehicle", vehicleData.typeOfVehicle);
  formData.append("year", vehicleData.year.toString());
  formData.append("condition", vehicleData.condition);
  formData.append("currency", vehicleData.currency);
  formData.append("price", vehicleData.price.toString());
  formData.append("mileage", vehicleData.mileage.toString());
  formData.append("description", vehicleData.description);

  vehicleData.images.forEach((file) => {
    formData.append("images", file);
  });

  const response = await http.post<any>("/vehicles", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

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
  const response = await http.get<any>("/vehicles/me");
  if (response.data?.data) {
    return response.data.data;
  }
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (Array.isArray(response.data?.vehicles)) {
    return response.data.vehicles;
  }
  return [];
};

export const getPosts = async (
  page: number = 1,
  limit: number = 10,
  filters: any = {}
): Promise<GetPostsResponse> => {
  const params: Record<string, any> = {
    page,
    limit,
  };

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params[key] = value;
    }
  });

  const response = await http.get<GetPostsResponse>("/posts", {
    params,
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
    throw error;
  }
};

export const createPost = async (
  vehicleId: string,
  description?: string
): Promise<PostResponse> => {
  const response = await http.post<ApiResponse<PostResponse>>("/posts", {
    vehicleId,
    description,
  });
  return response.data.data;
};

export const getMyPosts = async (): Promise<GetPostsResponse> => {
  const response = await http.get<ApiResponse<GetPostsResponse>>("/posts/me");
  return response.data.data;
};

export const getPendingPosts = async (): Promise<GetPostsResponse> => {
  const response = await http.get<ApiResponse<GetPostsResponse>>("/posts", {
    params: {
      status: "Pending",
      limit: 100,
      page: 1,
    },
  });

  if (response.data && response.data.data) {
    const allPosts = response.data.data;
    const pendingPosts = (
      Array.isArray(allPosts) ? allPosts : allPosts.data || []
    ).filter((post: PostResponse) => post.status === "Pending");

    return {
      data: pendingPosts,
      total: pendingPosts.length,
      page: 1,
      limit: 1000,
      totalPages: 1,
    };
  }

  return {
    data: [],
    total: 0,
    page: 1,
    limit: 1000,
    totalPages: 1,
  };
};

export const acceptPost = async (postId: string): Promise<void> => {
  try {
    await http.patch(`/posts/accept/${postId}`);
  } catch (error) {
    throw error;
  }
};

export const rejectPost = async (postId: string): Promise<void> => {
  try {
    await http.patch(`/posts/reject/${postId}`);
  } catch (error) {
    throw error;
  }
};

export const generateVehicleDescription = async (vehicleData: {
  brand: string;
  model: string;
  version?: string;
  year?: number;
  price?: number;
  mileage?: number;
  condition?: string;
  typeOfVehicle?: string;
}): Promise<string> => {
  try {
    if (!vehicleData.brand?.trim() || !vehicleData.model?.trim()) {
      throw new Error("Se requieren marca y modelo");
    }

    const payload: {
      brand: string;
      model: string;
      version?: string;
      year?: number;
      price?: number;
      mileage?: number;
      condition?: string;
      vehicle_type?: string;
      description: string;
    } = {
      brand: vehicleData.brand.trim(),
      model: vehicleData.model.trim(),
      version: vehicleData.version?.trim(),
      year: vehicleData.year ? Number(vehicleData.year) : undefined,
      price: vehicleData.price ? Number(vehicleData.price) : undefined,
      mileage: vehicleData.mileage ? Number(vehicleData.mileage) : undefined,
      condition: vehicleData.condition,
      vehicle_type: vehicleData.typeOfVehicle,
      description: "Descripción generada automáticamente",
    };

    (Object.keys(payload) as Array<keyof typeof payload>).forEach((key) => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    const response = await http.post<{ description: string }>(
      "/openai/generate-description",
      payload
    );

    if (!response.data?.description) {
      throw new Error("La respuesta no contiene descripción");
    }

    return response.data.description;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    const status = (error as any)?.response?.status;
    const data = (error as any)?.response?.data;

    throw new Error(errorMessage);
  }
};
