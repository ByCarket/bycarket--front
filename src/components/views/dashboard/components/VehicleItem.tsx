"use client";

import React, { useState } from "react";
import { VehicleResponse } from "@/services/vehicle.service";
import { createPost } from "@/services/api.service";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";

interface VehicleItemProps {
	vehicle: VehicleResponse;
	onViewDetails: (vehicleId: string) => void;
}

const VehicleItem: React.FC<VehicleItemProps> = ({
	vehicle,
	onViewDetails,
}) => {
	const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
	const [description, setDescription] = useState("");
	const [isPublishing, setIsPublishing] = useState(false);
	const [publishSuccess, setPublishSuccess] = useState(false);
	const [mainImage, setMainImage] = useState<string | undefined>(
		vehicle.images?.[0]?.secure_url
	);

	const handlePublish = async () => {
		setIsPublishing(true);
		try {
			await createPost(vehicle.id, description);
			setPublishSuccess(true);
			setTimeout(() => {
				setIsPublishModalOpen(false);
				setPublishSuccess(false);
			}, 2000);
		} catch (error) {
			setIsPublishing(false);
		} finally {
			setIsPublishing(false);
		}
	};

	const defaultImage = "/images/car-placeholder.jpg";
	const currentImageUrl = mainImage || defaultImage;

	return (
		<div className='bg-white rounded-lg shadow-md overflow-hidden'>
			<div className='relative h-48'>
				<Image
					src={currentImageUrl}
					alt={`${vehicle.brand.name} ${vehicle.model.name}`}
					fill
					style={{ objectFit: "cover" }}
				/>
			</div>

			{vehicle.images && vehicle.images.length > 1 && (
				<div className='flex space-x-2 p-2 overflow-x-auto'>
					{vehicle.images.map((image, index) => (
						<div
							key={index}
							className={`relative w-16 h-12 cursor-pointer rounded overflow-hidden ${
								image.secure_url === mainImage
									? "border-2 border-principal-blue"
									: ""
							}`}
							onClick={() => setMainImage(image.secure_url)}>
							<Image
								src={image.secure_url}
								alt={`Thumbnail ${index + 1}`}
								fill
								style={{ objectFit: "cover" }}
							/>
						</div>
					))}
				</div>
			)}

			<div className='p-4'>
				<h3 className='text-lg font-semibold text-gray-800'>
					{vehicle.brand.name} {vehicle.model.name}
				</h3>
				<p className='text-sm text-gray-600'>
					{vehicle.version.name} - {vehicle.year}
				</p>
				<p className='text-lg font-bold text-principal-blue mt-2'>
					{vehicle.currency} {vehicle.price.toLocaleString()}
				</p>
				<p className='text-sm text-gray-600'>
					{vehicle.mileage.toLocaleString()} km |{" "}
					{vehicle.condition === "new" ? "Nuevo" : "Usado"}
				</p>

				<div className='mt-4 flex space-x-2'>
					<button
						onClick={() => onViewDetails(vehicle.id)}
						className='flex-1 px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition'>
						Ver detalles
					</button>
					<button
						onClick={() => setIsPublishModalOpen(true)}
						className='flex-1 px-3 py-1.5 bg-principal-blue text-white rounded hover:bg-secondary-blue transition'>
						Publicar
					</button>
				</div>
			</div>

			<Modal
				isOpen={isPublishModalOpen}
				onClose={() => setIsPublishModalOpen(false)}
				title='Publicar Vehículo'>
				{publishSuccess ? (
					<div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
						¡Vehículo publicado exitosamente!
					</div>
				) : (
					<>
						<p className='mb-4'>
							Estás a punto de publicar tu {vehicle.brand.name}{" "}
							{vehicle.model.name} {vehicle.version.name}.
						</p>
						<div className='mb-4'>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Descripción adicional
							</label>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 rounded-md'
								rows={4}
								placeholder='Añade detalles adicionales para tu publicación...'
							/>
						</div>
						<div className='flex justify-end space-x-2'>
							<button
								onClick={() => setIsPublishModalOpen(false)}
								className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'>
								Cancelar
							</button>
							<button
								onClick={handlePublish}
								disabled={isPublishing}
								className='px-4 py-2 bg-principal-blue text-white rounded-md hover:bg-secondary-blue disabled:opacity-50'>
								{isPublishing ? "Publicando..." : "Publicar"}
							</button>
						</div>
					</>
				)}
			</Modal>
		</div>
	);
};

export default VehicleItem;
