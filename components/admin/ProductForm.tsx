"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowDownToLine, LoaderCircle, Sparkles } from "lucide-react";
import { createProduct, updateProduct } from "@/api/products/productsApi";
import { removeImages, resolveImage } from "@/api/images/imagesApi";
import type { Category } from "@/api/categories/categoriseType";
import type { Product } from "@/api/products/productsType";
import MultiImageDropzone from "./MultiImageDropzone";
import {
  FieldError,
  FormNotice,
  imageSchema,
  inputClass,
  slugSchema,
  slugify,
} from "./formShared";

const productSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(2, "Unesite naziv proizvoda."),
  description: z
    .string()
    .trim()
    .min(10, "Opis treba da ima najmanje 10 karaktera."),
  images: z.array(imageSchema).min(1, "Dodajte bar jednu fotografiju."),
  categoryId: z.number({ message: "Izaberite kategoriju." }).int(),
  price: z
    .number()
    .int("Cena mora biti ceo broj.")
    .positive("Cena mora biti veća od nule.")
    .nullable(),
  featured: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

function toFormValues(product?: Product): Partial<ProductFormValues> {
  return {
    slug: product?.slug ?? "",
    name: product?.name ?? "",
    description: product?.description ?? "",
    images: product?.image ?? [],
    categoryId: product?.categoryId,
    price: product?.price ?? null,
    featured: product?.featured ?? false,
  };
}

// Without `product` the form creates a new one; with it, the form edits it.
export default function ProductForm({
  product,
  categories,
  onSaved,
}: {
  product?: Product;
  categories: Category[];
  onSaved: (product: Product) => void;
}) {
  const [notice, setNotice] = useState("");
  const [imagesKey, setImagesKey] = useState(0);
  const isEdit = Boolean(product);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: toFormValues(product),
  });
  const { errors, isSubmitting } = form.formState;

  const save = form.handleSubmit(async (values) => {
    setNotice("");
    const uploadedPaths: string[] = [];
    try {
      const imageUrls: string[] = [];
      for (const image of values.images) {
        imageUrls.push(await resolveImage(image, uploadedPaths));
      }
      const input = {
        slug: values.slug,
        name: values.name,
        description: values.description,
        image: imageUrls,
        categoryId: values.categoryId,
        price: values.price,
        featured: values.featured,
      };
      const saved = product
        ? await updateProduct(product.id, input)
        : await createProduct(input);
      form.reset(toFormValues(isEdit ? saved : undefined));
      setImagesKey((current) => current + 1);
      onSaved(saved);
    } catch (error) {
      await removeImages(uploadedPaths);
      setNotice(
        error instanceof Error
          ? error.message
          : "Proizvod nije sačuvan. Proverite Supabase podešavanja.",
      );
    }
  });

  return (
    <form onSubmit={save} className="space-y-5 p-5 sm:p-7" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-ink">
          Naziv proizvoda
          <input
            className={inputClass}
            placeholder="Pastelni buket"
            {...form.register("name", {
              // Changing the slug of an existing product would break its URL.
              onChange: (event) =>
                !isEdit &&
                form.setValue("slug", slugify(event.target.value), {
                  shouldValidate: true,
                }),
            })}
          />
          <FieldError>{errors.name?.message}</FieldError>
        </label>
        <label className="block text-sm font-semibold text-ink">
          URL oznaka
          <input
            className={inputClass}
            placeholder="pastelni-buket"
            {...form.register("slug")}
          />
          <FieldError>{errors.slug?.message}</FieldError>
        </label>
      </div>
      <label className="block text-sm font-semibold text-ink">
        Opis
        <textarea
          rows={3}
          className={`${inputClass} resize-y`}
          placeholder="Opišite proizvod..."
          {...form.register("description")}
        />
        <FieldError>{errors.description?.message}</FieldError>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-ink">
          Kategorija
          <select
            className={inputClass}
            {...form.register("categoryId", {
              setValueAs: (value: string) =>
                value === "" ? undefined : Number(value),
            })}
          >
            <option value="">Izaberite kategoriju</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
          <FieldError>{errors.categoryId?.message}</FieldError>
        </label>
        <label className="block text-sm font-semibold text-ink">
          Cena u dinarima
          <input
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            className={inputClass}
            placeholder="Prazno = cena na upit"
            {...form.register("price", {
              setValueAs: (value: string) =>
                value === "" ? null : Number(value),
            })}
          />
          <FieldError>{errors.price?.message}</FieldError>
        </label>
      </div>
      <div>
        <p className="mb-1.5 text-sm font-semibold text-ink">
          Fotografije proizvoda
        </p>
        <MultiImageDropzone
          key={imagesKey}
          defaultUrls={form
            .getValues("images")
            ?.filter((image): image is string => typeof image === "string")}
          onChange={(values) =>
            form.setValue("images", values, { shouldValidate: true })
          }
          error={
            errors.images?.message ??
            errors.images?.find?.(Boolean)?.message
          }
        />
      </div>
      <label className="flex cursor-pointer items-center gap-3 rounded-md border border-line bg-cream/60 px-4 py-3.5">
        <input
          type="checkbox"
          className="h-4 w-4 accent-rose"
          {...form.register("featured")}
        />
        <span className="flex items-center gap-2 text-sm font-medium text-ink">
          <Sparkles size={17} className="text-plum" />
          Prikaži u sekciji „Top izbor“
        </span>
      </label>
      <FormNotice message={notice} isError />
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-rose px-5 py-3.5 font-semibold text-white transition-colors hover:bg-rose-dark disabled:cursor-wait disabled:opacity-70"
      >
        {isSubmitting ? (
          <LoaderCircle className="animate-spin" size={18} />
        ) : (
          <ArrowDownToLine size={18} />
        )}
        {isEdit ? "Sačuvaj izmene" : "Sačuvaj proizvod"}
      </button>
    </form>
  );
}
