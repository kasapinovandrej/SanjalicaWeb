import type { Metadata } from "next";
import Categories from "@/components/Categories";
import CtaSection from "@/components/CtaSection";
import Favorites from "@/components/Favorites";
import Hero from "@/components/Hero";
import HowToOrder from "@/components/HowToOrder";
import Occasions from "@/components/Occasions";
import { getProducts } from "@/api/products/productsApi";
import { getCurrentUser } from "@/api/supabaseServer";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({ description: site.description, path: "/" }),
  title: {
    absolute:
      "Sanjalica Gift Shop — pokloni, buketi i personalizovani pokloni | Kraljevo",
  },
};

export default async function Home() {
  const [products, user] = await Promise.all([
    getProducts(),
    getCurrentUser(),
  ]);

  return (
    <>
      <Hero />
      <Occasions />
      <Categories />
      <Favorites
        products={products.filter((p) => p.featured)}
        isAdmin={Boolean(user)}
      />
      <HowToOrder />
      <CtaSection />
    </>
  );
}
