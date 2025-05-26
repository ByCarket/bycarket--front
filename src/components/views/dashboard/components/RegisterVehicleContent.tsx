"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import VehicleForm from "@/components/views/dashboard/VehicleForm";

export default function RegisterVehicleContent() {
	const { isAuthenticated, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.push("/login");
		}
	}, [isAuthenticated, loading, router]);

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-[300px]'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue'></div>
			</div>
		);
	}

	return (
		<div>
			<div className='border-b pb-4 mb-6'>
				<h1 className='text-2xl font-bold text-principal-blue'>
					Registrar un vehículo
				</h1>
			</div>
			<VehicleForm />
		</div>
	);
}
