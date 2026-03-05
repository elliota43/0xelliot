"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Snippet } from "@/lib/mdx";
import { formatDateShort } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SnippetsClientProps {
  snippets: Snippet[];
}

export function SnippetsClient({ snippets }: SnippetsClientProps) {
  const allLangs = Array.from(
    new Set(snippets.map((s) => s.frontmatter.language))
  );
  const [activeLang, setActiveLang] = useState<string | null>(null);

  const filtered = activeLang
    ? snippets.filter((s) => s.frontmatter.language === activeLang)
    : snippets;

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
            snippets
          </h1>
          <p className="text-sm text-overlay-1">
            short code patterns and reference material.
          </p>
        </motion.div>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveLang(null)}
            className={cn(
              "text-xs px-2.5 py-1 rounded transition-colors",
              activeLang === null
                ? "bg-surface-0 text-peach"
                : "text-overlay-0 hover:text-subtext-1"
            )}
          >
            all
          </button>
          {allLangs.map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang === activeLang ? null : lang)}
              className={cn(
                "text-xs px-2.5 py-1 rounded transition-colors lowercase",
                activeLang === lang
                  ? "bg-surface-0 text-peach"
                  : "text-overlay-0 hover:text-subtext-1"
              )}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((snippet, i) => (
            <motion.div
              key={snippet.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Link
                href={`/snippets/${snippet.slug}`}
                className="group block border border-surface-0 rounded-md p-4 hover:border-surface-1 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-1.5">
                  <h3 className="text-sm text-subtext-1 group-hover:text-peach transition-colors">
                    {snippet.frontmatter.title}
                  </h3>
                  <div className="flex items-center gap-3 shrink-0 text-xs text-overlay-0">
                    <span className="lowercase">
                      {snippet.frontmatter.language}
                    </span>
                    <span className="hidden sm:inline">
                      {formatDateShort(snippet.frontmatter.date)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-overlay-1">
                  {snippet.frontmatter.description}
                </p>
                {snippet.frontmatter.tags &&
                  snippet.frontmatter.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      {snippet.frontmatter.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-overlay-0 bg-surface-0 px-1.5 py-0.5 rounded lowercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
              </Link>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="py-16 text-center text-sm text-overlay-0">
              no snippets found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
