"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Code2,
  FolderGit2,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
} from "lucide-react";
import { search, type SearchItem, type FuzzyResult } from "@/lib/search";

const TYPE_META = {
  article: { label: "article", Icon: FileText, color: "var(--color-blue)" },
  snippet: { label: "snippet", Icon: Code2, color: "var(--color-green)" },
  project: { label: "project", Icon: FolderGit2, color: "var(--color-mauve)" },
} as const;

const TABS = [
  { id: "all", label: "all" },
  { id: "article", label: "articles" },
  { id: "snippet", label: "snippets" },
  { id: "project", label: "projects" },
] as const;

function Highlighted({
  text,
  indices,
}: {
  text: string;
  indices: number[];
}) {
  if (indices.length === 0) return <>{text}</>;
  const set = new Set(indices);
  return (
    <>
      {Array.from(text).map((ch, i) =>
        set.has(i) ? (
          <span
            key={i}
            className="font-semibold"
            style={{ color: "var(--color-peach)" }}
          >
            {ch}
          </span>
        ) : (
          <span key={i}>{ch}</span>
        ),
      )}
    </>
  );
}

export function SearchModal({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<string>("all");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const results = useMemo(() => search(items, query, tab), [items, query, tab]);

  // ── Open / close ──────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSel(0);
    // auto-pick tab from current route
    if (pathname.startsWith("/articles")) setTab("article");
    else if (pathname.startsWith("/snippets")) setTab("snippet");
    else if (pathname.startsWith("/projects")) setTab("project");
    else setTab("all");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [open, pathname]);

  // reset selection on filter change
  useEffect(() => setSel(0), [query, tab]);

  // scroll active into view
  useEffect(() => {
    const el = listRef.current?.children[sel] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  // ── Keyboard shortcut: Cmd+K or / ────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (
        e.key === "/" &&
        !open &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Nav button custom event
  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener("open-search", handler);
    return () => document.removeEventListener("open-search", handler);
  }, []);

  // lock scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSel((i) => Math.min(i + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSel((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (results[sel]) go(results[sel].item.href);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab": {
        e.preventDefault();
        const ids = TABS.map((t) => t.id as string);
        const cur = ids.indexOf(tab);
        const next = e.shiftKey
          ? (cur - 1 + ids.length) % ids.length
          : (cur + 1) % ids.length;
        setTab(ids[next]);
        break;
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="search-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="fixed inset-0 z-50"
            style={{
              backgroundColor: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <motion.div
            key="search-dialog"
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.12 }}
            className="fixed left-1/2 top-[12vh] z-50 w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2"
          >
            <div
              className="flex max-h-[70vh] flex-col overflow-hidden rounded-lg border shadow-2xl"
              style={{
                backgroundColor: "var(--color-mantle)",
                borderColor: "var(--color-surface-0)",
              }}
              onKeyDown={onKeyDown}
            >
              {/* ── Input ──────────────────────────────────────── */}
              <div
                className="flex items-center gap-3 border-b px-4 py-3"
                style={{ borderColor: "var(--color-surface-0)" }}
              >
                <span
                  className="select-none text-sm font-bold"
                  style={{ color: "var(--color-peach)" }}
                >
                  &gt;
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40"
                  style={{
                    color: "var(--color-text)",
                    fontFamily:
                      "var(--font-geist-mono), ui-monospace, monospace",
                  }}
                  spellCheck={false}
                  autoComplete="off"
                />
                <kbd
                  className="hidden rounded px-1.5 py-0.5 text-[10px] sm:inline-block"
                  style={{
                    backgroundColor: "var(--color-surface-0)",
                    color: "var(--color-overlay-0)",
                  }}
                >
                  esc
                </kbd>
              </div>

              {/* ── Tabs ───────────────────────────────────────── */}
              <div
                className="flex items-center gap-1 border-b px-4 py-2"
                style={{ borderColor: "var(--color-surface-0)" }}
              >
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className="rounded px-2 py-0.5 text-xs transition-colors"
                    style={
                      tab === t.id
                        ? {
                            backgroundColor: "var(--color-peach)",
                            color: "var(--color-base)",
                          }
                        : { color: "var(--color-overlay-1)" }
                    }
                    tabIndex={-1}
                  >
                    {t.label}
                  </button>
                ))}
                <span
                  className="ml-auto text-[10px]"
                  style={{ color: "var(--color-overlay-0)" }}
                >
                  tab to switch
                </span>
              </div>

              {/* ── Results ────────────────────────────────────── */}
              <div
                ref={listRef}
                className="flex-1 overflow-y-auto"
                style={{ maxHeight: "50vh" }}
              >
                {results.length === 0 ? (
                  <div
                    className="px-4 py-14 text-center text-xs"
                    style={{ color: "var(--color-overlay-0)" }}
                  >
                    {query
                      ? `no results for "${query}"`
                      : "nothing here yet"}
                  </div>
                ) : (
                  results.map((match, i) => (
                    <ResultRow
                      key={`${match.item.type}-${match.item.href}`}
                      match={match}
                      active={i === sel}
                      onHover={() => setSel(i)}
                      onSelect={() => go(match.item.href)}
                    />
                  ))
                )}
              </div>

              {/* ── Footer ─────────────────────────────────────── */}
              <div
                className="flex items-center justify-between border-t px-4 py-2"
                style={{ borderColor: "var(--color-surface-0)" }}
              >
                <div
                  className="flex items-center gap-3 text-[10px]"
                  style={{ color: "var(--color-overlay-0)" }}
                >
                  <span className="flex items-center gap-1">
                    <ArrowUp size={10} />
                    <ArrowDown size={10} /> navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <CornerDownLeft size={10} /> open
                  </span>
                  <span>tab filter</span>
                </div>
                <span
                  className="text-[10px]"
                  style={{ color: "var(--color-overlay-0)" }}
                >
                  {results.length} result{results.length !== 1 && "s"}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Single result row ──────────────────────────────────────── */
function ResultRow({
  match,
  active,
  onHover,
  onSelect,
}: {
  match: FuzzyResult;
  active: boolean;
  onHover: () => void;
  onSelect: () => void;
}) {
  const { item } = match;
  const meta = TYPE_META[item.type];
  const { Icon } = meta;

  return (
    <button
      onClick={onSelect}
      onMouseEnter={onHover}
      className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors"
      style={{
        backgroundColor: active ? "var(--color-surface-0)" : "transparent",
      }}
      tabIndex={-1}
    >
      <Icon size={14} className="mt-0.5 shrink-0" style={{ color: meta.color }} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span
            className="truncate text-sm"
            style={{
              color: active ? "var(--color-text)" : "var(--color-subtext-1)",
            }}
          >
            <Highlighted text={item.title} indices={match.titleIndices} />
          </span>
          <span
            className="shrink-0 text-[10px] uppercase"
            style={{ color: meta.color }}
          >
            {meta.label}
          </span>
        </div>
        <p
          className="mt-0.5 truncate text-xs"
          style={{ color: "var(--color-overlay-1)" }}
        >
          <Highlighted text={item.description} indices={match.descIndices} />
        </p>
        {item.tags.length > 0 && (
          <div className="mt-1 flex gap-1.5">
            {item.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[10px]"
                style={{ color: "var(--color-overlay-0)" }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {active && (
        <CornerDownLeft
          size={12}
          className="mt-1 shrink-0"
          style={{ color: "var(--color-overlay-0)" }}
        />
      )}
    </button>
  );
}
