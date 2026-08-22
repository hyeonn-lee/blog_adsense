import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { siteConfig, categories } from "@/config/site";

export const metadata: Metadata = {
  title: "사이트 소개",
  description: `${siteConfig.name} 사이트 소개`,
};

export default function AboutPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl font-black text-primary">사이트 소개</h1>
        <p className="mt-3 text-xl font-medium text-accent">{siteConfig.slogan}</p>
        <p className="mt-6 text-lg leading-[1.9] text-foreground">
          <b>{siteConfig.name}</b>은(는) 시니어 세대와 그 가족이 건강하고 지혜로운 노후를 준비할 수
          있도록 신뢰할 수 있는 생활·건강 정보를 전하는 웹사이트입니다. 어려운 의학 용어와 복잡한
          제도를 누구나 이해할 수 있게 풀어 설명하고, 일상에서 바로 실천할 수 있는 내용을 담으려
          노력합니다.
        </p>
        <p className="mt-4 text-lg leading-[1.9] text-foreground">
          모든 글은 공신력 있는 자료를 바탕으로 정리하며, 발행일을 함께 밝혀 독자가 정보의 신뢰도를
          스스로 확인할 수 있도록 합니다. 다만 본 사이트의 글은 일반적인 정보 제공을 목적으로 하며,
          의학적 진단이나 치료를 대체하지 않습니다. 개인의 건강 상태에 따라 반드시 전문의와
          상담하시기 바랍니다.
        </p>

        <h2 className="mt-12 mb-5 font-serif text-2xl font-black text-primary">이런 정보를 다룹니다</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((c) => (
            <div key={c.id} className="rounded-lg border border-border bg-card p-5">
              <div className="font-serif text-xl font-bold text-primary">{c.name}</div>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">{c.tagline}</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
