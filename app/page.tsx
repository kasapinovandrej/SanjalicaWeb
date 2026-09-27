import Categories from "@/components/Categories";
import CtaSection from "@/components/CtaSection";
import Favorites from "@/components/Favorites";
import Hero from "@/components/Hero";
import HowToOrder from "@/components/HowToOrder";
import Occasions from "@/components/Occasions";

export default function Home() {
  return (
    <>
      <Hero />
      <Occasions />
      <Categories />
      <Favorites />
      <HowToOrder />
      <CtaSection />
    </>
  );
}
