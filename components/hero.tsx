import Link from "next/link";
import { ArrowDown, ArrowUpRight, Download, Phone } from "lucide-react";
import { WhatsappIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { personalInfo, socials } from "@/content/data";

export function Hero() {
  const phoneNumber = personalInfo.phone.replace(/\D/g, "");

  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 py-10 min-[767px]:py-20"
    >
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-sm font-medium text-accent"><span aria-hidden="true" className="h-2 w-2 bg-accent" />{personalInfo.role}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-6 max-w-2xl text-5xl font-normal leading-[1.08] text-balance sm:text-7xl">
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
              data-analytics="navigation-projects"
              href="#projects"
              className="inline-flex items-center gap-3 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Ver proyectos
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <a
              data-analytics="resume-download"
              href={personalInfo.resumeUrl}
              download
              className="inline-flex items-center gap-3 rounded-lg border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-muted/20"
            >
              Descargar CV
              <Download aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.32}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              data-analytics="contact-whatsapp"
              href={`https://wa.me/${phoneNumber}`}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Enviar un WhatsApp"
              title="Enviar un WhatsApp"
              className="contact-action"
            >
              <WhatsappIcon aria-hidden="true" className="h-4 w-4" />
            </a>
            <a
              data-analytics="contact-phone"
              href={`tel:+${phoneNumber}`}
              aria-label={`Llamar a ${personalInfo.phone}`}
              title={`Llamar a ${personalInfo.phone}`}
              className="contact-action"
            >
              <Phone aria-hidden="true" className="h-4 w-4" />
            </a>
            {socials.map((social) => (
              <a
                key={social.label}
                data-analytics={`social-${social.label.toLowerCase()}`}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={social.label}
                title={social.label}
                className="contact-action"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </Reveal>
      </div>

      <a
        data-analytics="navigation-about"
        href="#about"
        aria-label="Ir a Sobre mi"
        className="mx-auto mt-20 flex h-11 w-11 items-center justify-center text-xs text-muted-foreground"
      >
        <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
      </a>
    </section>
  );
}
