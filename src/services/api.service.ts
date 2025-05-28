import http from "./http.service";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: number;
  country: string;
  city: string;
  address: string;
}
interface RegisterResponse {
  message: string;
}

export interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface GoogleProcessLoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  message: string;
  token: string;
}

export interface CompleteProfileData {
  email: string;
  phone?: number;
  country?: string;
  city?: string;
  address?: string;
}

export interface CompleteProfileResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    profileComplete: boolean;
  };
  message: string;
}

export const registerUser = async (
  userData: RegisterData
): Promise<RegisterResponse> => {
  const { ...payload } = userData;
  const response = await http.post<RegisterResponse>("/auth/register", payload);
  return response.data;
};

export const loginUser = async (
  loginData: LoginData
): Promise<LoginResponse> => {
  const response = await http.post<LoginResponse>("/auth/login", loginData);
  return response.data;
};

export const processGoogleLogin = async (
  googleProfile: unknown
): Promise<GoogleProcessLoginResponse> => {
  const formattedProfile = {
    email: (googleProfile as any).email || "",
    name: (googleProfile as any).name || "",
    sub: (googleProfile as any).sub || (googleProfile as any).id || "",
  };

  try {
    const response = await http.post<GoogleProcessLoginResponse>(
      "/auth/process-google",
      formattedProfile
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al procesar el login de Google");
  }
};

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: number;
  country?: string;
  city?: string;
  address?: string;
  role?: string;
  image?: string | { secure_url: string };
  posts?: {
    id: string;
    postDate: string;
    status: string;
    questions?: {
      id: string;
      message: string;
      date: string;
    }[];
  }[];
}

export interface UserDataResponse {
  data: UserData;
  message: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: number;
  country?: string;
  city?: string;
  address?: string;
}

export const getUserData = async (): Promise<UserDataResponse> => {
  const response = await http.get<UserDataResponse>("/users/me");
  return response.data;
};

export const updateUserData = async (
  userData: UpdateUserData
): Promise<UserDataResponse> => {
  try {
    const response = await http.patch<UserDataResponse>("/users/me", userData);
    return response.data;
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      "Error al actualizar datos del usuario";
    throw new Error(errorMsg);
  }
};

export interface UploadProfileImageResponse {
  data: {
    image: string;
  };
  message: string;
}

export const uploadUserProfileImage = async (
  file: File
): Promise<UploadProfileImageResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await http.patch<UploadProfileImageResponse>(
      "/files/user-profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      "Error al subir la imagen de perfil";
    throw new Error(errorMsg);
  }
};

export interface CreatePostResponse {
  data: {
    id: string;
    vehicleId: string;
    status: string;
    postDate: string;
    description?: string;
  };
  message: string;
}

export const createPost = async (
  vehicleId: string,
  description?: string
): Promise<CreatePostResponse> => {
  const response = await http.post<CreatePostResponse>("/posts", {
    vehicleId,
    description,
  });
  return response.data;
};

export const deleteUserAccount = async (): Promise<{ message: string }> => {
  const response = await http.delete<{ message: string }>("/users/me");
  return response.data;
};

export interface Price {
  id: string;
  object: string;
  active: boolean;
  billing_scheme: string;
  created: number;
  currency: string;
  custom_unit_amount: null | any;
  livemode: boolean;
  lookup_key: null | string;
  metadata: Record<string, any>;
  nickname: null | string;
  product: string;
  recurring: {
    interval: "monthly" | "quarterly" | "annual";
    interval_count: number;
    meter: null | any;
    trial_period_days: null | number;
    usage_type: string;
  };
  tax_behavior: string;
  tiers_mode: null | any;
  transform_quantity: null | any;
  type: string;
  unit_amount: number;
  unit_amount_decimal: string;
  [key: string]: any;
}

export interface Subscription {
  id: string;
  object: string;
  status: string;
  amount_subtotal: number;
  amount_total: number;
  subscription?: {
    id: string;
    items: {
      data: Array<{
        price: Price;
      }>;
    };
  };
  customer_details?: {
    name?: string;
    email?: string;
  };
  payment_status: string;
  client_reference_id: string | null;
  metadata: Record<string, any>;
}

export const getMonthlyPrice = async (): Promise<{ data: Price }> => {
  const response = await http.get<Price>("/prices/monthly");
  return { data: response.data };
};

export const getQuarterlyPrice = async (): Promise<{ data: Price }> => {
  const response = await http.get<Price>("/prices/quarterly");
  return { data: response.data };
};

export const getAnnualPrice = async (): Promise<{ data: Price }> => {
  const response = await http.get<Price>("/prices/annual");
  return { data: response.data };
};

export const getSubscription = async (
  sessionId: string
): Promise<{ data: any }> => {
  try {
    const response = await http.get<{ data: any }>(
      `/subscription/session/${sessionId}`
    );
    return response;
  } catch (error: any) {
    console.error("Error fetching subscription:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Error al obtener los detalles de la suscripción"
    );
  }
};

export const createSubscription = async (
  priceId: string,
  paymentMethodId?: string
): Promise<{ url: string } | string> => {
  try {
    const response = await http.post<{ url: string } | string>(
      `/subscription/${priceId}`,
      {
        paymentMethodId,
        metadata: {
          frontend_timestamp: new Date().toISOString(),
          user_agent:
            typeof window !== "undefined"
              ? window.navigator.userAgent
              : "server",
        },
      }
    );

    if (typeof response.data === "string") {
      return response.data;
    }

    if (!response.data) {
      throw new Error("La respuesta del servidor está vacía");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Error al crear la suscripción"
    );
  }
};

export interface ChatMessage {
  role: "user" | "bot" | "system";
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
}

export interface ChatCompletionResponse {
  message: string;
}

export const getChatCompletion = async (
  messages: ChatMessage[]
): Promise<ChatCompletionResponse> => {
  const response = await http.post<ChatCompletionResponse>(
    "/openai/chatCompletion",
    { messages }
  );
  return response.data;
};
