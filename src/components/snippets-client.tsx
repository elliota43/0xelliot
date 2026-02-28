"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronRight, Code2 } from "lucide-react";
import type { Snippet } from "@/lib/mdx";
import { formatDateShort } from "@/lib/utils";
import { cn } from "@/lib/utils";

const LANG_COLORS: Record<string, string> = {
  Go: "#00ADD8",
  Rust: "#CE422B",
  C: "#555555",
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  Python: "#3572A5",
  PHP: "#4F5D95",
  Shell: "#89E051",
  SQL: "#e38c00",
};

interface SnippetsClientProps {
  snippets: Snippet[];
}

export function SnippetsClient({ snippets }: SnippetsClientProps) {
  const [selected, setSelected] = useState<Snippet | null>(
    snippets[0] ?? null
  );

  const allLangs = Array.from(
    new Set(snippets.map((s) => s.frontmatter.language))
  );
  const [activeLang, setActiveLang] = useState<string | null>(null);

  const filtered = activeLang
    ? snippets.filter((s) => s.frontmatter.language === activeLang)
    : snippets;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mb-2 font-mono text-xs text-[#7effa0]">~/snippets</div>
          <h1 className="mb-3 font-mono text-3xl font-bold tracking-tight text-[#e4e6f0]">
            Snippets
          </h1>
          <p className="text-[#6b6f88]">
            Short, focused code patterns and micro-articles. Click a snippet to
            preview.
          </p>
        </motion.div>

        {/* IDE layout */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="overflow-hidden rounded-xl border border-[#1c1f2e] bg-[#0d0f16]"
        >
          {/* IDE title bar */}
          <div className="flex items-center gap-2 border-b border-[#1c1f2e] px-4 py-2.5">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#28ca41]" />
            </div>
            <div className="flex flex-1 items-center gap-1 pl-2">
              <Code2 size={12} className="text-[#363a50]" />
              <span className="font-mono text-xs text-[#363a50]">
                {selected
                  ? `snippets/${selected.slug}.${selected.frontmatter.language.toLowerCase()}`
                  : "snippets/"}
              </span>
            </div>
            {/* Lang filter pills */}
            <div className="hidden items-center gap-1 sm:flex">
              {allLangs.slice(0, 4).map((lang) => (
                <button
                  key={lang}
                  onClick={() =>
                    setActiveLang(lang === activeLang ? null : lang)
                  }
                  className={cn(
                    "rounded px-2 py-0.5 font-mono text-xs transition-all duration-200",
                    activeLang === lang
                      ? "text-[#e4e6f0]"
                      : "text-[#363a50] hover:text-[#6b6f88]"
                  )}
                  style={
                    activeLang === lang
                      ? { color: LANG_COLORS[lang] ?? "#7effa0" }
                      : {}
                  }
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="flex min-h-[500px]">
            {/* File tree / sidebar */}
            <div className="w-56 shrink-0 border-r border-[#1c1f2e] overflow-y-auto">
              <div className="py-2">
                <div className="px-3 pb-1.5 pt-1 font-mono text-xs uppercase tracking-widest text-[#363a50]">
                  explorer
                </div>
                <div className="space-y-0.5 px-1">
                  {filtered.map((snippet, i) => {
                    const isSelected = selected?.slug === snippet.slug;
                    const color =
                      LANG_COLORS[snippet.frontmatter.language] ?? "#7effa0";
                    return (
                      <motion.button
                        key={snippet.slug}
                        onClick={() => setSelected(snippet)}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.05 }}
                        className={cn(
                          "group flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left transition-all duration-150",
                          isSelected
                            ? "bg-[#141720] text-[#e4e6f0]"
                            : "text-[#6b6f88] hover:bg-[#141720] hover:text-[#e4e6f0]"
                        )}
                      >
                        <ChevronRight
                          size={10}
                          className={cn(
                            "shrink-0 transition-transform duration-150",
                            isSelected ? "rotate-90 text-[#7effa0]" : "text-[#363a50]"
                          )}
                        />
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="truncate font-mono text-xs">
                          {snippet.slug}
                        </span>
                      </motion.button>
                    );
                  })}
                  {filtered.length === 0 && (
                    <p className="px-3 py-2 font-mono text-xs text-[#363a50]">
                      no snippets
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Preview panel */}
            <div className="flex-1 min-w-0 overflow-auto">
              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div
                    key={selected.slug}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-6"
                  >
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="mb-1 font-mono text-lg font-semibold text-[#e4e6f0]">
                          {selected.frontmatter.title}
                        </h2>
                        <p className="text-sm text-[#6b6f88]">
                          {selected.frontmatter.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="font-mono text-xs text-[#363a50]">
                          {formatDateShort(selected.frontmatter.date)}
                        </span>
                        <Link
                          href={`/snippets/${selected.slug}`}
                          className="rounded-md border border-[#1c1f2e] px-2.5 py-1 font-mono text-xs text-[#6b6f88] transition-all duration-200 hover:border-[#7effa030] hover:text-[#7effa0]"
                        >
                          open →
                        </Link>
                      </div>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {selected.frontmatter.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-sm bg-[#141720] px-2 py-0.5 font-mono text-xs text-[#363a50]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Preview: show first ~20 lines of raw content */}
                    <div className="rounded-lg border border-[#1c1f2e] bg-[#08090e] p-4 overflow-x-auto">
                      <pre className="font-mono text-xs leading-relaxed text-[#6b6f88]">
                        {selected.content
                          .split("\n")
                          .slice(0, 22)
                          .join("\n")
                          .trim()}
                        {selected.content.split("\n").length > 22 && (
                          <span className="text-[#363a50]">{"\n"}...</span>
                        )}
                      </pre>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex h-full items-center justify-center p-12"
                  >
                    <p className="font-mono text-sm text-[#363a50]">
                      select a snippet to preview
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
