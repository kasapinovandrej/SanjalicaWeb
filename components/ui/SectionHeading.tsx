type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  as?: "h1" | "h2";
};

export default function SectionHeading({
  eyebrow,
  title,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-2 lg:gap-3">
      <p className="eyebrow">{eyebrow}</p>
      <Tag className="font-serif text-[38px] leading-[1.05] text-balance lg:text-[60px]">
        {title}
      </Tag>
    </div>
  );
}
