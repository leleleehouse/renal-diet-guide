import { useRouter } from "next/router";
import { usePatientStore } from "../stores/usePatientStore";

export default function Home() {
  const router = useRouter();
  const info = usePatientStore((state) => state.info);
  const setInfo = usePatientStore((state) => state.setInfo);

  // 입력값 변경 시 전역 상태에 바로 반영
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === "diabetes" || name === "hypertension") {
      setInfo({
        ...info,
        comorbidities: {
          ...info.comorbidities,
          [name]: checked,
        },
      });
    } else {
      setInfo({
        ...info,
        [name]: type === "number" ? Number(value) : value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/chat");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-6">
      <h1 className="text-3xl font-bold">혈액투석 환자 식단 추천 서비스</h1>
      <p className="text-gray-600 mb-6">오늘의 건강한 식단과 음식 궁합을 확인하세요</p>
      <form onSubmit={handleSubmit} className="space-y-2 w-full max-w-md text-left">
        <div>
          <label>나이: <input name="age" type="number" value={info.age ?? ""} onChange={handleChange} required className="border p-1 rounded w-20" /></label>
        </div>
        <div>
          <label>성별: 
            <select name="gender" value={info.gender ?? ""} onChange={handleChange} required className="border p-1 rounded ml-2">
              <option value="">선택</option>
              <option value="남">남</option>
              <option value="여">여</option>
            </select>
          </label>
        </div>
        <div>
          <label>키(cm): <input name="height" type="number" value={info.height ?? ""} onChange={handleChange} required className="border p-1 rounded w-20" /></label>
        </div>
        <div>
          <label>몸무게(kg): <input name="weight" type="number" value={info.weight ?? ""} onChange={handleChange} required className="border p-1 rounded w-20" /></label>
        </div>
        <div>
          <label>투석 유형: 
            <select name="dialysisType" value={info.dialysisType ?? ""} onChange={handleChange} required className="border p-1 rounded ml-2">
              <option value="">선택</option>
              <option value="혈액투석">혈액투석</option>
              <option value="복막투석">복막투석</option>
            </select>
          </label>
        </div>
        <div>
          <label>소변량: 
            <select name="urineOutput" value={info.urineOutput ?? ""} onChange={handleChange} required className="border p-1 rounded ml-2">
              <option value="">선택</option>
              <option value="none">거의 없음</option>
              <option value="some">있음</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            <input name="diabetes" type="checkbox" checked={info.comorbidities?.diabetes ?? false} onChange={handleChange} className="mr-1" />
            당뇨
          </label>
          <label className="ml-4">
            <input name="hypertension" type="checkbox" checked={info.comorbidities?.hypertension ?? false} onChange={handleChange} className="mr-1" />
            고혈압
          </label>
        </div>
        <div>
          <label>투석 주기(회/주): <input name="dialysis_frequency" type="number" value={info.dialysis_frequency ?? 3} onChange={handleChange} required className="border p-1 rounded w-20" /></label>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-2">
          입력하고 궁합 진단하기
        </button>
      </form>
      <button
        onClick={() => router.push("/recommend")}
        className="w-full bg-green-500 text-white py-2 rounded mt-4 max-w-md"
      >
        추천 식단 보기
      </button>
    </main>
  );
}