import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

const cssVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

function catppuccinHighlight() {
  return HighlightStyle.define([
    { tag: t.keyword, color: cssVar("--color-mauve") },
    { tag: [t.name, t.deleted, t.character, t.macroName], color: cssVar("--color-text") },
    { tag: [t.propertyName], color: cssVar("--color-blue") },
    { tag: [t.function(t.variableName), t.labelName], color: cssVar("--color-blue") },
    { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: cssVar("--color-peach") },
    { tag: [t.definition(t.name), t.separator], color: cssVar("--color-text") },
    { tag: [t.typeName, t.className, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: cssVar("--color-yellow") },
    { tag: [t.number, t.bool], color: cssVar("--color-peach") },
    { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.special(t.string)], color: cssVar("--color-teal") },
    { tag: [t.meta, t.comment], color: cssVar("--color-overlay-0") },
    { tag: t.strong, fontWeight: "bold" },
    { tag: t.emphasis, fontStyle: "italic" },
    { tag: t.strikethrough, textDecoration: "line-through" },
    { tag: t.link, color: cssVar("--color-blue"), textDecoration: "underline" },
    { tag: t.heading, fontWeight: "bold", color: cssVar("--color-red") },
    { tag: [t.atom, t.special(t.variableName)], color: cssVar("--color-mauve") },
    { tag: [t.processingInstruction, t.string, t.inserted], color: cssVar("--color-green") },
    { tag: t.invalid, color: cssVar("--color-red") },
  ]);
}

export function catppuccinTheme() {
  const theme = EditorView.theme(
    {
      "&": {
        backgroundColor: "var(--color-mantle)",
        color: "var(--color-text)",
        fontFamily: "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace",
        fontSize: "0.85rem",
        lineHeight: "1.7",
      },
      ".cm-content": {
        caretColor: "var(--color-peach)",
        padding: "0.75rem 0",
      },
      ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: "var(--color-peach)",
        borderLeftWidth: "2px",
      },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
        backgroundColor: "color-mix(in srgb, var(--color-peach) 15%, transparent)",
      },
      ".cm-panels": {
        backgroundColor: "var(--color-mantle)",
        color: "var(--color-text)",
      },
      ".cm-panels.cm-panels-top": {
        borderBottom: "1px solid var(--color-surface-0)",
      },
      ".cm-panels.cm-panels-bottom": {
        borderTop: "1px solid var(--color-surface-0)",
      },
      ".cm-activeLine": {
        backgroundColor: "color-mix(in srgb, var(--color-surface-0) 40%, transparent)",
      },
      ".cm-gutters": {
        backgroundColor: "var(--color-mantle)",
        color: "var(--color-overlay-0)",
        border: "none",
        paddingLeft: "0.5rem",
      },
      ".cm-activeLineGutter": {
        backgroundColor: "transparent",
        color: "var(--color-subtext-0)",
      },
      ".cm-lineNumbers .cm-gutterElement": {
        padding: "0 0.75rem 0 0",
        minWidth: "2.5rem",
      },
      ".cm-foldPlaceholder": {
        backgroundColor: "var(--color-surface-0)",
        color: "var(--color-overlay-1)",
        border: "none",
      },
      ".cm-tooltip": {
        backgroundColor: "var(--color-surface-0)",
        color: "var(--color-text)",
        border: "1px solid var(--color-surface-1)",
        borderRadius: "4px",
      },
      ".cm-tooltip .cm-tooltip-arrow:before": {
        borderTopColor: "var(--color-surface-1)",
        borderBottomColor: "var(--color-surface-1)",
      },
      ".cm-tooltip .cm-tooltip-arrow:after": {
        borderTopColor: "var(--color-surface-0)",
        borderBottomColor: "var(--color-surface-0)",
      },
      ".cm-tooltip-autocomplete": {
        "& > ul > li[aria-selected]": {
          backgroundColor: "var(--color-surface-1)",
          color: "var(--color-text)",
        },
      },
      ".cm-searchMatch": {
        backgroundColor: "color-mix(in srgb, var(--color-yellow) 25%, transparent)",
        outline: "1px solid color-mix(in srgb, var(--color-yellow) 40%, transparent)",
      },
      ".cm-searchMatch.cm-searchMatch-selected": {
        backgroundColor: "color-mix(in srgb, var(--color-peach) 25%, transparent)",
      },
      ".cm-matchingBracket, .cm-nonmatchingBracket": {
        backgroundColor: "color-mix(in srgb, var(--color-surface-2) 50%, transparent)",
        outline: "1px solid var(--color-surface-2)",
      },
    },
    { dark: true }
  );

  return [theme, syntaxHighlighting(catppuccinHighlight())];
}
