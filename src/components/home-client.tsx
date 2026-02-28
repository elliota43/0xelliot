"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Github, ExternalLink, Star } from "lucide-react";
import { TerminalHero } from "@/components/terminal-hero";
import type { Article } from "@/lib/mdx";
import { formatDateShort } from "@/lib/utils";

interface Project {
  title: string;
  description: string;
  tags: string[];
  href: string;
  stars?: number;
  lang: string;
  langColor: string;
}

const PROJECTS: Project[] = [
  {
    title: "Git Clone in Go",
    description:
      "A from-scratch implementation of Git's core plumbing commands. Parses pack files, resolves delta chains, and handles the HTTP smart protocol.",
    tags: ["Go", "Systems", "Git Internals"],
    href: "/projects",
    stars: 84,
    lang: "Go",
    langColor: "#00ADD8",
  },
  {
    title: "Vim-style Text Editor in Rust",
    description:
      "A modal text editor built in Rust using raw terminal I/O. Implements normal, insert, and visual modes with a gap buffer for efficient editing.",
    tags: ["Rust", "TUI", "Data Structures"],
    href: "/projects",
    stars: 61,
    lang: "Rust",
    langColor: "#CE422B",
  },
  {
    title: "Lox VM in C",
    description:
      "A bytecode virtual machine for the Lox language from Crafting Interpreters. Features mark-and-sweep GC, closures, and a single-pass compiler.",
    tags: ["C", "Compilers", "VM"],
    href: "/projects",
    stars: 47,
    lang: "C",
    langColor: "#555555",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

interface HomeClientProps {
  articles: Article[];
}

export function HomeClient({ articles }: HomeClientProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 bg-grid">
        {/* Radial glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
          style={{
            width: 800,
            height: 400,
            background:
              "radial-gradient(ellipse at top, #7effa008 0%, transparent 70%)",
          }}
        />

        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: intro */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="flex flex-col justify-center"
            >
              <motion.div
                variants={fadeInUp}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1c1f2e] bg-[#0d0f16] px-3 py-1.5 w-fit"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#7effa0] shadow-[0_0_8px_#7effa0]" />
                <span className="font-mono text-xs text-[#6b6f88]">
                  open to new opportunities
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="mb-4 font-mono text-4xl font-bold leading-tight tracking-tight lg:text-5xl"
              >
                <span className="text-[#e4e6f0]">Elliot</span>{" "}
                <span
                  className="text-gradient"
                  style={{
                    background:
                      "linear-gradient(135deg, #7effa0 0%, #5dbaff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Anderson
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="mb-3 font-mono text-sm text-[#7effa0]"
              >
                software engineer / systems programmer
              </motion.p>

              <motion.p
                variants={fadeInUp}
                className="mb-8 max-w-md text-base leading-relaxed text-[#6b6f88]"
              >
                I build things at the intersection of{" "}
                <span className="text-[#b8bbcc]">systems programming</span>,{" "}
                <span className="text-[#b8bbcc]">compilers</span>, and{" "}
                <span className="text-[#b8bbcc]">developer tooling</span>. I
                write about what I build here.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap items-center gap-3"
              >
                <Link
                  href="/projects"
                  className="group flex items-center gap-2 rounded-md bg-[#7effa0] px-4 py-2 font-mono text-sm font-medium text-[#08090e] transition-all duration-200 hover:bg-[#a0ffba]"
                >
                  view projects
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
                <a
                  href="https://github.com/elliota43"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md border border-[#1c1f2e] bg-[#0d0f16] px-4 py-2 font-mono text-sm text-[#6b6f88] transition-all duration-200 hover:border-[#7effa030] hover:text-[#e4e6f0]"
                >
                  <Github size={14} />
                  elliota43
                </a>
                <Link
                  href="/articles"
                  className="font-mono text-sm text-[#6b6f88] transition-colors duration-200 hover:text-[#7effa0]"
                >
                  read the blog →
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: terminal */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <TerminalHero />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex items-center justify-between"
          >
            <div>
              <h2 className="font-mono text-xl font-semibold text-[#e4e6f0]">
                <span className="text-[#7effa0]">$ ls</span> projects/
              </h2>
              <p className="mt-1 font-mono text-xs text-[#363a50]">
                things i&apos;ve built
              </p>
            </div>
            <Link
              href="/projects"
              className="flex items-center gap-1.5 font-mono text-xs text-[#6b6f88] transition-colors duration-200 hover:text-[#7effa0]"
            >
              all projects
              <ArrowRight size={12} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {PROJECTS.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      {articles.length > 0 && (
        <section className="py-20 border-t border-[#1c1f2e]">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="mb-10 flex items-center justify-between"
            >
              <div>
                <h2 className="font-mono text-xl font-semibold text-[#e4e6f0]">
                  <span className="text-[#7effa0]">$ cat</span> recent-posts
                </h2>
                <p className="mt-1 font-mono text-xs text-[#363a50]">
                  latest from the blog
                </p>
              </div>
              <Link
                href="/articles"
                className="flex items-center gap-1.5 font-mono text-xs text-[#6b6f88] transition-colors duration-200 hover:text-[#7effa0]"
              >
                all articles
                <ArrowRight size={12} />
              </Link>
            </motion.div>

            <div className="space-y-3">
              {articles.map((article, i) => (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Link
                    href={`/articles/${article.slug}`}
                    className="group flex items-start justify-between gap-4 rounded-xl border border-[#1c1f2e] bg-[#0d0f16] p-4 transition-all duration-200 hover:border-[#7effa030] hover:bg-[#0d0f16]"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-mono text-xs text-[#363a50]">
                          {formatDateShort(article.frontmatter.date)}
                        </span>
                        {article.frontmatter.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-sm bg-[#141720] px-1.5 py-0.5 font-mono text-xs text-[#6b6f88]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-mono text-sm font-medium text-[#e4e6f0] transition-colors duration-200 group-hover:text-[#7effa0]">
                        {article.frontmatter.title}
                      </h3>
                      <p className="mt-1 text-xs text-[#6b6f88] line-clamp-1">
                        {article.frontmatter.description}
                      </p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="mt-1 shrink-0 text-[#363a50] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#7effa0]"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <Link
        href={project.href}
        className="group flex h-full flex-col rounded-xl border border-[#1c1f2e] bg-[#0d0f16] p-5 transition-all duration-200 hover:border-[#7effa030] hover:shadow-[0_0_24px_#7effa008]"
      >
        <div className="mb-3 flex items-start justify-between">
          <h3 className="font-mono text-sm font-semibold text-[#e4e6f0] transition-colors duration-200 group-hover:text-[#7effa0]">
            {project.title}
          </h3>
          <ExternalLink
            size={12}
            className="mt-0.5 shrink-0 text-[#363a50] opacity-0 transition-all duration-200 group-hover:opacity-100"
          />
        </div>

        <p className="mb-4 flex-1 text-xs leading-relaxed text-[#6b6f88]">
          {project.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-sm bg-[#141720] px-1.5 py-0.5 font-mono text-xs text-[#363a50]"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-[#363a50]">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: project.langColor }}
            />
            <span className="font-mono text-xs">{project.lang}</span>
            {project.stars && (
              <>
                <Star size={10} className="ml-1" />
                <span className="font-mono text-xs">{project.stars}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
