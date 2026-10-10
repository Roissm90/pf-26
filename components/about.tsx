import { Reveal } from "@/components/motion/reveal";
import { ArrowUpRight, FileText, GraduationCap } from "lucide-react";
import { education, personalInfo } from "@/content/data";

export function About() {
  return (
    <section id="about" className="px-6 py-10 min-[767px]:py-20">
      <div className="mx-auto grid max-w-3xl sm:gap-10 sm:grid-cols-[auto_1fr] sm:items-center">
        <Reveal>
          <div className="hidden sm:flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent/40 text-2xl font-semibold text-accent-foreground">
            {personalInfo.initials}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Sobre mí</h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              {personalInfo.bioShort}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {personalInfo.location}
            </p>
          </div>
        </Reveal>
      </div>
      <div className="mx-auto mt-12 max-w-3xl border-t border-border/60 pt-8">
        <Reveal>
          <h3 className="text-lg font-medium">Formación y certificados</h3>
          <ul className="mt-4 divide-y divide-border/60">
            {education.map((item) => (
              <li key={item.analyticsId}>
                <a
                  href={item.href}
                  data-analytics={item.analyticsId}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center gap-4 rounded py-4 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                >
                  {item.format === "PDF" ? (
                    <FileText aria-hidden="true" className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
                  ) : (
                    <GraduationCap aria-hidden="true" className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block break-words text-sm font-medium">{item.title}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{item.format}</span>
                  </span>
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
