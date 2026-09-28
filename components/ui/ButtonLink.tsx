import Link from "next/link";

type Variant = "primary" | "outline" | "light" | "outlineLight";

const variants: Record<Variant, string> = {
  primary: "bg-rose text-white hover:bg-rose-dark",
  outline:
    "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-cream",
  light: "bg-white text-bordo hover:bg-blush",
  outlineLight:
    "border-[1.5px] border-white/60 text-white hover:border-white hover:bg-white/10",
};

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
};

export default function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "lg",
  className = "",
  onClick,
}: ButtonLinkProps) {
  const sizes =
    size === "lg"
      ? "px-7 py-4 text-base lg:px-[30px] lg:py-[18px]"
      : "px-6 py-3.5 text-[15px]";
  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      onClick={onClick}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full font-semibold transition-colors ${sizes} ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
