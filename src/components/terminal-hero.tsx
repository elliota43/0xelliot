"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface Line {
  type: "input" | "output" | "blank";
  content: string;
  delay?: number;
}

const TERMINAL_LINES: Line[] = [
  { type: "input", content: "whoami", delay: 600 },
  { type: "output", content: "elliot anderson // software engineer", delay: 80 },
  { type: "blank", content: "", delay: 300 },
  { type: "input", content: "cat skills.txt", delay: 500 },
  { type: "output", content: "systems programming  ·  compiler design", delay: 60 },
  { type: "output", content: "distributed systems  ·  developer tooling", delay: 60 },
  { type: "output", content: "Go  ·  Rust  ·  C  ·  TypeScript  ·  PHP", delay: 60 },
  { type: "blank", content: "", delay: 300 },
  { type: "input", content: "ls projects/", delay: 500 },
  { type: "output", content: "git-clone-go/   vim-rust/   lox-vm-c/   laravel-migrations/", delay: 80 },
  { type: "blank", content: "", delay: 300 },
  { type: "input", content: "echo $status", delay: 400 },
  { type: "output", content: "building things I care about.", delay: 60 },
];

function useTypewriter(lines: Line[]) {
  const [displayedLines, setDisplayedLines] = useState<
    { content: string; type: string; done: boolean }[]
  >([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (currentLineIndex >= lines.length) return;

    const line = lines[currentLineIndex];
    const delay = currentChar === 0 ? (line.delay ?? 0) : 0;

    const timeout = setTimeout(
      () => {
        if (line.type !== "input" || currentChar >= line.content.length) {
          // Line is done
          setDisplayedLines((prev) => {
            const updated = [...prev];
            if (updated.length <= currentLineIndex) {
              updated.push({ content: line.content, type: line.type, done: true });
            } else {
              updated[currentLineIndex] = { ...updated[currentLineIndex], done: true };
            }
            return updated;
          });
          setCurrentChar(0);
          setCurrentLineIndex((i) => i + 1);
          setIsTyping(false);
        } else {
          setIsTyping(true);
          const newContent = line.content.slice(0, currentChar + 1);
          setDisplayedLines((prev) => {
            const updated = [...prev];
            if (updated.length <= currentLineIndex) {
              updated.push({ content: newContent, type: line.type, done: false });
            } else {
              updated[currentLineIndex] = { content: newContent, type: line.type, done: false };
            }
            return updated;
          });
          setCurrentChar((c) => c + 1);
        }
      },
      currentChar === 0 ? delay : line.type === "input" ? 55 + Math.random() * 40 : 0
    );

    return () => clearTimeout(timeout);
  }, [currentLineIndex, currentChar, lines]);

  return { displayedLines, isTyping, done: currentLineIndex >= lines.length };
}

export function TerminalHero() {
  const { displayedLines, isTyping, done } = useTypewriter(TERMINAL_LINES);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [displayedLines]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full overflow-hidden rounded-xl border border-[#1c1f2e] bg-[#0d0f16] shadow-2xl"
    >
      {/* Terminal chrome */}
      <div className="flex items-center gap-2 border-b border-[#1c1f2e] px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28ca41]" />
        </div>
        <span className="ml-2 font-mono text-xs text-[#363a50]">
          elliot@dev:~
        </span>
      </div>

      {/* Terminal body */}
      <div className="h-64 overflow-y-auto p-4 font-mono text-sm">
        {displayedLines.map((line, i) => (
          <div key={i} className="mb-0.5">
            {line.type === "input" && (
              <div className="flex items-center gap-2">
                <span className="text-[#7effa0]">❯</span>
                <span className="text-[#e4e6f0]">{line.content}</span>
                {i === displayedLines.length - 1 && !line.done && (
                  <span className="terminal-cursor" />
                )}
              </div>
            )}
            {line.type === "output" && (
              <div className="pl-4 text-[#6b6f88]">{line.content}</div>
            )}
            {line.type === "blank" && <div className="h-2" />}
          </div>
        ))}
        {done && (
          <div className="flex items-center gap-2">
            <span className="text-[#7effa0]">❯</span>
            <span className="terminal-cursor" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </motion.div>
  );
}
