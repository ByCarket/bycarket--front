import FeaturedProducts from "./components/FeaturedProducts";
import PrincingComponent from "./components/ExploreTypesSection";
import { DotSeparator } from "@/components/ui/DotSeparator";
import HomeBanner from "./components/HomeBanner";

export default function HomeView() {
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
