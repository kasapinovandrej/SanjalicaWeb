import Categories from "@/components/Categories";
import CtaSection from "@/components/CtaSection";
import Favorites from "@/components/Favorites";
import Hero from "@/components/Hero";
import HowToOrder from "@/components/HowToOrder";
import Occasions from "@/components/Occasions";
import { getProducts } from "@/api/products/productsApi";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Hero />
      <Occasions />
      <Categories />
      <Favorites products={products.filter((p) => p.featured)} />
      <HowToOrder />
      <CtaSection />
    </>
  );
}
