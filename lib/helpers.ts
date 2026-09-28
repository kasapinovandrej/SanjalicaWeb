export function formatPrice(price: number | null) {
  if (price === null) return "Cena na upit";
  return `od ${price.toLocaleString("sr-RS")} RSD`;
}
