"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AlertCircle, LoaderCircle, Trash2 } from "lucide-react";
import { deleteCategory } from "@/api/categories/categoriseApi";
import type { Category } from "@/api/categories/categoriseType";
import SuccessToast from "./ui/SuccessToast";

type Target = Pick<Category, "id" | "title">;

const CategoryDeleteContext = createContext<(category: Target) => void>(
  () => {},
);

// Drži modal i toast iznad liste, da toast ostane vidljiv i kada
// obrisana kategorija nestane iz liste posle osvežavanja.
export function CategoryDeleteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
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
      await deleteCategory(target.id);
      setToastMessage(`Kategorija „${target.title}“ je uspešno obrisana.`);
      setTarget(null);
      router.refresh();
    } catch {
      setError("Brisanje nije uspelo. Pokušajte ponovo.");
    } finally {
      setPending(false);
    }
  };

  return (
    <CategoryDeleteContext.Provider value={setTarget}>
      {children}

      {target && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
          onClick={closeModal}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-category-title"
            className="w-full max-w-md rounded-[14px] bg-white p-6 shadow-[0_18px_45px_-20px_rgba(46,14,31,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="delete-category-title"
              className="font-serif text-[26px] leading-tight"
            >
              Obriši kategoriju
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-body">
              Da li ste sigurni da želite da obrišete kategoriju „
              {target.title}“? Ova radnja se ne može poništiti.
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
    </CategoryDeleteContext.Provider>
  );
}

export function DeleteCategoryButton({ category }: { category: Target }) {
  const requestDelete = useContext(CategoryDeleteContext);

  return (
    <button
      type="button"
      onClick={() => requestDelete({ id: category.id, title: category.title })}
      aria-label={`Obriši kategoriju ${category.title}`}
      title="Obriši kategoriju"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-rose shadow-sm backdrop-blur hover:bg-white hover:text-rose-dark"
    >
      <Trash2 size={17} />
    </button>
  );
}
