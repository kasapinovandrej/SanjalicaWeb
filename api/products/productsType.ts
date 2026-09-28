export type Product = {
  id: number;
  slug: string;
  name: string;
  description: string;
  image: string[];
  categoryId: number;
  price: number | null;
  featured?: boolean;
};
