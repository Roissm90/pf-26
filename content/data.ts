import { Mail } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

// EDITAR: reemplazá todo lo de abajo con tu información real.
export const personalInfo = {
  name: "Santiago Martínez",
  initials: "SM",
  role: "Frontend Developer",
  tagline:
    "Construyo interfaces rápidas, accesibles y con atención al detalle, del diseño al deploy.",
  bioShort:
    "Soy desarrollador frontend especializado en React, animaciones fluidas y experiencias de usuario inmersivas. Me obsesiona la intersección entre buen diseño, buen rendimiento y código mantenible.",
  location: "Madrid, España",
  email: "roissm90@gmail.com",
  resumeUrl: "/cv.pdf", // EDITAR: subí tu CV como public/cv.pdf
};

export type SocialLink = {
  label: string;
  href: string;
  icon: IconComponent;
};

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/roissm90", icon: GithubIcon },
  { label: "LinkedIn", href: "https://linkedin.com/in/roissm90", icon: LinkedinIcon },
  { label: "Email", href: `mailto:${personalInfo.email}`, icon: Mail },
];

export type SkillGroup = {
  category: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    category: "Frontend",
    items: [
      "HTML5",
      "CSS3",
      "JavaScript (ES6+)",
      "React",
      "Next.js",
      "TypeScript",
    ],
  },
  {
    category: "Estilos y Animación",
    items: [
      "Tailwind CSS",
      "Sass/SCSS",
      "Styled Components",
      "GSAP",
      "Framer Motion",
      "Diseño Responsive",
    ],
  },
  {
    category: "Calidad",
    items: ["Vitest", "Testing Library", "Playwright", "ESLint", "Accesibilidad (a11y)"],
  },
  {
    category: "Herramientas",
    items: ["Git", "Figma", "Vercel", "Docker", "Vite", "Storybook"],
  },
];

export type Project = {
  title: string;
  description: string;
  stack: string[];
  liveUrl?: string;
  imgUrl?: string;
  repoUrl?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "Endesa",
    description:
      "Desarrollo de diferentes landings destinadas a empresas para Endesa, optimizando la experiencia de usuario y el rendimiento.",
    stack: ["WordPress", "AEM", "PHP"],
    liveUrl: "https://endesaluzempresas.com/",
    imgUrl: "https://portfolio-santiago-martinez-rois.wuaze.com/wp-content/uploads/2026/04/Nuevo-logo_Endesa.png",
  },
  {
    title: "Lola Casademunt",
    description:
      "Desarrollo del sitio web de la marca de moda Lola Casademunt, implementando un diseño responsive y optimizando la experiencia de usuario.",
    stack: ["Shopify", "Liquid", "Scss"],
    liveUrl: "https://www.lolacasademunt.com/",
    imgUrl: "https://portfolio-santiago-martinez-rois.wuaze.com/wp-content/uploads/2026/10/logo-lola.png",
    featured: true,
  },
  {
    title: "Ayesa",
    description:
      "Desarrollo y mantenimiento de la web de Ayesa, optimizando la experiencia de usuario y el rendimiento.",
    stack: ["WordPress", "Scss", "PHP"],
    liveUrl: "https://www.ayesa.com/",
    imgUrl: "https://portfolio-santiago-martinez-rois.wuaze.com/wp-content/uploads/2026/04/ayesa-1.png",
  },
  {
    title: "BSH",
    description:
      "Desarrollo de una landing de BSH, destinada a la participación y votación de proyectos con IA",
    stack: ["PHP", "JavaScript", "HTML5", "Scss", "GSAP"],
    liveUrl: "https://www.suchard.es/",
    imgUrl: "https://portfolio-santiago-martinez-rois.wuaze.com/wp-content/uploads/2026/10/BSH.png",
    featured: true,
  },
  {
    title: "Generali",
    description:
      "Desarrollo de la plataforma de gestión de clientes para Generali, mejorando la experiencia de usuario y la eficiencia del sistema.",
    stack: ["WordPress", "PHP", "Scss"],
    liveUrl: "https://www.generali.es/",
    imgUrl: "https://portfolio-santiago-martinez-rois.wuaze.com/wp-content/uploads/2026/04/generali-1.png",
  },
  {
    title: "Farmalastic",
    description:
      "Desarrollo del sitio web de la farmacia online Farmalastic, implementando un diseño responsive y optimizando la experiencia de usuario.",
    stack: ["WordPress", "CSS", "PHP"],
    liveUrl: "https://www.farmalastic.com/",
    imgUrl: "https://portfolio-santiago-martinez-rois.wuaze.com/wp-content/uploads/2026/04/farmalastic.png",
  },
  {
    title: "Suchard",
    description:
      "Desarrollo del sitio web de la marca de chocolates Suchard, implementando un diseño atractivo en su landing page.",
    stack: ["PHP", "JavaScript", "HTML5", "Scss", "GSAP"],
    liveUrl: "https://www.suchard.es/",
    imgUrl: "https://portfolio-santiago-martinez-rois.wuaze.com/wp-content/uploads/2026/04/suchard.png",
    featured: true,
  },
];

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  description: string;
};

// EDITAR: dejá la lista vacía (`[]`) si todavía no tenés experiencia laboral formal.
export const experience: ExperienceItem[] = [
  {
    role: "Frontend Developer Sr.",
    company: "WPP Production",
    period: "Junio 2026 — Presente",
    description:
      "Lidero el desarrollo frontend de proyectos para distintos clientes, definiendo arquitectura técnica y buenas prácticas del equipo. Acompaño a perfiles junior y soy referente en la resolución de problemas técnicos complejos y decisiones de stack.",
  },
  {
    role: "Frontend Developer Jr.",
    company: "WPP Production",
    period: "Octubre 2024 — Junio 2026",
    description:
      "Tras la etapa de prácticas, asumí mayor autonomía en el desarrollo de sitios para clientes, haciéndome cargo de funcionalidades completas de principio a fin. Profundicé en buenas prácticas de código, rendimiento y accesibilidad, colaborando de cerca con diseño y producto en cada entrega.",
  },
  {
    role: "Frontend Intern",
    company: "WPP Production",
    period: "Abril 2023 — Octubre 2024",
    description:
      "Formé parte del equipo de desarrollo frontend, colaborando en proyectos para clientes de distintos sectores. Pasé de tareas guiadas a resolver de forma autónoma necesidades técnicas y de UX, aplicando buenas prácticas de rendimiento y diseño responsive en cada entrega.",
  },
];
