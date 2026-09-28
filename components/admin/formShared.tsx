import { AlertCircle, Check } from "lucide-react";
import { z } from "zod";

const imageTypes = ["image/jpeg", "image/png", "image/webp"];

// A new File to upload, or the URL of an already uploaded image (edit mode).
export const imageSchema = z
  .custom<File | string>(
    (value) =>
      (typeof value === "string" && value.length > 0) ||
      (typeof File !== "undefined" && value instanceof File),
    {
      message: "Dodajte fotografiju.",
    },
  )
  .refine(
    (value) => typeof value === "string" || imageTypes.includes(value.type),
    "Koristite JPG, PNG ili WebP sliku.",
  )
  .refine(
    (value) => typeof value === "string" || value.size <= 8 * 1024 * 1024,
    "Slika može imati najviše 8 MB.",
  );

export const slugSchema = z
  .string()
  .trim()
  .min(2, "Unesite najmanje 2 karaktera.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Koristite mala slova, brojeve i crtice.",
  );

export function slugify(value: string) {
  return value
    .toLocaleLowerCase("sr-Latn")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "dj")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const inputClass =
  "mt-1.5 w-full rounded-md border border-line-strong bg-white px-3.5 py-3 text-[15px] text-ink placeholder:text-muted/75 focus:border-rose focus:outline-none";

export function FieldError({ children }: { children?: string }) {
  return children ? (
    <p className="mt-1.5 text-sm text-rose">{children}</p>
  ) : null;
}

export function FormNotice({
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
