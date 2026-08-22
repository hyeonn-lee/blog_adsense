"use client";

import { useState } from "react";
import Link from "next/link";
import type { Post } from "@/types/post";
import { ArticleCard } from "@/components/cards";
import { AdSlot } from "@/components/AdSlot";
import { Container } from "@/components/Container";
import type { CategoryMeta } from "@/config/site";

export function CategoryPageClient({ category, posts }: { category: CategoryMeta; posts: Post[] }) {
  const [sort, setSort] = useState<"latest" | "popular">("latest");

  const list = [...posts].sort((a, b) =>
    sort === "latest" ? (a.date < b.date ? 1 : -1) : (b.views ?? 0) - (a.views ?? 0)
  );

  return (
    <Container className="py-10">
      <p className="text-base font-medium text-accent">카테고리</p>
      <h1 className="mt-1 font-serif text-4xl font-black text-primary">{category.name}</h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">{category.description}</p>

      <div className="mt-8 mb-6 flex items-center gap-2 border-b border-border pb-3">
        {(["latest", "popular"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className={`min-h-11 rounded-md px-4 py-2 text-base font-medium transition-colors ${
              sort === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            {s === "latest" ? "최신순" : "인기순"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>

      <AdSlot />

      <div className="mt-6 flex justify-center">
        <Link
          href="/"
          className="min-h-12 rounded-md border border-border px-6 py-3 text-base font-medium text-primary hover:bg-secondary"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </Container>
  );
}
