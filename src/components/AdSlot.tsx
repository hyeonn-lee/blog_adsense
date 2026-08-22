import { siteConfig } from "@/config/site";

type AdSlotProps = {
  /** 광고 위치 식별용 (승인 후 실제 slot id로 교체) */
  slot?: string;
  label?: string;
  className?: string;
};

/**
 * 애드센스 승인 전에는 클라이언트 ID가 없으므로 자리 표시자만 렌더링합니다.
 * .env.local에 NEXT_PUBLIC_ADSENSE_CLIENT_ID를 넣으면 실제 광고 태그로 전환됩니다.
 */
export function AdSlot({ slot, label = "광고", className }: AdSlotProps) {
  if (!siteConfig.adsenseClientId) {
    return (
      <div className={`my-8 ${className ?? ""}`} role="complementary" aria-label="광고 영역">
        <div className="mb-1 text-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {label}
        </div>
        <div className="flex min-h-[110px] items-center justify-center rounded border border-dashed border-border bg-muted/60 text-sm text-muted-foreground">
          광고 삽입 영역 (AdSense 승인 후 자동 노출)
        </div>
      </div>
    );
  }

  return (
    <div className={`my-8 ${className ?? ""}`} role="complementary" aria-label="광고 영역">
      <div className="mb-1 text-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
        {label}
      </div>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={siteConfig.adsenseClientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
