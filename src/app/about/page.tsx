import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "사이트 소개",
  description: `${siteConfig.name} 사이트 소개`,
};

export default function AboutPage() {
  return (
    <div className="prose prose-zinc mx-auto max-w-3xl px-4 py-10">
      <h1>사이트 소개</h1>
      <p>
        {siteConfig.name}는 시니어와 가족분들이 일상에서 바로 활용할 수 있는 건강·생활 정보를
        전달하기 위해 만들어진 정보형 블로그입니다.
      </p>
      <h2>다루는 주제</h2>
      <ul>
        <li>시니어 건강 관리 (질환, 통증, 영양 등)</li>
        <li>생활 정보 및 복지 제도 안내</li>
        <li>운동, 재활, 식단 등 실천 가능한 정보</li>
      </ul>
      <h2>콘텐츠 원칙</h2>
      <p>
        모든 글은 실제 도움이 되는 정보를 담아 직접 작성하며, 출처가 필요한 의학·제도 정보는
        가능한 한 신뢰할 수 있는 자료를 참고합니다. 다만 본 사이트의 글은 일반적인 정보 제공을
        목적으로 하며, 의학적 진단이나 치료를 대체하지 않습니다. 개인의 건강 상태에 따라 반드시
        전문의와 상담하시기 바랍니다.
      </p>
    </div>
  );
}
