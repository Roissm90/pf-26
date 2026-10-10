import { Reveal } from "@/components/motion/reveal";
import { experience } from "@/content/data";

export function Experience() {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="border-t border-border/60 px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight">Experiencia</h2>
        </Reveal>

        <div className="mt-10 space-y-8">
          {experience.map((item, i) => (
            <Reveal key={`${item.company}-${item.role}`} delay={i * 0.08}>
              <div className="flex flex-col gap-1 border-l border-border pl-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <div>
                  <h3 className="font-medium">{item.role}</h3>
                  <p className="text-sm text-muted-foreground">{item.company}</p>
                  <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <p className="shrink-0 text-sm text-muted-foreground">
                  {item.period}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
