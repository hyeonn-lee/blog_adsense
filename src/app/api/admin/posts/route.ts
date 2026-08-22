import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { POSTS_DIR, getPostBySlug, getPostSlugs } from "@/lib/posts";
import { isValidSlug } from "@/lib/slugify";
import { commitAndPushPosts } from "@/lib/git";

function guardDev() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "관리자 API는 프로덕션에서 비활성화되어 있습니다." }, { status: 404 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const blocked = guardDev();
  if (blocked) return blocked;

  const slug = request.nextUrl.searchParams.get("slug");

  if (slug) {
    const post = getPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json({ post });
  }

  const posts = getPostSlugs()
    .map((s) => getPostBySlug(s))
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ slug: s, title, date, category, draft }) => ({ slug: s, title, date, category, draft }));

  return NextResponse.json({ posts });
}

type SavePayload = {
  slug: string;
  isNew: boolean;
  title: string;
  date: string;
  description: string;
  category: string;
  tags: string[];
  draft: boolean;
  content: string;
};

export async function POST(request: NextRequest) {
  const blocked = guardDev();
  if (blocked) return blocked;

  const body = (await request.json()) as SavePayload;
  const { slug, isNew, title, date, description, category, tags, draft, content } = body;

  if (!slug || !isValidSlug(slug)) {
    return NextResponse.json(
      { error: "슬러그는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다." },
      { status: 400 }
    );
  }
  if (!title?.trim()) {
    return NextResponse.json({ error: "제목을 입력해 주세요." }, { status: 400 });
  }

  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  const exists = fs.existsSync(filePath);
  if (isNew && exists) {
    return NextResponse.json({ error: "이미 같은 슬러그의 글이 존재합니다." }, { status: 409 });
  }

  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  const fileContent = matter.stringify(content ?? "", {
    title,
    date,
    description,
    category,
    tags,
    draft,
  });

  fs.writeFileSync(filePath, fileContent, "utf8");

  const gitResult = await commitAndPushPosts(
    `${isNew ? "add" : "update"} post: ${title}`
  );

  return NextResponse.json({ ok: true, slug, git: gitResult });
}

export async function DELETE(request: NextRequest) {
  const blocked = guardDev();
  if (blocked) return blocked;

  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug 파라미터가 필요합니다." }, { status: 400 });
  }

  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
  }

  const post = getPostBySlug(slug);
  fs.unlinkSync(filePath);

  const gitResult = await commitAndPushPosts(`delete post: ${post?.title ?? slug}`);

  return NextResponse.json({ ok: true, git: gitResult });
}
