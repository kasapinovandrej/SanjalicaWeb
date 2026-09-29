// Osnovni podaci o radnji — popuni vrednosti u uglastim zagradama.
export const site = {
  name: "Sanjalica Gift Shop",
  tagline: "Ručno rađeni buketi i pokloni",
  phone: "+381 63 738 3079", // npr. "+381 60 123 4567"
  email: "sanjalica98kv@gmail.com", // npr. "kontakt@sanjalica.rs"
  city: "Kraljevo",
  instagram: "https://www.instagram.com/sanjalica_giftshop/",
  // facebook: "https://www.facebook.com/sanjalicaGiftShop",
  delivery: "[ROK IZRADE] · [NAČIN DOSTAVE I GRADOVI]",
  // Produkcioni domen — postavi NEXT_PUBLIC_SITE_URL (npr. "https://sanjalica.rs").
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  ).replace(/\/$/, ""),
  description:
    "Ručno rađeni pokloni iz Kraljeva: mirisni buketi od sojinog voska, slatki aranžmani i personalizovani pokloni sa imenom za rođendan, svadbu, godišnjicu, slavu i devojačko veče.",
};

// Ključne reči za SEO — sa i bez dijakritika, jer ljudi često kucaju bez njih.
export const keywords = [
  // osnovne
  "pokloni",
  "buketi",
  "cveće",
  "cvece",
  "personalizovani pokloni",
  "pokloni po meri",
  "pokloni sa imenom",
  "ručno rađeni pokloni",
  "rucno radjeni pokloni",
  "unikatni pokloni",
  "gift shop",
  // proizvodi
  "buketi od sojinog voska",
  "mirisni buket",
  "večni buket",
  "buket koji traje",
  "buket ruža",
  "buket sa medom",
  "buket sa parfemom",
  "buket sa pićem",
  "slatki aranžmani",
  "buket od slatkiša",
  "poklon aranžman",
  "poklon korpa",
  "daire za devojačko",
  "jesmonit dekoracije",
  // prilike
  "poklon za rođendan",
  "poklon za rodjendan",
  "poklon za svadbu",
  "poklon za mladence",
  "poklon za godišnjicu",
  "poklon za godisnjicu",
  "poklon za slavu",
  "devojačko veče",
  "devojacko vece",
  "romantično iznenađenje",
  "romanticno iznenadjenje",
  "mali znak pažnje",
  "mali znak paznje",
  "poklon za krštenje",
  "poklon za rođenje bebe",
  "poklon za Dan žena",
  "poklon za 8. mart",
  "poklon za Valentinovo",
  "poklon za Majčin dan",
  "poklon za kraj školske godine",
  "poklon za učiteljicu",
  "poklon za diplomu",
  "novogodišnji pokloni",
  // za koga
  "poklon za nju",
  "poklon za devojku",
  "poklon za ženu",
  "poklon za mamu",
  "poklon za drugaricu",
  "poklon za kumu",
  "poklon za njega",
  // lokalno
  "pokloni Kraljevo",
  "buketi Kraljevo",
  "cvećara Kraljevo",
  "gift shop Kraljevo",
  "poklon dostava Srbija",
];

export const navigation = [
  { name: "Početna", href: "/" },
  { name: "Proizvodi", href: "/proizvodi" },
  { name: "O nama", href: "/o-nama" },
  { name: "Kontakt", href: "/kontakt" },
];

export const occasions = [
  "Rođendan",
  "Svadba",
  "Godišnjica",
  "Slava",
  "Devojačko veče",
  "Romantično iznenađenje",
  "Mali znak pažnje",
];
