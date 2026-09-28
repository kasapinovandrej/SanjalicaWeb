import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import CtaSection from "@/components/CtaSection";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { getCategories } from "@/api/categories/categoriseApi";
import { getProducts } from "@/api/products/productsApi";
import { getCurrentUser } from "@/api/supabaseServer";

export const metadata: Metadata = {
  title: "Proizvodi",
  description:
    "Buketi od sojinog voska, slatki aranžmani i personalizovani pokloni.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorija?: string }>;
}) {
  const { kategorija } = await searchParams;
  const [categories, products, user] = await Promise.all([
    getCategories(),
    getProducts(),
    getCurrentUser(),
  ]);
  const active = categories.find((c) => c.slug === kategorija);
  const list = active
    ? products.filter((p) => p.categoryId === active.id)
    : products;

  const filters = [
    { label: "Sve", href: "/proizvodi", isActive: !active },
    ...categories.map((c) => ({
      label: c.title,
      href: `/proizvodi?kategorija=${c.slug}`,
      isActive: active?.slug === c.slug,
    })),
  ];

  return (
    <>
      <section className="py-12 lg:py-20">
        <Container className="flex flex-col gap-8 lg:gap-12">
          <SectionHeading
            as="h1"
            eyebrow="Naša ponuda"
            title={active ? active.title : "Svi proizvodi"}
          />

          <nav aria-label="Kategorije">
            <ul className="flex flex-wrap gap-2.5">
              {filters.map((f) => (
                <li key={f.href} className="shrink-0">
                  <Link
                    href={f.href}
                    aria-current={f.isActive ? "page" : undefined}
                    className={`inline-flex rounded-full border-[1.5px] px-5 py-3 text-[15px] font-semibold transition-colors ${
                      f.isActive
                        ? "border-ink bg-ink text-cream"
                        : "border-line-strong text-ink hover:border-ink"
                    }`}
                  >
                    {f.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="grid grid-cols-2 gap-x-3.5 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12">
            {list.map((product) => (
              <li key={product.slug}>
                <ProductCard
                  product={product}
                  compactOnMobile
                  isAdmin={Boolean(user)}
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaSection />
    </>
  );
}
