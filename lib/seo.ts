import type { Metadata } from "next";
import { site } from "@/lib/site";

const defaultImage = "/assets/images/kaca-buket.jpg";

type PageSeo = {
  title?: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
};

// Podstranica zamenjuje ceo openGraph objekat iz layout-a, pa ga ovde gradimo kompletno.
export function pageMetadata({
  title,
  description,
  path,
  image = defaultImage,
  imageAlt,
  keywords,
}: PageSeo): Metadata {
  const fullTitle = title ? `${title} · ${site.name}` : site.name;
  const images = [{ url: image, alt: imageAlt ?? title ?? site.name }];

  return {
    ...(title && { title }),
    description,
    ...(keywords && { keywords }),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "sr_RS",
      siteName: site.name,
      title: fullTitle,
      description,
      url: path,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

// Skraćuje opis na ~155 znakova da ga Google ne bi presekao usred reči.
export function truncate(text: string, max = 155) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}
