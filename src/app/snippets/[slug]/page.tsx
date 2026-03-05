import { notFound } from "next/navigation";
import { getSnippetBySlug, getAllSnippets } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { mdxComponents } from "@/components/mdx-components";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

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

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-2xl px-6">
        <Link
          href="/snippets"
          className="inline-block mb-10 text-sm text-overlay-0 hover:text-peach transition-colors"
        >
          &larr; snippets
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3 text-xs text-overlay-0">
            <span className="lowercase">{frontmatter.language}</span>
            {frontmatter.tags?.map((tag) => (
              <span
                key={tag}
                className="bg-surface-0 px-1.5 py-0.5 rounded lowercase"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mb-3 text-xl font-semibold tracking-tight">
            {frontmatter.title}
          </h1>

          <p className="mb-4 text-sm text-overlay-1">
            {frontmatter.description}
          </p>

          <div className="text-xs text-overlay-0">
            {formatDate(frontmatter.date)}
          </div>
        </header>

        <hr className="border-surface-0 mb-10" />

        <article className="prose">
          <MDXRemote
            source={content}
            options={{
              mdxOptions: {
                rehypePlugins: [
                  [
                    rehypePrettyCode as never,
                    { theme: "catppuccin-mocha", keepBackground: false },
                  ],
                ],
              },
            }}
            components={mdxComponents}
          />
        </article>

        <div className="mt-12 border-t border-surface-0 pt-6">
          <Link
            href="/snippets"
            className="text-sm text-overlay-0 hover:text-peach transition-colors"
          >
            &larr; snippets
          </Link>
        </div>
      </div>
    </div>
  );
}
