import supabase from "@/api/supabase";
import { removeImageUrls } from "@/api/images/imagesApi";
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

export const deleteProduct = async (id: number) => {
  // select() returns the deleted rows, so an RLS-blocked delete (0 rows) is caught too.
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .select("id, image");

  if (error || !data?.length) {
    console.log("ERROR....", error);
    throw new Error("Cant delete product!");
  }

  // The product is already gone, so a failed cleanup only leaves orphaned files.
  await removeImageUrls(data[0].image ?? []).catch((error) =>
    console.log("ERROR....", error),
  );
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
