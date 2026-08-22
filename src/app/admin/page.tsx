"use client";

import { useEffect, useMemo, useState } from "react";
import { markdownToHtml } from "@/lib/markdown";
import { slugify } from "@/lib/slugify";
import { siteConfig } from "@/config/site";

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
    category: Object.keys(siteConfig.categoryLabels)[0] ?? "",
    tags: "",
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

  const categoryOptions = useMemo(() => {
    const known = Object.keys(siteConfig.categoryLabels);
    const fromPosts = posts.map((p) => p.category);
    return Array.from(new Set([...known, ...fromPosts]));
  }, [posts]);

  async function loadPosts() {
    const res = await fetch("/api/admin/posts");
    if (!res.ok) return;
    const data = await res.json();
    setPosts(data.posts ?? []);
  }

  useEffect(() => {
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
          className="mb-4 w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          + 새 글 작성
        </button>
        <ul className="space-y-1">
          {posts.map((p) => (
            <li key={p.slug}>
              <button
                onClick={() => editPost(p.slug)}
                className={`block w-full truncate rounded-md px-2 py-1.5 text-left text-sm hover:bg-zinc-100 ${
                  form.slug === p.slug ? "bg-zinc-100 font-medium" : "text-zinc-700"
                }`}
              >
                {p.draft && <span className="mr-1 text-amber-600">●</span>}
                {p.title}
              </button>
            </li>
          ))}
          {posts.length === 0 && (
            <li className="px-2 py-1.5 text-sm text-zinc-400">작성된 글이 없습니다.</li>
          )}
        </ul>
      </aside>

      {/* 편집 폼 */}
      <div className="flex-1">
        <h1 className="mb-4 text-xl font-bold">{isNew ? "새 글 작성" : "글 수정"}</h1>

        {status && (
          <div
            className={`mb-4 rounded-md px-3 py-2 text-sm ${
              status.type === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            }`}
          >
            {status.message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">제목</label>
              <input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                placeholder="글 제목"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                슬러그 (URL, 영문/숫자/하이픈)
              </label>
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm((prev) => ({ ...prev, slug: e.target.value }));
                }}
                disabled={!isNew}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm disabled:bg-zinc-100 disabled:text-zinc-500"
                placeholder="my-first-post"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">날짜</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">카테고리</label>
                <input
                  list="category-options"
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <datalist id="category-options">
                  {categoryOptions.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">설명(description)</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                placeholder="검색 결과와 목록에 노출될 요약 (1~2문장)"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">태그 (쉼표로 구분)</label>
              <input
                value={form.tags}
                onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                placeholder="관절염, 영양제, 낙상예방"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={form.draft}
                onChange={(e) => setForm((prev) => ({ ...prev, draft: e.target.checked }))}
              />
              초안(draft)으로 저장 — 체크 해제 시 배포된 사이트에 바로 노출됩니다.
            </label>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">본문 (마크다운)</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                rows={18}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm"
                placeholder={"## 소제목\n\n본문 내용을 입력하세요."}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? "저장 중..." : "저장하고 GitHub에 반영"}
              </button>
              {!isNew && (
                <button
                  onClick={handleDelete}
                  className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  삭제
                </button>
              )}
            </div>
          </div>

          {/* 미리보기 */}
          <div>
            <p className="mb-1 text-sm font-medium text-zinc-700">미리보기</p>
            <div className="h-full rounded-md border border-zinc-200 p-4">
              <div className="mb-3 border-b border-zinc-100 pb-3">
                <h2 className="text-lg font-bold">{form.title || "제목 미리보기"}</h2>
                <p className="text-xs text-zinc-500">{form.date}</p>
              </div>
              <div
                className="prose prose-zinc prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
