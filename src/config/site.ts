export type CategoryId = "health" | "life" | "policy" | "hobby";

export type CategoryMeta = {
  id: CategoryId;
  name: string;
  tagline: string;
  description: string;
};

export const categories: CategoryMeta[] = [
  {
    id: "health",
    name: "건강관리",
    tagline: "몸과 마음을 지키는 실천 정보",
    description:
      "만성질환 관리, 운동, 영양, 수면 등 일상에서 바로 실천할 수 있는 건강 정보를 전합니다.",
  },
  {
    id: "life",
    name: "생활정보",
    tagline: "매일이 편안해지는 생활의 지혜",
    description:
      "가계, 안전, 디지털 기기 사용법 등 시니어의 일상을 돕는 실용 정보를 모았습니다.",
  },
  {
    id: "policy",
    name: "정책·지원제도",
    tagline: "놓치지 말아야 할 혜택 안내",
    description:
      "노인복지, 연금, 의료·돌봄 지원 등 정부와 지자체의 제도를 알기 쉽게 정리합니다.",
  },
  {
    id: "hobby",
    name: "취미·여가",
    tagline: "인생 후반을 채우는 즐거움",
    description: "여행, 문화생활, 배움, 관계 등 활기찬 노후를 위한 여가 정보를 소개합니다.",
  },
];

export function categoryName(id: string): string {
  return categories.find((c) => c.id === id)?.name ?? id;
}

export function getCategoryMeta(id: string): CategoryMeta | undefined {
  return categories.find((c) => c.id === id);
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "건강한 노후",
  slogan: "시니어 세대를 위한 건강하고 지혜로운 생활 안내서",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://seniorhealth.homes",
  domain: "seniorhealth.homes",
  description: "시니어와 가족을 위한 건강·생활 정보를 다루는 블로그입니다.",
  authorName: process.env.NEXT_PUBLIC_AUTHOR_NAME || "편집팀",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "sj96023@gmail.com",
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "",
  categories,
} as const;

export type SiteConfig = typeof siteConfig;
