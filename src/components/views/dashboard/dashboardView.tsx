"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import ProfileContent from "./components/ProfileContent";
import VehiclesContent from "./components/VehiclesContent";
import PublicationsContent from "./components/PostContent";
import RegisterVehicleContent from "./components/RegisterVehicleContent";
import PublishVehicleContent from "./components/PublishVehicleContent";
import { useUserData } from "@/hooks/useUserData";
import { User, Car, FileText, Crown, PlusCircle } from "lucide-react";

export default function Dashboard() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const tabParam = searchParams.get("tab");
	const [activeTab, setActiveTab] = useState("profile");
	const { loading, userData } = useUserData();

	useEffect(() => {
		if (tabParam) {
			const validTabs = [
				"profile",
				"vehicles",
				"publications",
				"register-vehicle",
				"publish-vehicle",
				"vip",
			];
			if (validTabs.includes(tabParam)) {
				setActiveTab(tabParam);
			}
		}
	}, [tabParam]);

	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
		router.push(`/dashboard?tab=${tab}`);
	};

	const renderContent = () => {
		if (loading) {
			return (
				<div className='flex items-center justify-center min-h-[300px]'>
					<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue'></div>
				</div>
			);
		}

		switch (activeTab) {
			case "profile":
				return <ProfileContent />;
			case "vehicles":
				return <VehiclesContent />;
			case "publications":
				return <PublicationsContent />;
			case "register-vehicle":
				return <RegisterVehicleContent />;
			case "publish-vehicle":
				return <PublishVehicleContent />;
			case "vip":
				return (
					<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4'>
						<h2 className='text-2xl font-bold text-principal-blue mb-4'>
							Membresía VIP
						</h2>
						<p className='text-yellow-600'>
							¡Próximamente! Estamos trabajando en características
							exclusivas para miembros VIP.
						</p>
					</div>
				);
			default:
				return <ProfileContent />;
		}
	};

	const menuItems = [
		{ id: "profile", label: "Perfil", icon: User },
		{ id: "vehicles", label: "Vehículos", icon: Car },
		{ id: "publications", label: "Publicaciones", icon: FileText },
		{ id: "register-vehicle", label: "Registrar", icon: PlusCircle },
		{ id: "vip", label: "VIP", icon: Crown },
	];

	return (
		<div className='flex min-h-screen bg-white'>
			<Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
			<main className='flex-1 p-6 md:p-8 pb-20 md:pb-8'>
				{renderContent()}
			</main>

			<div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50'>
				<div className='flex justify-around items-center h-16'>
					{menuItems.map((item) => (
						<button
							key={item.id}
							onClick={() => handleTabChange(item.id)}
							className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
								activeTab === item.id
									? "text-principal-blue"
									: "text-gray-500 hover:text-principal-blue"
							}`}>
							<item.icon
								className={`w-5 h-5 ${
									activeTab === item.id ? "scale-110" : ""
								}`}
							/>
							<span className='text-xs mt-1'>{item.label}</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
