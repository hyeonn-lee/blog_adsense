import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}

export function estimateReadingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  const charCount = markdown.replace(/\s+/g, "").length;
  // 한글 위주 콘텐츠 특성상 어절 수 대신 글자 수 기준(분당 약 500자)으로도 보정
  const minutesByChars = charCount / 500;
  const minutesByWords = words / 200;
  return Math.max(1, Math.round(Math.max(minutesByChars, minutesByWords)));
}
