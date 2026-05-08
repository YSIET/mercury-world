/**
 * 원본 inc/header.php의 메뉴 배열 그대로 미러링
 * group: 1100=수은세상소개(없음), 1200=수은백서, 1300=수은소식, 1400=수은상담소, 1500=식품속수은
 */
export const MENU_ITEMS: Array<[number, string, string]> = [
  [1200, "수은이란", "/mercury/mercury"],
  [1200, "수은순환과생물농축", "/mercury/mercury_cycle"],
  [1200, "어패류속수은", "/mercury/fish"],
  [1200, "수은응급처리법", "/mercury/emergency"],
  [1200, "수은규제치", "/mercury/regulation"],

  [1300, "공지사항", "/news/board"],
  [1300, "수은관련뉴스", "/news/news"],
  [1300, "수은함유량정보", "/news/pds"],

  [1400, "묻고답하기", "/community/freeboard"],
  [1400, "분석의뢰", "/community/request"],
  [1400, "수은응급처리키트", "/community/kit"],

  [1500, "수은섭취량테스트", "/content/content"],
  [1500, "ONEDAY수은신호등", "/content/one"],
];
