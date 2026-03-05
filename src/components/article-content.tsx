import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { formatDate } from "@/lib/utils";
import { mdxComponents } from "@/components/mdx-components";
import type { Article } from "@/lib/mdx";

interface ArticleContentProps {
  article: Article;
}

const prettyCodeOptions = {
  theme: "catppuccin-mocha",
  keepBackground: false,
  defaultLang: "plaintext",
};

export async function ArticleContent({ article }: ArticleContentProps) {
  const { frontmatter, content, readingTime } = article;

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-2xl px-6">
        <Link
          href="/articles"
          className="inline-block mb-10 text-sm text-overlay-0 hover:text-peach transition-colors"
        >
          &larr; articles
        </Link>

        <header className="mb-10">
          {frontmatter.tags && (
            <div className="mb-3 flex flex-wrap gap-2 text-xs text-overlay-0">
              {frontmatter.tags.map((tag) => (
                <span key={tag} className="lowercase">{tag}</span>
              ))}
            </div>
          )}

          <h1 className="mb-4 text-2xl font-semibold leading-tight tracking-tight lg:text-3xl">
            {frontmatter.title}
          </h1>

          <p className="mb-6 text-sm leading-relaxed text-overlay-1">
            {frontmatter.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 border-t border-surface-0 pt-4 text-xs text-overlay-0">
            <span>{formatDate(frontmatter.date)}</span>
            <span className="text-surface-2">/</span>
            <span>{readingTime}</span>
            {frontmatter.canonicalUrl && (
              <>
                <span className="text-surface-2">/</span>
                <a
                  href={frontmatter.canonicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-peach transition-colors"
                >
                  original
                </a>
              </>
            )}
          </div>
        </header>

        <hr className="border-surface-0 mb-10" />

        <article className="prose">
          <MDXRemote
            source={content}
            options={{
              mdxOptions: {
                rehypePlugins: [[rehypePrettyCode as never, prettyCodeOptions]],
              },
            }}
            components={mdxComponents}
          />
        </article>

        <div className="mt-16 border-t border-surface-0 pt-8">
          <Link
            href="/articles"
            className="text-sm text-overlay-0 hover:text-peach transition-colors"
          >
            &larr; all articles
          </Link>
        </div>
      </div>
    </div>
  );
}
