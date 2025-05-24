"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Citroen C3 Picasso",
    model: "Modelo 2015",
    price: "$12.500.000",
    image: "/assets/images/cars/citroen-c3-picasso.webp",
  },
  {
    id: 2,
    name: "Ford Ranger",
    model: "Modelo 2021",
    price: "$36.000.000",
    image: "/assets/images/cars/ford-ranger.webp",
  },
  {
    id: 3,
    name: "Peugeot 308",
    model: "Modelo 2011",
    price: "US$ 19.900",
    image: "/assets/images/cars/peugeot-308.webp",
  },
];

export default function FeaturedProducts() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-2 pb-12 flex flex-col items-center">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-8 flex flex-col items-center">
        <div className="mb-0 text-center">
          <h1 className="text-5xl font-bold text-principal-blue leading-none">
            Productos destacados
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            <div className="relative h-56 w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority={true}
              />
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold mb-1 text-principal-blue">
                {product.name}
              </h2>
              <p className="text-secondary-blue text-sm mb-2">
                {product.model}
              </p>
              <p className="font-bold text-principal-blue text-lg mb-4">
                {product.price}
              </p>
              <button className="mt-auto bg-principal-blue text-white py-2 px-6 rounded-full hover:bg-opacity-90 transition-colors">
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center">
        <Link
          href="/marketplace"
          className="mt-12 inline-flex items-center text-principal-blue font-semibold text-lg hover:underline"
        >
          Ver todos los vehículos
          <ArrowRight className="ml-2" size={20} />
        </Link>
      </div>
    </div>
  );
}
