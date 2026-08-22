import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: `${siteConfig.name} 개인정보 처리방침`,
};

export default function PrivacyPage() {
  const sections: { h: string; p: string }[] = [
    {
      h: "1. 수집하는 개인정보 항목",
      p: `${siteConfig.name}은(는) 문의하기 기능을 이용하실 때 이름, 이메일 주소, 문의 내용을 수집합니다. 그 밖에 서비스 이용 과정에서 접속 기록, 쿠키, 방문 기록이 자동으로 생성·수집될 수 있습니다.`,
    },
    {
      h: "2. 쿠키 및 광고 쿠키 고지",
      p: "본 사이트는 서비스 운영을 위해 Google AdSense 등 제3자 광고를 게재할 수 있습니다. 이러한 광고 제공업체는 이용자의 관심사에 맞는 광고를 제공하기 위해 쿠키를 사용할 수 있으며, 이용자는 브라우저 설정에서 쿠키 사용을 거부하거나 Google 광고 설정 페이지에서 맞춤 광고를 해제할 수 있습니다.",
    },
    {
      h: "3. 개인정보의 이용 목적",
      p: "수집한 개인정보는 문의에 대한 답변 및 서비스 개선 목적으로만 이용하며, 이용자의 동의 없이 목적 외의 용도로 사용하지 않습니다.",
    },
    {
      h: "4. 제3자 제공",
      p: "본 사이트는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 법령에 근거하거나 수사기관의 적법한 요청이 있는 경우에 한해 제공될 수 있습니다.",
    },
    {
      h: "5. 개인정보의 보유 및 파기",
      p: "문의 처리가 완료된 후에는 관련 법령에 따른 보존 기간이 없는 한 지체 없이 파기합니다.",
    },
    {
      h: "6. 문의처",
      p: `개인정보 처리에 관한 문의는 ${siteConfig.contactEmail}로 연락해 주시기 바랍니다.`,
    },
  ];

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl font-black text-primary">개인정보처리방침</h1>
        <p className="mt-3 text-base text-muted-foreground">시행일: 2026년 8월 22일</p>
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
