import supabase from "@/api/supabase";
import { Category } from "./categoriseType";

export const getCategories = async () => {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("title", { ascending: true });

  if (error) {
    console.log("ERROR....", error);
    throw new Error("Cant get categories!");
  }

  return categories as Category[];
};

export const deleteCategory = async (id: number) => {
  // select() returns the deleted rows, so an RLS-blocked delete (0 rows) is caught too.
  const { data, error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .select("id");

  if (error || !data?.length) {
    console.log("ERROR....", error);
    throw new Error("Cant delete category!");
  }
};

export type CategoryInput = Omit<Category, "id">;

export const createCategory = async (input: CategoryInput) => {
  const { data, error } = await supabase
    .from("categories")
    .insert(input)
    .select()
    .single<Category>();
  if (error) throw error;
  return data;
};

export const updateCategory = async (id: number, input: CategoryInput) => {
  const { data, error } = await supabase
    .from("categories")
    .update(input)
    .eq("id", id)
    .select()
    .single<Category>();
  if (error) throw error;
  return data;
};
