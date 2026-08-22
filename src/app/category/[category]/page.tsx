import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNonEmptyCategories, getPostsByCategory } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { siteConfig } from "@/config/site";

export function generateStaticParams() {
  return getNonEmptyCategories().map(({ category }) => ({
    category: encodeURIComponent(category),
  }));
}

export async function generateMetadata(
  props: PageProps<"/category/[category]">
): Promise<Metadata> {
  const { category } = await props.params;
  const name = decodeURIComponent(category);
  return {
    title: siteConfig.categoryLabels[name] ?? name,
    description: `${siteConfig.categoryLabels[name] ?? name} 카테고리의 글 모음`,
  };
}

export default async function CategoryPage(props: PageProps<"/category/[category]">) {
  const { category } = await props.params;
  const name = decodeURIComponent(category);
  const posts = getPostsByCategory(name);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">
        {siteConfig.categoryLabels[name] ?? name}
      </h1>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
