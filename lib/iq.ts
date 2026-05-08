export type IqQuestion = {
  id: string; // q1..q8
  num: number; // 1..8
  question: string;
  options: string[]; // 선택지 (1-base value 매핑)
  correct: number; // 정답 value (1-base)
  explanation: string;
};

export const iqQuestions: IqQuestion[] = [
  {
    id: "q1",
    num: 1,
    question:
      "상온에서 원소(금속)수은은 어떠한 형태로 존재하는가?",
    options: ["고체", "액체", "기체"],
    correct: 2,
    explanation:
      "수은은 상온에서 액체로 존재하는 유일한 금속입니다.",
  },
  {
    id: "q2",
    num: 2,
    question: "생태계에서 생물농축(bioaccumulation)이 되는 수은의 형태는?",
    options: ["원소(금속)수은", "메틸수은", "무기수은"],
    correct: 2,
    explanation:
      "메틸수은은 탄소와 결합되어있는 유기수은 형태로 생물농축이 일어납니다.",
  },
  {
    id: "q3",
    num: 3,
    question: "다음중 수은 함유량이 가장 높은 것은?",
    options: ["식물성 플랑크톤", "동물성 플랑크톤", "대형어류"],
    correct: 3,
    explanation:
      "수은은 공중에서 낙하하여 하천과 바다에 축적되고, 물속에서 메틸수은으로 바뀝니다. 물속에서 먹이를 먹는 어류는 메틸수은을 흡수하여 체내에 축적하고 먹이 연쇄에 따른 생물농축이 일어납니다. 물 속 농축 → 식물성 플랑크톤 → 동물성 플랑크톤 → 소형 무척추 동물 → 소형 어류 → 대형 어류 → 최종 소비자(사람 등)",
  },
  {
    id: "q4",
    num: 4,
    question: "온도계에 수은이 쓰이는 이유는?",
    options: [
      "상온에서 액체로 존재하는 금속이기 때문에",
      "온도에 따른 부피팽창이 일정하기 때문에",
      "수은의 은색이 눈에 잘 보이기 때문에",
    ],
    correct: 2,
    explanation:
      "수은은 온도가 변하여도 부피팽창이 일정하기 때문에 온도계로 사용됩니다.",
  },
  {
    id: "q5",
    num: 5,
    question: "온도계 유리관과 구부에 보이는 빨간 액체는 수은이다",
    options: ["O", "X"],
    correct: 2,
    explanation:
      "수은의 유해성 때문에 요즘 나오는 온도계에는 수은 대신 알코올을 사용하고 있습니다.",
  },
  {
    id: "q6",
    num: 6,
    question:
      "수은온도계를 깼을 경우 해야 할 조치가 아닌 것은?",
    options: [
      "창문을 열어 방을 환기시킨다.",
      "방 온도를 올려 액체상태의 수은을 가능한 빨리 기화시킨다.",
      "흘려진 수은 위에 황가루를 뿌린 후 주워 담는다.",
    ],
    correct: 2,
    explanation:
      "유출된 수은은 상온에서 쉽게 공기중으로 휘발되고, 방의 온도를 올릴 경우 휘발속도가 빨라져 좁은 실내에서 많은 양의 수은 가스를 형성하게 됩니다. 이렇게 발생한 수은가스는 무색 무취하며, 흡입시 매우 유독합니다. 따라서 수은을 흘렸을 경우에는 가능한 한 빨리 처리해야 합니다.",
  },
  {
    id: "q7",
    num: 7,
    question: "다음 중 수은이 사용되지 않는 제품은?",
    options: ["형광등", "온도계", "혈압계", "휴대폰"],
    correct: 4,
    explanation:
      "형광등 내에는 기체상의 수은이 주입되어 있으며, 수은의 일정한 열팽창율과 높은 밀도 때문에 온도계 및 혈압계에 사용되었습니다.",
  },
  {
    id: "q8",
    num: 8,
    question:
      "손목시계에 들어가는 단추형 전지에 많은 양의 수은이 들어있다",
    options: ["O", "X"],
    correct: 2,
    explanation:
      "손목시계 단추형 전지에는 미량의 수은이 사용됩니다. 수은의 양은 제품에 따라 다르지만 적은 양이며, 환경오염 방지를 위해 최근에는 수은-free 전지도 널리 보급되고 있습니다.",
  },
];

export const POINTS_PER_Q = 12.5;
export const TOTAL_QUESTIONS = iqQuestions.length;

export function calculateScore(answers: Record<string, number>): {
  total: number;
  correctCount: number;
  results: Array<{ q: IqQuestion; selected?: number; isCorrect: boolean }>;
} {
  const results = iqQuestions.map((q) => {
    const selected = answers[q.id];
    return { q, selected, isCorrect: selected === q.correct };
  });
  const correctCount = results.filter((r) => r.isCorrect).length;
  return {
    total: Math.round(correctCount * POINTS_PER_Q),
    correctCount,
    results,
  };
}
