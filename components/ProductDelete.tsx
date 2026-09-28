"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AlertCircle, LoaderCircle, Trash2 } from "lucide-react";
import { deleteProduct } from "@/api/products/productsApi";
import type { Product } from "@/api/products/productsType";
import SuccessToast from "./ui/SuccessToast";

type Target = Pick<Product, "id" | "name" | "slug">;

const ProductDeleteContext = createContext<(product: Target) => void>(
  () => {},
);

// Stoji u layout-u, da toast ostane vidljiv i posle preusmerenja
// sa stranice obrisanog proizvoda na listu proizvoda.
export function ProductDeleteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [target, setTarget] = useState<Target | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const closeToast = useCallback(() => setToastMessage(""), []);

  const closeModal = useCallback(() => {
    if (pending) return;
    setTarget(null);
    setError("");
  }, [pending]);

  useEffect(() => {
    if (!target) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [target, closeModal]);

  const confirmDelete = async () => {
    if (!target) return;
    setPending(true);
    setError("");
    try {
      await deleteProduct(target.id);
      setToastMessage(`Proizvod „${target.name}“ je uspešno obrisan.`);
      setTarget(null);
      // Stranica obrisanog proizvoda više ne postoji.
      if (pathname === `/proizvodi/${target.slug}`) {
        router.replace("/proizvodi");
      } else {
        router.refresh();
      }
    } catch {
      setError("Brisanje nije uspelo. Pokušajte ponovo.");
    } finally {
      setPending(false);
    }
  };

  return (
    <ProductDeleteContext.Provider value={setTarget}>
      {children}

      {target && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
          onClick={closeModal}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
            className="w-full max-w-md rounded-[14px] bg-white p-6 shadow-[0_18px_45px_-20px_rgba(46,14,31,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="delete-product-title"
              className="font-serif text-[26px] leading-tight"
            >
              Obriši proizvod
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-body">
              Da li ste sigurni da želite da obrišete proizvod „{target.name}“?
              Biće obrisane i njegove fotografije. Ova radnja se ne može
              poništiti.
            </p>

            {error && (
              <p
                role="alert"
                className="mt-4 flex items-start gap-2 text-sm text-rose"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={pending}
                className="rounded-md border border-line-strong px-4 py-2.5 text-[15px] font-semibold text-ink hover:bg-cream disabled:opacity-60"
              >
                Ne
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={pending}
                autoFocus
                className="flex items-center gap-2 rounded-md bg-rose px-4 py-2.5 text-[15px] font-semibold text-white hover:bg-rose-dark disabled:opacity-60"
              >
                {pending && <LoaderCircle size={16} className="animate-spin" />}
                Da, obriši
              </button>
            </div>
          </div>
        </div>
      )}

      <SuccessToast message={toastMessage} onClose={closeToast} />
    </ProductDeleteContext.Provider>
  );
}

export function DeleteProductButton({ product }: { product: Target }) {
  const requestDelete = useContext(ProductDeleteContext);

  return (
    <button
      type="button"
      onClick={() =>
        requestDelete({ id: product.id, name: product.name, slug: product.slug })
      }
      aria-label={`Obriši proizvod ${product.name}`}
      title="Obriši proizvod"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-rose shadow-sm backdrop-blur hover:bg-white hover:text-rose-dark"
    >
      <Trash2 size={17} />
    </button>
  );
}
