# Sanjalica Gift Shop — redizajn

Next.js 16 + Tailwind CSS v4, rađeno po dizajnu sa canvasa „Sanjalica – redizajn".

## Pokretanje

```bash
npm install
npm run dev
```

Otvori http://localhost:3000

## Struktura

```
app/
  layout.tsx              fontovi (DM Sans + Instrument Serif), Header, Footer
  globals.css             paleta boja i fontovi (Tailwind @theme)
  page.tsx                početna
  proizvodi/page.tsx      svi proizvodi + filter po kategoriji (?kategorija=buketi)
  proizvodi/[slug]/       stranica jednog proizvoda
  o-nama/, kontakt/       ostale stranice
components/               sekcije (Hero, Occasions, Categories, Favorites, HowToOrder, CtaSection…)
components/ui/            sitni delovi (Container, ButtonLink, SectionHeading, ikonice)
lib/products.ts           SVI proizvodi i kategorije — ovde dodaješ nove
lib/site.ts               kontakt podaci, linkovi ka mrežama, meni, prilike
public/assets/            logo i fotografije
```

## Šta treba popuniti

- `lib/site.ts` — telefon, email, grad, Instagram i Facebook linkovi, rok izrade i dostava
  (sve što je u `[UGLASTIM ZAGRADAMA]`).
- `lib/products.ts` — `price` za svaki proizvod (u dinarima). Dok je `null`, prikazuje se „Cena na upit".
- `app/o-nama/page.tsx` — lična priča (označeno sa TODO).

## Dodavanje proizvoda

1. Ubaci sliku u `public/assets/images/`.
2. Dodaj objekat u niz `products` u `lib/products.ts`
   (`featured: true` = pojavljuje se u sekciji „Top izbor").

## Boje

| Token        | Hex       | Upotreba                 |
|--------------|-----------|--------------------------|
| `cream`      | `#fbf6f2` | pozadina                 |
| `blush`      | `#f5e6e8` | istaknute sekcije        |
| `ink`        | `#2e0e1f` | naslovi i tekst          |
| `body`       | `#5b4250` | opisi                    |
| `rose`       | `#c6084d` | dugmad, akcenti          |
| `bordo`      | `#561136` | traka sa prilikama, CTA  |

Koriste se kao Tailwind klase: `bg-cream`, `text-rose`, `border-line`…
