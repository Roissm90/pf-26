import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { GithubIcon } from "@/components/icons";
import type { Project } from "@/content/data";

export function ProjectCard({ project }: { project: Project }) {
  const primaryUrl = project.liveUrl ?? project.repoUrl;

  return (
    <article className="group relative -mx-4 flex cursor-pointer flex-col gap-4 rounded-xl px-4 py-6 transition-colors hover:bg-muted/5 sm:-mx-6 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white p-2.5 ring-1 ring-border/50 self-start">
        {project.imgUrl ? (
          <Image
            src={project.imgUrl}
            alt={`Logo de ${project.title}`}
            width={56}
            height={56}
            className="h-full w-full object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
          />
        ) : (
          <span className="text-sm font-semibold text-foreground/40">
            {project.title.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="font-medium tracking-tight transition-colors group-hover:text-accent">
            {project.title}
          </h3>
          {project.featured && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-accent">
              Reciente
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {project.description}
        </p>
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {project.stack.map((tech) => (
            <li key={tech} className="text-xs text-muted-foreground/60">
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
