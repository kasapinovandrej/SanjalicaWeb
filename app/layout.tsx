import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProductDeleteProvider } from "@/components/ProductDelete";
import { ProductEditProvider } from "@/components/ProductEdit";
import JsonLd from "@/components/JsonLd";
import { keywords, occasions, site } from "@/lib/site";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default:
      "Sanjalica Gift Shop — pokloni, buketi i personalizovani pokloni | Kraljevo",
    template: "%s · Sanjalica Gift Shop",
  },
  description: site.description,
  keywords,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  category: "shopping",
  openGraph: {
    type: "website",
    locale: "sr_RS",
    siteName: site.name,
    title: "Sanjalica Gift Shop — ručno rađeni pokloni i buketi",
    description: site.description,
    images: [
      {
        url: "/assets/images/kaca-buket.jpg",
        alt: "Ručno rađen buket od sojinog voska — Sanjalica Gift Shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanjalica Gift Shop — ručno rađeni pokloni i buketi",
    description: site.description,
    images: ["/assets/images/kaca-buket.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Strukturirani podaci — Google iz ovoga pravi „kartu" radnje u pretrazi.
const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  "@id": `${site.url}/#store`,
  name: site.name,
  description: site.description,
  url: site.url,
  image: `${site.url}/assets/images/kaca-buket.jpg`,
  logo: `${site.url}/favicon.ico`,
  telephone: site.phone,
  email: site.email,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressCountry: "RS",
  },
  areaServed: { "@type": "Country", name: "Srbija" },
  sameAs: [site.instagram],
  knowsAbout: occasions.map((o) => `Poklon za: ${o}`),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: site.name,
  url: site.url,
  inLanguage: "sr-Latn",
  publisher: { "@id": `${site.url}/#store` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sr-Latn"
      className={`${dmSans.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <JsonLd data={[storeJsonLd, websiteJsonLd]} />
        <ProductEditProvider>
          <ProductDeleteProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </ProductDeleteProvider>
        </ProductEditProvider>
      </body>
    </html>
  );
}
