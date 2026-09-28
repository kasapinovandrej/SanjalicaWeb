"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { LoaderCircle, Pencil, X } from "lucide-react";
import { getCategories } from "@/api/categories/categoriseApi";
import type { Category } from "@/api/categories/categoriseType";
import type { Product } from "@/api/products/productsType";
import ProductForm from "./admin/ProductForm";
import { FormNotice } from "./admin/formShared";
import SuccessToast from "./ui/SuccessToast";

const ProductEditContext = createContext<(product: Product) => void>(() => {});

// Stoji u layout-u, isto kao ProductDeleteProvider.
export function ProductEditProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [target, setTarget] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [categoriesError, setCategoriesError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const closeToast = useCallback(() => setToastMessage(""), []);
  const closeModal = useCallback(() => setTarget(null), []);

  // Kategorije za padajući meni učitavamo pri svakom otvaranju modala,
  // da bi uvek bile sveže, a layout ne bi ništa dohvatao unapred.
  const openEdit = useCallback(async (product: Product) => {
    setTarget(product);
    setCategories(null);
    setCategoriesError("");
    try {
      setCategories(await getCategories());
    } catch {
      setCategoriesError("Kategorije nisu učitane. Pokušajte ponovo.");
    }
  }, []);

  useEffect(() => {
    if (!target) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [target, closeModal]);

  function handleSaved(saved: Product) {
    setToastMessage(`Proizvod „${saved.name}“ je uspešno izmenjen.`);
    setTarget(null);
    // Ako je promenjena URL oznaka, stara adresa proizvoda više ne postoji.
    if (
      target &&
      pathname === `/proizvodi/${target.slug}` &&
      saved.slug !== target.slug
    ) {
      router.replace(`/proizvodi/${saved.slug}`);
    } else {
      router.refresh();
    }
  }

  return (
    <ProductEditContext.Provider value={openEdit}>
      {children}

      {target && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-ink/50"
          onClick={closeModal}
        >
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-product-title"
              className="w-full max-w-2xl rounded-[14px] bg-white shadow-[0_18px_45px_-20px_rgba(46,14,31,0.45)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
                <h2
                  id="edit-product-title"
                  className="font-serif text-[26px] leading-tight"
                >
                  Izmeni proizvod
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Zatvori"
                  title="Zatvori"
                  className="flex h-9 w-9 items-center justify-center rounded-md text-ink hover:bg-cream"
                >
                  <X size={18} />
                </button>
              </div>
              {categories ? (
                // Forma se prikazuje tek sa kategorijama, da bi padajući meni
                // odmah imao izabranu kategoriju proizvoda.
                <ProductForm
                  key={target.id}
                  product={target}
                  categories={categories}
                  onSaved={handleSaved}
                />
              ) : categoriesError ? (
                <div className="p-5 sm:p-7">
                  <FormNotice message={categoriesError} isError />
                </div>
              ) : (
                <div className="flex justify-center p-10 text-muted">
                  <LoaderCircle size={24} className="animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <SuccessToast message={toastMessage} onClose={closeToast} />
    </ProductEditContext.Provider>
  );
}

export function EditProductButton({ product }: { product: Product }) {
  const requestEdit = useContext(ProductEditContext);

  return (
    <button
      type="button"
      onClick={() => requestEdit(product)}
      aria-label={`Izmeni proizvod ${product.name}`}
      title="Izmeni proizvod"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-plum shadow-sm backdrop-blur hover:bg-white hover:text-ink"
    >
      <Pencil size={16} />
    </button>
  );
}
