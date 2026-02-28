import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

export interface ArticleFrontmatter {
  title: string;
  date: string;
  description: string;
  tags?: string[];
  canonicalUrl?: string;
  published?: boolean;
}

export interface SnippetFrontmatter {
  title: string;
  date: string;
  description: string;
  language: string;
  tags?: string[];
}

export interface Article {
  slug: string;
  frontmatter: ArticleFrontmatter;
  readingTime: string;
  content: string;
}

export interface Snippet {
  slug: string;
  frontmatter: SnippetFrontmatter;
  content: string;
}

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");
const SNIPPETS_DIR = path.join(process.cwd(), "content/snippets");

function getMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));
}

export function getAllArticles(): Article[] {
  const files = getMdxFiles(ARTICLES_DIR);

  const articles = files
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const filePath = path.join(ARTICLES_DIR, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const stats = readingTime(content);

      return {
        slug,
        frontmatter: data as ArticleFrontmatter,
        readingTime: stats.text,
        content,
      };
    })
    .filter((a) => a.frontmatter.published !== false)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

  return articles;
}

export function getArticleBySlug(slug: string): Article | null {
  const files = getMdxFiles(ARTICLES_DIR);
  const file = files.find((f) => f.replace(/\.mdx?$/, "") === slug);

  if (!file) return null;

  const filePath = path.join(ARTICLES_DIR, file);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    frontmatter: data as ArticleFrontmatter,
    readingTime: stats.text,
    content,
  };
}

export function getAllSnippets(): Snippet[] {
  const files = getMdxFiles(SNIPPETS_DIR);

  const snippets = files
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const filePath = path.join(SNIPPETS_DIR, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);

      return {
        slug,
        frontmatter: data as SnippetFrontmatter,
        content,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

  return snippets;
}

export function getSnippetBySlug(slug: string): Snippet | null {
  const files = getMdxFiles(SNIPPETS_DIR);
  const file = files.find((f) => f.replace(/\.mdx?$/, "") === slug);

  if (!file) return null;

  const filePath = path.join(SNIPPETS_DIR, file);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as SnippetFrontmatter,
    content,
  };
}
