"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

const frameClass =
  "relative aspect-[3/4] overflow-hidden rounded-[20px] bg-blush lg:rounded-[28px]";

const arrowClass =
  "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-ink shadow-sm transition-colors hover:bg-ink hover:text-cream disabled:pointer-events-none disabled:opacity-0";

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [swiper, setSwiper] = useState<SwiperClass>();
  const [active, setActive] = useState(0);

  if (images.length <= 1) {
    return (
      <div className={frameClass}>
        {images[0] && (
          <Image
            src={images[0]}
            alt={alt}
            fill
            priority
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <div className={frameClass}>
        <Swiper
          modules={[A11y, Keyboard]}
          keyboard={{ enabled: true }}
          onSwiper={setSwiper}
          onSlideChange={(s) => setActive(s.activeIndex)}
          className="h-full"
        >
          {images.map((src, i) => (
            <SwiperSlide key={src} className="relative">
              <Image
                src={src}
                alt={`${alt} — fotografija ${i + 1} od ${images.length}`}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          type="button"
          aria-label="Prethodna fotografija"
          onClick={() => swiper?.slidePrev()}
          disabled={active === 0}
          className={`${arrowClass} left-3`}
        >
          <ArrowLeft size={18} aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Sledeća fotografija"
          onClick={() => swiper?.slideNext()}
          disabled={active === images.length - 1}
          className={`${arrowClass} right-3`}
        >
          <ArrowRight size={18} aria-hidden />
        </button>
        <span className="absolute right-3 bottom-3 z-10 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-semibold text-cream">
          {active + 1} / {images.length}
        </span>
      </div>

      <ul className="no-scrollbar flex gap-2.5 overflow-x-auto lg:gap-3">
        {images.map((src, i) => (
          <li key={src} className="shrink-0">
            <button
              type="button"
              onClick={() => swiper?.slideTo(i)}
              aria-label={`Prikaži fotografiju ${i + 1}`}
              aria-current={active === i ? "true" : undefined}
              className={`relative block h-20 w-16 overflow-hidden rounded-[10px] border-2 transition-opacity lg:h-24 lg:w-[72px] ${
                active === i
                  ? "border-rose"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="72px"
                className="object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
