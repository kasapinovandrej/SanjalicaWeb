import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import { InstagramIcon } from "@/components/ui/icons";
import {
  formatPrice,
  getCategory,
  getProduct,
  products,
} from "@/lib/products";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      <section className="py-8 lg:py-16">
        <Container className="flex flex-col gap-6 lg:gap-10">
          <Link
            href="/proizvodi"
            className="inline-flex items-center gap-2 self-start text-[15px] font-semibold text-body hover:text-rose"
          >
            <ArrowLeft size={16} aria-hidden />
            Svi proizvodi
          </Link>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-20">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-blush lg:rounded-[28px]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </div>

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
                  <ProductCard product={p} compactOnMobile />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
