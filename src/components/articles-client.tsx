"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Article } from "@/lib/mdx";
import { formatDateShort } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ArticlesClientProps {
  articles: Article[];
}

export function ArticlesClient({ articles }: ArticlesClientProps) {
  const allTags = Array.from(
    new Set(articles.flatMap((a) => a.frontmatter.tags ?? []))
  );
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? articles.filter((a) => a.frontmatter.tags?.includes(activeTag))
    : articles;

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
            articles
          </h1>
          <p className="text-sm text-overlay-1">
            writing about systems programming, compilers, and developer
            tooling. {articles.length} posts.
          </p>
        </motion.div>

        {allTags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={cn(
                "text-xs px-2.5 py-1 rounded transition-colors",
                activeTag === null
                  ? "bg-surface-0 text-peach"
                  : "text-overlay-0 hover:text-subtext-1"
              )}
            >
              all
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={cn(
                  "text-xs px-2.5 py-1 rounded transition-colors lowercase",
                  activeTag === tag
                    ? "bg-surface-0 text-peach"
                    : "text-overlay-0 hover:text-subtext-1"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <div>
          {filtered.map((article, i) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Link
                href={`/articles/${article.slug}`}
                className="group block py-4 border-b border-surface-0 last:border-b-0"
              >
                <div className="flex items-baseline gap-6">
                  <span className="text-xs text-overlay-0 shrink-0 tabular-nums hidden sm:block w-20">
                    {formatDateShort(article.frontmatter.date)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-overlay-0 sm:hidden block mb-1">
                      {formatDateShort(article.frontmatter.date)}
                    </span>
                    <h2 className="text-sm text-subtext-1 group-hover:text-peach transition-colors">
                      {article.frontmatter.title}
                    </h2>
                    <p className="text-sm text-overlay-1 mt-0.5 line-clamp-1">
                      {article.frontmatter.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-overlay-0">
                      {article.frontmatter.tags?.map((tag) => (
                        <span key={tag} className="lowercase">{tag}</span>
                      ))}
                      <span className="text-surface-2">/</span>
                      <span>{article.readingTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="py-16 text-center text-sm text-overlay-0">
              no articles found for &quot;{activeTag}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
