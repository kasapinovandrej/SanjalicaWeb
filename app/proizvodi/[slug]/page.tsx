import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { DeleteProductButton } from "@/components/ProductDelete";
import { EditProductButton } from "@/components/ProductEdit";
import ProductGallery from "@/components/ProductGallery";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import { InstagramIcon } from "@/components/ui/icons";
import JsonLd from "@/components/JsonLd";
import { formatPrice } from "@/lib/helpers";
import { pageMetadata, truncate } from "@/lib/seo";
import { site } from "@/lib/site";
import { getCategories } from "@/api/categories/categoriseApi";
import { getProducts } from "@/api/products/productsApi";
import { getCurrentUser } from "@/api/supabaseServer";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return pageMetadata({
    title: product.name,
    description: truncate(
      `${product.description} Ručno rađen poklon po meri — Sanjalica Gift Shop, ${site.city}.`,
    ),
    path: `/proizvodi/${product.slug}`,
    image: product.image?.[0],
    imageAlt: product.name,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [categories, products, user] = await Promise.all([
    getCategories(),
    getProducts(),
    getCurrentUser(),
  ]);
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const category = categories.find((c) => c.id === product.categoryId);
  const related = products
    .filter(
      (p) => p.categoryId === product.categoryId && p.slug !== product.slug,
    )
    .slice(0, 4);

  const productUrl = `${site.url}/proizvodi/${product.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.image,
      url: productUrl,
      ...(category && { category: category.title }),
      brand: { "@type": "Brand", name: site.name },
      // Google prikazuje cenu u rezultatima samo kada je poznata.
      ...(product.price !== null && {
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "RSD",
          availability: "https://schema.org/MadeToOrder",
          url: productUrl,
          seller: { "@id": `${site.url}/#store` },
        },
      }),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { name: "Početna", item: site.url },
        { name: "Proizvodi", item: `${site.url}/proizvodi` },
        ...(category
          ? [
              {
                name: category.title,
                item: `${site.url}/proizvodi?kategorija=${category.slug}`,
              },
            ]
          : []),
        { name: product.name, item: productUrl },
      ].map((crumb, i) => ({
        "@type": "ListItem",
        position: i + 1,
        ...crumb,
      })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="py-8 lg:py-16">
        <Container className="flex flex-col gap-6 lg:gap-10">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/proizvodi"
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-body hover:text-rose"
            >
              <ArrowLeft size={16} aria-hidden />
              Svi proizvodi
            </Link>
            {user && (
              <div className="flex gap-2">
                <EditProductButton product={product} />
                <DeleteProductButton product={product} />
              </div>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-20">
            <ProductGallery images={product.image} alt={product.name} />

            <div className="flex flex-col gap-5 lg:justify-center lg:gap-7">
              {category && (
                <Link
                  href={`/proizvodi?kategorija=${category.slug}`}
                  className="eyebrow hover:text-rose"
                >
                  {category.title}
                </Link>
              )}
              <h1 className="font-serif text-[44px] leading-none text-balance lg:text-[68px]">
                {product.name}
              </h1>
              <p className="text-base leading-relaxed text-body lg:text-lg">
                {product.description}
              </p>
              <p className="text-lg font-semibold text-rose-dark">
                {formatPrice(product.price)}
              </p>
              <p className="border-t border-line-strong pt-5 text-[15px] leading-relaxed text-body">
                Svaki poklon izrađujemo ručno — boje, miris, ime ili poruku
                prilagođavamo vašoj želji.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/kontakt">Poruči ovaj poklon</ButtonLink>
                <ButtonLink href={site.instagram} variant="outline">
                  <InstagramIcon className="h-[18px] w-[18px]" />
                  Pitaj na Instagramu
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="bg-blush py-14 lg:py-24">
          <Container className="flex flex-col gap-7 lg:gap-12">
            <h2 className="font-serif text-[34px] leading-[1.05] lg:text-[48px]">
              Možda vam se dopadne i…
            </h2>
            <ul className="grid grid-cols-2 gap-x-3.5 gap-y-8 lg:grid-cols-4 lg:gap-8">
              {related.map((p) => (
                <li key={p.slug}>
                  <ProductCard
                    product={p}
                    compactOnMobile
                    isAdmin={Boolean(user)}
                  />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
