import type { Metadata } from "next";
import { Portfolio } from "@/components/portfolio";
import { personalInfo } from "@/content/data";
import { t } from "@/lib/translations";
import { getSiteUrl } from "@/lib/site-url";

const title = `${personalInfo.name} | ${personalInfo.role}`;
const description = t("en", "Desarrollador frontend en Madrid. React, Next.js y experiencias web rápidas y accesibles. Descubre mi experiencia y proyectos.");

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/en", languages: { es: "/", en: "/en", "x-default": "/" } },
  openGraph: {
    title,
    description,
    type: "website",
    url: new URL("/en", getSiteUrl()),
    siteName: personalInfo.name,
    locale: "en_GB",
    alternateLocale: "es_ES",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
  },
};

export default function EnglishHome() {
  return <Portfolio language="en" />;
}