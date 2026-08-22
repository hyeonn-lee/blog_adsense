import Link from "next/link";
import type { Post } from "@/types/post";
import { siteConfig } from "@/config/site";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="block rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-300 hover:shadow-sm"
    >
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <span className="rounded-full bg-zinc-100 px-2 py-0.5">
          {siteConfig.categoryLabels[post.category] ?? post.category}
        </span>
        <time dateTime={post.date}>{post.date}</time>
      </div>
      <h2 className="mt-2 text-lg font-semibold text-zinc-900">{post.title}</h2>
      <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{post.description}</p>
    </Link>
  );
}
