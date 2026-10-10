import { personalInfo } from "@/content/data";

export function Footer() {
  return (
    <footer className="py-8 bg-accent/5">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 text-sm text-muted-foreground px-6">
        <p className="mr-auto ml-0">
          © {new Date().getFullYear()} {personalInfo.fullName}
        </p>
          <p>
            Los proyectos mostrados reflejan mi participación profesional en el
            marco de mi trabajo en{" "}
            <a
              href="https://www.wppproduction.com/"
              target="_blank"
              rel="noopener noreferrer"
              data-analytics="footer-wpp-production"
            >
              WPP Production
            </a>
            . Se presentan únicamente para dar a conocer mi experiencia y mis
            capacidades. Los derechos sobre las marcas, los diseños, el código y
            los demás contenidos de estos proyectos corresponden a sus respectivos
            titulares. No reivindico su titularidad ni la autoría exclusiva de
            estos proyectos.
          </p>
      </div>
    </footer>
  );
}
