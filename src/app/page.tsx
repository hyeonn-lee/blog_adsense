import Link from "next/link";
import { Container } from "@/components/Container";
import { AdSlot } from "@/components/AdSlot";
import { ArticleCard, CategoryTag, RankList, formatDate } from "@/components/cards";
import { Thumbnail } from "@/components/cards";
import { getActiveCategories, getAllPosts, getPopularPosts, getPostsByCategory } from "@/lib/posts";
import { siteConfig } from "@/config/site";

function SectionHead({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between border-b-2 border-primary pb-2">
      <h2 className="font-serif text-2xl font-black text-primary">{title}</h2>
      {href && (
        <Link href={href} className="text-base font-medium text-accent hover:underline">
          더보기 →
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const all = getAllPosts();
  const activeCategories = getActiveCategories();
  const popular = getPopularPosts(5);

  if (all.length === 0) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-serif text-3xl font-black text-primary">{siteConfig.name}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{siteConfig.slogan}</p>
        <p className="mt-10 text-lg text-muted-foreground">
          아직 등록된 글이 없습니다. 곧 첫 글로 찾아뵐게요.
        </p>
      </Container>
    );
  }

  const [lead, ...rest] = all;
  const secondary = rest.slice(0, 2);

  return (
    <Container className="py-8">
      {/* Hero */}
      <section className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <Link
          href={`/posts/${lead.slug}`}
          className="group overflow-hidden rounded-xl border border-border bg-card text-left"
        >
          <div className="aspect-video overflow-hidden bg-muted">
            <Thumbnail post={lead} />
          </div>
          <div className="p-6">
            <span className="inline-block rounded bg-point px-2.5 py-1 text-sm font-bold text-white">
              오늘의 헤드라인
            </span>
            <h1 className="mt-3 font-serif text-3xl leading-tight font-black text-primary group-hover:text-accent sm:text-4xl">
              {lead.title}
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{lead.description}</p>
            <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
              <span>{formatDate(lead.date)}</span>
            </div>
          </div>
        </Link>

        {secondary.length > 0 && (
          <div className="flex flex-col gap-5">
            {secondary.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="group flex gap-4 rounded-lg border border-border bg-card p-3 text-left transition-shadow hover:shadow-md"
              >
                <div className="aspect-square h-24 w-24 flex-none overflow-hidden rounded-md bg-muted">
                  <Thumbnail post={post} />
                </div>
                <div>
                  <CategoryTag post={post} />
                  <h3 className="mt-1 font-serif text-lg leading-snug font-bold text-primary group-hover:text-accent">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <AdSlot />

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-14">
          {activeCategories.map((c) => {
            const list = getPostsByCategory(c.id).slice(0, 4);
            if (list.length === 0) return null;
            return (
              <section key={c.id}>
                <SectionHead title={c.name} href={`/category/${c.id}`} />
                <div className="grid gap-6 sm:grid-cols-2">
                  {list.map((post) => (
                    <ArticleCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          {popular.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-3 font-serif text-xl font-black text-primary">많이 본 글</h2>
              <RankList posts={popular} />
            </div>
          )}
          <AdSlot label="광고 · Sponsored" />
        </aside>
      </div>
    </Container>
  );
}
