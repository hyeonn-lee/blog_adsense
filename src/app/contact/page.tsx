import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "문의하기",
  description: `${siteConfig.name} 문의 안내`,
};

export default function ContactPage() {
  return (
    <div className="prose prose-zinc mx-auto max-w-3xl px-4 py-10">
      <h1>문의하기</h1>
      <p>
        사이트 이용 중 궁금한 점이나 제안하고 싶은 내용이 있으시면 아래 이메일로 편하게
        연락해 주세요. 확인 후 빠르게 답변드리겠습니다.
      </p>
      <p>
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
      </p>
    </div>
  );
}
