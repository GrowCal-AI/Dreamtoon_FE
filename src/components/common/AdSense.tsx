import { useEffect } from "react";

interface AdSenseProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
}

/**
 * Google AdSense 광고 컴포넌트
 *
 * 사용법:
 * <AdSense adSlot="1234567890" />
 *
 * AdSense 대시보드에서 광고 단위를 생성한 후 slot ID를 받아서 사용하세요.
 */
export default function AdSense({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
}: AdSenseProps) {
  useEffect(() => {
    try {
      // AdSense 스크립트가 로드되었는지 확인
      if (typeof window !== "undefined" && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-6192776695660842"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      ></ins>
    </div>
  );
}
