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
