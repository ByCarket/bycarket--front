import BuySection from "./components/BuySection";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import SellSection from "./components/SellSection";

export default function LandingView() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <SellSection />
      <BuySection />
    </main>
  );
}
