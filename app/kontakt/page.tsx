import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import HowToOrder from "@/components/HowToOrder";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import { InstagramIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt",
};

const contacts = [
  {
    label: "Telefon",
    value: site.phone,
    href: `tel:${site.phone.replace(/\s/g, "")}`,
    icon: Phone,
  },
  { label: "Email", value: site.email, href: `mailto:${site.email}`, icon: Mail },
  { label: "Lokacija", value: site.city, icon: MapPin },
];

export default function ContactPage() {
  return (
    <>
      <section className="py-12 lg:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_480px] lg:gap-20">
          <div className="flex flex-col gap-5 lg:gap-7">
            <p className="eyebrow">Kontakt</p>
            <h1 className="font-serif text-[46px] leading-none text-balance lg:text-[72px]">
              Hajde da napravimo <em className="text-rose">vaš poklon.</em>
            </h1>
            <p className="max-w-[520px] text-base leading-relaxed text-body lg:text-lg">
              Pošaljite nam sliku, ideju ili samo priliku za koju tražite
              poklon — javićemo vam se sa predlogom.
            </p>
          </div>

          <div className="flex flex-col gap-6 rounded-3xl bg-blush p-6 lg:p-10">
            <ul className="flex flex-col">
              {contacts.map(({ label, value, href, icon: Icon }) => (
                <li
                  key={label}
                  className="flex items-center gap-4 border-b border-line-strong py-4 first:pt-0"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-rose">
                    <Icon size={20} strokeWidth={1.8} aria-hidden />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[13px] text-muted">{label}</span>
                    {href ? (
                      <a href={href} className="text-lg font-semibold hover:text-rose">
                        {value}
                      </a>
                    ) : (
                      <span className="text-lg font-semibold">{value}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <ButtonLink href={site.instagram}>
              <InstagramIcon className="h-[18px] w-[18px]" />
              Pišite nam na Instagramu
            </ButtonLink>
          </div>
        </Container>
      </section>
      <HowToOrder />
    </>
  );
}
