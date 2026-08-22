import type { CategoryId } from "@/config/site";

export type PostFrontmatter = {
  title: string;
  date: string; // YYYY-MM-DD
  description: string;
  category: CategoryId | string;
  tags: string[];
  /** 카드/헤드라인에 쓸 대표 이미지 URL (없으면 자리표시자 노출) */
  image?: string;
  /** 조회수 — "많이 본 글" 정렬에 사용 (선택, 기본 0) */
  views?: number;
  draft?: boolean;
};

export type Post = PostFrontmatter & {
  slug: string;
  content: string; // raw markdown
};
