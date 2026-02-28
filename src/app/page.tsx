import { getAllArticles } from "@/lib/mdx";
import { HomeClient } from "@/components/home-client";

export default function HomePage() {
  const articles = getAllArticles().slice(0, 3);

  return <HomeClient articles={articles} />;
}
