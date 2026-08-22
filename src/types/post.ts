export type PostFrontmatter = {
  title: string;
  date: string; // YYYY-MM-DD
  description: string;
  category: string;
  tags: string[];
  draft?: boolean;
};

export type Post = PostFrontmatter & {
  slug: string;
  content: string; // raw markdown
};

export type PostWithHtml = Post & {
  html: string;
  readingMinutes: number;
};
