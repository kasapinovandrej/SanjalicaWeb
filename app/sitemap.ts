import type { MetadataRoute } from "next";
import { getCategories } from "@/api/categories/categoriseApi";
import { getProducts } from "@/api/products/productsApi";
import { site } from "@/lib/site";

// Osvežava se na sat vremena, pa novi proizvodi brzo ulaze u sitemap.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/proizvodi`, changeFrequency: "weekly", priority: 0.9 },
    ...categories.map((c) => ({
      url: `${site.url}/proizvodi?kategorija=${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${site.url}/proizvodi/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: p.image?.slice(0, 1),
    })),
    { url: `${site.url}/o-nama`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${site.url}/kontakt`, changeFrequency: "yearly", priority: 0.6 },
  ];
}
