"use client";

import Sidebar from "./components/Sidebar";
import ProductCard from "./components/ProductCard";
import Pagination from "./components/pagination";
import { useFetchPosts } from "@/hooks/useFetchPosts";

export default function MarketplaceView() {
	const {
		posts,
		loading,
		error,
		currentPage,
		totalPages,
		handlePageChange,
	} = useFetchPosts();

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue'></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-screen text-red-500'>
				{error}
			</div>
		);
	}

	return (
		<div className='flex flex-col md:flex-row min-h-screen bg-white'>
			<Sidebar />

			<main className='flex-1 p-4 md:p-6'>
				<h1 className='text-2xl font-bold text-[#103663] mb-6'>
					Marketplace de Vehículos
				</h1>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{Array.isArray(posts) &&
						posts.map((post) => (
							<ProductCard key={post.id} vehicle={post.vehicle} />
						))}
				</div>

				<div className='mt-8'>
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</div>
			</main>
		</div>
	);
}
