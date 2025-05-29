"use client";

import FeaturedProducts from "./components/FeaturedProducts";
import PrincingComponent from "./components/ExploreTypesSection";
import { DotSeparator } from "@/components/ui/DotSeparator";
import HomeBanner from "./components/HomeBanner";

export default function HomeView() {
  const handleSearch = (query: string) => {
    console.log("Consulta de búsqueda:", query);
  };

  return (
    <>
      <HomeBanner />
      <DotSeparator />
      <FeaturedProducts />
      <DotSeparator />
      <PrincingComponent />
    </>
  );
}
