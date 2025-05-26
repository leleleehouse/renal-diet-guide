import React from 'react';
import { useRouter } from 'next/router';

const ChecklistPage = () => {
  const router = useRouter();

  const checklistItems = [
    '채소는 데치거나 삶아서 칼륨을 줄인 뒤 섭취했나요?',
    '끼니마다 고기, 생선, 달걀, 두부 등 적절한 단백질을 포함했나요?',
    '가공식품(햄, 소시지, 라면 등)을 피했나요?',
    '탕류는 국물을 남기고 건더기만 섭취했나요?',
    '생채소나 과일 주스를 과량 섭취하지 않았나요?',
  ];

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-[#1e1e1e] dark:text-white">
        ✅ 만성 신부전 환자 식단 체크리스트
      </h1>
      <div className="space-y-4 mb-8">
        {checklistItems.map((item, index) => (
          <label
            key={index}
            className="flex items-start bg-white dark:bg-[#1c1f23] border border-[#d1d6db] dark:border-[#3a3d40] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer gap-3"
          >
            <input
              type="checkbox"
              className="mt-1 accent-[#3182F6] w-5 h-5 shrink-0"
            />
            <span className="text-sm sm:text-base text-[#333d4b] dark:text-white leading-snug">
              {item}
            </span>
          </label>
        ))}
      </div>
      <div className="text-center">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-[#3182F6] text-white rounded-lg hover:bg-[#1e6ae1] transition duration-200 font-semibold"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default ChecklistPage;