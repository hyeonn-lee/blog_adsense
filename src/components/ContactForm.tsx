"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[${siteConfig.name}] 문의: ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n회신 받을 이메일: ${form.email}`);
    window.location.href = `mailto:${siteConfig.contactEmail}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div role="status" className="mt-8 rounded-lg border-2 border-accent bg-accent/10 p-6 text-center">
        <div className="font-serif text-2xl font-bold text-accent">이메일 작성 화면이 열렸습니다</div>
        <p className="mt-2 text-lg text-foreground">
          열린 이메일 앱에서 &lsquo;보내기&rsquo;를 눌러야 문의가 실제로 접수됩니다. 화면이 열리지
          않았다면 <span className="font-medium text-accent">{siteConfig.contactEmail}</span>로 직접
          보내주세요.
        </p>
        <button
          onClick={() => {
            setSent(false);
            setForm({ name: "", email: "", message: "" });
          }}
          className="mt-4 min-h-11 rounded-md border border-border px-5 py-2 text-base font-medium text-primary hover:bg-secondary"
        >
          새 문의 작성
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <Field label="이름" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
      <Field
        label="이메일"
        type="email"
        value={form.email}
        onChange={(v) => setForm({ ...form, email: v })}
      />
      <div>
        <label className="mb-2 block text-lg font-bold text-primary">문의 내용</label>
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-md border border-border bg-card px-4 py-3 text-lg text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-ring/40"
        />
      </div>
      <button
        type="submit"
        className="min-h-12 w-full rounded-md bg-accent px-6 py-3 text-lg font-bold text-accent-foreground hover:opacity-90 sm:w-auto"
      >
        문의 보내기
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-lg font-bold text-primary">{label}</label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-card px-4 py-3 text-lg text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-ring/40"
      />
    </div>
  );
}
