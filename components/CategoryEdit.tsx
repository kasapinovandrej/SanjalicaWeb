"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Pencil, X } from "lucide-react";
import type { Category } from "@/api/categories/categoriseType";
import CategoryForm from "./admin/CategoryForm";
import SuccessToast from "./ui/SuccessToast";

const CategoryEditContext = createContext<(category: Category) => void>(
  () => {},
);

// Drži modal i toast iznad liste, isto kao CategoryDeleteProvider.
export function CategoryEditProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [target, setTarget] = useState<Category | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const closeToast = useCallback(() => setToastMessage(""), []);
  const closeModal = useCallback(() => setTarget(null), []);

  useEffect(() => {
    if (!target) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [target, closeModal]);

  function handleSaved(saved: Category) {
    setToastMessage(`Kategorija „${saved.title}“ je uspešno izmenjena.`);
    setTarget(null);
    router.refresh();
  }

  return (
    <CategoryEditContext.Provider value={setTarget}>
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
              aria-labelledby="edit-category-title"
              className="w-full max-w-2xl rounded-[14px] bg-white shadow-[0_18px_45px_-20px_rgba(46,14,31,0.45)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
                <h2
                  id="edit-category-title"
                  className="font-serif text-[26px] leading-tight"
                >
                  Izmeni kategoriju
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
              <CategoryForm
                key={target.id}
                category={target}
                onSaved={handleSaved}
              />
            </div>
          </div>
        </div>
      )}

      <SuccessToast message={toastMessage} onClose={closeToast} />
    </CategoryEditContext.Provider>
  );
}

export function EditCategoryButton({ category }: { category: Category }) {
  const requestEdit = useContext(CategoryEditContext);

  return (
    <button
      type="button"
      onClick={() => requestEdit(category)}
      aria-label={`Izmeni kategoriju ${category.title}`}
      title="Izmeni kategoriju"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-plum shadow-sm backdrop-blur hover:bg-white hover:text-ink"
    >
      <Pencil size={16} />
    </button>
  );
}
