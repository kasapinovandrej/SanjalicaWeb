"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  LogOut,
  PackagePlus,
  Plus,
  Shapes,
  X,
} from "lucide-react";
import supabase from "@/api/supabase";
import { getCategories } from "@/api/categories/categoriseApi";
import { storageBucket } from "@/api/images/imagesApi";
import SuccessToast from "@/components/ui/SuccessToast";
import type { Category } from "@/api/categories/categoriseType";
import CategoryForm from "./CategoryForm";
import ProductForm from "./ProductForm";
import { FormNotice } from "./formShared";

export default function AdminForms() {
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const closeToast = useCallback(() => setToastMessage(""), []);
  const router = useRouter();

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoryOptions(await getCategories());
      } catch (error) {
        setCategoriesError(
          error instanceof Error ? error.message : "Kategorije nisu učitane.",
        );
      }
    };
    loadCategories();
  }, []);

  function handleCategorySaved(saved: Category) {
    setCategoryOptions((current) =>
      [...current.filter((category) => category.id !== saved.id), saved].sort(
        (first, second) => first.title.localeCompare(second.title, "sr"),
      ),
    );
    setToastMessage(`Kategorija „${saved.title}“ je uspešno dodata.`);
  }

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
          <button
            type="button"
            onClick={signOut}
            className="mt-4 flex items-center gap-1.5 rounded-md border border-line-strong px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-white sm:mt-0"
          >
            <LogOut size={16} />
            Odjavi se
          </button>
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
            <div id="category-form" hidden={!categoryFormOpen}>
              <CategoryForm onSaved={handleCategorySaved} />
            </div>
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
            {categoriesError && (
              <div className="px-5 pt-5 sm:px-7">
                <FormNotice message={categoriesError} isError />
              </div>
            )}
            <ProductForm
              categories={categoryOptions}
              onSaved={(saved) =>
                setToastMessage(`Proizvod „${saved.name}“ je uspešno dodat.`)
              }
            />
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
