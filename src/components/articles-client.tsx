"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
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
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="mb-2 font-mono text-xs text-[#7effa0]">
            ~/articles
          </div>
          <h1 className="mb-3 font-mono text-3xl font-bold tracking-tight text-[#e4e6f0]">
            Articles
          </h1>
          <p className="text-[#6b6f88]">
            Writing about systems programming, compilers, Go, Rust, and
            developer tooling. {articles.length} posts so far.
          </p>
        </motion.div>

        {/* Tags filter */}
        {allTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 flex flex-wrap gap-2"
          >
            <button
              onClick={() => setActiveTag(null)}
              className={cn(
                "rounded-md px-3 py-1 font-mono text-xs transition-all duration-200",
                activeTag === null
                  ? "bg-[#7effa010] text-[#7effa0] border border-[#7effa030]"
                  : "border border-[#1c1f2e] text-[#6b6f88] hover:text-[#e4e6f0] hover:border-[#252836]"
              )}
            >
              all
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={cn(
                  "rounded-md px-3 py-1 font-mono text-xs transition-all duration-200",
                  activeTag === tag
                    ? "bg-[#7effa010] text-[#7effa0] border border-[#7effa030]"
                    : "border border-[#1c1f2e] text-[#6b6f88] hover:text-[#e4e6f0] hover:border-[#252836]"
                )}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        )}

        {/* Articles list */}
        <div className="space-y-px">
          {filtered.map((article, i) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <Link
                href={`/articles/${article.slug}`}
                className="group block border-b border-[#1c1f2e] py-6 transition-all duration-200 hover:border-[#252836]"
              >
                <div className="flex items-start gap-6">
                  {/* Date */}
                  <div className="hidden w-28 shrink-0 font-mono text-xs text-[#363a50] sm:block pt-0.5">
                    {formatDateShort(article.frontmatter.date)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-2 sm:hidden font-mono text-xs text-[#363a50]">
                      {formatDateShort(article.frontmatter.date)}
                    </div>
                    <h2 className="mb-1.5 font-mono text-base font-semibold text-[#e4e6f0] transition-colors duration-200 group-hover:text-[#7effa0]">
                      {article.frontmatter.title}
                    </h2>
                    <p className="mb-3 text-sm leading-relaxed text-[#6b6f88]">
                      {article.frontmatter.description}
                    </p>
                    <div className="flex items-center gap-3">
                      {article.frontmatter.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-xs text-[#363a50]"
                        >
                          #{tag}
                        </span>
                      ))}
                      <span className="font-mono text-xs text-[#363a50]">
                        {article.readingTime}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ArrowRight
                    size={14}
                    className="mt-1 shrink-0 text-[#363a50] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#7effa0]"
                  />
                </div>
              </Link>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="py-16 text-center font-mono text-sm text-[#363a50]">
              no articles found for &quot;{activeTag}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
