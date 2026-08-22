"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { siteConfig } from "@/config/site";
import type { CategoryMeta } from "@/config/site";

export function HeaderClient({ categories }: { categories: CategoryMeta[] }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <Container>
        <div className="flex items-center justify-between gap-4 py-4">
          <Link href="/" className="flex items-baseline gap-2 text-left" onClick={() => setOpen(false)}>
            <span className="font-serif text-2xl font-black tracking-tight text-primary sm:text-3xl">
              {siteConfig.name}
            </span>
            <span className="hidden text-sm text-muted-foreground sm:inline">{siteConfig.domain}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex min-h-11 items-center gap-2 rounded-md border border-border px-4 py-2 text-base font-medium text-primary md:hidden"
              aria-expanded={open}
            >
              <span aria-hidden>☰</span> 메뉴
            </button>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className="rounded-md px-3 py-2 text-lg font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/about"
              className="ml-2 rounded-md px-3 py-2 text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              소개
            </Link>
          </nav>
        </div>
      </Container>

      {open && (
        <div className="border-t border-border bg-card md:hidden">
          <Container className="py-3">
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.id}`}
                  onClick={() => setOpen(false)}
                  className="min-h-12 rounded-md bg-secondary px-4 py-3 text-left text-lg font-medium text-primary"
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-base text-muted-foreground">
              <Link href="/about" onClick={() => setOpen(false)} className="min-h-11 py-1">
                사이트 소개
              </Link>
              <Link href="/author" onClick={() => setOpen(false)} className="min-h-11 py-1">
                운영자 소개
              </Link>
              <Link href="/contact" onClick={() => setOpen(false)} className="min-h-11 py-1">
                문의하기
              </Link>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
