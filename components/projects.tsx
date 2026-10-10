import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/content/data";

const sortedProjects = [...projects].sort(
  (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
);

export function Projects() {
  return (
    <section id="projects" className="border-t border-border/60 px-6 py-10 min-[767px]:py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="text-3xl font-normal sm:text-4xl">Proyectos</h2>
          <p className="mt-2 text-muted-foreground">
            Algunas cosas que construí recientemente.
          </p>
        </Reveal>

        <div className="mt-10 space-y-4">
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
