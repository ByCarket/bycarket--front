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
      className={`
        group block w-full
        bg-[#4a77a8] rounded-2xl 
        overflow-hidden border border-white/20
        transform transition 
        hover:shadow-2xl hover:scale-[1.02]
        duration-300
      `}
    >
      <div className="relative h-44 md:h-48">
        {vehicle.images?.[0] && (
          <Image
            src={vehicle.images[0]}
            alt={`${vehicle.brand.name} ${vehicle.model.name}`}
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
          />
        )}
      </div>

      <div className="px-4 py-3 bg-white/10 backdrop-blur-sm space-y-1.5">
        <h3 className="text-lg font-semibold text-white truncate">
          {vehicle.brand.name} {vehicle.model.name}
        </h3>
        <p className="text-sm text-white/90 truncate">{vehicle.version.name}</p>

        <div className="flex justify-between items-center mt-2">
          <span className="text-xl font-bold text-yellow-400">
            ${vehicle.price.toLocaleString()}
          </span>
          <span className="text-base text-white/90">{vehicle.year}</span>
        </div>

        <div className="mt-3">
          <span
            className={`
              inline-block w-full text-center
              text-base font-medium
              bg-white text-[#103663]
              py-2 rounded-full
              shadow-sm
              opacity-90 group-hover:opacity-100
              transition-opacity duration-200
            `}
          >
            Ver detalles
          </span>
        </div>
      </div>
    </Link>
  );
}
