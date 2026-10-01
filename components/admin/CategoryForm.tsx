"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check, LoaderCircle } from "lucide-react";
import { createCategory, updateCategory } from "@/api/categories/categoriseApi";
import { removeImages, resolveImage } from "@/api/images/imagesApi";
import type { Category } from "@/api/categories/categoriseType";
import ImageDropzone from "./ImageDropzone";
import {
  FieldError,
  FormNotice,
  imageSchema,
  inputClass,
  slugSchema,
  slugify,
} from "./formShared";

const categorySchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(2, "Unesite naziv kategorije."),
  description: z
    .string()
    .trim()
    .min(10, "Opis treba da ima najmanje 10 karaktera."),
  linkLabel: z.string().trim().min(2, "Unesite tekst linka."),
  image: imageSchema,
  imageAlt: z.string().trim().min(4, "Unesite kratak opis fotografije."),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

function toFormValues(category?: Category): Partial<CategoryFormValues> {
  return {
    slug: category?.slug ?? "",
    title: category?.title ?? "",
    description: category?.description ?? "",
    linkLabel: category?.linkLabel ?? "",
    image: category?.image,
    imageAlt: category?.imageAlt ?? "",
  };
}

// Without `category` the form creates a new one; with it, the form edits it.
export default function CategoryForm({
  category,
  onSaved,
}: {
  category?: Category;
  onSaved: (category: Category) => void;
}) {
  const [notice, setNotice] = useState("");
  const [imageKey, setImageKey] = useState(0);
  const isEdit = Boolean(category);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: toFormValues(category),
  });
  const { errors, isSubmitting } = form.formState;

  const save = form.handleSubmit(async (values) => {
    setNotice("");
    const uploadedPaths: string[] = [];
    try {
      const input = {
        ...values,
        image: await resolveImage(values.image, uploadedPaths),
      };
      const saved = category
        ? await updateCategory(category.id, input)
        : await createCategory(input);
      form.reset(toFormValues(isEdit ? saved : undefined));
      setImageKey((current) => current + 1);
      onSaved(saved);
    } catch (error) {
      await removeImages(uploadedPaths);
      setNotice(
        error instanceof Error
          ? error.message
          : "Kategorija nije sačuvana. Proverite Supabase podešavanja.",
      );
    }
  });

  return (
    <form onSubmit={save} className="space-y-5 p-5 sm:p-7" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-ink">
          Naziv kategorije
          <input
            className={inputClass}
            placeholder="Unesi naziv kategorije"
            {...form.register("title", {
              // Changing the slug of an existing category would break its URL.
              onChange: (event) =>
                !isEdit &&
                form.setValue("slug", slugify(event.target.value), {
                  shouldValidate: true,
                }),
            })}
          />
          <FieldError>{errors.title?.message}</FieldError>
        </label>
        <label className="block text-sm font-semibold text-ink">
          URL oznaka
          <input
            className={inputClass}
            placeholder="kebab-kase naziva kategorije"
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
          placeholder="Kratko opišite ovu kategoriju..."
          {...form.register("description")}
        />
        <FieldError>{errors.description?.message}</FieldError>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-ink">
          Tekst linka
          <input
            className={inputClass}
            placeholder="Labela linka za kategoriju"
            {...form.register("linkLabel")}
          />
          <FieldError>{errors.linkLabel?.message}</FieldError>
        </label>
        <label className="block text-sm font-semibold text-ink">
          Opis fotografije
          <input
            className={inputClass}
            placeholder="Opis fotografije za pristupačnost i SEO"
            {...form.register("imageAlt")}
          />
          <FieldError>{errors.imageAlt?.message}</FieldError>
        </label>
      </div>
      <div>
        <p className="mb-1.5 text-sm font-semibold text-ink">
          Naslovna fotografija
        </p>
        <ImageDropzone
          key={imageKey}
          defaultUrl={
            typeof form.getValues("image") === "string"
              ? (form.getValues("image") as string)
              : undefined
          }
          onChange={(value) =>
            form.setValue("image", value as File | string, {
              shouldValidate: true,
            })
          }
          error={errors.image?.message}
        />
      </div>
      <FormNotice message={notice} isError />
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-[#315b45] px-5 py-3.5 font-semibold text-white transition-colors hover:bg-[#254735] disabled:cursor-wait disabled:opacity-70"
      >
        {isSubmitting ? (
          <LoaderCircle className="animate-spin" size={18} />
        ) : (
          <Check size={18} />
        )}
        {isEdit ? "Sačuvaj izmene" : "Sačuvaj kategoriju"}
      </button>
    </form>
  );
}
