"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, Star, GitFork } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  github?: string;
  demo?: string;
  stars?: number;
  forks?: number;
  lang: string;
  langColor: string;
  size?: "normal" | "wide" | "tall";
  status: "complete" | "active" | "archived";
}

const PROJECTS: Project[] = [
  {
    title: "Git Clone in Go",
    description:
      "A from-scratch implementation of Git core plumbing.",
    longDescription:
      "Implements git init, git add, git commit, git log, git push, and git clone from scratch in Go. Parses pack files, resolves delta chains, implements the HTTP smart protocol, and handles the object store.",
    tags: ["Go", "Systems", "Git Internals", "Networking"],
    github: "https://github.com/elliota43",
    stars: 84,
    forks: 12,
    lang: "Go",
    langColor: "#00ADD8",
    size: "wide",
    status: "complete",
  },
  {
    title: "Vim-style Text Editor in Rust",
    description: "Modal text editor with gap buffer data structure.",
    longDescription:
      "A modal text editor built in Rust using raw terminal I/O with no external TUI libraries. Implements normal, insert, and visual modes. Uses a gap buffer for O(1) local edits. Supports syntax highlighting via tree-sitter.",
    tags: ["Rust", "TUI", "Data Structures", "Tree-sitter"],
    github: "https://github.com/elliota43",
    stars: 61,
    forks: 8,
    lang: "Rust",
    langColor: "#CE422B",
    size: "normal",
    status: "active",
  },
  {
    title: "Lox VM in C",
    description: "Bytecode VM for the Lox language from Crafting Interpreters.",
    longDescription:
      "A complete bytecode virtual machine for the Lox language. Features mark-and-sweep garbage collection, closures with upvalue capture, a single-pass compiler, and a NaN-boxing value representation for performance.",
    tags: ["C", "Compilers", "VM", "GC"],
    github: "https://github.com/elliota43",
    stars: 47,
    forks: 5,
    lang: "C",
    langColor: "#555555",
    size: "normal",
    status: "complete",
  },
  {
    title: "Declarative Laravel Migrations",
    description: "Schema-driven database migrations for Laravel.",
    longDescription:
      "A Laravel package that allows you to define your database schema declaratively in a single file and automatically generates the necessary migrations. Eliminates migration drift and makes schema evolution explicit.",
    tags: ["PHP", "Laravel", "Developer Tooling", "MySQL"],
    github: "https://github.com/elliota43",
    stars: 33,
    forks: 4,
    lang: "PHP",
    langColor: "#4F5D95",
    size: "wide",
    status: "active",
  },
];

const STATUS_COLORS = {
  complete: { bg: "#7effa010", text: "#7effa0", dot: "#7effa0" },
  active: { bg: "#5dbaff10", text: "#5dbaff", dot: "#5dbaff" },
  archived: { bg: "#6b6f8820", text: "#6b6f88", dot: "#6b6f88" },
};

export function ProjectsClient() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="mb-2 font-mono text-xs text-[#7effa0]">~/projects</div>
          <h1 className="mb-3 font-mono text-3xl font-bold tracking-tight text-[#e4e6f0]">
            Projects
          </h1>
          <p className="text-[#6b6f88]">
            Systems programming projects, compilers, and developer tooling. Most
            source is on{" "}
            <a
              href="https://github.com/elliota43"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7effa0] hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const statusStyle = STATUS_COLORS[project.status];
  const isWide = project.size === "wide";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={cn(isWide ? "md:col-span-2" : "")}
    >
      <div className="group h-full rounded-xl border border-[#1c1f2e] bg-[#0d0f16] p-6 transition-all duration-300 hover:border-[#7effa020] hover:shadow-[0_8px_32px_#7effa006]">
        {/* Top row */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span
                className="rounded-sm px-2 py-0.5 font-mono text-xs"
                style={{
                  background: statusStyle.bg,
                  color: statusStyle.text,
                }}
              >
                <span
                  className="mr-1 inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: statusStyle.dot }}
                />
                {project.status}
              </span>
            </div>
            <h3 className="font-mono text-base font-semibold text-[#e4e6f0] transition-colors duration-200 group-hover:text-[#7effa0]">
              {project.title}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-[#1c1f2e] text-[#363a50] transition-all duration-200 hover:border-[#252836] hover:text-[#e4e6f0]"
                aria-label="GitHub"
              >
                <Github size={13} />
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-[#1c1f2e] text-[#363a50] transition-all duration-200 hover:border-[#252836] hover:text-[#e4e6f0]"
                aria-label="Demo"
              >
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-[#6b6f88]">
          {isWide ? project.longDescription : project.description}
        </p>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-sm bg-[#141720] px-2 py-0.5 font-mono text-xs text-[#363a50]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-[#1c1f2e] pt-4">
          <div className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: project.langColor }}
            />
            <span className="font-mono text-xs text-[#363a50]">
              {project.lang}
            </span>
          </div>
          {project.stars !== undefined && (
            <div className="flex items-center gap-1 font-mono text-xs text-[#363a50]">
              <Star size={11} />
              <span>{project.stars}</span>
            </div>
          )}
          {project.forks !== undefined && (
            <div className="flex items-center gap-1 font-mono text-xs text-[#363a50]">
              <GitFork size={11} />
              <span>{project.forks}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
