import { getAllSnippets } from "@/lib/mdx";
import { SnippetsClient } from "@/components/snippets-client";

export const metadata = {
  title: "Snippets",
  description: "Short, reusable code patterns and micro-articles.",
};

export default function SnippetsPage() {
  const snippets = getAllSnippets();
  return <SnippetsClient snippets={snippets} />;
}
