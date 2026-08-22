export const siteConfig = {
  name: "시니어 헬스",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://seniorhealth.homes",
  description: "시니어와 가족을 위한 건강·생활 정보를 다루는 블로그입니다.",
  authorName: process.env.NEXT_PUBLIC_AUTHOR_NAME || "운영자",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@seniorhealth.homes",
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "",
  // 카테고리는 posts frontmatter에서 자동 수집되며,
  // 아래 목록은 "표시 이름"과 "정렬 순서"만 정의합니다.
  // 실제 글이 1개 이상 있는 카테고리만 메뉴/목록에 노출됩니다.
  categoryLabels: {
    "건강정보": "건강정보",
    "생활정보": "생활정보",
    "복지제도": "복지제도",
    "운동/재활": "운동/재활",
    "영양/식단": "영양/식단",
  } as Record<string, string>,
} as const;

export type SiteConfig = typeof siteConfig;
