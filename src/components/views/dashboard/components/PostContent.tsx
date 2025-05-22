"use client";

import { useEffect, useState } from "react";
import {
	getUserVehicles,
	VehicleResponse,
	getPosts,
	PostResponse,
	deletePost,
} from "@/services/vehicle.service";
import { createPost } from "@/services/api.service";
import { useRouter } from "next/navigation";
import { Car as CarIcon, Share2, Trash as TrashIcon } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

export default function PublicationsContent() {
	const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
	const [posts, setPosts] = useState<PostResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [posting, setPosting] = useState<string | null>(null);
	const [deleting, setDeleting] = useState<string | null>(null);
	const [republishing, setRepublishing] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const router = useRouter();

	const [selectedVehicle, setSelectedVehicle] =
		useState<VehicleResponse | null>(null);
	const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
	const [description, setDescription] = useState("");
	const [publishSuccess, setPublishSuccess] = useState(false);
	const [isRepublishing, setIsRepublishing] = useState(false);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const [userVehicles, postsResponse] = await Promise.all([
				getUserVehicles(),
				getPosts(1, 100),
			]);
			setVehicles(userVehicles);
			setPosts(postsResponse.data);
		} catch (err) {
			setError("Error al cargar tus datos");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handlePostVehicle = async (vehicleId: string) => {
		try {
			setPosting(vehicleId);
			await createPost(vehicleId, description);
			setPublishSuccess(true);
			setSuccessMessage(
				isRepublishing
					? "¡Vehículo republicado con éxito!"
					: "¡Vehículo publicado con éxito!"
			);

			setTimeout(() => {
				setIsPublishModalOpen(false);
				setPublishSuccess(false);
				setDescription("");
				setIsRepublishing(false);
				fetchData();
			}, 2000);
		} catch (err: any) {
			setError(err.message || "Hubo un error al publicar el vehículo");
			setTimeout(() => {
				setError(null);
			}, 3000);
		} finally {
			setPosting(null);
			setRepublishing(null);
		}
	};

	const openPublishModal = (vehicle: VehicleResponse) => {
		setSelectedVehicle(vehicle);
		setIsPublishModalOpen(true);
		setDescription("");
		setPublishSuccess(false);
		setIsRepublishing(false);
	};

	const openRepublishModal = (post: PostResponse) => {
		setSelectedVehicle(post.vehicle);
		setIsPublishModalOpen(true);
		setDescription("");
		setPublishSuccess(false);
		setIsRepublishing(true);
		setRepublishing(post.id);
	};

	const handleDeletePost = async (postId: string) => {
		if (
			window.confirm(
				"¿Estás seguro que deseas eliminar esta publicación?"
			)
		) {
			try {
				setDeleting(postId);
				setError(null);

				await deletePost(postId);

				setSuccessMessage("Publicación eliminada correctamente");
				fetchData();

				setTimeout(() => {
					setSuccessMessage(null);
				}, 3000);
			} catch (err: any) {
				setError(
					err.message || "Hubo un error al eliminar la publicación"
				);
				setTimeout(() => {
					setError(null);
				}, 3000);
			} finally {
				setDeleting(null);
			}
		}
	};

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
					Mis publicaciones
				</h1>
				<p className='text-gray-500 mt-1'>
					Gestiona tus publicaciones o crea nuevas
				</p>
			</div>

			{successMessage && (
				<div className='bg-green-50 border border-green-200 rounded-lg p-4 my-4'>
					<p className='text-green-600'>{successMessage}</p>
				</div>
			)}

			{error && (
				<div className='bg-red-50 border border-red-200 rounded-lg p-4 my-4'>
					<p className='text-red-600'>{error}</p>
				</div>
			)}

			{posts.length > 0 && (
				<>
					<h2 className='text-xl font-semibold mb-4 text-principal-blue'>
						Publicaciones activas
					</h2>
					<div className='grid gap-4 mb-8'>
						{posts.map((post) => (
							<div
								key={post.id}
								className='bg-white p-6 rounded-lg border border-gray-200 flex flex-col md:flex-row md:items-center gap-4'>
								<div className='w-16 h-16 bg-secondary-blue rounded-md flex items-center justify-center text-white'>
									<CarIcon className='w-8 h-8' />
								</div>

								<div className='flex-1'>
									<h3 className='font-semibold text-lg'>
										{post.vehicle.brand.name}{" "}
										{post.vehicle.model.name}
									</h3>
									<div className='grid grid-cols-2 md:grid-cols-4 gap-2 mt-2'>
										<div>
											<p className='text-xs text-gray-500'>
												Año
											</p>
											<p>{post.vehicle.year}</p>
										</div>
										<div>
											<p className='text-xs text-gray-500'>
												Versión
											</p>
											<p>{post.vehicle.version.name}</p>
										</div>
										<div>
											<p className='text-xs text-gray-500'>
												Kilometraje
											</p>
											<p>
												{post.vehicle.mileage.toLocaleString()}{" "}
												KM
											</p>
										</div>
										<div>
											<p className='text-xs text-gray-500'>
												Precio
											</p>
											<p>
												$
												{post.vehicle.price.toLocaleString()}
											</p>
										</div>
									</div>
									<div className='mt-2'>
										<p className='text-xs text-gray-500'>
											Estado
										</p>
										<p className='text-sm'>
											<span className='inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full'>
												{post.status}
											</span>
										</p>
									</div>
								</div>

								<div className='flex flex-col md:flex-row gap-2'>
									<button
										onClick={() => openRepublishModal(post)}
										disabled={republishing === post.id}
										className='px-4 py-2 bg-principal-blue text-white rounded-md hover:bg-secondary-blue transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'>
										{republishing === post.id ? (
											<>
												<div className='animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white'></div>
												<span>Republicando...</span>
											</>
										) : (
											<>
												<Share2 className='w-5 h-5' />
												<span>Republicar</span>
											</>
										)}
									</button>

									<button
										onClick={() =>
											handleDeletePost(post.id)
										}
										disabled={deleting === post.id}
										className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'>
										{deleting === post.id ? (
											<>
												<div className='animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white'></div>
												<span>Eliminando...</span>
											</>
										) : (
											<>
												<TrashIcon className='w-5 h-5' />
												<span>Eliminar</span>
											</>
										)}
									</button>
								</div>
							</div>
						))}
					</div>
				</>
			)}

			{vehicles.length > 0 && (
				<>
					<h2 className='text-xl font-semibold mb-4 text-principal-blue'>
						Vehículos disponibles para publicar
					</h2>

					<div className='grid gap-4'>
						{vehicles
							.filter(
								(vehicle) =>
									!posts.some(
										(post) => post.vehicle.id === vehicle.id
									)
							)
							.map((vehicle) => (
								<div
									key={vehicle.id}
									className='bg-white p-6 rounded-lg border border-gray-200 flex flex-col md:flex-row md:items-center gap-4'>
									<div className='w-16 h-16 bg-secondary-blue rounded-md flex items-center justify-center text-white'>
										<CarIcon className='w-8 h-8' />
									</div>

									<div className='flex-1'>
										<h3 className='font-semibold text-lg'>
											{vehicle.brand.name}{" "}
											{vehicle.model.name}
										</h3>
										<div className='grid grid-cols-2 md:grid-cols-4 gap-2 mt-2'>
											<div>
												<p className='text-xs text-gray-500'>
													Año
												</p>
												<p>{vehicle.year}</p>
											</div>
											<div>
												<p className='text-xs text-gray-500'>
													Versión
												</p>
												<p>{vehicle.version.name}</p>
											</div>
											<div>
												<p className='text-xs text-gray-500'>
													Kilometraje
												</p>
												<p>
													{vehicle.mileage.toLocaleString()}{" "}
													KM
												</p>
											</div>
											<div>
												<p className='text-xs text-gray-500'>
													Precio
												</p>
												<p>
													$
													{vehicle.price.toLocaleString()}
												</p>
											</div>
										</div>
									</div>

									<button
										onClick={() =>
											openPublishModal(vehicle)
										}
										disabled={posting === vehicle.id}
										className='px-4 py-2 bg-principal-blue text-white rounded-md hover:bg-secondary-blue transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'>
										{posting === vehicle.id ? (
											<>
												<div className='animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white'></div>
												<span>Publicando...</span>
											</>
										) : (
											<>
												<Share2 className='w-5 h-5' />
												<span>Publicar</span>
											</>
										)}
									</button>
								</div>
							))}
					</div>
				</>
			)}

			<Modal
				isOpen={isPublishModalOpen}
				onClose={() => setIsPublishModalOpen(false)}
				title={
					isRepublishing ? "Republicar Vehículo" : "Publicar Vehículo"
				}>
				{publishSuccess ? (
					<div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
						{isRepublishing
							? "¡Vehículo republicado exitosamente!"
							: "¡Vehículo publicado exitosamente!"}
					</div>
				) : (
					selectedVehicle && (
						<>
							<div className='mb-4 p-4 border rounded-lg bg-gray-50'>
								<h3 className='font-semibold text-lg text-principal-blue'>
									{selectedVehicle.brand.name}{" "}
									{selectedVehicle.model.name}
								</h3>
								<div className='grid grid-cols-2 gap-3 mt-2'>
									<div>
										<p className='text-xs text-gray-500'>
											Versión
										</p>
										<p>{selectedVehicle.version.name}</p>
									</div>
									<div>
										<p className='text-xs text-gray-500'>
											Año
										</p>
										<p>{selectedVehicle.year}</p>
									</div>
									<div>
										<p className='text-xs text-gray-500'>
											Kilometraje
										</p>
										<p>
											{selectedVehicle.mileage.toLocaleString()}{" "}
											KM
										</p>
									</div>
									<div>
										<p className='text-xs text-gray-500'>
											Precio
										</p>
										<p>
											{selectedVehicle.currency}{" "}
											{selectedVehicle.price.toLocaleString()}
										</p>
									</div>
									<div className='col-span-2'>
										<p className='text-xs text-gray-500'>
											Condición
										</p>
										<p>
											{selectedVehicle.condition === "new"
												? "Nuevo"
												: "Usado"}
										</p>
									</div>
								</div>
							</div>

							<div className='mb-4'>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Descripción adicional (opcional)
								</label>
								<textarea
									value={description}
									onChange={(e) =>
										setDescription(e.target.value)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue'
									rows={4}
									placeholder='Añade detalles adicionales para tu publicación...'
								/>
							</div>
							<div className='flex justify-end space-x-2'>
								<button
									onClick={() => setIsPublishModalOpen(false)}
									className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700'>
									Cancelar
								</button>
								<button
									onClick={() =>
										selectedVehicle &&
										handlePostVehicle(selectedVehicle.id)
									}
									disabled={
										posting === selectedVehicle.id ||
										republishing === selectedVehicle.id
									}
									className='px-4 py-2 bg-principal-blue text-white rounded-md hover:bg-secondary-blue transition-colors disabled:opacity-50'>
									{isRepublishing
										? republishing === selectedVehicle.id
											? "Republicando..."
											: "Republicar"
										: posting === selectedVehicle.id
										? "Publicando..."
										: "Publicar"}
								</button>
							</div>
						</>
					)
				)}
			</Modal>

			{vehicles.length === 0 && posts.length === 0 && (
				<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4'>
					<p className='text-yellow-600'>
						No tienes vehículos para publicar. Registra un vehículo
						primero.
					</p>
				</div>
			)}
		</div>
	);
}

function Trash(props: any) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path d='M3 6h18' />
			<path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
			<path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
		</svg>
	);
}
