import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { personalInfo, socials } from "@/content/data";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pt-24 pb-20 sm:pt-32 sm:pb-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
      />

      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="text-sm font-medium text-accent">{personalInfo.role}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Hola, soy {personalInfo.name}.
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty">
            {personalInfo.tagline}
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#projects"
              className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Ver proyectos
            </Link>
            <a
              href={personalInfo.resumeUrl}
              download
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted/20"
            >
              Descargar CV
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.32}>
          <div className="mt-10 flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </Reveal>
      </div>

      <Link
        href="#about"
        className="mx-auto mt-20 hidden w-fit items-center gap-2 text-xs text-muted-foreground sm:flex"
      >
        <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
      </Link>
    </section>
  );
}
