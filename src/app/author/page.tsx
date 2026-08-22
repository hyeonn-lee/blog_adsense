import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "운영자 소개",
  description: `${siteConfig.name} 운영자 소개`,
};

export default function AuthorPage() {
  return (
    <div className="prose prose-zinc mx-auto max-w-3xl px-4 py-10">
      <h1>운영자 소개</h1>
      <p>
        안녕하세요, {siteConfig.name}를 운영하는 {siteConfig.authorName}입니다. 시니어 세대와
        가족들이 실생활에서 필요로 하는 건강·복지 정보를 알기 쉽게 정리해 전달하고자 이 블로그를
        시작했습니다.
      </p>
      <p>
        문의사항이 있으시면{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>로 언제든
        연락해 주세요.
      </p>
    </div>
  );
}
