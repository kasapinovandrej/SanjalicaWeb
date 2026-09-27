type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

/** Širina sadržaja: 1200px + bočni razmak (20px mobilni, 120px na 1440px ekranu). */
export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-[1240px] px-5 ${className}`}>
      {children}
    </div>
  );
}
