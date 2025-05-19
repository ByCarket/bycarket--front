
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import UserData from "@/components/views/dashboard/components/UserData";

export default function Profile() {
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
		<div className='container mx-auto py-8 px-4'>
			<h1 className='text-3xl font-bold text-principal-blue mb-6'>
				Mi Perfil
			</h1>
			<UserData />
		</div>
	);
}

