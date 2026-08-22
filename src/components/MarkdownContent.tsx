const DEFAULT_CLASS_NAME =
  "prose max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-primary prose-headings:scroll-mt-24 prose-h2:mt-10 prose-h2:text-2xl prose-p:text-lg prose-p:leading-[1.9] prose-p:text-foreground prose-a:text-accent prose-strong:text-foreground prose-img:rounded-lg prose-li:text-lg prose-li:leading-[1.9]";

export function MarkdownContent({ html, className }: { html: string; className?: string }) {
  return <div className={className ?? DEFAULT_CLASS_NAME} dangerouslySetInnerHTML={{ __html: html }} />;
}
