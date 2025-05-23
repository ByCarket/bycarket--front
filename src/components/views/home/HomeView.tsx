import FeaturedProducts from "./components/FeaturedProducts";
import PrincingComponent from "./components/ExploreTypesSection";
import { DotSeparator } from "@/components/ui/DotSeparator";
import HomeBanner from "./components/HomeBanner";
import SearchBar from "@/components/ui/SearchBar";

export default function HomeView() {
  return (
    <>
      <HomeBanner />
      <DotSeparator />
      <SearchBar />
      <FeaturedProducts />
      <DotSeparator />
      <PrincingComponent />
    </>
  );
}
