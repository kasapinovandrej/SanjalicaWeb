"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navigation } from "@/lib/site";
import ButtonLink from "./ui/ButtonLink";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Header() {
  const pathname = usePathname();
  // Meni je otvoren samo za stranicu na kojoj je otvoren —
  // posle navigacije se automatski zatvara.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenOn(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-[1240px] items-center justify-between px-5 lg:h-24">
        <Link href="/" aria-label="Sanjalica – početna" className="shrink-0">
          <Image
            src="/assets/logo.png"
            alt="Sanjalica gift shop"
            width={529}
            height={602}
            priority
            className="h-[52px] w-auto lg:h-[68px]"
          />
        </Link>

        <nav aria-label="Glavni meni" className="hidden md:block">
          <ul className="flex gap-10 font-medium">
            {navigation.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`border-b-2 pb-1 transition-colors ${
                      active
                        ? "border-rose text-ink"
                        : "border-transparent text-body hover:text-ink"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden md:block">
          <ButtonLink href="/kontakt" size="md">
            Poruči poklon
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpenOn(open ? null : pathname)}
          aria-expanded={open}
          aria-controls="mobilni-meni"
          aria-label={open ? "Zatvori meni" : "Otvori meni"}
          className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-ink text-ink md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <button
        type="button"
        aria-label="Zatvori meni"
        aria-hidden={!open}
        tabIndex={-1}
        onClick={() => setOpenOn(null)}
        className={`absolute inset-x-0 top-full h-[calc(100dvh-72px)] bg-ink/35 transition-opacity duration-300 motion-reduce:transition-none md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <nav
        id="mobilni-meni"
        aria-label="Mobilni meni"
        aria-hidden={!open}
        inert={!open}
        className={`absolute top-full right-0 z-10 h-[calc(100dvh-72px)] w-[min(88vw,380px)] overflow-y-auto border-t border-line bg-cream px-6 pt-5 pb-8 shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="flex flex-col">
          {navigation.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`block border-b border-line py-4 font-serif text-3xl ${
                    active ? "text-rose" : "text-ink"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
        <ButtonLink href="/kontakt" className="mt-6 w-full">
          Poruči poklon
        </ButtonLink>
      </nav>
    </header>
  );
}
