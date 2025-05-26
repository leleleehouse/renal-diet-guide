import React from 'react';
import { useRouter } from 'next/router';

const FaqPage = () => {
  const router = useRouter();

  const faqItems = [
    {
      question: '카페에선 무엇을 먹을 수 있나요?',
      answer:
        '커피는 블랙으로 적정량 섭취하고, 우유·초콜릿 첨가 음료는 피해야 합니다. 커피나 주스를 마실 때 칼륨과 수분 함량을 반드시 확인하고, 과도한 섭취는 혈압 상승과 부종을 유발할 수 있습니다.',
    },
    {
      question: '과일이 먹고 싶어요!',
      answer:
        '고칼륨혈증 예방을 위해 멜론, 바나나, 키위 등 고칼륨 과일은 피하고 사과, 포도, 파인애플 등 저칼륨 과일을 선택해야 합니다. 껍질 제거, 통조림 시럽 제외, 건과일 자제 등으로 과일 섭취 시 칼륨 섭취를 줄이는 것이 중요합니다.',
    },
    {
      question: '외식 시 어떻게 먹어야 하나요?',
      answer:
        '외식 시 단백질이 포함된 균형 잡힌 식단을 선택하되, 염분·칼륨·인 섭취를 줄이고 과식을 피해야 합니다. 탕류는 건더기 위주, 면류는 국물 제외, 양념은 최소화하며, 고기·소스·채소량을 조절해 섭취해야 합니다.',
    },
  ];

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-[#1e1e1e] dark:text-white">
        💬 만성 신부전 Q&A
      </h1>
      <div className="space-y-4 mb-8">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#1c1f23] border border-[#d1d6db] dark:border-[#3a3d40] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            <h2 className="text-base sm:text-lg font-semibold text-[#3182F6] mb-2">
              Q. {item.question}
            </h2>
            <p className="text-sm sm:text-base text-[#333d4b] dark:text-white leading-relaxed">
              A. {item.answer}
            </p>
          </div>
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

export default FaqPage;
