import Image from "next/image";
import Link from "next/link";
import { navigation, site } from "@/lib/site";
import Container from "./ui/Container";

const headingClass =
  "text-xs font-semibold tracking-[0.12em] text-plum uppercase lg:text-[13px]";
const linkClass = "text-ink hover:text-rose";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-7 pt-10 pb-7 lg:gap-14 lg:pt-16 lg:pb-10">
        <div className="grid grid-cols-2 gap-6 text-[15px] lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          <div className="col-span-2 flex flex-col gap-4 lg:col-span-1">
            <Image
              src="/assets/logo.png"
              alt="Sanjalica gift shop"
              width={529}
              height={602}
              className="h-[72px] w-auto self-start lg:h-[88px]"
            />
            <p className="hidden max-w-[280px] leading-relaxed text-body lg:block">
              Ručno rađeni buketi i pokloni, s ljubavlju i pažnjom.
            </p>
          </div>

          <nav aria-label="Stranice" className="hidden flex-col gap-3 lg:flex">
            <span className={headingClass}>Stranice</span>
            {navigation.slice(1).map((item) => (
              <Link key={item.href} href={item.href} className={linkClass}>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2.5 lg:gap-3">
            <span className={headingClass}>Kontakt</span>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className={linkClass}>
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className={linkClass}>
              {site.email}
            </a>
            <span className="hidden lg:inline">{site.city}</span>
          </div>

          <div className="flex flex-col gap-2.5 lg:gap-3">
            <span className={headingClass}>Pratite nas</span>
            <a href={site.instagram} className={linkClass} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href={site.facebook} className={linkClass} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </div>
        </div>

        <div className="flex justify-between border-t border-line pt-5 text-[13px] text-muted lg:pt-6">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span className="hidden lg:inline">
            Napravljeno s ljubavlju, darovano od srca
          </span>
        </div>
      </Container>
    </footer>
  );
}
