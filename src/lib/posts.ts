import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Post, PostFrontmatter } from "@/types/post";
import { categories, type CategoryMeta } from "@/config/site";

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
    category: fm.category ?? categories[0].id,
    tags: fm.tags ?? [],
    image: fm.image ?? undefined,
    views: fm.views ?? 0,
    draft: fm.draft ?? false,
    content,
  };
}

const isProd = process.env.NODE_ENV === "production";

export function getAllPosts(): Post[] {
  return getPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .filter((post) => !(isProd && post.draft))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostsByCategory(categoryId: string): Post[] {
  return getAllPosts().filter((post) => post.category === categoryId);
}

export function getPopularPosts(limit = 5): Post[] {
  return [...getAllPosts()]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0) || (a.date < b.date ? 1 : -1))
    .slice(0, limit);
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  return getAllPosts()
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, limit);
}

/** 실제 글이 1개 이상 존재하는 카테고리만, 정해진 순서대로 반환 (빈 카테고리 노출 방지) */
export function getActiveCategories(): CategoryMeta[] {
  const posts = getAllPosts();
  return categories.filter((c) => posts.some((p) => p.category === c.id));
}
