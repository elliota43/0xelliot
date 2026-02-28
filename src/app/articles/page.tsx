import { getAllArticles } from "@/lib/mdx";
import { ArticlesClient } from "@/components/articles-client";

export const metadata = {
  title: "Articles",
  description: "Writing about systems programming, compilers, and developer tooling.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();
  return <ArticlesClient articles={articles} />;
}
