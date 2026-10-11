import { ArrowDown, ArrowUpRight, Download, Phone } from "lucide-react";
import { WhatsappIcon } from "@/components/icons";
import { HeroEntrance, TypewriterText } from "@/components/motion/hero-entrance";
import { personalInfo, socials } from "@/content/data";
import { t, type LanguageProps } from "@/lib/translations";
import { SecretCommand } from "@/components/secret-command";

export function Hero({ language = "es" }: LanguageProps) {
  const phoneNumber = personalInfo.phone.replace(/\D/g, "");

  return (
    <HeroEntrance>
    <section
      id="top"
      className="relative overflow-hidden px-6 py-10 min-[767px]:py-20 min-h-svh flex flex-col justify-between"
    >
      <div className="mx-auto max-w-3xl">
        <div>
          <div className="flex items-center gap-3 font-mono text-sm font-medium text-accent"><span aria-hidden="true" className="h-2 w-2 bg-accent" /><TypewriterText text={t(language, personalInfo.role)} /><SecretCommand language={language} /></div>
        </div>

        <div>
          <h1 className="mt-6 max-w-2xl text-5xl font-normal leading-[1.08] text-balance sm:text-7xl">
            <TypewriterText text={`${t(language, "Hola, soy")} ${personalInfo.name}.`} />
          </h1>
        </div>

        <div data-hero-reveal>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty">
            {t(language, personalInfo.tagline)}
          </p>
        </div>

        <div data-hero-reveal>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              data-analytics="navigation-projects"
              href="#projects"
              className="inline-flex items-center gap-3 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              {t(language, "Ver proyectos")}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
            <a
              data-analytics="resume-download"
              href={personalInfo.resumeUrl}
              download
              className="inline-flex items-center gap-3 rounded-lg border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-muted/20"
            >
              {t(language, "Descargar CV")}
              <Download aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div data-hero-reveal>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              data-analytics="contact-whatsapp"
              href={`https://wa.me/${phoneNumber}`}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={t(language, "Enviar un WhatsApp")}
              title={t(language, "Enviar un WhatsApp")}
              className="contact-action"
            >
              <WhatsappIcon aria-hidden="true" className="h-4 w-4" />
            </a>
            <a
              data-analytics="contact-phone"
              href={`tel:+${phoneNumber}`}
              aria-label={`${t(language, "Llamar a")} ${personalInfo.phone}`}
              title={`${t(language, "Llamar a")} ${personalInfo.phone}`}
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
        </div>
      </div>

      <a
        data-hero-reveal
        data-analytics="navigation-about"
        href="#about"
        aria-label={t(language, "Ir a Sobre mí")}
        className="mx-auto mt-auto mb-10 flex h-11 w-11 items-center justify-center text-accent"
      >
        <ArrowDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
    </HeroEntrance>
  );
}
