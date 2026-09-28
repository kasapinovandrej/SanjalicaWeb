import Link from "next/link";
import type { Metadata } from "next";
import { AlertCircle, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Greška pri prijavi",
  robots: { index: false, follow: false },
};

export default function ErrorPage() {
  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center bg-[#f4f1ec] px-4 py-10 sm:px-6">
      <section className="w-full max-w-md rounded-lg border border-line bg-white p-5 text-center shadow-[0_12px_35px_-28px_rgba(46,14,31,0.35)] sm:p-7">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f8e8e9] text-rose">
          <AlertCircle size={24} />
        </span>
        <h1 className="mt-4 text-xl font-semibold text-ink">
          Prijava nije uspela
        </h1>
        <p className="mt-2 text-sm text-muted">
          Proverite email i lozinku, pa pokušajte ponovo.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-rose px-5 py-3 font-semibold text-white transition-colors hover:bg-rose-dark"
        >
          <ArrowLeft size={18} />
          Nazad na prijavu
        </Link>
      </section>
    </div>
  );
}
