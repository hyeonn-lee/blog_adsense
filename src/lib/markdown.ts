import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}

/** 최상위 "## " 제목을 기준으로 마크다운을 섹션 단위로 나눕니다 (본문 중간 광고 삽입용). */
export function splitMarkdownSections(markdown: string): string[] {
  const lines = markdown.split("\n");
  const sections: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (/^##\s+/.test(line) && current.length > 0) {
      sections.push(current.join("\n").trim());
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) sections.push(current.join("\n").trim());

  return sections.filter((s) => s.length > 0);
}

export function estimateReadingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  const charCount = markdown.replace(/\s+/g, "").length;
  // 한글 위주 콘텐츠 특성상 어절 수 대신 글자 수 기준(분당 약 500자)으로도 보정
  const minutesByChars = charCount / 500;
  const minutesByWords = words / 200;
  return Math.max(1, Math.round(Math.max(minutesByChars, minutesByWords)));
}
