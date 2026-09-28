"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { FieldError } from "./formShared";

export default function ImageDropzone({
  defaultUrl,
  onChange,
  error,
}: {
  defaultUrl?: string;
  onChange: (value?: File | string) => void;
  error?: string;
}) {
  const [label, setLabel] = useState(defaultUrl ? "Trenutna fotografija" : "");
  const [preview, setPreview] = useState(defaultUrl ?? "");
  const [dragging, setDragging] = useState(false);
  const objectUrlRef = useRef("");

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    [],
  );

  function acceptFile(candidate?: File) {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = candidate ? URL.createObjectURL(candidate) : "";
    setLabel(candidate?.name ?? "");
    setPreview(objectUrlRef.current);
    onChange(candidate);
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
                {label}
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
