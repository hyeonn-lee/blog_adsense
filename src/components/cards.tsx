import Link from "next/link";
import type { Post } from "@/types/post";
import { categoryName } from "@/config/site";

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function CategoryTag({ post }: { post: Post }) {
  return (
    <Link
      href={`/category/${post.category}`}
      className="inline-block rounded bg-accent/10 px-2.5 py-1 text-sm font-bold text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {categoryName(post.category)}
    </Link>
  );
}

function Thumbnail({ post, className }: { post: Post; className?: string }) {
  if (post.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={post.image}
        alt={post.title}
        loading="lazy"
        className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${className ?? ""}`}
      />
    );
  }
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-muted text-lg font-bold text-muted-foreground ${className ?? ""}`}
    >
      {categoryName(post.category)}
    </div>
  );
}

export function ArticleCard({ post }: { post: Post }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
      <Link href={`/posts/${post.slug}`} className="block text-left">
        <div className="aspect-video overflow-hidden bg-muted">
          <Thumbnail post={post} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2">
          <CategoryTag post={post} />
        </div>
        <Link href={`/posts/${post.slug}`} className="text-left">
          <h3 className="font-serif text-xl leading-snug font-bold text-primary transition-colors group-hover:text-accent">
            {post.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 flex-1 text-base leading-relaxed text-muted-foreground">
          {post.description}
        </p>
        <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
          <span>{formatDate(post.date)}</span>
        </div>
      </div>
    </article>
  );
}

export function RankList({ posts }: { posts: Post[] }) {
  return (
    <ol className="space-y-1">
      {posts.map((post, i) => (
        <li key={post.slug}>
          <Link
            href={`/posts/${post.slug}`}
            className="flex w-full items-start gap-3 rounded-md px-2 py-3 text-left transition-colors hover:bg-secondary"
          >
            <span
              className={`mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded font-serif text-lg font-black ${
                i < 3 ? "bg-point text-white" : "bg-secondary text-muted-foreground"
              }`}
            >
              {i + 1}
            </span>
            <span className="text-base leading-snug font-medium text-foreground">{post.title}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export { Thumbnail };
