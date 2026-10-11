import { education, navigationLinks, projects } from "@/content/data";

export const analyticsElements = [
  "contact-email", "social-github", "social-linkedin", "social-email",
  "contact-phone", "contact-whatsapp",
  ...projects.map((project) => project.analyticsId),
  ...education.map((item) => item.analyticsId),
  ...navigationLinks.map((link) => link.analyticsId),
  "navigation-top",
  "resume-download",
  "footer-wpp-production",
  "input-discovered",
  "game-discovered",
] as const;

function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export function matchingAnalyticsElements(search: string): string[] | null {
  const terms = normalizeSearch(search).split(/\s+/).filter(Boolean);
  if (!terms.length) return null;

  const entries = [
    ...education.map((item) => ({
      id: item.analyticsId,
      keywords: `${item.title} ${item.format} formacion certificados estudios educacion education ${
        item.analyticsId === "education-ia" ? "ia inteligencia artificial" : ""
      }`,
    })),
    ...projects.map((project) => ({
      id: project.analyticsId,
      keywords: `${project.title} proyectos project tarjeta demo ver proyectos`,
    })),
    ...navigationLinks.map((link) => ({
      id: link.analyticsId,
      keywords: `${link.label} navegacion navigation interna menu navbar ${
        link.href === "#projects" ? "proyectos project ver proyectos" :
        link.href === "#contact" ? "contacto contact correo email" : ""
      }`,
    })),
    { id: "navigation-top", keywords: "navegacion navigation interna menu navbar inicio arriba portada" },
    { id: "contact-email", keywords: "contacto contact correo email" },
    { id: "contact-phone", keywords: "contacto contact telefono movil llamada llamar phone" },
    { id: "contact-whatsapp", keywords: "contacto contact whatsapp mensaje chat" },
    { id: "social-email", keywords: "contacto contact correo email social" },
    { id: "social-github", keywords: "redes social github" },
    { id: "social-linkedin", keywords: "redes social linkedin" },
    { id: "resume-download", keywords: "cv curriculum resume descargar descarga" },
    { id: "footer-wpp-production", keywords: "wpp production empresa footer pie atribucion" },
    { id: "input-discovered", keywords: "input encontrado descubierto consola secreta easter egg discovery" },
    { id: "game-discovered", keywords: "game juego descubierto breakout easter egg discovery" },
  ];

  return [...new Set(entries.filter((entry) => {
    const text = normalizeSearch(`${entry.id} ${entry.keywords}`);
    const words = text.split(/[^a-z0-9]+/);
    return terms.every((term) => term.length <= 2 ? words.includes(term) : text.includes(term));
  }).map((entry) => entry.id))];
}