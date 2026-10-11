import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const spanish = getSiteUrl().href;
  const english = new URL("/en", getSiteUrl()).href;
  return [
    {
      url: spanish,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { es: spanish, en: english } },
    },
    {
      url: english,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages: { es: spanish, en: english } },
    },
  ];
}
