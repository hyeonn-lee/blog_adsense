import GithubSlugger from "github-slugger";

export type TocItem = { text: string; slug: string };

/** "## " 제목을 목차 항목으로 추출. rehype-slug와 동일한 슬러그 규칙(github-slugger)을 사용해 앵커가 일치합니다. */
export function extractHeadings(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  for (const line of markdown.split("\n")) {
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (match) {
      const text = match[1].replace(/[*_`]/g, "");
      items.push({ text, slug: slugger.slug(text) });
    }
  }

  return items;
}
