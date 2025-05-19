import { VehicleResponse } from "@/services/vehicle.service";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
	vehicle: VehicleResponse;
}

export default function ProductCard({ vehicle }: ProductCardProps) {
	return (
		<div className='bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300'>
			<div className='h-48 bg-gray-200 relative'>
				{vehicle.images && vehicle.images.length > 0 && (
					<Image
						src={vehicle.images[0]}
						alt={`${vehicle.brand.name} ${vehicle.model.name}`}
						className='w-full h-full object-cover'
					/>
				)}
			</div>
			<div className='p-4'>
				<h3 className='text-lg font-semibold text-[#103663]'>
					{`${vehicle.brand.name} ${vehicle.model.name} ${vehicle.version.name}`}
				</h3>
				<div className='flex justify-between items-center mt-2'>
					<span className='text-xl font-bold'>
						${vehicle.price.toLocaleString()}
					</span>
					<span className='text-sm text-gray-500'>
						{vehicle.year}
					</span>
				</div>
				<div className='mt-3 text-sm text-gray-600'>
					<div className='flex justify-between mb-1'>
						<span>Kilometraje:</span>
						<span className='font-medium'>
							{vehicle.mileage.toLocaleString()} km
						</span>
					</div>
					<div className='flex justify-between mb-1'>
						<span>Motor:</span>
						<span className='font-medium'>N/A</span>{" "}
					</div>
					<div className='flex justify-between'>
						<span>Transmisión:</span>
						<span className='font-medium'>N/A</span>{" "}
					</div>
				</div>
				<Link href={`/marketplace/${vehicle.id}`} passHref>
					<button className='w-full mt-4 bg-[#103663] text-white py-2 rounded-md hover:bg-[#0c2a4d] transition-colors'>
						Ver Detalles
					</button>
				</Link>
			</div>
		</div>
	);
}
