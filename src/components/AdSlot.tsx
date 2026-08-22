import { siteConfig } from "@/config/site";

type AdSlotProps = {
  /** 광고 위치 식별용 (승인 후 slot id로 교체) */
  slot?: string;
  className?: string;
};

/**
 * 애드센스 승인 전에는 클라이언트 ID가 없으므로 자리 표시자만 렌더링합니다.
 * .env.local에 NEXT_PUBLIC_ADSENSE_CLIENT_ID를 넣으면 실제 광고 태그로 전환됩니다.
 * 본문 중간/사이드바 등 원하는 위치에 <AdSlot /> 컴포넌트만 추가하면 됩니다.
 */
export function AdSlot({ slot, className }: AdSlotProps) {
  if (!siteConfig.adsenseClientId) {
    return (
      <div
        className={`flex h-24 items-center justify-center rounded-lg border border-dashed border-zinc-300 text-xs text-zinc-400 ${className ?? ""}`}
      >
        광고 영역 (AdSense 승인 후 자동 노출)
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle block ${className ?? ""}`}
      style={{ display: "block" }}
      data-ad-client={siteConfig.adsenseClientId}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
