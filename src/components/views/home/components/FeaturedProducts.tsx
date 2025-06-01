"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PostResponse } from "@/services/vehicle.service";
import { ProductCard } from "@/components/views/marketplace/components/ProductCard";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // DESCOMENTAR PARA MOCKEAR PUBLICACIONES
        setTimeout(() => {
          // const mockData: PostResponse[] = [
          //   {
          //     id: "201",
          //     status: "Approved",
          //     postDate: new Date().toISOString(),
          //     vehicle: {
          //       id: "201",
          //       brand: { id: "1", name: "Toyota" },
          //       model: { id: "10", brandId: "1", name: "Corolla" },
          //       version: { id: "100", modelId: "10", name: "XEi" },
          //       typeOfVehicle: "Sedán",
          //       year: 2020,
          //       condition: "used",
          //       currency: "AR$",
          //       price: 2500000,
          //       mileage: 35000,
          //       description: "Sedán familiar en muy buen estado.",
          //       images: [
          //         {
          //           public_id: "toyota-corolla",
          //           secure_url: "/assets/images/cars/toyota-corolla.webp",
          //         },
          //       ],
          //       userId: "user123",
          //       createdAt: new Date().toISOString(),
          //     },
          //   },
          //   {
          //     id: "202",
          //     status: "Approved",
          //     postDate: new Date().toISOString(),
          //     vehicle: {
          //       id: "202",
          //       brand: { id: "2", name: "Honda" },
          //       model: { id: "20", brandId: "2", name: "Civic" },
          //       version: { id: "200", modelId: "20", name: "LX" },
          //       typeOfVehicle: "Sedán",
          //       year: 2019,
          //       condition: "used",
          //       currency: "AR$",
          //       price: 2700000,
          //       mileage: 42000,
          //       description: "Civic en excelente estado, único dueño.",
          //       images: [
          //         {
          //           public_id: "honda-civic",
          //           secure_url: "/assets/images/cars/honda-civic.webp",
          //         },
          //       ],
          //       userId: "user456",
          //       createdAt: new Date().toISOString(),
          //     },
          //   },
          //   {
          //     id: "203",
          //     status: "Approved",
          //     postDate: new Date().toISOString(),
          //     vehicle: {
          //       id: "203",
          //       brand: { id: "3", name: "Ford" },
          //       model: { id: "30", brandId: "3", name: "Ranger" },
          //       version: { id: "300", modelId: "30", name: "XLT" },
          //       typeOfVehicle: "Pickup",
          //       year: 2021,
          //       condition: "used",
          //       currency: "AR$",
          //       price: 3600000,
          //       mileage: 15000,
          //       description: "Pickup en excelente estado y baja milla.",
          //       images: [
          //         {
          //           public_id: "ford-ranger",
          //           secure_url: "/assets/images/cars/ford-ranger.webp",
          //         },
          //       ],
          //       userId: "user789",
          //       createdAt: new Date().toISOString(),
          //     },
          //   },
          // ];

          setProducts([]);
          setLoading(false);
        }, 2500);
      } catch (error) {
        console.error("Error cargando productos destacados:", error);
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse flex flex-col h-full">
      <div className="h-48 w-full bg-gray-200"></div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="mt-auto pt-3">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="flex justify-between items-center mt-2">
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );

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
        {loading ? (
          [1, 2, 3].map((i) => <SkeletonCard key={i} />)
        ) : products.length > 0 ? (
          products.map((post) => <ProductCard key={post.id} post={post} />)
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No hay productos destacados
          </p>
        )}
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
