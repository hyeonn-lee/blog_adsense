import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug, getPostSlugs } from "@/lib/posts";
import { markdownToHtml, estimateReadingMinutes } from "@/lib/markdown";
import { MarkdownContent } from "@/components/MarkdownContent";
import { AdSlot } from "@/components/AdSlot";
import { siteConfig } from "@/config/site";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/posts/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `${siteConfig.url}/posts/${post.slug}`,
    },
  };
}

export default async function PostPage(props: PageProps<"/posts/[slug]">) {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post || (process.env.NODE_ENV === "production" && post.draft)) {
    notFound();
  }

  const html = await markdownToHtml(post.content);
  const readingMinutes = estimateReadingMinutes(post.content);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <Link
          href={`/category/${encodeURIComponent(post.category)}`}
          className="text-xs font-medium text-emerald-700"
        >
          {siteConfig.categoryLabels[post.category] ?? post.category}
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-zinc-900">{post.title}</h1>
        <div className="mt-2 flex gap-3 text-sm text-zinc-500">
          <time dateTime={post.date}>{post.date}</time>
          <span>·</span>
          <span>약 {readingMinutes}분 소요</span>
        </div>
      </div>

      <AdSlot className="mb-8" />

      <MarkdownContent html={html} />

      {post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <AdSlot className="mt-10" />

      <RelatedPosts currentSlug={post.slug} category={post.category} />
    </article>
  );
}

function RelatedPosts({
  currentSlug,
  category,
}: {
  currentSlug: string;
  category: string;
}) {
  const related = getAllPosts()
    .filter((p) => p.category === category && p.slug !== currentSlug)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="mt-12 border-t border-zinc-200 pt-8">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900">관련 글</h2>
      <ul className="space-y-3">
        {related.map((p) => (
          <li key={p.slug}>
            <Link href={`/posts/${p.slug}`} className="text-emerald-700 hover:underline">
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
