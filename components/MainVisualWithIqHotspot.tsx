/**
 * 메인 비주얼 (970×514) + image map (IQ 영역은 area로만 유지)
 */
export default function MainVisualWithIqHotspot() {
  return (
    <div className="mw-main-visual-rail mw-mobile-scale-970-clip">
      <div className="mw-mobile-scale-970">
        <img
          src="/img/img_new/main_visual.gif"
          alt="메인 이미지"
          width={970}
          height={514}
          style={{ display: "block", width: 970, height: 514 }}
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
      </div>
    </div>
  );
}
