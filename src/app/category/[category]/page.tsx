import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActiveCategories, getPostsByCategory } from "@/lib/posts";
import { getCategoryMeta } from "@/config/site";
import { CategoryPageClient } from "@/components/CategoryPageClient";

export function generateStaticParams() {
  return getActiveCategories().map((c) => ({ category: c.id }));
}

export async function generateMetadata(
  props: PageProps<"/category/[category]">
): Promise<Metadata> {
  const { category } = await props.params;
  const meta = getCategoryMeta(category);
  if (!meta) return {};
  return {
    title: meta.name,
    description: meta.description,
  };
}

export default async function CategoryPage(props: PageProps<"/category/[category]">) {
  const { category } = await props.params;
  const meta = getCategoryMeta(category);
  const posts = getPostsByCategory(category);

  if (!meta || posts.length === 0) {
    notFound();
  }

  return <CategoryPageClient category={meta} posts={posts} />;
}
