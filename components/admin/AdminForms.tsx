"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AlertCircle,
  ArrowDownToLine,
  Check,
  GripVertical,
  ImagePlus,
  LoaderCircle,
  PackagePlus,
  Plus,
  Shapes,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";
import supabase from "@/api/supabase";
import { getCategories } from "@/api/categories/categoriseApi";
import type { Category } from "@/api/categories/categoriseType";

const storageBucket = "images";
const imageTypes = ["image/jpeg", "image/png", "image/webp"];

const imageFileSchema = z
  .custom<File>(
    (value) => typeof File !== "undefined" && value instanceof File,
    {
      message: "Dodajte fotografiju.",
    },
  )
  .refine(
    (file) => imageTypes.includes(file.type),
    "Koristite JPG, PNG ili WebP sliku.",
  )
  .refine(
    (file) => file.size <= 8 * 1024 * 1024,
    "Slika može imati najviše 8 MB.",
  );

const categorySchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Unesite najmanje 2 karaktera.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Koristite mala slova, brojeve i crtice.",
    ),
  title: z.string().trim().min(2, "Unesite naziv kategorije."),
  description: z
    .string()
    .trim()
    .min(10, "Opis treba da ima najmanje 10 karaktera."),
  linkLabel: z.string().trim().min(2, "Unesite tekst linka."),
  image: imageFileSchema,
  imageAlt: z.string().trim().min(4, "Unesite kratak opis fotografije."),
});

const productSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Unesite najmanje 2 karaktera.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Koristite mala slova, brojeve i crtice.",
    ),
  name: z.string().trim().min(2, "Unesite naziv proizvoda."),
  description: z
    .string()
    .trim()
    .min(10, "Opis treba da ima najmanje 10 karaktera."),
  images: z.array(imageFileSchema).min(1, "Dodajte bar jednu fotografiju."),
  categoryId: z.number({ message: "Izaberite kategoriju." }).int(),
  price: z
    .number()
    .int("Cena mora biti ceo broj.")
    .positive("Cena mora biti veća od nule.")
    .nullable(),
  featured: z.boolean(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;
type ProductFormValues = z.infer<typeof productSchema>;

function slugify(value: string) {
  return value
    .toLocaleLowerCase("sr-Latn")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "dj")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function FieldError({ children }: { children?: string }) {
  return children ? (
    <p className="mt-1.5 text-sm text-rose">{children}</p>
  ) : null;
}

function ImageDropzone({
  onFileChange,
  error,
}: {
  onFileChange: (file?: File) => void;
  error?: string;
}) {
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState("");
  const [dragging, setDragging] = useState(false);
  const previewRef = useRef("");

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    [],
  );

  function acceptFile(candidate?: File) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = candidate ? URL.createObjectURL(candidate) : "";
    setFile(candidate);
    setPreview(previewRef.current);
    onFileChange(candidate);
  }

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          acceptFile(event.dataTransfer.files[0]);
        }}
        className={`relative flex min-h-40 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-colors ${dragging ? "border-rose bg-blush" : "border-line-strong bg-cream/70"}`}
      >
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Pregled izabrane fotografije"
              fill
              unoptimized
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-end justify-between bg-linear-to-t from-ink/75 to-transparent p-3">
              <span className="max-w-[75%] truncate text-sm font-medium text-white">
                {file?.name}
              </span>
              <button
                type="button"
                onClick={() => acceptFile(undefined)}
                aria-label="Ukloni fotografiju"
                title="Ukloni fotografiju"
                className="relative z-10 flex h-9 w-9 items-center justify-center rounded-md bg-white text-ink hover:bg-blush"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </>
        ) : (
          <div className="px-4 py-6 text-center">
            <ImagePlus className="mx-auto mb-2 text-plum" size={26} />
            <p className="font-semibold text-ink">Prevucite fotografiju ovde</p>
            <p className="mt-1 text-sm text-muted">
              JPG, PNG ili WebP · do 8 MB
            </p>
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label="Izaberi fotografiju"
          onChange={(event) => acceptFile(event.target.files?.[0])}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </div>
      <FieldError>{error}</FieldError>
    </div>
  );
}

