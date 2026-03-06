"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Loader2, ChevronDown, Trash2, Share2, Check, Link } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { rust } from "@codemirror/lang-rust";
import { cpp } from "@codemirror/lang-cpp";
import { go } from "@codemirror/lang-go";
import { catppuccinTheme } from "@/lib/playground/themes";
import {
  execute,
  LANGUAGES,
  DEFAULT_CODE,
  type Language,
  type OutputLine,
} from "@/lib/playground/executor";
import { cn } from "@/lib/utils";
import { decodeSnippet, buildShareUrl } from "@/lib/playground/share";

function getLanguageExtension(lang: Language) {
  switch (lang) {
    case "javascript":
      return javascript();
    case "typescript":
      return javascript({ typescript: true });
    case "rust":
      return rust();
    case "c":
      return cpp();
    case "go":
      return go();
  }
}

function OutputPanel({
  output,
  running,
  onClear,
}: {
  output: OutputLine[];
  running: boolean;
  onClear: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div
      className="rounded-md border overflow-hidden"
      style={{
        borderColor: "var(--color-surface-0)",
        backgroundColor: "var(--color-mantle)",
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b"
        style={{ borderColor: "var(--color-surface-0)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-xs"
            style={{ color: "var(--color-overlay-1)" }}
          >
            output
          </span>
          {running && (
            <Loader2
              size={11}
              className="animate-spin"
              style={{ color: "var(--color-peach)" }}
            />
          )}
        </div>
        {output.length > 0 && (
          <button
            onClick={onClear}
            className="rounded p-1 transition-colors"
            style={{ color: "var(--color-overlay-0)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-text)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-overlay-0)")
            }
            aria-label="Clear output"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="overflow-y-auto p-3 font-mono text-xs leading-relaxed"
        style={{ maxHeight: "12rem", minHeight: "4rem" }}
      >
        {output.length === 0 && !running && (
          <span style={{ color: "var(--color-overlay-0)" }}>
            run your code to see output here
          </span>
        )}
        {output.map((line, i) => (
          <div
            key={i}
            className="whitespace-pre-wrap break-all"
            style={{
              color:
                line.level === "error"
                  ? "var(--color-red)"
                  : line.level === "warn"
                    ? "var(--color-yellow)"
                    : "var(--color-text)",
            }}
          >
            {line.text}
          </div>
        ))}
        {running && output.length === 0 && (
          <span style={{ color: "var(--color-overlay-0)" }}>running...</span>
        )}
      </div>
    </div>
  );
}

export function PlaygroundClient() {
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<Language>("javascript");
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [running, setRunning] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSharedSnippet, setIsSharedSnippet] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const codeCache = useRef<Record<string, string>>({});
  const sharedLoaded = useRef(false);

  // Load shared snippet from URL on mount
  useEffect(() => {
    if (sharedLoaded.current) return;
    sharedLoaded.current = true;

    const encoded = searchParams.get("code");
    if (!encoded) return;

    const snippet = decodeSnippet(encoded);
    if (!snippet) return;

    codeCache.current[snippet.language] = snippet.code;
    setLanguage(snippet.language);
    setIsSharedSnippet(true);
  }, [searchParams]);

  const runCodeRef = useRef<() => void>(() => {});

  const runCode = useCallback(async () => {
    if (running || !viewRef.current) return;
    const code = viewRef.current.state.doc.toString();
    setRunning(true);
    setOutput([]);
    try {
      const result = await execute(language, code);
      setOutput(result.output);
    } finally {
      setRunning(false);
    }
  }, [language, running]);

  runCodeRef.current = runCode;

  useEffect(() => {
    if (!editorRef.current) return;

    const runKeymap = keymap.of([
      {
        key: "Mod-Enter",
        run: () => {
          runCodeRef.current();
          return true;
        },
      },
    ]);

    const startDoc = codeCache.current[language] ?? DEFAULT_CODE[language];

    const state = EditorState.create({
      doc: startDoc,
      extensions: [
        basicSetup,
        getLanguageExtension(language),
        ...catppuccinTheme(),
        runKeymap,
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            codeCache.current[language] = update.state.doc.toString();
          }
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const switchLanguage = useCallback(
    (lang: Language) => {
      if (viewRef.current) {
        codeCache.current[language] = viewRef.current.state.doc.toString();
      }
      setLanguage(lang);
      setDropdownOpen(false);
      setOutput([]);
    },
    [language]
  );

  const shareSnippet = useCallback(async () => {
    if (!viewRef.current) return;
    const code = viewRef.current.state.doc.toString();
    const url = buildShareUrl(language, code);

    window.history.replaceState(null, "", `/playground?code=${url.split("?code=")[1]}`);

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments where clipboard API isn't available
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [language]);

  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(/Mac/.test(navigator.userAgent));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-28 pb-20"
    >
      <div className="mx-auto max-w-2xl px-6">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-xl font-semibold tracking-tight"
            style={{ color: "var(--color-text)" }}
          >
            playground
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-overlay-1)" }}
          >
            write and run code in the browser
          </p>
        </div>

        {/* Shared snippet banner */}
        {isSharedSnippet && (
          <div
            className="mb-3 flex items-center gap-2 rounded-md border px-3 py-2 text-xs"
            style={{
              borderColor: "var(--color-surface-0)",
              backgroundColor: "var(--color-mantle)",
              color: "var(--color-overlay-1)",
            }}
          >
            <Link size={12} style={{ color: "var(--color-peach)" }} />
            <span>viewing a shared snippet</span>
            <button
              onClick={() => {
                setIsSharedSnippet(false);
                window.history.replaceState(null, "", "/playground");
              }}
              className="ml-auto text-xs transition-colors"
              style={{ color: "var(--color-overlay-0)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-overlay-0)")
              }
            >
              dismiss
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className="mb-3 flex items-center justify-between gap-3">
          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
              className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors"
              style={{
                borderColor: "var(--color-surface-0)",
                backgroundColor: "var(--color-mantle)",
                color: "var(--color-text)",
              }}
            >
              {LANGUAGES.find((l) => l.id === language)?.label}
              <ChevronDown
                size={12}
                className={cn(
                  "transition-transform",
                  dropdownOpen && "rotate-180"
                )}
                style={{ color: "var(--color-overlay-0)" }}
              />
            </button>

            {dropdownOpen && (
              <div
                className="absolute left-0 top-full z-10 mt-1 min-w-[140px] rounded-md border py-1 shadow-lg"
                style={{
                  borderColor: "var(--color-surface-0)",
                  backgroundColor: "var(--color-mantle)",
                }}
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => switchLanguage(lang.id)}
                    className={cn(
                      "block w-full px-3 py-1.5 text-left text-xs transition-colors",
                      language === lang.id
                        ? ""
                        : "hover:bg-[var(--color-surface-0)]"
                    )}
                    style={{
                      color:
                        language === lang.id
                          ? "var(--color-peach)"
                          : "var(--color-subtext-1)",
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Share button */}
            <button
              onClick={shareSnippet}
              className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors"
              style={{
                borderColor: "var(--color-surface-0)",
                backgroundColor: "var(--color-mantle)",
                color: copied ? "var(--color-green)" : "var(--color-subtext-1)",
              }}
            >
              {copied ? <Check size={12} /> : <Share2 size={12} />}
              {copied ? "copied!" : "share"}
            </button>

            {/* Run button */}
            <button
              onClick={runCode}
              disabled={running}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor: "var(--color-peach)",
                color: "var(--color-base)",
              }}
            >
              {running ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Play size={12} />
              )}
              {running ? "running" : "run"}
              <kbd
                className="ml-1 hidden rounded px-1 py-0.5 text-[10px] opacity-70 sm:inline-block"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--color-base) 30%, transparent)",
                }}
              >
                {isMac ? "⌘" : "Ctrl"}↵
              </kbd>
            </button>
          </div>
        </div>

        {/* Editor */}
        <div
          className="overflow-hidden rounded-md border"
          style={{
            borderColor: "var(--color-surface-0)",
          }}
        >
          <div ref={editorRef} className="min-h-[280px] max-h-[500px] overflow-y-auto" />
        </div>

        {/* Output */}
        <div className="mt-3">
          <OutputPanel
            output={output}
            running={running}
            onClear={() => setOutput([])}
          />
        </div>

        {/* Footer hint */}
        <p
          className="mt-4 text-center text-xs"
          style={{ color: "var(--color-overlay-0)" }}
        >
          {language === "javascript" || language === "typescript"
            ? "runs client-side in your browser"
            : `compiles via ${language === "rust" ? "play.rust-lang.org" : language === "go" ? "go.dev/play" : "wandbox.org"}`}
        </p>
      </div>
    </motion.div>
  );
}
