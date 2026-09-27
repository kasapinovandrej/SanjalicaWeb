import { site } from "@/lib/site";
import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";

const steps = [
  {
    title: "Izaberite ili opišite poklon",
    text: "Izaberite nešto iz ponude ili nam pošaljite sliku i ideju.",
  },
  {
    title: "Dogovorimo detalje",
    text: "Boje, miris, ime ili poruka — sve prilagođavamo vama.",
  },
  {
    title: "Preuzimanje ili dostava",
    // text: site.delivery,
    text: "Rok izrade i način dostave zavise od proizvoda i lokacije.",
  },
];

export default function HowToOrder() {
  return (
    <section className="py-14 lg:py-28">
      <Container className="flex flex-col gap-6 lg:gap-14">
        <SectionHeading
          eyebrow="Kako poručiti"
          title="Od ideje do poklona u tri koraka"
        />
        <ol className="flex flex-col gap-5 lg:grid lg:grid-cols-3 lg:gap-12">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="flex gap-4 border-t border-line-strong pt-4 lg:flex-col lg:gap-3 lg:pt-6"
            >
              <span
                aria-hidden="true"
                className="w-10 shrink-0 font-serif text-[30px] leading-none text-rose italic lg:text-[40px]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1 lg:gap-3">
                <h3 className="text-[17px] font-semibold lg:text-xl">
                  {step.title}
                </h3>
                <p className="text-sm leading-normal text-body lg:text-base lg:leading-relaxed">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
