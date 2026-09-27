import { site } from "@/lib/site";
import ButtonLink from "./ui/ButtonLink";
import Container from "./ui/Container";
import { InstagramIcon } from "./ui/icons";

export default function CtaSection() {
  return (
    <section className="pb-10 lg:pb-20">
      <Container>
        <div className="grid gap-8 rounded-3xl bg-bordo px-6 py-9 lg:grid-cols-[1fr_360px] lg:items-center lg:gap-[60px] lg:rounded-[32px] lg:px-[88px] lg:py-[72px]">
          <div className="flex flex-col gap-3 lg:gap-5">
            <h2 className="font-serif text-[40px] leading-[1.02] text-white lg:text-[64px]">
              Spremni za <em>savršen poklon?</em>
            </h2>
            <p className="max-w-[520px] text-[15px] leading-relaxed text-on-bordo lg:text-lg">
              Ne čekajte poslednji trenutak — savršen poklon traži vreme,
              ljubav i pažnju. Javite nam se danas.
            </p>
          </div>
          <div className="flex flex-col gap-3.5">
            <ButtonLink href="/kontakt" variant="light">
              Kontaktirajte nas
            </ButtonLink>
            <ButtonLink href={site.instagram} variant="outlineLight">
              <InstagramIcon className="h-[18px] w-[18px]" />
              Pišite nam na Instagramu
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
