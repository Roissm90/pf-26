import { personalInfo } from "@/content/data";

export function Footer() {
  return (
    <footer className="border-t border-border/60 px-6 py-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-2 text-sm text-muted-foreground sm:flex-row">
        <p>
          © {new Date().getFullYear()} {personalInfo.name}
        </p>
        <p>Hecho con Next.js y Tailwind CSS</p>
      </div>
    </footer>
  );
}
