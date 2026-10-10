import { Reveal } from "@/components/motion/reveal";
import { personalInfo } from "@/content/data";

export function About() {
  return (
    <section id="about" className="px-6 py-20">
      <div className="mx-auto grid max-w-3xl gap-10 sm:grid-cols-[auto_1fr] sm:items-center">
        <Reveal>
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent/40 text-2xl font-semibold text-accent-foreground">
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
    </section>
  );
}
