// export type CategorySlug = "buketi" | "slatki" | "pokloni";

// export type Category = {
//   slug: CategorySlug;
//   title: string;
//   description: string;
//   linkLabel: string;
//   image: string;
//   imageAlt: string;
// };

// export type Product = {
//   slug: string;
//   name: string;
//   description: string;
//   image: string;
//   category: CategorySlug;
//   /** Cena u dinarima. `null` = prikazuje se „Cena na upit". */
//   price: number | null;
//   featured?: boolean;
// };

// export const categories: Category[] = [
//   {
//     slug: "buketi",
//     title: "Buketi po meri",
//     description:
//       "Ručno rađeni buketi od sojinog voska, prilagođeni svakoj prilici — rođendan, godišnjica ili poseban poklon.",
//     linkLabel: "Pogledaj bukete",
//     image: "/assets/images/soft-colors-bouqet.jpg",
//     imageAlt: "Buket ruža od sojinog voska u nežnim bojama",
//   },
//   {
//     slug: "slatki",
//     title: "Slatki aranžmani",
//     description:
//       "Spoj umetnosti i ukusa — savršen način da iznenadite nekoga i ulepšate svaki poklon.",
//     linkLabel: "Pogledaj aranžmane",
//     image: "/assets/images/kinder.jpg",
//     imageAlt: "Slatki aranžman sa Kinder čokoladicama",
//   },
//   {
//     slug: "pokloni",
//     title: "Personalizovani pokloni",
//     description:
//       "Dodajte ime, poruku ili poseban detalj i stvorite poklon koji ostavlja trajan utisak.",
//     linkLabel: "Pogledaj personalizovano",
//     image: "/assets/images/daire.jpg",
//     imageAlt: "Personalizovane daire sa natpisom Mlada",
//   },
// ];

// // Redosled „featured" proizvoda = redosled u sekciji „Top izbor".
// export const products: Product[] = [
//   {
//     slug: "meda-buket-crveni",
//     name: "Meda buket crveni",
//     description: "Romantični aranžman sa medom i crvenim ružama.",
//     image: "/assets/images/red-bear.jpg",
//     category: "buketi",
//     price: null,
//     featured: true,
//   },
//   {
//     slug: "premium-buket",
//     name: "Premium buket",
//     description:
//       "Elegantni mirisni buket od sojinog voska, savršen za slave, rođendane i proslave, sa pićem po izboru.",
//     image: "/assets/images/purple-bottle.jpg",
//     category: "buketi",
//     price: null,
//     featured: true,
//   },
//   {
//     slug: "buket-sa-parfemom",
//     name: "Buket sa poklon parfemom",
//     description: "Luksuzni buket kombinovan sa parfemom.",
//     image: "/assets/images/parfume-bouqet.jpg",
//     category: "buketi",
//     price: null,
//     featured: true,
//   },
//   {
//     slug: "panda-poklon",
//     name: "Panda poklon",
//     description: "Slatki poklon aranžman sa panda igračkom.",
//     image: "/assets/images/panda.webp",
//     category: "slatki",
//     price: null,
//     featured: true,
//   },
//   {
//     slug: "kinder-iznenadjenje",
//     name: "Kinder iznenađenje",
//     description: "Slatki poklon aranžman sa Kinder čokoladicama.",
//     image: "/assets/images/kinder.jpg",
//     category: "slatki",
//     price: null,
//     featured: true,
//   },
//   {
//     slug: "korpa-sa-cvecem",
//     name: "Korpa sa cvećem od sojinog voska",
//     description: "Mirisni plavi cvetni aranžman u korpi.",
//     image: "/assets/images/blue-basket.jpg",
//     category: "buketi",
//     price: null,
//     featured: true,
//   },
//   {
//     slug: "meda-buket-roze",
//     name: "Meda buket roze",
//     description: "Buket ruža od sojinog voska u nežnim bojama.",
//     image: "/assets/images/soft-colors-bouqet.jpg",
//     category: "buketi",
//     price: null,
//     featured: true,
//   },
//   {
//     slug: "pastelni-buket",
//     name: "Pastelni buket",
//     description: "Buket u nežnim pastelnim bojama.",
//     image: "/assets/images/light-colors-bouquet.jpg",
//     category: "buketi",
//     price: null,
//   },
//   {
//     slug: "buket-za-negu-tela",
//     name: "Buket za negu tela",
//     description: "Buket sa proizvodima za negu tela u roze nijansama.",
//     image: "/assets/images/pink-kids-bouqet.webp",
//     category: "buketi",
//     price: null,
//   },
//   {
//     slug: "daire",
//     name: "Daire",
//     description: "Obavezni aksesoar za devojačko veče, sa imenom po želji.",
//     image: "/assets/images/daire.jpg",
//     category: "pokloni",
//     price: null,
//   },
//   {
//     slug: "kaktus",
//     name: "Kaktus",
//     description: "Minijaturni kaktus aranžman u kamenoj saksiji.",
//     image: "/assets/images/desert.jpg",
//     category: "pokloni",
//     price: null,
//   },
// ];

// export const featuredProducts = products.filter((p) => p.featured);

// export function getProduct(slug: string) {
//   return products.find((p) => p.slug === slug);
// }

// export function getCategory(slug: string | undefined) {
//   return categories.find((c) => c.slug === slug);
// }

// export function formatPrice(price: number | null) {
//   if (price === null) return "Cena na upit";
//   return `od ${price.toLocaleString("sr-RS")} RSD`;
// }
