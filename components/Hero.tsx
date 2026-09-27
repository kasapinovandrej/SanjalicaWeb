import Image from "next/image";
import { Check } from "lucide-react";
import ButtonLink from "./ui/ButtonLink";
import Container from "./ui/Container";

const highlights = [
  "Mirisni sojin vosak",
  "Boje i poruka po želji",
  "Traje godinama",
];

export default function Hero() {
  return (
    <section>
      <Container className="grid items-center gap-6 pt-6 pb-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-9 lg:pt-14 lg:pb-20 xl:grid-cols-[580px_1fr] xl:gap-[60px]">
        {/* Tekst */}
        <div className="order-2 flex flex-col gap-[22px] lg:order-1 lg:gap-7">
          <p className="eyebrow">Ručno rađeni buketi i pokloni</p>
          <h1 className="font-serif text-[50px] leading-none tracking-[-0.01em] text-balance lg:text-[84px]">
            Kad reči nisu dovoljne —{" "}
            <em className="text-rose">tu smo mi.</em>
          </h1>
          <p className="max-w-[500px] text-base leading-relaxed text-body text-pretty lg:text-[19px]">
            Buketi od mirisnog sojinog voska, slatki aranžmani i
            personalizovani pokloni — izrađeni po meri, s ljubavlju i pažnjom,
            za svaku priliku.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:pt-2">
            <ButtonLink href="/proizvodi">Pogledaj proizvode</ButtonLink>
            <ButtonLink href="/kontakt" variant="outline">
              Poruči po meri
            </ButtonLink>
          </div>
          <ul className="hidden flex-wrap gap-7 pt-5 text-sm text-body lg:flex">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check size={18} strokeWidth={1.8} className="text-rose" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Slika u obliku luka */}
        <div className="relative order-1 w-full lg:order-2 lg:aspect-[540/624] lg:h-auto lg:max-w-[540px] lg:justify-self-end">
          <div className="relative h-[380px] w-full overflow-hidden rounded-t-full rounded-b-[20px] sm:h-[480px] lg:absolute lg:top-0 lg:right-0 lg:h-full lg:w-full lg:rounded-b-[28px]">
            <Image
              src="/assets/images/bg-light-rose.png"
              alt="Buket ruža od sojinog voska u beloj korpi"
              fill
              priority
              sizes="(min-width: 1280px) 540px, (min-width: 1024px) 45vw, 100vw"
              className="object-cover object-[72%_50%]"
            />
          </div>

          <div className="absolute bottom-12 left-0 hidden w-[280px] items-center gap-3.5 rounded-[20px] bg-white p-4 shadow-[0_18px_40px_rgba(46,14,31,0.14)] lg:flex">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
              <Image
                src="/assets/images/red-bear.jpg"
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-serif text-[22px] leading-tight">
                Izrada po meri
              </span>
              <span className="text-[13px] leading-snug text-body">
                Ime, poruka i boje po vašoj želji
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
