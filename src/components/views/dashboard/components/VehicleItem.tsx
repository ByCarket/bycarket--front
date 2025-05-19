import { VehicleResponse } from "@/services/vehicle.service";
import Image from "next/image";

interface VehicleItemProps {
	vehicle: VehicleResponse;
	onPost: (vehicleId: string) => void;
	onViewDetails: (vehicleId: string) => void;
}

const VehicleItem: React.FC<VehicleItemProps> = ({
	vehicle,
	onPost,
	onViewDetails,
}) => {
	const imageUrl =
		vehicle.images && vehicle.images.length > 0
			? vehicle.images[0]
			: "/placeholder-car.png";

	return (
		<div className='border rounded-lg overflow-hidden shadow-lg flex flex-col'>
			<div className='relative w-full h-48'>
				<Image
					src={imageUrl}
					alt={`${vehicle.brand.name} ${vehicle.model.name}`}
					layout='fill'
					objectFit='cover'
				/>
			</div>
			<div className='p-4 flex-grow'>
				<h3 className='text-lg font-semibold'>
					{vehicle.brand.name} {vehicle.model.name}
				</h3>
				<p className='text-sm text-gray-600'>
					{vehicle.version.name} - {vehicle.year}
				</p>
				<p className='text-xl font-bold mt-2'>
					${vehicle.price.toLocaleString()}
				</p>
				<p className='text-sm text-gray-500'>
					{vehicle.mileage.toLocaleString()} KM
				</p>
			</div>
			<div className='p-4 border-t flex justify-between gap-2'>
				<button
					onClick={() => onPost(vehicle.id)}
					className='bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2 px-4 rounded flex-1'>
					Publicar
				</button>
				<button
					onClick={() => onViewDetails(vehicle.id)}
					className='bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded flex-1'>
					Ver Detalle
				</button>
			</div>
		</div>
	);
};

export default VehicleItem;
