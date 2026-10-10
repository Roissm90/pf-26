import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/content/data";

const sortedProjects = [...projects].sort(
  (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
);

export function Projects() {
  return (
    <section id="projects" className="border-t border-border/60 px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight">Proyectos</h2>
          <p className="mt-2 text-muted-foreground">
            Algunas cosas que construí recientemente.
          </p>
        </Reveal>

        <div className="mt-10 divide-y divide-border/60 border-t border-border/60">
          {sortedProjects.map((project, i) => (
            <Reveal key={project.title} delay={i * 0.05}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
