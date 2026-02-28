import { notFound } from "next/navigation";
import { getSnippetBySlug, getAllSnippets } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { mdxComponents } from "@/components/mdx-components";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

const LANG_COLORS: Record<string, string> = {
  Go: "#00ADD8",
  Rust: "#CE422B",
  C: "#555555",
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  PHP: "#4F5D95",
};

export async function generateStaticParams() {
  const snippets = getAllSnippets();
  return snippets.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const snippet = getSnippetBySlug(slug);
  if (!snippet) return {};
  return {
    title: snippet.frontmatter.title,
    description: snippet.frontmatter.description,
  };
}

export default async function SnippetPage({ params }: Props) {
  const { slug } = await params;
  const snippet = getSnippetBySlug(slug);
  if (!snippet) notFound();

  const { frontmatter, content } = snippet;
  const langColor = LANG_COLORS[frontmatter.language] ?? "#7effa0";

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/snippets"
          className="group mb-10 inline-flex items-center gap-2 font-mono text-xs text-[#363a50] transition-colors duration-200 hover:text-[#7effa0]"
        >
          <ArrowLeft
            size={12}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          all snippets
        </Link>

        {/* Header */}
        <div className="mb-8 rounded-xl border border-[#1c1f2e] bg-[#0d0f16] p-6">
          {/* Top chrome */}
          <div className="mb-4 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#28ca41]" />
            </div>
            <span className="ml-2 font-mono text-xs text-[#363a50]">
              {slug}.{frontmatter.language.toLowerCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: langColor }}
            />
            <span className="font-mono text-xs" style={{ color: langColor }}>
              {frontmatter.language}
            </span>
          </div>

          <h1 className="mb-2 font-mono text-2xl font-bold text-[#e4e6f0]">
            {frontmatter.title}
          </h1>
          <p className="mb-4 text-[#6b6f88]">{frontmatter.description}</p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#363a50]">
              <Calendar size={11} />
              {formatDate(frontmatter.date)}
            </div>
            {frontmatter.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-sm bg-[#141720] px-2 py-0.5 font-mono text-xs text-[#363a50]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* MDX Content */}
        <article className="prose">
          <MDXRemote
            source={content}
            options={{
              mdxOptions: {
                rehypePlugins: [
                  [rehypePrettyCode as never, { theme: "one-dark-pro", keepBackground: false }],
                ],
              },
            }}
            components={mdxComponents}
          />
        </article>

        <div className="mt-12 border-t border-[#1c1f2e] pt-6">
          <Link
            href="/snippets"
            className="group inline-flex items-center gap-2 font-mono text-xs text-[#363a50] transition-colors duration-200 hover:text-[#7effa0]"
          >
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
            back to snippets
          </Link>
        </div>
      </div>
    </div>
  );
}
