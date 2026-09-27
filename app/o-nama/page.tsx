import type { Metadata } from "next";
import Image from "next/image";
import CtaSection from "@/components/CtaSection";
import HowToOrder from "@/components/HowToOrder";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "O nama",
};

export default function AboutPage() {
  return (
    <>
      <section className="py-12 lg:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-5 lg:gap-7">
            <p className="eyebrow">O nama</p>
            <h1 className="font-serif text-[46px] leading-none text-balance lg:text-[72px]">
              Napravljeno s ljubavlju, <em className="text-rose">darovano od srca.</em>
            </h1>
            <p className="text-base leading-relaxed text-body lg:text-lg">
              Ručno rađeni buketi od sojinog voska, slatki aranžmani i
              nezaboravni pokloni za svaku priliku — spoj umetnosti, mirisa i
              pažljivo biranih detalja koji donose radost i eleganciju svakom
              prostoru.
            </p>
            <p className="text-base leading-relaxed text-body lg:text-lg">
              Svaki komad je izrađen s ljubavlju i pažnjom, kako bi postao
              savršen poklon koji ostavlja dugotrajan utisak.
            </p>
            {/* TODO: dodati ličnu priču — ko stoji iza Sanjalice i kako je počelo */}
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[28px]">
            <Image
              src="/assets/images/light-colors-bouquet.jpg"
              alt="Buket u nežnim pastelnim bojama"
              fill
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>
      <HowToOrder />
      <CtaSection />
    </>
  );
}
