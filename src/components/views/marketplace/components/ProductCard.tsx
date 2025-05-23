import { VehicleResponse } from "@/services/vehicle.service";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  vehicle: VehicleResponse;
}

export default function ProductCard({ vehicle }: ProductCardProps) {
  return (
    <Link
      href={`/marketplace/${vehicle.id}`}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
    >
      <div className="relative h-44 w-full">
        {vehicle.images?.[0] && (
          <Image
            src={vehicle.images[0]}
            alt={`${vehicle.brand.name} ${vehicle.model.name}`}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold mb-1 text-principal-blue truncate">
          {vehicle.brand.name} {vehicle.model.name}
        </h2>
        <p className="text-sm text-secondary-blue mb-1 truncate">
          {vehicle.version.name}
        </p>
        <p className="text-base font-bold text-principal-blue mb-2">
          ${vehicle.price.toLocaleString()}
        </p>
        <p className="text-xs text-gray-600 mb-3">{vehicle.year}</p>
        <span className="mt-auto bg-principal-blue text-white text-sm py-1.5 px-4 rounded-full text-center hover:bg-opacity-90 transition-colors">
          Ver detalles
        </span>
      </div>
    </Link>
  );
}
