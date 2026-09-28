"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoaderCircle, LockKeyhole, LogIn } from "lucide-react";
import { login } from "@/api/auth/actions";

const loginSchema = z.object({
  email: z.email("Unesite ispravnu email adresu."),
  password: z.string().min(1, "Unesite lozinku."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const inputClass =
  "mt-1.5 w-full rounded-md border border-line-strong bg-white px-3.5 py-3 text-[15px] text-ink placeholder:text-muted/75 focus:border-rose focus:outline-none";

export default function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { errors, isSubmitting: busy } = form.formState;

  // The action redirects to /admin on success and to /error on failure.
  const signIn = form.handleSubmit(async (values) => {
    const formData = new FormData();
    formData.set("email", values.email);
    formData.set("password", values.password);
    await login(formData);
  });

  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center bg-[#f4f1ec] px-4 py-10 sm:px-6">
      <section className="w-full max-w-md overflow-hidden rounded-lg border border-line bg-white shadow-[0_12px_35px_-28px_rgba(46,14,31,0.35)]">
        <div className="flex items-center gap-3 border-b border-line px-5 py-5 sm:px-7">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#f8e8e9] text-rose">
            <LockKeyhole size={20} />
          </span>
          <div>
            <p className="eyebrow">SANJALICA · RADNI PROSTOR</p>
            <h1 className="text-xl font-semibold text-ink">Prijava</h1>
          </div>
        </div>
        <form onSubmit={signIn} className="space-y-5 p-5 sm:p-7" noValidate>
          <label className="block text-sm font-semibold text-ink">
            Email
            <input
              type="email"
              autoComplete="email"
              className={inputClass}
              placeholder="ime@primer.rs"
              {...form.register("email")}
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-rose">{errors.email.message}</p>
            )}
          </label>
          <label className="block text-sm font-semibold text-ink">
            Lozinka
            <input
              type="password"
              autoComplete="current-password"
              className={inputClass}
              {...form.register("password")}
            />
            {errors.password && (
              <p className="mt-1.5 text-sm text-rose">
                {errors.password.message}
              </p>
            )}
          </label>
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-rose px-5 py-3.5 font-semibold text-white transition-colors hover:bg-rose-dark disabled:cursor-wait disabled:opacity-70"
          >
            {busy ? (
              <LoaderCircle className="animate-spin" size={18} />
            ) : (
              <LogIn size={18} />
            )}
            Prijavi se
          </button>
        </form>
      </section>
    </div>
  );
}
