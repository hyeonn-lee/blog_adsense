import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Post, PostFrontmatter } from "@/types/post";

export const POSTS_DIR = path.join(process.cwd(), "posts");

function ensurePostsDir() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }
}

export function getPostSlugs(): string[] {
  ensurePostsDir();
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as Partial<PostFrontmatter>;

  return {
    slug,
    title: fm.title ?? slug,
    date: fm.date ?? "1970-01-01",
    description: fm.description ?? "",
    category: fm.category ?? "미분류",
    tags: fm.tags ?? [],
    draft: fm.draft ?? false,
    content,
  };
}

const isProd = process.env.NODE_ENV === "production";

export function getAllPosts(): Post[] {
  const posts = getPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .filter((post) => !(isProd && post.draft))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return posts;
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((post) => post.category === category);
}

/** 글이 1개 이상 실제로 존재하는 카테고리만 반환 (빈 카테고리 노출 방지) */
export function getNonEmptyCategories(): { category: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts()) {
    post.tags.forEach((tag) => tags.add(tag));
  }
  return Array.from(tags).sort();
}
