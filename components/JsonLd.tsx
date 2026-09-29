// Ubacuje schema.org strukturirane podatke; `<` se escapuje da tekst iz baze ne zatvori <script>.
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
