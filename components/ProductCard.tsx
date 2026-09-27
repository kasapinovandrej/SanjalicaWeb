import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
  /** Kraći prikaz za mobilni grid (bez opisa). */
  compactOnMobile?: boolean;
};

export default function ProductCard({
  product,
  compactOnMobile = false,
}: ProductCardProps) {
  return (
    <Link
      href={`/proizvodi/${product.slug}`}
      className="group flex flex-col gap-2.5 lg:gap-4"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[14px] bg-blush lg:rounded-2xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 280px, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[15px] leading-snug font-semibold lg:text-lg">
          {product.name}
        </h3>
        <p
          className={`line-clamp-2 text-sm leading-normal text-body ${
            compactOnMobile ? "hidden lg:block" : ""
          }`}
        >
          {product.description}
        </p>
        <span className="pt-0.5 text-sm font-semibold text-rose-dark lg:text-[15px]">
          {formatPrice(product.price)}
        </span>
      </div>
    </Link>
  );
}
