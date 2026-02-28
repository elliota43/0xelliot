import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { ArrowLeft, Calendar, Clock, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { mdxComponents } from "@/components/mdx-components";
import type { Article } from "@/lib/mdx";

interface ArticleContentProps {
  article: Article;
}

const prettyCodeOptions = {
  theme: "one-dark-pro",
  keepBackground: false,
  defaultLang: "plaintext",
};

export async function ArticleContent({ article }: ArticleContentProps) {
  const { frontmatter, content, readingTime } = article;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        {/* Back link */}
        <Link
          href="/articles"
          className="group mb-12 inline-flex items-center gap-2 font-mono text-xs text-[#363a50] transition-colors duration-200 hover:text-[#7effa0]"
        >
          <ArrowLeft
            size={12}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          all articles
        </Link>

        {/* Article header */}
        <header className="mb-10">
          {frontmatter.tags && (
            <div className="mb-3 flex flex-wrap gap-2">
              {frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm bg-[#141720] px-2 py-0.5 font-mono text-xs text-[#6b6f88]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="mb-4 font-mono text-3xl font-bold leading-tight tracking-tight text-[#e4e6f0] lg:text-4xl">
            {frontmatter.title}
          </h1>

          <p className="mb-6 text-lg leading-relaxed text-[#6b6f88]">
            {frontmatter.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 border-t border-[#1c1f2e] pt-4">
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#363a50]">
              <Calendar size={11} />
              {formatDate(frontmatter.date)}
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#363a50]">
              <Clock size={11} />
              {readingTime}
            </div>
            {frontmatter.canonicalUrl && (
              <a
                href={frontmatter.canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-mono text-xs text-[#363a50] transition-colors duration-200 hover:text-[#7effa0]"
              >
                <ExternalLink size={11} />
                originally published here
              </a>
            )}
          </div>
        </header>

        {/* Divider */}
        <div className="mb-10 h-px bg-gradient-to-r from-[#7effa020] via-[#1c1f2e] to-transparent" />

        {/* MDX Content */}
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

        {/* Footer nav */}
        <div className="mt-16 border-t border-[#1c1f2e] pt-8">
          <Link
            href="/articles"
            className="group inline-flex items-center gap-2 font-mono text-xs text-[#363a50] transition-colors duration-200 hover:text-[#7effa0]"
          >
            <ArrowLeft
              size={12}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            back to all articles
          </Link>
        </div>
      </div>
    </div>
  );
}