function MultiImageDropzone({
  onFilesChange,
  error,
}: {
  onFilesChange: (files: File[]) => void;
  error?: string;
}) {
  const [items, setItems] = useState<{ file: File; preview: string }[]>([]);
  const [dragging, setDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const itemsRef = useRef(items);

  useEffect(
    () => () =>
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.preview)),
    [],
  );

  function update(next: { file: File; preview: string }[]) {
    itemsRef.current = next;
    setItems(next);
    onFilesChange(next.map((item) => item.file));
  }

  function addFiles(files?: FileList | null) {
    if (!files?.length) return;
    update([
      ...itemsRef.current,
      ...Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  }

  function removeAt(index: number) {
    URL.revokeObjectURL(itemsRef.current[index].preview);
    update(itemsRef.current.filter((_, i) => i !== index));
  }

  function move(from: number, to: number) {
    if (from === to) return;
    const next = [...itemsRef.current];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    update(next);
  }

  function endReorder() {
    setDragIndex(null);
    setOverIndex(null);
  }

  return (
    <div>
      {items.length > 0 && (
        <ul className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {items.map((item, index) => (
            <li
              key={item.preview}
              draggable
              onDragStart={(event) => {
                setDragIndex(index);
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", String(index));
              }}
              onDragOver={(event) => {
                if (dragIndex === null) return;
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                setOverIndex(index);
              }}
              onDrop={(event) => {
                if (dragIndex === null) return;
                event.preventDefault();
                move(dragIndex, index);
                endReorder();
              }}
              onDragEnd={endReorder}
              className={`group relative aspect-square cursor-grab overflow-hidden rounded-md border transition active:cursor-grabbing ${dragIndex === index ? "opacity-40" : ""} ${overIndex === index && dragIndex !== index ? "border-rose ring-2 ring-rose" : "border-line"}`}
            >
              <Image
                src={item.preview}
                alt={`Pregled fotografije ${index + 1}`}
                fill
                unoptimized
                draggable={false}
                className="pointer-events-none object-cover"
              />
              {index === 0 ? (
                <span className="absolute top-1.5 left-1.5 rounded bg-white/90 px-1.5 py-0.5 text-[11px] font-semibold text-ink">
                  Glavna
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => move(index, 0)}
                  aria-label={`Postavi ${item.file.name} kao glavnu fotografiju`}
                  title="Postavi kao glavnu"
                  className="absolute top-1.5 left-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-white text-ink hover:bg-blush"
                >
                  <Star size={14} />
                </button>
              )}
              <GripVertical
                size={16}
                className="absolute bottom-1.5 left-1.5 text-white drop-shadow"
              />
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`Ukloni fotografiju ${item.file.name}`}
                title="Ukloni fotografiju"
                className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-white text-ink hover:bg-blush"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div
        onDragOver={(event) => {
          if (!event.dataTransfer.types.includes("Files")) return;
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
        className={`relative flex min-h-32 items-center justify-center rounded-lg border-2 border-dashed transition-colors ${dragging ? "border-rose bg-blush" : "border-line-strong bg-cream/70"}`}
      >
        <div className="px-4 py-6 text-center">
          <ImagePlus className="mx-auto mb-2 text-plum" size={26} />
          <p className="font-semibold text-ink">
            {items.length ? "Dodajte još fotografija" : "Prevucite fotografije ovde"}
          </p>
          <p className="mt-1 text-sm text-muted">
            JPG, PNG ili WebP · do 8 MB po slici
          </p>
        </div>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          aria-label="Izaberi fotografije"
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </div>
      <FieldError>{error}</FieldError>
    </div>
  );
}

async function uploadImage(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(storageBucket)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
  if (error) throw error;
  const { data } = supabase.storage.from(storageBucket).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

function FormNotice({
  message,
  isError = false,
}: {
  message: string;
  isError?: boolean;
}) {
  if (!message) return null;
  const Icon = isError ? AlertCircle : Check;
  return (
    <p
      role="status"
      className={`flex items-start gap-2 text-sm ${isError ? "text-rose" : "text-emerald-800"}`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

function SuccessToast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(onClose, 4000);
    return () => clearTimeout(timeout);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      <div className="flex w-full max-w-sm items-start gap-3 rounded-lg border border-emerald-200 bg-white p-4 shadow-[0_18px_45px_-20px_rgba(46,14,31,0.45)]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Check size={18} />
        </span>
        <p className="flex-1 pt-1 text-sm font-medium text-ink">{message}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Zatvori obaveštenje"
          title="Zatvori"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted hover:bg-cream hover:text-ink"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-md border border-line-strong bg-white px-3.5 py-3 text-[15px] text-ink placeholder:text-muted/75 focus:border-rose focus:outline-none";

export default function AdminForms() {
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [categoryNotice, setCategoryNotice] = useState("");
  const [productNotice, setProductNotice] = useState("");
  const [categoryFailed, setCategoryFailed] = useState(false);
  const [productFailed, setProductFailed] = useState(false);
  const [categoryImageReset, setCategoryImageReset] = useState(0);
  const [productImageReset, setProductImageReset] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const closeToast = useCallback(() => setToastMessage(""), []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoryOptions(await getCategories());
      } catch (error) {
        setProductFailed(true);
        setProductNotice(
          error instanceof Error ? error.message : "Kategorije nisu učitane.",
        );
      }
    };
    loadCategories();
  }, []);

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      slug: "",
      title: "",
      description: "",
      linkLabel: "",
      imageAlt: "",
    },
  });
  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      slug: "",
      name: "",
      description: "",
      categoryId: undefined,
      price: null,
      featured: false,
    },
  });

  const saveCategory = categoryForm.handleSubmit(async (values) => {
    setCategoryNotice("");
    setCategoryFailed(false);
    let uploadedPath: string | undefined;
    try {
      const image = await uploadImage(values.image);
      uploadedPath = image.path;
      const { data, error } = await supabase
        .from("categories")
        .insert({
          slug: values.slug,
          title: values.title,
          description: values.description,
          linkLabel: values.linkLabel,
          image: image.url,
          imageAlt: values.imageAlt,
        })
        .select()
        .single<Category>();
      if (error) throw error;
      setCategoryOptions((current) =>
        [
          ...current.filter((category) => category.id !== data.id),
          data,
        ].sort((first, second) =>
          first.title.localeCompare(second.title, "sr"),
        ),
      );
      categoryForm.reset();
      setCategoryImageReset((current) => current + 1);
      setToastMessage(`Kategorija „${values.title}“ je uspešno dodata.`);
    } catch (error) {
      if (uploadedPath)
        await supabase.storage.from(storageBucket).remove([uploadedPath]);
      setCategoryFailed(true);
      setCategoryNotice(
        error instanceof Error
          ? error.message
          : "Kategorija nije sačuvana. Proverite Supabase podešavanja.",
      );
    }
  });

  const saveProduct = productForm.handleSubmit(async (values) => {
    setProductNotice("");
    setProductFailed(false);
    const uploadedPaths: string[] = [];
    try {
      const imageUrls: string[] = [];
      for (const file of values.images) {
        const image = await uploadImage(file);
        uploadedPaths.push(image.path);
        imageUrls.push(image.url);
      }
      const { error } = await supabase.from("products").insert({
        slug: values.slug,
        name: values.name,
        description: values.description,
        image: imageUrls,
        categoryId: values.categoryId,
        price: values.price,
        featured: values.featured,
      });
      if (error) throw error;
      productForm.reset();
      setProductImageReset((current) => current + 1);
      setToastMessage(`Proizvod „${values.name}“ je uspešno dodat.`);
    } catch (error) {
      if (uploadedPaths.length)
        await supabase.storage.from(storageBucket).remove(uploadedPaths);
      setProductFailed(true);
      setProductNotice(
        error instanceof Error
          ? error.message
          : "Proizvod nije sačuvan. Proverite Supabase podešavanja.",
      );
    }
  });

  return (
    <div className="min-h-[calc(100vh-96px)] bg-[#f4f1ec] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="mb-9 border-b border-[#d9d1c8] pb-7 sm:mb-11 sm:flex sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">SANJALICA · RADNI PROSTOR</p>
            <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">
              Upravljanje sadržajem
            </h1>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted sm:mt-0">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Administratorski pristup nije zaštićen</span>
          </div>
        </header>

        <div className="mx-auto grid max-w-3xl gap-6 lg:gap-8">
          <section className="overflow-hidden rounded-lg border border-line bg-white shadow-[0_12px_35px_-28px_rgba(46,14,31,0.35)]">
            <div
              className={`flex items-center gap-3 px-5 py-5 sm:px-7 ${categoryFormOpen ? "border-b border-line" : ""}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#e7efe9] text-[#315b45]">
                <Shapes size={20} />
              </span>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-ink">
                  Nova kategorija
                </h2>
                <p className="text-sm text-muted">
                  Osnovne informacije i naslovna fotografija
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCategoryFormOpen((open) => !open)}
                aria-expanded={categoryFormOpen}
                aria-controls="category-form"
                className="flex shrink-0 items-center gap-1.5 rounded-md border border-line-strong px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-cream"
              >
                {categoryFormOpen ? <X size={16} /> : <Plus size={16} />}
                {categoryFormOpen ? "Zatvori" : "Dodaj"}
              </button>
            </div>
            <form
              id="category-form"
              hidden={!categoryFormOpen}
              onSubmit={saveCategory}
              className="space-y-5 p-5 sm:p-7"
              noValidate
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-ink">
                  Naziv kategorije
                  <input
                    className={inputClass}
                    placeholder="Unesi naziv kategorije"
                    {...categoryForm.register("title", {
                      onChange: (event) =>
                        categoryForm.setValue(
                          "slug",
                          slugify(event.target.value),
                          { shouldValidate: true },
                        ),
                    })}
                  />
                  <FieldError>
                    {categoryForm.formState.errors.title?.message}
                  </FieldError>
                </label>
                <label className="block text-sm font-semibold text-ink">
                  URL oznaka
                  <input
                    className={inputClass}
                    placeholder="kebab-kase naziva kategorije"
                    {...categoryForm.register("slug")}
                  />
                  <FieldError>
                    {categoryForm.formState.errors.slug?.message}
                  </FieldError>
                </label>
              </div>
              <label className="block text-sm font-semibold text-ink">
                Opis
                <textarea
                  rows={3}
                  className={`${inputClass} resize-y`}
                  placeholder="Kratko opišite ovu kategoriju..."
                  {...categoryForm.register("description")}
                />
                <FieldError>
                  {categoryForm.formState.errors.description?.message}
                </FieldError>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-ink">
                  Tekst linka
                  <input
                    className={inputClass}
                    placeholder="Labela linka za kategoriju"
                    {...categoryForm.register("linkLabel")}
                  />
                  <FieldError>
                    {categoryForm.formState.errors.linkLabel?.message}
                  </FieldError>
                </label>
                <label className="block text-sm font-semibold text-ink">
                  Opis fotografije
                  <input
                    className={inputClass}
                    placeholder="Buket ruža u nežnim bojama"
                    {...categoryForm.register("imageAlt")}
                  />
                  <FieldError>
                    {categoryForm.formState.errors.imageAlt?.message}
                  </FieldError>
                </label>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-semibold text-ink">
                  Naslovna fotografija
                </p>
                <ImageDropzone
                  key={categoryImageReset}
                  onFileChange={(file) =>
                    categoryForm.setValue("image", file as File, {
                      shouldValidate: true,
                    })
                  }
                  error={categoryForm.formState.errors.image?.message}
                />
              </div>
              <FormNotice message={categoryNotice} isError={categoryFailed} />
              <button
                type="submit"
                disabled={categoryForm.formState.isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[#315b45] px-5 py-3.5 font-semibold text-white transition-colors hover:bg-[#254735] disabled:cursor-wait disabled:opacity-70"
              >
                {categoryForm.formState.isSubmitting ? (
                  <LoaderCircle className="animate-spin" size={18} />
                ) : (
                  <Check size={18} />
                )}
                Sačuvaj kategoriju
              </button>
            </form>
          </section>

          <section className="overflow-hidden rounded-lg border border-line bg-white shadow-[0_12px_35px_-28px_rgba(46,14,31,0.35)]">
            <div className="flex items-center gap-3 border-b border-line px-5 py-5 sm:px-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f8e8e9] text-rose">
                <PackagePlus size={20} />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-ink">
                  Novi proizvod
                </h2>
                <p className="text-sm text-muted">
                  Detalji proizvoda, cena i vidljivost
                </p>
              </div>
            </div>
            <form
              onSubmit={saveProduct}
              className="space-y-5 p-5 sm:p-7"
              noValidate
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-ink">
                  Naziv proizvoda
                  <input
                    className={inputClass}
                    placeholder="Pastelni buket"
                    {...productForm.register("name", {
                      onChange: (event) =>
                        productForm.setValue(
                          "slug",
                          slugify(event.target.value),
                          { shouldValidate: true },
                        ),
                    })}
                  />
                  <FieldError>
                    {productForm.formState.errors.name?.message}
                  </FieldError>
                </label>
                <label className="block text-sm font-semibold text-ink">
                  URL oznaka
                  <input
                    className={inputClass}
                    placeholder="pastelni-buket"
                    {...productForm.register("slug")}
                  />
                  <FieldError>
                    {productForm.formState.errors.slug?.message}
                  </FieldError>
                </label>
              </div>
              <label className="block text-sm font-semibold text-ink">
                Opis
                <textarea
                  rows={3}
                  className={`${inputClass} resize-y`}
                  placeholder="Opišite proizvod..."
                  {...productForm.register("description")}
                />
                <FieldError>
                  {productForm.formState.errors.description?.message}
                </FieldError>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-ink">
                  Kategorija
                  <select
                    className={inputClass}
                    {...productForm.register("categoryId", {
                      setValueAs: (value: string) =>
                        value === "" ? undefined : Number(value),
                    })}
                  >
                    <option value="">Izaberite kategoriju</option>
                    {categoryOptions.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                  <FieldError>
                    {productForm.formState.errors.categoryId?.message}
                  </FieldError>
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
                    {...productForm.register("price", {
                      setValueAs: (value: string) =>
                        value === "" ? null : Number(value),
                    })}
                  />
                  <FieldError>
                    {productForm.formState.errors.price?.message}
                  </FieldError>
                </label>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-semibold text-ink">
                  Fotografije proizvoda
                </p>
                <MultiImageDropzone
                  key={productImageReset}
                  onFilesChange={(files) =>
                    productForm.setValue("images", files, {
                      shouldValidate: true,
                    })
                  }
                  error={
                    productForm.formState.errors.images?.message ??
                    productForm.formState.errors.images?.find?.(Boolean)
                      ?.message
                  }
                />
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-md border border-line bg-cream/60 px-4 py-3.5">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-rose"
                  {...productForm.register("featured")}
                />
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  <Sparkles size={17} className="text-plum" />
                  Prikaži u sekciji „Top izbor“
                </span>
              </label>
              <FormNotice message={productNotice} isError={productFailed} />
              <button
                type="submit"
                disabled={productForm.formState.isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-rose px-5 py-3.5 font-semibold text-white transition-colors hover:bg-rose-dark disabled:cursor-wait disabled:opacity-70"
              >
                {productForm.formState.isSubmitting ? (
                  <LoaderCircle className="animate-spin" size={18} />
                ) : (
                  <ArrowDownToLine size={18} />
                )}
                Sačuvaj proizvod
              </button>
            </form>
          </section>
        </div>

        <p className="mt-7 flex items-start gap-2 text-sm leading-relaxed text-muted">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          Za čuvanje je potreban Supabase Storage bucket{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-ink">
            {storageBucket}
          </code>{" "}
          sa javnim čitanjem. Pre javnog puštanja obavezno uključi
          autentifikaciju i RLS pravila za obe tabele i bucket.
        </p>
      </div>
      <SuccessToast message={toastMessage} onClose={closeToast} />
    </div>
  );
}
