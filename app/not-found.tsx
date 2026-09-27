import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="py-24 lg:py-40">
      <Container className="flex flex-col items-start gap-6">
        <p className="eyebrow">Greška 404</p>
        <h1 className="font-serif text-[46px] leading-none lg:text-[72px]">
          Ova stranica <em className="text-rose">ne postoji.</em>
        </h1>
        <ButtonLink href="/">Nazad na početnu</ButtonLink>
      </Container>
    </section>
  );
}
