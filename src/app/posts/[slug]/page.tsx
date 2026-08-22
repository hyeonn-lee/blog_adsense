import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/posts";
import {
  markdownToHtml,
  splitMarkdownSections,
  splitSourcesSection,
  estimateReadingMinutes,
} from "@/lib/markdown";
import { extractHeadings } from "@/lib/toc";
import { MarkdownContent } from "@/components/MarkdownContent";
import { AdSlot } from "@/components/AdSlot";
import { ShareButtons } from "@/components/ShareButtons";
import { ArticleCard, CategoryTag, Thumbnail, formatDate } from "@/components/cards";
import { Container } from "@/components/Container";
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

  const { main: postBody, sources: sourcesMarkdown } = splitSourcesSection(post.content);
  const sections = splitMarkdownSections(postBody);
  const sectionHtml = await Promise.all(sections.map((s) => markdownToHtml(s)));
  const sourcesHtml = sourcesMarkdown ? await markdownToHtml(sourcesMarkdown) : null;
  const toc = extractHeadings(postBody);
  const readingMinutes = estimateReadingMinutes(post.content);
  const related = getRelatedPosts(post);
  const adIndex = Math.floor(sections.length / 2);

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-3xl">
        <CategoryTag post={post} />
        <h1 className="mt-4 font-serif text-3xl leading-tight font-black text-primary sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border pb-5 text-base text-muted-foreground">
          <span className="font-medium text-foreground">{siteConfig.authorName}</span>
          <span aria-hidden>·</span>
          <span>{formatDate(post.date)}</span>
          <span aria-hidden>·</span>
          <span>{readingMinutes}분 읽기</span>
        </div>

        <div className="mt-6 aspect-video overflow-hidden rounded-lg bg-muted">
          <Thumbnail post={post} />
        </div>

        <p className="mt-6 border-l-4 border-accent bg-secondary/50 py-4 pl-5 text-lg leading-relaxed font-medium text-foreground">
          {post.description}
        </p>

        {toc.length > 1 && (
          <nav className="mt-8 mb-8 rounded-lg border border-border bg-card p-5">
            <div className="mb-2 text-base font-bold text-primary">목차</div>
            <ol className="space-y-1">
              {toc.map((item, i) => (
                <li key={item.slug}>
                  <a href={`#${item.slug}`} className="text-base text-accent hover:underline">
                    {i + 1}. {item.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="space-y-8">
          {sectionHtml.map((html, i) => (
            <div key={i}>
              <MarkdownContent html={html} />
              {i === adIndex && <AdSlot />}
            </div>
          ))}
        </div>

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {sourcesHtml && (
          <div className="mt-8 border-t border-border pt-4">
            <MarkdownContent
              html={sourcesHtml}
              className="prose prose-sm max-w-none prose-headings:text-xs prose-headings:font-semibold prose-headings:text-muted-foreground prose-headings:mb-1 prose-p:text-xs prose-p:text-muted-foreground prose-li:text-xs prose-li:text-muted-foreground prose-li:leading-relaxed prose-a:text-muted-foreground prose-a:underline prose-a:underline-offset-2 prose-strong:text-xs prose-strong:text-muted-foreground"
            />
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <ShareButtons title={post.title} />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mx-auto mt-16 max-w-5xl">
          <h2 className="mb-5 border-b-2 border-primary pb-2 font-serif text-2xl font-black text-primary">
            함께 보면 좋은 글
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((p) => (
              <ArticleCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto mt-10 max-w-3xl">
        <Link
          href="/"
          className="inline-block min-h-11 rounded-md border border-border px-5 py-2 text-base font-medium text-primary hover:bg-secondary"
        >
          ← 홈으로
        </Link>
      </div>
    </Container>
  );
}
