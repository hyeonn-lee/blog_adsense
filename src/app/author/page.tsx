import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "운영자 소개",
  description: `${siteConfig.name} 운영자 소개`,
};

export default function AuthorPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl font-black text-primary">운영자 소개</h1>
        <p className="mt-6 text-lg leading-[1.9] text-foreground">
          안녕하세요. <b>{siteConfig.name}</b>을(를) 운영하는 {siteConfig.authorName}입니다. 시니어
          세대와 가족들이 실생활에서 필요로 하는 건강·복지 정보를 알기 쉽게 정리해 전달하고자 이
          블로그를 시작했습니다.
        </p>
        <p className="mt-4 text-lg leading-[1.9] text-foreground">
          &ldquo;가족에게 보여드려도 안심할 수 있는 정보&rdquo;를 기준으로 글을 씁니다. 과장된 건강
          정보나 근거 없는 상품 홍보는 다루지 않으며, 큰 글씨와 넉넉한 여백으로 편안하게 읽을 수
          있는 화면을 만들고자 합니다.
        </p>
        <p className="mt-4 text-lg leading-[1.9] text-foreground">
          궁금한 점이나 다루었으면 하는 주제가 있다면 언제든 알려 주세요.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block min-h-12 rounded-md bg-accent px-6 py-3 text-lg font-bold text-accent-foreground hover:opacity-90"
        >
          문의하러 가기 →
        </Link>
      </div>
    </Container>
  );
}
