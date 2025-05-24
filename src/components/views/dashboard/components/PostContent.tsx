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
import { Car as CarIcon, Share2, Trash as TrashIcon, ChevronDown, ChevronUp } from "lucide-react";

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
	const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
	const [description, setDescription] = useState("");
	const [publishSuccess, setPublishSuccess] = useState(false);
	const [isRepublishing, setIsRepublishing] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
				closeDetail();
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
		setSelectedVehicleId(vehicle.id);
		setDescription("");
		setPublishSuccess(false);
		setIsRepublishing(false);
		setSelectedImageIndex(0);
	};

	const openRepublishModal = (post: PostResponse) => {
		setSelectedVehicle(post.vehicle);
		setSelectedVehicleId(post.vehicle.id);
		setDescription("");
		setPublishSuccess(false);
		setIsRepublishing(true);
		setSelectedImageIndex(0);
	};

	const closeDetail = () => {
		setSelectedVehicleId(null);
		setSelectedVehicle(null);
		setDescription("");
		setPublishSuccess(false);
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
							<div key={post.id}>
								<div
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
											className='px-4 py-2 bg-principal-blue text-white rounded-md hover:bg-secondary-blue transition-colors flex items-center gap-2'>
											<Share2 className='w-5 h-5' />
											<span>Ver detalles</span>
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
								
								{selectedVehicleId === post.vehicle.id && selectedVehicle && (
									<div className='mt-2 border border-gray-200 rounded-lg bg-white p-4 transition-all duration-300 ease-in-out'>
										{publishSuccess ? (
											<div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
												{isRepublishing
													? "¡Vehículo republicado exitosamente!"
													: "¡Vehículo publicado exitosamente!"}
											</div>
										) : (
											<div className='max-w-4xl mx-auto'>
												<div className='flex justify-between items-center mb-4'>
													<h3 className='text-xl font-bold text-principal-blue'>
														{isRepublishing ? "Republicar Vehículo" : "Publicar Vehículo"}
													</h3>
													<button 
														onClick={closeDetail}
														className='text-gray-500 hover:text-gray-700'
													>
														<ChevronUp className='w-5 h-5' />
													</button>
												</div>
												<div className='flex flex-col lg:flex-row gap-6'>
													{selectedVehicle.images && selectedVehicle.images.length > 0 && (
														<div className='lg:w-1/2'>
															<div className='mb-3'>
																<div className='relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100 border border-gray-200'>
																	<img
																		src={selectedVehicle.images[selectedImageIndex].secure_url}
																		alt={`Vehicle main image`}
																		className='object-contain w-full h-full'
																	/>
																</div>
															</div>
															{selectedVehicle.images.length > 1 && (
																<div className='flex gap-2 overflow-x-auto pb-2'>
																	{selectedVehicle.images.map((image, index) => (
																		<button
																			key={index}
																			onClick={() => setSelectedImageIndex(index)}
																			className={`relative w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
																				selectedImageIndex === index
																					? 'border-principal-blue shadow-md'
																					: 'border-gray-200 hover:border-gray-300'
																			}`}>
																			<img
																				src={image.secure_url}
																				alt={`Vehicle thumbnail ${index + 1}`}
																				className='object-cover w-full h-full'
																			/>
																		</button>
																	))}
																</div>
															)}
														</div>
													)}

													<div className='lg:w-1/2'>
														<div className='bg-white border border-gray-200 rounded-lg p-4 mb-4'>
															<h3 className='text-xl font-bold text-principal-blue mb-3'>
																{selectedVehicle.brand.name} {selectedVehicle.model.name}
															</h3>
															
															<div className='mb-4'>
																<div className='text-2xl font-bold text-green-600 mb-2'>
																	{selectedVehicle.currency} {selectedVehicle.price.toLocaleString()}
																</div>
																<div className='inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium'>
																	{selectedVehicle.condition === "new" ? "Nuevo" : "Usado"}
																</div>
															</div>

															<div className='grid grid-cols-2 gap-4'>
																<div className='bg-gray-50 p-3 rounded-md'>
																	<p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>Año</p>
																	<p className='font-semibold text-gray-900'>{selectedVehicle.year}</p>
																</div>
																<div className='bg-gray-50 p-3 rounded-md'>
																	<p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>Kilometraje</p>
																	<p className='font-semibold text-gray-900'>{selectedVehicle.mileage.toLocaleString()} KM</p>
																</div>
																<div className='bg-gray-50 p-3 rounded-md col-span-2'>
																	<p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>Versión</p>
																	<p className='font-semibold text-gray-900'>{selectedVehicle.version.name}</p>
																</div>
															</div>
														</div>
													</div>
												</div>

												<div className='mt-6'>
													<label className='block text-sm font-medium text-gray-700 mb-2'>
														Descripción adicional (opcional)
													</label>
													<textarea
														value={description}
														onChange={(e) => setDescription(e.target.value)}
														className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-principal-blue focus:border-transparent resize-none'
														rows={4}
														placeholder='Añade detalles adicionales sobre tu vehículo, características especiales, historial de mantenimiento, etc...'
													/>
												</div>

												<div className='flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-200'>
													<button
														onClick={closeDetail}
														className='px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors'>
														Cancelar
													</button>
													<button
														onClick={() => selectedVehicle && handlePostVehicle(selectedVehicle.id)}
														disabled={posting === selectedVehicle.id || republishing === selectedVehicle.id}
														className='px-6 py-2 bg-principal-blue text-white rounded-lg hover:bg-secondary-blue transition-colors disabled:opacity-50 font-medium min-w-[120px]'>
														{isRepublishing
															? republishing === selectedVehicle.id
																? "Republicando..."
																: "Republicar"
															: posting === selectedVehicle.id
															? "Publicando..."
															: "Publicar"}
													</button>
												</div>
											</div>
										)}
									</div>
								)}
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
								<div key={vehicle.id}>
									<div className='bg-white p-6 rounded-lg border border-gray-200 flex flex-col md:flex-row md:items-center gap-4'>
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
											onClick={() => openPublishModal(vehicle)}
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
									
									{selectedVehicleId === vehicle.id && selectedVehicle && (
										<div className='mt-2 border border-gray-200 rounded-lg bg-white p-4 transition-all duration-300 ease-in-out'>
											{publishSuccess ? (
												<div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
													{isRepublishing
														? "¡Vehículo republicado exitosamente!"
														: "¡Vehículo publicado exitosamente!"}
												</div>
											) : (
												<div className='max-w-4xl mx-auto'>
													<div className='flex justify-between items-center mb-4'>
														<h3 className='text-xl font-bold text-principal-blue'>
															{isRepublishing ? "Republicar Vehículo" : "Publicar Vehículo"}
														</h3>
														<button 
															onClick={closeDetail}
															className='text-gray-500 hover:text-gray-700'
														>
															<ChevronUp className='w-5 h-5' />
														</button>
													</div>
													<div className='flex flex-col lg:flex-row gap-6'>
														{selectedVehicle.images && selectedVehicle.images.length > 0 && (
															<div className='lg:w-1/2'>
																<div className='mb-3'>
																	<div className='relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100 border border-gray-200'>
																		<img
																			src={selectedVehicle.images[selectedImageIndex].secure_url}
																			alt={`Vehicle main image`}
																			className='object-contain w-full h-full'
																		/>
																	</div>
																</div>
																{selectedVehicle.images.length > 1 && (
																	<div className='flex gap-2 overflow-x-auto pb-2'>
																		{selectedVehicle.images.map((image, index) => (
																			<button
																				key={index}
																				onClick={() => setSelectedImageIndex(index)}
																				className={`relative w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
																					selectedImageIndex === index
																						? 'border-principal-blue shadow-md'
																						: 'border-gray-200 hover:border-gray-300'
																				}`}>
																				<img
																					src={image.secure_url}
																					alt={`Vehicle thumbnail ${index + 1}`}
																					className='object-cover w-full h-full'
																				/>
																			</button>
																		))}
																	</div>
																)}
															</div>
														)}

														<div className='lg:w-1/2'>
															<div className='bg-white border border-gray-200 rounded-lg p-4 mb-4'>
																<h3 className='text-xl font-bold text-principal-blue mb-3'>
																	{selectedVehicle.brand.name} {selectedVehicle.model.name}
																</h3>
																
																<div className='mb-4'>
																	<div className='text-2xl font-bold text-green-600 mb-2'>
																		{selectedVehicle.currency} {selectedVehicle.price.toLocaleString()}
																	</div>
																	<div className='inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium'>
																		{selectedVehicle.condition === "new" ? "Nuevo" : "Usado"}
																	</div>
																</div>

																<div className='grid grid-cols-2 gap-4'>
																	<div className='bg-gray-50 p-3 rounded-md'>
																		<p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>Año</p>
																		<p className='font-semibold text-gray-900'>{selectedVehicle.year}</p>
																	</div>
																	<div className='bg-gray-50 p-3 rounded-md'>
																		<p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>Kilometraje</p>
																		<p className='font-semibold text-gray-900'>{selectedVehicle.mileage.toLocaleString()} KM</p>
																	</div>
																	<div className='bg-gray-50 p-3 rounded-md col-span-2'>
																		<p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>Versión</p>
																		<p className='font-semibold text-gray-900'>{selectedVehicle.version.name}</p>
																	</div>
																</div>
															</div>
														</div>
													</div>

													<div className='mt-6'>
														<label className='block text-sm font-medium text-gray-700 mb-2'>
															Descripción adicional (opcional)
														</label>
														<textarea
															value={description}
															onChange={(e) => setDescription(e.target.value)}
															className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-principal-blue focus:border-transparent resize-none'
															rows={4}
															placeholder='Añade detalles adicionales sobre tu vehículo, características especiales, historial de mantenimiento, etc...'
														/>
													</div>

													<div className='flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-200'>
														<button
															onClick={closeDetail}
															className='px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors'>
															Cancelar
														</button>
														<button
															onClick={() => selectedVehicle && handlePostVehicle(selectedVehicle.id)}
															disabled={posting === selectedVehicle.id || republishing === selectedVehicle.id}
															className='px-6 py-2 bg-principal-blue text-white rounded-lg hover:bg-secondary-blue transition-colors disabled:opacity-50 font-medium min-w-[120px]'>
															{isRepublishing
																? republishing === selectedVehicle.id
																	? "Republicando..."
																	: "Republicar"
																: posting === selectedVehicle.id
																? "Publicando..."
																: "Publicar"}
														</button>
													</div>
												</div>
											)}
										</div>
									)}
								</div>
							))}
					</div>
				</>
			)}

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
