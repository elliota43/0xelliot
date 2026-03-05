"use client";

import { motion } from "framer-motion";
import { Github } from "lucide-react";

interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  stars?: number;
  lang: string;
  status: string;
}

const PROJECTS: Project[] = [
  {
    title: "git clone in go",
    description:
      "implements git init, add, commit, log, push, and clone from scratch. parses pack files, resolves delta chains, implements the http smart protocol, and handles the object store.",
    tags: ["go", "systems", "git internals", "networking"],
    github: "https://github.com/elliota43",
    stars: 84,
    lang: "go",
    status: "complete",
  },
  {
    title: "vim-style text editor in rust",
    description:
      "modal text editor using raw terminal i/o with no external tui libraries. normal, insert, and visual modes. gap buffer for O(1) local edits. syntax highlighting via tree-sitter.",
    tags: ["rust", "tui", "data structures", "tree-sitter"],
    github: "https://github.com/elliota43",
    stars: 61,
    lang: "rust",
    status: "active",
  },
  {
    title: "lox vm in c",
    description:
      "complete bytecode virtual machine for the lox language. mark-and-sweep garbage collection, closures with upvalue capture, single-pass compiler, nan-boxing value representation.",
    tags: ["c", "compilers", "vm", "gc"],
    github: "https://github.com/elliota43",
    stars: 47,
    lang: "c",
    status: "complete",
  },
  {
    title: "declarative laravel migrations",
    description:
      "laravel package to define your database schema declaratively in a single file. auto-generates necessary migrations. eliminates migration drift, makes schema evolution explicit.",
    tags: ["php", "laravel", "developer tooling", "mysql"],
    github: "https://github.com/elliota43",
    stars: 33,
    lang: "php",
    status: "active",
  },
];

export function ProjectsClient() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="text-2xl font-semibold tracking-tight mb-3">
            projects
          </h1>
          <p className="text-sm text-overlay-1">
            systems programming, compilers, and developer tooling.
            source on{" "}
            <a
              href="https://github.com/elliota43"
              target="_blank"
              rel="noopener noreferrer"
              className="text-peach hover:underline"
            >
              github
            </a>
            .
          </p>
        </motion.div>

        <div className="space-y-3">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <div className="border border-surface-0 rounded-md p-5 hover:border-surface-1 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-1.5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-medium text-subtext-1">
                      {project.title}
                    </h3>
                    <span className="text-xs text-overlay-0">
                      {project.status}
                    </span>
                  </div>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-overlay-0 hover:text-subtext-1 transition-colors shrink-0"
                      aria-label="GitHub"
                    >
                      <Github size={14} />
                    </a>
                  )}
                </div>

                <p className="text-sm text-overlay-1 leading-relaxed mb-3">
                  {project.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-overlay-0 bg-surface-0 px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-overlay-0">
                    <span>{project.lang}</span>
                    {project.stars !== undefined && (
                      <span>{project.stars}*</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
