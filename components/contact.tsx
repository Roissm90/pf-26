import { Reveal } from "@/components/motion/reveal";
import { personalInfo, socials } from "@/content/data";

export function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-border/60 px-6 py-24 text-center"
    >
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            ¿Hablamos?
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Estoy abierto a nuevas oportunidades y colaboraciones. Escribime y
            te respondo a la brevedad.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href={`mailto:${personalInfo.email}`}
            className="mt-8 inline-flex rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            {personalInfo.email}
          </a>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-8 flex items-center justify-center gap-4">
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
    </section>
  );
}
