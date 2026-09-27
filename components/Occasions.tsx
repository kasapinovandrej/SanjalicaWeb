import { Fragment } from "react";
import { occasions } from "@/lib/site";
import { StarIcon } from "./ui/icons";

export default function Occasions() {
  return (
    <section aria-label="Prilike" className="bg-bordo text-[#fbeff3]">
      <ul className="flex flex-wrap items-center justify-center gap-x-4.5 gap-y-2 px-5 py-4 font-serif text-[22px] italic lg:h-24 lg:flex-nowrap lg:gap-x-4 lg:py-0 lg:text-[26px] xl:gap-7 xl:text-[30px]">
        {occasions.map((occasion, index) => (
          <li key={occasion} className="flex shrink-0 items-center gap-3 whitespace-nowrap xl:gap-4.5">
            {index > 0 && (
              <StarIcon className="h-3 w-3 text-petal lg:h-3.5 lg:w-3.5" />
            )}
            {occasion}
          </li>
        ))}
      </ul>
    </section>
  );
}
