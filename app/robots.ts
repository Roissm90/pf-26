import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    // EDITAR: reemplazá con tu dominio real una vez desplegado en Vercel.
    sitemap: "https://tu-dominio.vercel.app/sitemap.xml",
  };
}
