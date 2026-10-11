import { Reveal } from "@/components/motion/reveal";
import { experience } from "@/content/data";
import { t, type LanguageProps } from "@/lib/translations";

export function Experience({ language = "es" }: LanguageProps) {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="border-t border-border/60 px-6 py-10 min-[767px]:py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="text-3xl font-normal sm:text-4xl">{t(language, "Experiencia")}</h2>
        </Reveal>

        <div className="mt-10 space-y-8">
          {experience.map((item, i) => (
            <Reveal key={`${item.company}-${item.role}`} delay={i * 0.08}>
              <div className={`relative flex flex-col-reverse gap-2 border-l pl-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 ${i === 0 ? "border-accent" : "border-border"}`}>
                <span aria-hidden="true" className={`absolute -left-[5px] top-1 h-[9px] w-[9px] rounded-full ${i === 0 ? "bg-accent ring-4 ring-accent/10" : "bg-border"}`} />
                <div>
                  <h3 className={`text-lg font-semibold ${i === 0 ? "text-accent" : ""}`}>{t(language, item.role)}</h3>
                  <p className="mt-1 text-sm font-medium">{item.company}</p>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {t(language, item.description)}
                  </p>
                </div>
                <p className="shrink-0 font-mono text-xs text-muted-foreground sm:w-48 sm:text-right">
                  {item.period.replace("Presente", t(language, "Presente"))}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
