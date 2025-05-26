import { useRouter } from "next/router";
import { usePatientStore } from "../stores/usePatientStore";

export default function Home() {
  const router = useRouter();
  const info = usePatientStore((state) => state.info);
  const setInfo = usePatientStore((state) => state.setInfo);

  // 입력값 변경 시 전역 상태에 바로 반영
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      const { checked } = e.target;
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
      <h1 className="text-3xl font-bold">신장환자 식이 관련 챗봇</h1>
      <p className="text-gray-600 mb-6">신장환자 식이에 대해 물어보세요</p>
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
        {/* <div>
          <label>투석 주기(회/주): <input name="dialysis_frequency" type="number" value={info.dialysis_frequency ?? 3} onChange={handleChange} required className="border p-1 rounded w-20" /></label>
        </div> */}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-2">
          신장 전문 챗봇과 대화하기
        </button>
      </form>
      {/* <button
        onClick={() => router.push("/recommend")}
        className="w-full bg-green-500 text-white py-2 rounded mt-4 max-w-md"
      >
        추천 식단 보기
      </button> */}
      <div className="mt-8 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-3">정보 및 가이드</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push("/checklist")}
            className="bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            식단 체크리스트
          </button>
          <button
            onClick={() => router.push("/faq")}
            className="bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            자주 묻는 질문 (FAQ)
          </button>
          <button
            onClick={() => router.push("/references")}
            className="bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            참고 문헌
          </button>
        </div>
      </div>
    </main>
  );
}