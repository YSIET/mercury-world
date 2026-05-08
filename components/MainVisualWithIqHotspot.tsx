import Link from "next/link";

/**
 * 메인 비주얼 (970×514) + image map + IQ 구역 시각 안내 오버레이
 */
export default function MainVisualWithIqHotspot() {
  return (
    <div className="main-visual-wrap">
      <img
        src="/img/img_new/main_visual.gif"
        alt="메인 이미지"
        className="main-visual-img"
        width={970}
        height={514}
        useMap="#Map"
      />
      <map name="Map">
        <area
          shape="rect"
          coords="663,268,810,409"
          href="/community/request"
          alt="분석의뢰"
        />
        <area
          shape="rect"
          coords="830,269,940,414"
          href="/test/q"
          alt="수은IQ테스트"
        />
      </map>
      <Link
        href="/test/q"
        aria-label="수은IQ테스트"
        className="main-visual-iq-hotspot"
      >
        수은IQ
        <br />
        테스트
      </Link>
    </div>
  );
}
