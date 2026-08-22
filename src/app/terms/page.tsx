import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "이용약관",
  description: `${siteConfig.name} 이용약관`,
};

export default function TermsPage() {
  const sections: { h: string; p: string }[] = [
    {
      h: "1. 목적",
      p: `본 약관은 ${siteConfig.name}(이하 '사이트')가 제공하는 콘텐츠 이용과 관련한 조건을 안내하기 위한 것입니다.`,
    },
    {
      h: "2. 콘텐츠의 성격",
      p: "본 사이트의 모든 글은 일반적인 정보 제공을 목적으로 하며, 의학적·법률적 자문을 대체하지 않습니다. 게시된 정보를 활용해 발생한 결과에 대해 사이트는 책임을 지지 않습니다.",
    },
    {
      h: "3. 저작권",
      p: "사이트에 게시된 모든 콘텐츠의 저작권은 운영자에게 있으며, 사전 동의 없이 무단으로 복제, 배포할 수 없습니다.",
    },
    {
      h: "4. 약관의 변경",
      p: "본 약관은 필요에 따라 사전 고지 없이 변경될 수 있습니다.",
    },
    {
      h: "5. 문의",
      p: `이용약관 관련 문의는 ${siteConfig.contactEmail}로 연락해 주세요.`,
    },
  ];

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl font-black text-primary">이용약관</h1>
        <div className="mt-8 space-y-8">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-serif text-xl font-bold text-primary">{s.h}</h2>
              <p className="mt-2 text-lg leading-[1.9] text-foreground">{s.p}</p>
            </section>
          ))}
        </div>
      </div>
    </Container>
  );
}
