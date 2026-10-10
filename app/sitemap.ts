import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // EDITAR: reemplazá con tu dominio real una vez desplegado en Vercel.
  const baseUrl = "https://tu-dominio.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
