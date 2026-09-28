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
              Napravljeno s ljubavlju,{" "}
              <em className="text-rose">darovano od srca.</em>
            </h1>
            <p className="text-base leading-relaxed text-body lg:text-lg">
              Sve što ovde vidite pravim sama, svojim rukama. A počelo je mnogo
              pre nego što sam uopšte pomislila da bi od toga mogla da nastane
              firma.
            </p>
            <p className="text-base leading-relaxed text-body lg:text-lg">
              U srednjoj školi sam ceo džeparac trošila na materijale za
              dekoraciju. Satima sam isprobavala boje, oblike i teksture, šta se
              s čim slaže, a šta ne. Niko me tome nije učio i nisam imala
              nikakav plan. Samo mi je bilo važno da sve ispadne baš kako treba.
              To se ni danas nije promenilo.
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[28px] pt-5">
            <Image
              src="/assets/images/o-nama-kaca.webp"
              alt="Kaća sa buketom"
              fill
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover object-[50%_30%]"
            />
          </div>
        </Container>
      </section>

      <section className="bg-blush py-14 lg:py-24">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col gap-12 lg:gap-16">
            <div className="flex flex-col gap-4 lg:gap-5">
              <h2 className="font-serif text-[34px] leading-[1.05] lg:text-[48px]">
                Korak po korak
              </h2>
              <p className="text-base leading-relaxed text-body lg:text-lg">
                Godinama sam radila po nekoliko poslova odjednom i štedela gde
                god sam mogla. Od te ušteđevine sam, jednu po jednu, kupovala
                mašine, alate i opremu bez kojih ovaj posao ne može da se radi
                kako treba. Prečica nije bilo, a iskreno, nisam ih ni tražila.
              </p>
              <p className="text-base leading-relaxed text-body lg:text-lg">
                Firmu sam zvanično otvorila 2025. godine. Na papiru je to samo
                jedan datum. Za mene je to bio kraj dugog puta i početak nečega
                što sam dugo sanjala.
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:gap-5">
              <h2 className="font-serif text-[34px] leading-[1.05] lg:text-[48px]">
                Detalji su mi sve
              </h2>
              <p className="text-base leading-relaxed text-body lg:text-lg">
                Svaki buket od sojinog voska oblikujem ručno, laticu po laticu.
                Proizvode od jesmonita izlivam i doterujem sve dok ne budem
                potpuno zadovoljna, a to ume da potraje. Na svaki
                personalizovani poklon dodam nešto što ga čini samo vašim.
              </p>
              <p className="text-base leading-relaxed text-body lg:text-lg">
                Mnogo mi znači kada mi se isti ljudi javljaju ponovo, prvo za
                rođendan, pa za godišnjicu, pa za krštenje. To mi je najlepši
                znak da se trud vidi.
              </p>
              <p className="border-l-2 border-rose pl-5 font-serif text-[22px] leading-snug text-ink lg:text-[26px]">
                Ideju svako može da kopira. Strpljenje za sitnice i ljubav prema
                poslu ne mogu.
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:gap-5">
              <h2 className="font-serif text-[34px] leading-[1.05] lg:text-[48px]">
                Zašto to radim
              </h2>
              <p className="text-base leading-relaxed text-body lg:text-lg">
                Poklon koji izađe iz mojih ruku nije napravljen na traci. U
                njega su uloženi vreme, pažnja i jedna iskrena želja: da se
                osoba koja ga otvori osmehne i oseti da je neko mislio baš na
                nju.
              </p>
              <p className="text-lg font-semibold text-rose-dark lg:text-xl">
                Hvala što ste svratili. Dobrodošli tamo gde pokloni dobijaju
                dušu. 🌸
              </p>
            </div>
          </div>
        </Container>
      </section>

      <HowToOrder />
      <CtaSection />
    </>
  );
}
