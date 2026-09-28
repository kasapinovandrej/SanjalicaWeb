"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GripVertical, ImagePlus, Star, Trash2 } from "lucide-react";
import { FieldError } from "./formShared";

// `value` is a new File or the URL of an already uploaded image (edit mode).
type Item = { value: File | string; preview: string };

function revoke(item: Item) {
  if (item.value instanceof File) URL.revokeObjectURL(item.preview);
}

function itemName(item: Item, index: number) {
  return item.value instanceof File
    ? item.value.name
    : `fotografiju ${index + 1}`;
}

export default function MultiImageDropzone({
  defaultUrls = [],
  onChange,
  error,
}: {
  defaultUrls?: string[];
  onChange: (values: (File | string)[]) => void;
  error?: string;
}) {
  const [items, setItems] = useState<Item[]>(() =>
    defaultUrls.map((url) => ({ value: url, preview: url })),
  );
  const [dragging, setDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const itemsRef = useRef(items);

  useEffect(() => () => itemsRef.current.forEach(revoke), []);

  function update(next: Item[]) {
    itemsRef.current = next;
    setItems(next);
    onChange(next.map((item) => item.value));
  }

  function addFiles(files?: FileList | null) {
    if (!files?.length) return;
    update([
      ...itemsRef.current,
      ...Array.from(files).map((file) => ({
        value: file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  }

  function removeAt(index: number) {
    revoke(itemsRef.current[index]);
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
                  aria-label={`Postavi ${itemName(item, index)} kao glavnu fotografiju`}
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
                aria-label={`Ukloni ${itemName(item, index)}`}
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
