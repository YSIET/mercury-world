import staticData from "@/data/signal_static.json";
import foodsData from "@/data/signal_foods.json";
import categoriesData from "@/data/signal_categories.json";

export interface SignalStaticFood {
  rank: number;
  food: string;
  daily_intake_g: number;
  mercury_ng_g: number;
}

export interface SignalFood {
  id: number;
  food: string;
  unit_text: string;
  mercury_ng_g: number;
  category_idx: number;
  category_name: string;
}

export interface SignalCategory {
  idx: number;
  name: string;
}

export const signalStatic: SignalStaticFood[] = staticData as SignalStaticFood[];
export const signalFoods: SignalFood[] = foodsData as SignalFood[];
export const signalCategories: SignalCategory[] = (
  categoriesData as SignalCategory[]
).slice().sort((a, b) => a.idx - b.idx);

export type SignalLevel = "green" | "yellow" | "red";

export interface SignalResult {
  level: SignalLevel;
  total_ug: number;
  threshold_ug: number;
  message: string;
  weight_kg: number;
}

export function calculateSignal(
  intakes: { food_id: number; grams: number }[],
  weight_kg: number
): SignalResult {
  const map = new Map(signalFoods.map((f) => [f.id, f.mercury_ng_g]));
  let total_ng = 0;
  for (const { food_id, grams } of intakes) {
    const ppm = map.get(food_id);
    if (ppm !== undefined) total_ng += grams * ppm;
  }
  const total_ug = total_ng / 1000;
  const threshold_ug = Math.floor((5 * weight_kg) / 7);
  if (total_ug <= 19) {
    return {
      level: "green",
      total_ug,
      threshold_ug,
      weight_kg,
      message:
        "일일 평균 수은 섭취량 이하이시군요. 오늘은 조절을 잘하셨어요.",
    };
  }
  if (total_ug <= threshold_ug) {
    return {
      level: "yellow",
      total_ug,
      threshold_ug,
      weight_kg,
      message:
        "일일 평균 수은 섭취량을 초과하셨어요. 오늘은 조심하실 필요가 있습니다.",
    };
  }
  return {
    level: "red",
    total_ug,
    threshold_ug,
    weight_kg,
    message:
      "일일 수은 섭취 권고치를 초과하셨어요. 식습관을 조절하셔서 수은 섭취량을 줄이셔야 합니다.",
  };
}
