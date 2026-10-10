import { Phone } from "lucide-react";
import { WhatsappIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { personalInfo, socials } from "@/content/data";

export function Contact() {
  const phoneNumber = personalInfo.phone.replace(/\D/g, "");

  return (
    <section
      id="contact"
      className="border-t border-border/60 px-6 py-10 min-[767px]:py-20 text-center"
    >
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            ¿Hablamos?
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Estoy abierto a nuevas oportunidades y colaboraciones. Escribime y
            te respondo a la mayor brevedad posible.
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
              aria-label="Enviar un WhatsApp"
              title="Enviar un WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
            >
              <WhatsappIcon aria-hidden="true" className="h-4 w-4" />
            </a>
            <a
              data-analytics="contact-phone"
              href={`tel:+${phoneNumber}`}
              aria-label={`Llamar a ${personalInfo.phone}`}
              title={`Llamar a ${personalInfo.phone}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
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
