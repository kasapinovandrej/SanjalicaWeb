"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
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

        <Dialog.Root
          open={open}
          onOpenChange={(next) => setOpenOn(next ? pathname : null)}
        >
          <Dialog.Trigger
            aria-label="Otvori meni"
            className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-ink text-ink md:hidden"
          >
            <Menu size={20} />
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/35 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in motion-reduce:animate-none md:hidden" />
            <Dialog.Content
              aria-describedby={undefined}
              className="fixed inset-y-0 right-0 z-50 flex w-[min(88vw,380px)] flex-col overflow-y-auto bg-cream shadow-2xl data-[state=closed]:animate-drawer-out data-[state=open]:animate-drawer-in motion-reduce:animate-none md:hidden"
            >
              <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-line px-6">
                <Dialog.Title className="font-serif text-2xl text-ink">
                  Meni
                </Dialog.Title>
                <Dialog.Close
                  aria-label="Zatvori meni"
                  className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-ink text-ink"
                >
                  <X size={20} />
                </Dialog.Close>
              </div>

              <nav aria-label="Mobilni meni" className="px-6 pt-5 pb-8">
                <ul className="flex flex-col">
                  {navigation.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          onClick={() => setOpenOn(null)}
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
                <ButtonLink
                  href="/kontakt"
                  className="mt-6 w-full"
                  onClick={() => setOpenOn(null)}
                >
                  Poruči poklon
                </ButtonLink>
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
