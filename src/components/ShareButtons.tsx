"use client";

import { useState } from "react";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${title} - ${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 접근이 막힌 환경 (권한 거부 등) — 조용히 무시
    }
  };

  return (
    <>
      <span className="self-center text-base font-medium text-muted-foreground">이 글 공유하기</span>
      <button
        onClick={copy}
        className="min-h-11 rounded-md border border-border px-4 py-2 text-base font-medium text-primary hover:bg-secondary"
      >
        {copied ? "복사되었습니다 ✓" : "링크 복사"}
      </button>
    </>
  );
}
