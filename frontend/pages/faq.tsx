import React from 'react';

const FaqPage = () => {
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">만성 신부전 Q&A</h1>
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Q. {item.question}</h2>
            <p>A. {item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPage; 