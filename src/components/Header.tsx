import Link from "next/link";
import { getNonEmptyCategories } from "@/lib/posts";
import { siteConfig } from "@/config/site";

export function Header() {
  const categories = getNonEmptyCategories();

  return (
    <header className="border-b border-zinc-200 bg-white/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-zinc-900">
          {siteConfig.name}
        </Link>

        <nav className="hidden gap-5 text-sm text-zinc-600 sm:flex">
          {categories.map(({ category }) => (
            <Link
              key={category}
              href={`/category/${encodeURIComponent(category)}`}
              className="hover:text-zinc-900"
            >
              {siteConfig.categoryLabels[category] ?? category}
            </Link>
          ))}
          <Link href="/about" className="hover:text-zinc-900">
            사이트 소개
          </Link>
        </nav>
      </div>

      {/* 모바일: 카테고리 가로 스크롤 */}
      {categories.length > 0 && (
        <div className="flex gap-4 overflow-x-auto border-t border-zinc-100 px-4 py-2 text-sm text-zinc-600 sm:hidden">
          {categories.map(({ category }) => (
            <Link
              key={category}
              href={`/category/${encodeURIComponent(category)}`}
              className="shrink-0 hover:text-zinc-900"
            >
              {siteConfig.categoryLabels[category] ?? category}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
