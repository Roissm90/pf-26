import { personalInfo } from "@/content/data";
import { t, type LanguageProps } from "@/lib/translations";
import { Reveal } from "@/components/motion/reveal";

export function Footer({ language = "es" }: LanguageProps) {
  return (
    <footer className="py-8 bg-accent/5">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 text-sm text-muted-foreground px-6">
        <Reveal className="mr-auto ml-0">
          <p>
            © {new Date().getFullYear()} {personalInfo.fullName}
          </p>
        </Reveal>
        <Reveal delay={0.08} className="w-full">
          <p>
            {t(language, "Los proyectos mostrados reflejan mi participación profesional en el marco de mi trabajo en")} {" "}
            <a
              href="https://www.wppproduction.com/"
              target="_blank"
              rel="noopener noreferrer"
              data-analytics="footer-wpp-production"
              className="underline underline-offset-4"
            >
              WPP Production
            </a>
            {t(language, ". Se presentan únicamente para dar a conocer mi experiencia y mis capacidades. Los derechos sobre las marcas, los diseños, el código y los demás contenidos de estos proyectos corresponden a sus respectivos titulares. No reivindico su titularidad ni la autoría exclusiva de estos proyectos.")}
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
