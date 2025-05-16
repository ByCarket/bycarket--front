import http from "./http.service";

export interface RegisterData {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
	phone?: number;
	country?: string;
	city?: string;
	address?: string;
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
		profileComplete: boolean;
	};
	message: string;
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
	const response = await http.post<RegisterResponse>(
		"/auth/register",
		userData
	);
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
	const response = await http.post<GoogleProcessLoginResponse>(
		"/google-auth/process-login",
		googleProfile
	);
	return response.data;
};

export const completeGoogleProfile = async (
	profileData: CompleteProfileData
): Promise<CompleteProfileResponse> => {
	const response = await http.post<CompleteProfileResponse>(
		"/google-auth/complete-profile",
		profileData
	);
	return response.data;
};
