"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, CalendarDays, CheckCircle2, MapPin, Pencil, Star, Upload } from "lucide-react";

const DashboardView = () => {
	const router = useRouter();

	useEffect(() => {
		const originalBg = document.body.style.backgroundColor;
		document.body.style.backgroundColor = "#0B1F3A";

		return () => {
			document.body.style.backgroundColor = originalBg;
		};
	}, []);

	const user = {
		name: "Valentino Rossi",
		email: "valentinorossi@example.com",
		bio: "Vendedor en ByCarket desde 2021.",
		avatarUrl:
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRetCtNsfwuticad2uh7IchEA29bdsxBpENJw&s",
		location: "Italia, Tavullia",
		joined: "Enero 2021",
		stats: {
			listings: 12,
			sold: 7,
			favorites: 18,
		},
	};

	return (
		<main className='flex h-screen text-white font-sans'>

			<aside className='w-1/4 bg-gradient-to-r from-secondary-blue to-principal-blue flex items-center justify-center'>
				<h1 className='text-6xl font-light leading-snug text-center whitespace-pre-line'>
					Bienvenido{"\n"}de nuevo
				</h1>
			</aside>


			<section className='w-3/4 bg-gradient-to-r from-principal-blue to-secondary-blue p-10 overflow-y-auto'>
				<div className='max-w-5xl mx-auto space-y-10'>


					<div className='bg-white text-black rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8'>
						<img
							src={user.avatarUrl}
							alt='Avatar'
							className='w-32 h-32 rounded-full object-cover border-4 border-[#0E2A47]'
						/>
						<div className='flex-1'>
							<h2 className='text-3xl font-semibold mb-1'>{user.name}</h2>
							<p className='text-sm text-gray-600 mb-3'>{user.email}</p>
							<p className='text-gray-800 mb-5'>{user.bio}</p>

							<div className='flex items-center gap-2 text-sm text-gray-600 mb-1'>
								<MapPin className='w-4 h-4 text-principal-blue' />
								<p>{user.location}</p>
							</div>
							<div className='flex items-center gap-2 text-sm text-gray-600'>
								<CalendarDays className='w-4 h-4 text-principal-blue' />
								<p>Miembro desde {user.joined}</p>
							</div>

							<div className='mt-6 flex gap-3'>
								<button className='flex items-center gap-2 px-5 py-2.5 bg-[#0E2A47] text-white rounded-lg hover:bg-[#154067] transition'>
									<Pencil className='w-4 h-4' />
									<span>Editar perfil</span>
								</button>
								<button className='flex items-center gap-2 px-5 py-2.5 bg-transparent border border-[#0E2A47] text-[#0E2A47] rounded-lg hover:bg-[#0E2A47] hover:text-white transition'>
									<Upload className='w-4 h-4' />
									<span>Publicar auto</span>
								</button>
							</div>
						</div>
					</div>




					<div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
						<div className='bg-white text-black rounded-2xl p-6 shadow-md flex flex-col items-center'>
							<BarChart3 className='text-principal-blue w-8 h-8 mb-3' />
							<p className='text-3xl font-bold'>{user.stats.listings}</p>
							<p className='text-sm text-gray-600'>Publicados</p>
						</div>
						<div className='bg-white text-black rounded-2xl p-6 shadow-md flex flex-col items-center'>
							<CheckCircle2 className='text-green-600 w-8 h-8 mb-3' />
							<p className='text-3xl font-bold'>{user.stats.sold}</p>
							<p className='text-sm text-gray-600'>Vendidos</p>
						</div>
						<div className='bg-white text-black rounded-2xl p-6 shadow-md flex flex-col items-center'>
							<Star className='text-yellow-500 w-8 h-8 mb-3' />
							<p className='text-3xl font-bold'>{user.stats.favorites}</p>
							<p className='text-sm text-gray-600'>Favoritos</p>
						</div>
					</div>
					<div className="flex justify-center">
						<button
							onClick={() => router.push("/dashboard/analytics")}
							className="flex items-center gap-2 px-6 py-3 bg-principal-blue hover:bg-[#154067] rounded-xl text-white font-semibold transition"
						>
							<BarChart3 className="w-5 h-5" />
							Ver Analíticas
						</button>
					</div>

				</div>
			</section>
		</main>
	);
};

export default DashboardView;