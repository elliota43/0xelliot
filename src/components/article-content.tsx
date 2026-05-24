import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { formatDate } from "@/lib/utils";
import { mdxComponents } from "@/components/mdx-components";
import { getAllArticles, type Article } from "@/lib/mdx";

interface ArticleContentProps {
  article: Article;
}

const prettyCodeOptions = {
  theme: "catppuccin-mocha",
  keepBackground: false,
  defaultLang: "plaintext",
};

function SeriesNav({ article, allArticles }: { article: Article; allArticles: Article[] }) {
  const { series, seriesPart } = article.frontmatter;
  if (!series || seriesPart === undefined) return null;

  const seriesArticles = allArticles
    .filter((a) => a.frontmatter.series === series)
    .sort((a, b) => (a.frontmatter.seriesPart ?? 0) - (b.frontmatter.seriesPart ?? 0));

  if (seriesArticles.length < 1) return null;

  const currentIdx = seriesArticles.findIndex((a) => a.slug === article.slug);
  const prev = currentIdx > 0 ? seriesArticles[currentIdx - 1] : null;
  const next = currentIdx < seriesArticles.length - 1 ? seriesArticles[currentIdx + 1] : null;

  return (
    <div className="mb-8 rounded border border-surface-0 px-4 py-3 text-xs">
      <div className="mb-2.5 flex items-center gap-2 text-overlay-0">
        <span>series</span>
        <span className="text-surface-2">/</span>
        <span className="text-subtext-1">{series}</span>
        <span className="text-surface-2">·</span>
        <span>
          pt. {seriesPart} of {seriesArticles.length}
        </span>
      </div>
      <ol className="space-y-1.5">
        {seriesArticles.map((a) => (
          <li key={a.slug} className="flex items-baseline gap-3">
            <span className="shrink-0 tabular-nums text-overlay-0 w-4 text-right">
              {a.frontmatter.seriesPart}.
            </span>
            {a.slug === article.slug ? (
              <span className="text-text font-medium">{a.frontmatter.title}</span>
            ) : (
              <Link
                href={`/articles/${a.slug}`}
                className="text-overlay-1 hover:text-peach transition-colors"
              >
                {a.frontmatter.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
      {(prev || next) && (
        <div className="mt-3 flex items-center justify-between border-t border-surface-0 pt-2.5">
          {prev ? (
            <Link
              href={`/articles/${prev.slug}`}
              className="text-overlay-0 hover:text-peach transition-colors"
            >
              ← pt. {prev.frontmatter.seriesPart}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/articles/${next.slug}`}
              className="text-overlay-0 hover:text-peach transition-colors"
            >
              pt. {next.frontmatter.seriesPart} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
}

export async function ArticleContent({ article }: ArticleContentProps) {
  const { frontmatter, content, readingTime } = article;
  const allArticles = getAllArticles();

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-4xl px-6">
        <Link
          href="/articles"
          className="inline-block mb-10 text-sm text-overlay-0 hover:text-peach transition-colors"
        >
          &larr; articles
        </Link>

        <header className="mb-12">
          {frontmatter.tags && (
            <div className="mb-3 flex flex-wrap gap-2 text-xs text-overlay-0">
              {frontmatter.tags
                .filter((tag) => !tag.startsWith("Series:"))
                .map((tag) => (
                  <Link
                    key={tag}
                    href={`/articles?tag=${encodeURIComponent(tag)}`}
                    className="lowercase hover:text-peach transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
            </div>
          )}

          <h1 className="mb-5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight lg:text-4xl">
            {frontmatter.title}
          </h1>

          <p className="mb-7 max-w-2xl text-base leading-8 text-subtext-1">
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

        <SeriesNav article={article} allArticles={allArticles} />

        <article className="prose article-prose mx-auto max-w-3xl">
          <MDXRemote
            source={content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [[rehypePrettyCode as never, prettyCodeOptions]],
              },
            }}
            components={mdxComponents}
          />
        </article>

        <div className="mt-16 border-t border-surface-0 pt-8 flex items-center justify-between">
          <Link
            href="/articles"
            className="text-sm text-overlay-0 hover:text-peach transition-colors"
          >
            &larr; all articles
          </Link>
          {frontmatter.series && frontmatter.seriesPart !== undefined && (() => {
            const seriesArticles = allArticles
              .filter((a) => a.frontmatter.series === frontmatter.series)
              .sort((a, b) => (a.frontmatter.seriesPart ?? 0) - (b.frontmatter.seriesPart ?? 0));
            const currentIdx = seriesArticles.findIndex((a) => a.slug === article.slug);
            const next = currentIdx < seriesArticles.length - 1 ? seriesArticles[currentIdx + 1] : null;
            if (!next) return null;
            return (
              <Link
                href={`/articles/${next.slug}`}
                className="text-sm text-overlay-0 hover:text-peach transition-colors"
              >
                pt. {next.frontmatter.seriesPart} &rarr;
              </Link>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
