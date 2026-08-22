import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: `${siteConfig.name} 개인정보 처리방침`,
};

export default function PrivacyPage() {
  return (
    <div className="prose prose-zinc mx-auto max-w-3xl px-4 py-10">
      <h1>개인정보 처리방침</h1>
      <p>
        {siteConfig.name}(이하 &lsquo;사이트&rsquo;)는 이용자의 개인정보를 중요하게 생각하며,
        관련 법령을 준수하기 위해 노력합니다.
      </p>

      <h2>1. 수집하는 정보</h2>
      <p>
        본 사이트는 별도의 회원가입 없이 이용 가능하며, 문의를 위해 이메일을 보내주시는 경우
        해당 이메일 주소와 문의 내용만 수집됩니다.
      </p>

      <h2>2. 쿠키 및 광고(Google AdSense)</h2>
      <p>
        본 사이트는 Google AdSense를 이용해 광고를 게재할 수 있습니다. Google을 포함한 광고
        네트워크는 쿠키를 사용해 이용자의 이전 방문 기록을 기반으로 광고를 게재할 수 있으며,
        이용자는{" "}
        <a
          href="https://adssettings.google.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google 광고 설정
        </a>
        에서 맞춤 광고를 비활성화할 수 있습니다.
      </p>
      <p>
        제3자 공급업체(Google 포함)는 쿠키를 사용하여 사용자가 본 사이트 및/또는 인터넷상의
        다른 사이트를 방문한 기록을 바탕으로 광고를 게재합니다.
      </p>

      <h2>3. 개인정보의 이용 목적</h2>
      <p>수집된 이메일은 문의 응대 목적으로만 사용되며, 별도 동의 없이 제3자에게 제공되지 않습니다.</p>

      <h2>4. 문의</h2>
      <p>
        개인정보 처리방침에 대한 문의는{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>로 연락해
        주세요.
      </p>

      <h2>5. 시행일</h2>
      <p>본 방침은 게시일부터 적용됩니다.</p>
    </div>
  );
}
