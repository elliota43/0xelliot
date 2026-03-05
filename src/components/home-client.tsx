"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/lib/mdx";
import { formatDateShort } from "@/lib/utils";

interface Project {
  title: string;
  description: string;
  href: string;
  lang: string;
}

const PROJECTS: Project[] = [
  {
    title: "git clone in go",
    description:
      "from-scratch implementation of git's core plumbing. parses pack files, resolves delta chains, handles the http smart protocol.",
    href: "/projects",
    lang: "go",
  },
  {
    title: "vim-style text editor",
    description:
      "modal text editor in rust using raw terminal i/o. normal, insert, and visual modes with a gap buffer for efficient editing.",
    href: "/projects",
    lang: "rust",
  },
  {
    title: "lox vm in c",
    description:
      "bytecode virtual machine for the lox language. mark-and-sweep gc, closures, and a single-pass compiler.",
    href: "/projects",
    lang: "c",
  },
];

interface HomeClientProps {
  articles: Article[];
}

export function HomeClient({ articles }: HomeClientProps) {
  return (
    <div>
      <section className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-semibold tracking-tight mb-4 lg:text-4xl">
              elliot anderson
            </h1>
            <p className="text-subtext-0 leading-relaxed mb-4 max-w-lg">
              software engineer building compilers, systems tools, and things
              that run close to the metal. i write about what i learn here.
            </p>
            <p className="text-sm text-overlay-0 mb-8">
              available for freelance &mdash; march 2026
            </p>
            <div className="flex items-center gap-5 text-sm">
              <a
                href="https://github.com/elliota43"
                target="_blank"
                rel="noopener noreferrer"
                className="text-overlay-1 underline underline-offset-4 decoration-surface-1 hover:text-peach hover:decoration-peach transition-colors"
              >
                github
              </a>
              <a
                href="mailto:hello@elliotanderson.dev"
                className="text-overlay-1 underline underline-offset-4 decoration-surface-1 hover:text-peach hover:decoration-peach transition-colors"
              >
                email
              </a>
              <Link
                href="/articles"
                className="text-overlay-1 underline underline-offset-4 decoration-surface-1 hover:text-peach hover:decoration-peach transition-colors"
              >
                blog
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-6">
        <hr className="border-surface-0" />
      </div>

      <section className="py-16 px-6">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-sm text-overlay-1">selected work</h2>
              <Link
                href="/projects"
                className="text-sm text-overlay-0 hover:text-peach transition-colors"
              >
                all
                <ArrowRight size={12} className="inline ml-1 -mt-px" />
              </Link>
            </div>

            <div className="space-y-3">
              {PROJECTS.map((project) => (
                <Link
                  key={project.title}
                  href={project.href}
                  className="group block border border-surface-0 rounded-md p-4 hover:border-surface-1 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-1.5">
                    <h3 className="text-sm font-medium text-subtext-1 group-hover:text-peach transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-xs text-overlay-0 shrink-0">
                      {project.lang}
                    </span>
                  </div>
                  <p className="text-sm text-overlay-1 leading-relaxed">
                    {project.description}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {articles.length > 0 && (
        <>
          <div className="mx-auto max-w-2xl px-6">
            <hr className="border-surface-0" />
          </div>

          <section className="py-16 px-6">
            <div className="mx-auto max-w-2xl">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-baseline justify-between mb-6">
                  <h2 className="text-sm text-overlay-1">recent writing</h2>
                  <Link
                    href="/articles"
                    className="text-sm text-overlay-0 hover:text-peach transition-colors"
                  >
                    all
                    <ArrowRight size={12} className="inline ml-1 -mt-px" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {articles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/articles/${article.slug}`}
                      className="group block"
                    >
                      <div className="flex items-baseline gap-6">
                        <span className="text-xs text-overlay-0 shrink-0 tabular-nums hidden sm:block w-20">
                          {formatDateShort(article.frontmatter.date)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-overlay-0 sm:hidden block mb-1">
                            {formatDateShort(article.frontmatter.date)}
                          </span>
                          <h3 className="text-sm text-subtext-1 group-hover:text-peach transition-colors">
                            {article.frontmatter.title}
                          </h3>
                          <p className="text-sm text-overlay-1 mt-0.5 line-clamp-1">
                            {article.frontmatter.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
