"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded bg-surface-0 text-overlay-0 transition-colors hover:text-subtext-1",
        className
      )}
      aria-label="Copy code"
    >
      {copied ? (
        <Check size={12} className="text-green" />
      ) : (
        <Copy size={12} />
      )}
    </button>
  );
}
