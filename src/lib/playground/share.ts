import LZString from "lz-string";
import type { Language } from "./executor";

interface SharedSnippet {
  language: Language;
  code: string;
}

const VALID_LANGUAGES = new Set<Language>([
  "javascript",
  "typescript",
  "c",
  "rust",
  "go",
]);

export function encodeSnippet(language: Language, code: string): string {
  const payload = JSON.stringify({ l: language, c: code });
  return LZString.compressToEncodedURIComponent(payload);
}

export function decodeSnippet(encoded: string): SharedSnippet | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;

    const parsed = JSON.parse(json);
    if (
      typeof parsed.l !== "string" ||
      typeof parsed.c !== "string" ||
      !VALID_LANGUAGES.has(parsed.l)
    ) {
      return null;
    }

    return { language: parsed.l, code: parsed.c };
  } catch {
    return null;
  }
}

export function buildShareUrl(language: Language, code: string): string {
  const encoded = encodeSnippet(language, code);
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : "";
  return `${base}/playground?code=${encoded}`;
}
