import { useEffect, useState } from "react";
import { usePatientStore } from "../stores/usePatientStore";
import { useRouter } from "next/router";

type Meal = {
  foods: string[];
  nutrition_total: {
    kcal: number;
    protein: number;
    sodium: number;
    potassium: number;
    phosphorus: number;
  };
  rag_advice: string;
};

export default function RecommendPage() {
  const { info } = usePatientStore();
  const router = useRouter();

  const [meal, setMeal] = useState<Meal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 필수 입력이 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (!info.age || !info.height || !info.weight) {
      router.push("/");
      return;
    }

    const fetchMeal = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recommend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...info,
            dialysis_frequency: (info as any).dialysis_frequency ?? 3,
            comorbidities: {
              diabetes: info.comorbidities?.diabetes ?? false,
              hypertension: info.comorbidities?.hypertension ?? false,
            }
          })
        });

        const data = await response.json();

        if (data.error) {
          setError("서버 오류: " + data.error);
        } else {
          setMeal(data);
        }
      } catch (err: any) {
        setError("서버 요청 실패: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [info, router]);

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🍱 맞춤 추천 식단</h1>

      {loading && <p>추천 식단 불러오는 중...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {meal && (
        <div className="space-y-4">
          {/* RAG 조언 */}
          <section className="p-4 border rounded bg-blue-50">
            <h2 className="font-semibold text-blue-800 mb-2">맞춤형 식이 조언</h2>
            <p className="text-gray-700 whitespace-pre-line">{meal.rag_advice}</p>
          </section>

          {/* 추천 음식 */}
          <section className="p-4 border rounded">
            <h2 className="font-semibold">추천된 반찬 조합</h2>
            <ul className="list-disc list-inside">
              {meal.foods.map((food, idx) => (
                <li key={idx}>{food}</li>
              ))}
            </ul>
          </section>

          {/* 영양소 정보 */}
          <section className="p-4 border rounded">
            <h2 className="font-semibold">총 영양소</h2>
            <ul className="list-inside">
              {Object.entries(meal.nutrition_total).map(([key, value]) => (
                <li key={key}>
                  {translateNutritionKey(key)}: {value.toFixed(1)}{" "}
                  {getUnit(key)}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          홈으로 돌아가기
        </button>
      </div>
    </main>
  );
}

// 영양소 이름 한국어로 변환
const translateNutritionKey = (key: string): string => {
  switch (key) {
    case "kcal":
      return "칼로리";
    case "protein":
      return "단백질";
    case "sodium":
      return "나트륨";
    case "potassium":
      return "칼륨";
    case "phosphorus":
      return "인";
    default:
      return key;
  }
};

// 영양소 단위
const getUnit = (key: string): string => {
  return key === "kcal" ? "kcal" : "mg";
};
