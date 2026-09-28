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
