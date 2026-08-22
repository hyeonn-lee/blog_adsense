"use client";

import { useEffect, useMemo, useState } from "react";
import { markdownToHtml } from "@/lib/markdown";
import { slugify } from "@/lib/slugify";
import { categories } from "@/config/site";

type PostSummary = {
  slug: string;
  title: string;
  date: string;
  category: string;
  draft: boolean;
};

type FormState = {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
  tags: string;
  image: string;
  views: string;
  draft: boolean;
  content: string;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function emptyForm(): FormState {
  return {
    slug: "",
    title: "",
    date: today(),
    description: "",
    category: categories[0].id,
    tags: "",
    image: "",
    views: "",
    draft: true,
    content: "",
  };
}

export default function AdminPage() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [isNew, setIsNew] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [slugTouched, setSlugTouched] = useState(false);
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState<{ type: "ok" | "error"; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const postsByCategory = useMemo(() => {
    const map = new Map<string, number>();
    posts.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + 1));
    return map;
  }, [posts]);

  async function loadPosts() {
    const res = await fetch("/api/admin/posts");
    if (!res.ok) return;
    const data = await res.json();
    setPosts(data.posts ?? []);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 마운트 시 글 목록을 서버에서 불러오는 표준 패턴
    loadPosts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      markdownToHtml(form.content || "").then(setPreview);
    }, 250);
    return () => clearTimeout(timer);
  }, [form.content]);

  function startNewPost() {
    setIsNew(true);
    setSlugTouched(false);
    setForm(emptyForm());
    setStatus(null);
  }

  async function editPost(slug: string) {
    const res = await fetch(`/api/admin/posts?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) {
      setStatus({ type: "error", message: "글을 불러오지 못했습니다." });
      return;
    }
    const data = await res.json();
    const post = data.post;
    setIsNew(false);
    setSlugTouched(true);
    setStatus(null);
    setForm({
      slug: post.slug,
      title: post.title,
      date: post.date,
      description: post.description,
      category: post.category,
      tags: post.tags.join(", "),
      image: post.image ?? "",
      views: post.views ? String(post.views) : "",
      draft: post.draft,
      content: post.content,
    });
  }

  function handleTitleChange(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugTouched ? prev.slug : slugify(title),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);

    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      isNew,
      views: form.views ? Number(form.views) : 0,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", message: data.error ?? "저장에 실패했습니다." });
        return;
      }

      const gitMsg = data.git?.synced
        ? "GitHub에 커밋 및 푸시까지 완료됐습니다."
        : `로컬 저장은 완료됐지만 GitHub 동기화는 되지 않았습니다 (${data.git?.reason ?? "알 수 없는 이유"}).`;

      setStatus({ type: "ok", message: `저장되었습니다. ${gitMsg}` });
      setIsNew(false);
      await loadPosts();
    } catch {
      setStatus({ type: "error", message: "네트워크 오류로 저장하지 못했습니다." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!form.slug) return;
    if (!confirm(`"${form.title}" 글을 정말 삭제할까요? 이 작업은 되돌릴 수 없습니다.`)) return;

    const res = await fetch(`/api/admin/posts?slug=${encodeURIComponent(form.slug)}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (!res.ok) {
      setStatus({ type: "error", message: data.error ?? "삭제에 실패했습니다." });
      return;
    }

    setStatus({ type: "ok", message: "삭제되었습니다." });
    startNewPost();
    await loadPosts();
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
      {/* 글 목록 */}
      <aside className="w-64 shrink-0">
        <button
          onClick={startNewPost}
          className="mb-4 w-full rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          + 새 글 작성
        </button>
        <ul className="space-y-1">
          {posts.map((p) => (
            <li key={p.slug}>
              <button
                onClick={() => editPost(p.slug)}
                className={`block w-full truncate rounded-md px-2 py-1.5 text-left text-sm hover:bg-secondary ${
                  form.slug === p.slug ? "bg-secondary font-medium" : "text-foreground"
                }`}
              >
                {p.draft && <span className="mr-1 text-point">●</span>}
                {p.title}
              </button>
            </li>
          ))}
          {posts.length === 0 && (
            <li className="px-2 py-1.5 text-sm text-muted-foreground">작성된 글이 없습니다.</li>
          )}
        </ul>
      </aside>

      {/* 편집 폼 */}
      <div className="flex-1">
        <h1 className="mb-4 text-xl font-bold text-primary">{isNew ? "새 글 작성" : "글 수정"}</h1>

        {status && (
          <div
            className={`mb-4 rounded-md px-3 py-2 text-sm ${
              status.type === "ok" ? "bg-accent/10 text-accent" : "bg-point/10 text-point"
            }`}
          >
            {status.message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">제목</label>
              <input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm"
                placeholder="글 제목"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                슬러그 (URL, 영문/숫자/하이픈)
              </label>
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm((prev) => ({ ...prev, slug: e.target.value }));
                }}
                disabled={!isNew}
                className="w-full rounded-md border border-border px-3 py-2 text-sm disabled:bg-muted disabled:text-muted-foreground"
                placeholder="my-first-post"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">날짜</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">카테고리</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {postsByCategory.get(c.id) ? `(${postsByCategory.get(c.id)})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">설명(description)</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full rounded-md border border-border px-3 py-2 text-sm"
                placeholder="검색 결과와 목록에 노출될 요약 (1~2문장)"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">태그 (쉼표로 구분)</label>
              <input
                value={form.tags}
                onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                className="w-full rounded-md border border-border px-3 py-2 text-sm"
                placeholder="관절염, 영양제, 낙상예방"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                대표 이미지 URL (선택)
              </label>
              <input
                value={form.image}
                onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                className="w-full rounded-md border border-border px-3 py-2 text-sm"
                placeholder="https://... (비워두면 카테고리 이름이 표시된 자리표시자가 나옵니다)"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={form.draft}
                  onChange={(e) => setForm((prev) => ({ ...prev, draft: e.target.checked }))}
                />
                초안(draft)으로 저장
              </label>
            </div>
            <p className="-mt-2 text-xs text-muted-foreground">
              체크 해제 시 배포된 사이트에 바로 노출됩니다.
            </p>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">본문 (마크다운)</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                rows={18}
                className="w-full rounded-md border border-border px-3 py-2 font-mono text-sm"
                placeholder={"## 소제목\n\n본문 내용을 입력하세요."}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "저장 중..." : "저장하고 GitHub에 반영"}
              </button>
              {!isNew && (
                <button
                  onClick={handleDelete}
                  className="rounded-md border border-point/40 px-4 py-2 text-sm font-medium text-point hover:bg-point/10"
                >
                  삭제
                </button>
              )}
            </div>
          </div>

          {/* 미리보기 */}
          <div>
            <p className="mb-1 text-sm font-medium text-foreground">미리보기</p>
            <div className="h-full rounded-md border border-border p-4">
              <div className="mb-3 border-b border-border pb-3">
                <h2 className="font-serif text-lg font-bold text-primary">
                  {form.title || "제목 미리보기"}
                </h2>
                <p className="text-xs text-muted-foreground">{form.date}</p>
              </div>
              <div
                className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-primary"
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
