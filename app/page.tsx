import type { Metadata } from "next";
import { Portfolio } from "@/components/portfolio";

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: { es: "/", en: "/en", "x-default": "/" } },
};

export default function Home() {
  return <Portfolio language="es" />;
}
