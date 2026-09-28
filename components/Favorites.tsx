"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Product } from "@/api/products/productsType";
import ProductCard from "./ProductCard";
import ButtonLink from "./ui/ButtonLink";
import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";

const MOBILE_COUNT = 4;

export default function Favorites({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows]);

  const scroll = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 32 : el.clientWidth;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const arrowClass =
    "flex h-[52px] w-[52px] items-center justify-center rounded-full border-[1.5px] border-ink transition-colors disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <section className="bg-blush py-16 lg:py-28">
      <Container className="flex flex-col gap-7 lg:gap-12">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Kolekcija koju kupci obožavaju"
            title="Top izbor naših klijenata"
          />
          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <button
              type="button"
              aria-label="Prethodni proizvodi"
              onClick={() => scroll(-1)}
              disabled={!canPrev}
              className={`${arrowClass} text-ink hover:bg-ink hover:text-cream`}
            >
              <ArrowLeft size={20} aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Sledeći proizvodi"
              onClick={() => scroll(1)}
              disabled={!canNext}
              className={`${arrowClass} bg-ink text-cream hover:bg-bordo`}
            >
              <ArrowRight size={20} aria-hidden />
            </button>
            <Link
              href="/proizvodi"
              className="ml-4 font-semibold text-ink underline underline-offset-4 hover:text-rose"
            >
              Vidi sve proizvode
            </Link>
          </div>
        </div>

        {/* Mobilni: grid 2×2 · Desktop: klizač sa 4 vidljiva proizvoda */}
        <ul
          ref={trackRef}
          onScroll={updateArrows}
          className="no-scrollbar grid grid-cols-2 gap-x-3.5 gap-y-6 lg:flex lg:snap-x lg:snap-mandatory lg:gap-8 lg:overflow-x-auto"
        >
          {products.map((product, i) => (
            <li
              key={product.slug}
              className={`lg:w-[calc((100%-96px)/4)] lg:shrink-0 lg:snap-start ${
                i >= MOBILE_COUNT ? "hidden lg:block" : ""
              }`}
            >
              <ProductCard product={product} compactOnMobile />
            </li>
          ))}
        </ul>

        <ButtonLink href="/proizvodi" variant="outline" className="lg:hidden">
          Vidi sve proizvode
        </ButtonLink>
      </Container>
    </section>
  );
}
