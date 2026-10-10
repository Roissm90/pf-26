import { Reveal } from "@/components/motion/reveal";
import { skills } from "@/content/data";

export function Skills() {
  return (
    <section id="skills" className="border-t border-border/60 px-6 py-10 min-[767px]:py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight">Stack</h2>
        </Reveal>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((group, i) => (
            <Reveal key={group.category} delay={i * 0.08}>
              <h3 className="text-sm font-medium text-muted-foreground">
                {group.category}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-border px-3 py-1 text-sm"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
