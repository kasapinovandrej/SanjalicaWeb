import LoginForm from "@/components/login/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prijava",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginForm />;
}
