import { Fragment } from "react";
import { occasions } from "@/lib/site";
import { StarIcon } from "./ui/icons";

export default function Occasions() {
  return (
    <section aria-label="Prilike" className="bg-bordo text-[#fbeff3]">
      <ul className="no-scrollbar flex h-16 items-center gap-[18px] overflow-x-auto px-5 font-serif text-[22px] whitespace-nowrap italic lg:h-24 lg:justify-center lg:gap-7 lg:text-[30px]">
        {occasions.map((occasion, i) => (
          <Fragment key={occasion}>
            {i > 0 && (
              <li aria-hidden="true" className="flex">
                <StarIcon className="h-3 w-3 text-petal lg:h-3.5 lg:w-3.5" />
              </li>
            )}
            <li>{occasion}</li>
          </Fragment>
        ))}
      </ul>
    </section>
  );
}
