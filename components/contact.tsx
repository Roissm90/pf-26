import { Phone } from "lucide-react";
import { WhatsappIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { personalInfo, socials } from "@/content/data";
import { t, type LanguageProps } from "@/lib/translations";

export function Contact({ language = "es" }: LanguageProps) {
  const phoneNumber = personalInfo.phone.replace(/\D/g, "");

  return (
    <section
      id="contact"
      className="border-t border-border/60 bg-accent/5 px-6 pt-10 pb-4 min-[767px]:pt-20 min-[767px]:pb-4 text-center"
    >
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="text-4xl font-normal sm:text-5xl">
            {t(language, "¿Hablamos?")}
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            {t(language, "Estoy abierto a nuevas oportunidades.")}
            <br></br>
            {t(language, "Contáctame y te respondo a la mayor brevedad posible.")}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            data-analytics="contact-email"
            href={`mailto:${personalInfo.email}`}
            className="hidden mt-8 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            {personalInfo.email}
          </a>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
        </Reveal>
      </div>
    </section>
  );
}
