import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import CtaSection from "@/components/CtaSection";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { categories, getCategory, products } from "@/lib/products";

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
  const active = getCategory(kategorija);
  const list = active
    ? products.filter((p) => p.category === active.slug)
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
            <ul className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5">
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
                <ProductCard product={product} compactOnMobile />
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaSection />
    </>
  );
}
