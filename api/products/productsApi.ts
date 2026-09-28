import supabase from "@/api/supabase";
import { Product } from "./productsType";

export const getProducts = async () => {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.log("ERROR....", error);
    throw new Error("Cant get products!");
  }

  return products as Product[];
};

export type ProductInput = Omit<Product, "id">;

export const createProduct = async (input: ProductInput) => {
  const { data, error } = await supabase
    .from("products")
    .insert(input)
    .select()
    .single<Product>();
  if (error) throw error;
  return data;
};

export const updateProduct = async (id: number, input: ProductInput) => {
  const { data, error } = await supabase
    .from("products")
    .update(input)
    .eq("id", id)
    .select()
    .single<Product>();
  if (error) throw error;
  return data;
};
