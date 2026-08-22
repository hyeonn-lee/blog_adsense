export function MarkdownContent({ html }: { html: string }) {
  return (
    <div
      className="prose prose-zinc max-w-none prose-headings:scroll-mt-24 prose-h2:mt-10 prose-h2:text-xl prose-h2:font-bold prose-p:leading-relaxed prose-img:rounded-lg"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
