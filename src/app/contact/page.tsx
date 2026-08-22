import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "문의하기",
  description: `${siteConfig.name} 문의 안내`,
};

export default function ContactPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-4xl font-black text-primary">문의하기</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          궁금한 점이나 의견을 남겨 주세요. 아래 버튼을 누르면 입력하신 내용으로 이메일 작성 화면이
          열립니다. 바로 메일을 보내셔도 됩니다:{" "}
          <span className="font-medium text-accent">{siteConfig.contactEmail}</span>
        </p>

        <ContactForm />
      </div>
    </Container>
  );
}
