"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import VehicleForm from "@/components/views/dashboard/VehicleForm";

export default function RegisterVehicle() {
	const { isAuthenticated, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.push("/login");
		}
	}, [isAuthenticated, loading, router]);

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue'></div>
			</div>
		);
	}

	return (
		<div className='container mx-auto py-8'>
			<VehicleForm />
		</div>
	);
}
