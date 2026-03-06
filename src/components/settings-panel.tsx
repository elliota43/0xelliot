"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Check } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { THEMES, CATEGORIES, type Theme } from "@/lib/themes";
import { cn } from "@/lib/utils";

function ThemeCard({
  theme,
  isActive,
  onSelect,
  onPreview,
  onPreviewEnd,
}: {
  theme: Theme;
  isActive: boolean;
  onSelect: (id: string) => void;
  onPreview: (id: string) => void;
  onPreviewEnd: () => void;
}) {
  const { base, surface0, text, peach, blue } = theme.colors;

  return (
    <button
      onClick={() => onSelect(theme.id)}
      onMouseEnter={() => onPreview(theme.id)}
      onMouseLeave={onPreviewEnd}
      onFocus={() => onPreview(theme.id)}
      onBlur={onPreviewEnd}
      className={cn(
        "group relative w-full rounded-md border p-3 text-left transition-all duration-150",
        isActive
          ? "border-[var(--color-peach)] bg-[var(--color-surface-0)]"
          : "border-[var(--color-surface-0)] bg-[var(--color-base)] hover:border-[var(--color-surface-2)] hover:bg-[var(--color-surface-0)]"
      )}
      aria-label={`Select ${theme.name} theme`}
      aria-pressed={isActive}
    >
      {/* Color swatch strip */}
      <div className="mb-2.5 flex h-5 overflow-hidden rounded gap-0.5">
        {[base, surface0, text, peach, blue].map((color, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Theme name + active indicator */}
      <div className="flex items-center justify-between gap-1">
        <span
          className="truncate text-xs leading-none"
          style={{ color: "var(--color-subtext-1)" }}
        >
          {theme.name}
        </span>
        {isActive && (
          <Check
            size={11}
            className="shrink-0"
            style={{ color: "var(--color-peach)" }}
          />
        )}
      </div>
    </button>
  );
}

export function SettingsPanel() {
  const { currentTheme, setTheme, panelOpen, closePanel, previewTheme } =
    useTheme();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Reset search when panel closes
  useEffect(() => {
    if (!panelOpen) {
      setSearch("");
      setActiveCategory("all");
    }
  }, [panelOpen]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (panelOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [panelOpen]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return THEMES.filter((t) => {
      const matchesCategory =
        activeCategory === "all" || t.category === activeCategory;
      const matchesSearch =
        !q || t.name.toLowerCase().includes(q) || t.id.includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const revertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePreview = useCallback(
    (id: string) => {
      if (revertTimerRef.current) {
        clearTimeout(revertTimerRef.current);
        revertTimerRef.current = null;
      }
      previewTheme(id);
    },
    [previewTheme]
  );

  const handlePreviewEnd = useCallback(() => {
    revertTimerRef.current = setTimeout(() => {
      previewTheme(null);
      revertTimerRef.current = null;
    }, 150);
  }, [previewTheme]);

  useEffect(() => {
    return () => {
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {panelOpen && (
        <>
          {/* Scrim */}
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={closePanel}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-80 flex-col shadow-2xl"
            style={{
              backgroundColor: "var(--color-mantle)",
              borderLeft: "1px solid var(--color-surface-0)",
            }}
            role="dialog"
            aria-label="Theme settings"
            aria-modal="true"
          >
            {/* Header */}
            <div
              className="flex shrink-0 items-center justify-between border-b px-4 py-3"
              style={{ borderColor: "var(--color-surface-0)" }}
            >
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text)" }}
                >
                  theme
                </p>
                <p className="text-xs" style={{ color: "var(--color-overlay-0)" }}>
                  {currentTheme.name}
                </p>
              </div>
              <button
                onClick={closePanel}
                className="rounded p-1.5 transition-colors"
                style={{ color: "var(--color-overlay-1)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-text)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-overlay-1)")
                }
                aria-label="Close theme picker"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search */}
            <div
              className="shrink-0 border-b px-4 py-3"
              style={{ borderColor: "var(--color-surface-0)" }}
            >
              <div
                className="flex items-center gap-2 rounded-md border px-3 py-2"
                style={{
                  backgroundColor: "var(--color-base)",
                  borderColor: "var(--color-surface-0)",
                }}
              >
                <Search
                  size={13}
                  style={{ color: "var(--color-overlay-0)" }}
                  className="shrink-0"
                />
                <input
                  type="text"
                  placeholder="search themes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-xs outline-none"
                  style={{
                    color: "var(--color-text)",
                    fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                  }}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    style={{ color: "var(--color-overlay-0)" }}
                    aria-label="Clear search"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Category chips */}
            <div
              className="shrink-0 border-b px-4 py-2"
              style={{ borderColor: "var(--color-surface-0)" }}
            >
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => {
                  const count =
                    cat.id === "all"
                      ? THEMES.length
                      : THEMES.filter((t) => t.category === cat.id).length;
                  if (count === 0) return null;
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className="rounded px-2 py-0.5 text-xs transition-colors"
                      style={
                        isActive
                          ? {
                              backgroundColor: "var(--color-peach)",
                              color: "var(--color-base)",
                            }
                          : {
                              backgroundColor: "var(--color-surface-0)",
                              color: "var(--color-overlay-1)",
                            }
                      }
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme grid */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {filtered.length === 0 ? (
                <p
                  className="py-8 text-center text-xs"
                  style={{ color: "var(--color-overlay-0)" }}
                >
                  no themes match &ldquo;{search}&rdquo;
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {filtered.map((theme) => (
                    <ThemeCard
                      key={theme.id}
                      theme={theme}
                      isActive={currentTheme.id === theme.id}
                      onSelect={(id) => {
                        setTheme(id);
                        // don't close panel — let them keep browsing
                      }}
                      onPreview={handlePreview}
                      onPreviewEnd={handlePreviewEnd}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="shrink-0 border-t px-4 py-3"
              style={{ borderColor: "var(--color-surface-0)" }}
            >
              <p className="text-xs" style={{ color: "var(--color-overlay-0)" }}>
                {filtered.length} theme{filtered.length !== 1 ? "s" : ""} &middot; hover to preview
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
