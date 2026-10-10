import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { GithubIcon } from "@/components/icons";
import type { Project } from "@/content/data";

export function ProjectCard({ project }: { project: Project }) {
  const primaryUrl = project.liveUrl ?? project.repoUrl;

  return (
    <article className={`group relative flex cursor-pointer flex-col gap-4 rounded-lg border p-6 transition-colors hover:border-accent focus-within:border-accent sm:flex-row sm:items-center sm:gap-6 ${project.featured ? "border-accent/30 bg-accent/5" : "border-border bg-card"}`}>
      <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-white p-2.5 self-start">
        {project.imgUrl ? (
          <Image
            src={project.imgUrl}
            alt={`Logo de ${project.title}`}
            width={56}
            height={56}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-sm font-semibold text-foreground/40">
            {project.title.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="text-xl font-semibold transition-colors group-hover:text-accent">
            {project.title}
          </h3>
          {project.featured && (
            <span className="border-l border-accent/40 pl-2 font-mono text-[10px] font-medium uppercase text-accent">
              Reciente
            </span>
          )}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
          {project.stack.map((tech) => (
            <li key={tech} className="font-mono text-xs text-muted-foreground">
              {tech}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex shrink-0 items-center gap-4 text-sm font-medium sm:pl-4 self-end">
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Código de ${project.title}`}
            className="relative z-20 text-muted-foreground transition-colors hover:text-foreground"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
        )}
        {project.liveUrl && (
          <span className="inline-flex items-center gap-1 text-foreground">
            Ver Site
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        )}
      </div>

      {primaryUrl && (
        <a
          data-analytics={project.analyticsId}
          href={primaryUrl}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={project.title}
          className="absolute inset-0 z-10"
        />
      )}
    </article>
  );
}
