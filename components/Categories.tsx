import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/api/categories/categoriseApi";
import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";

export default async function Categories() {
  const categories = await getCategories();

  return (
    <section className="py-16 lg:py-28">
      <Container className="flex flex-col gap-7 lg:gap-14">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end lg:gap-10">
          <SectionHeading
            eyebrow="Šta pravimo"
            title="Stvaramo nezaboravne trenutke"
          />
          <p className="hidden max-w-[380px] text-[17px] leading-relaxed text-body lg:block">
            Svaki komad nastaje ručno, u malim serijama — zato je svaki poklon
            pomalo drugačiji.
          </p>
        </div>

        <ul className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-10">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/proizvodi?kategorija=${category.slug}`}
                className="group flex items-center gap-4 lg:flex-col lg:items-stretch lg:gap-6"
              >
                <div className="relative h-[140px] w-28 shrink-0 overflow-hidden rounded-[14px] lg:h-[460px] lg:w-full lg:rounded-[20px]">
                  <Image
                    src={category.image}
                    alt={category.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 380px, 112px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-col gap-1.5 lg:gap-2.5">
                  <h3 className="font-serif text-[25px] leading-[1.1] lg:text-[32px]">
                    {category.title}
                  </h3>
                  <p className="text-sm leading-normal text-body lg:text-base lg:leading-relaxed">
                    {category.description}
                  </p>
                  <span className="hidden items-center gap-1.5 pt-1 text-[15px] font-semibold text-rose group-hover:text-rose-dark lg:flex">
                    {category.linkLabel}
                    <ArrowRight
                      size={16}
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
