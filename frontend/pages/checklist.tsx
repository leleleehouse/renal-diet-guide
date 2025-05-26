import React from 'react';

const ChecklistPage = () => {
  const checklistItems = [
    '채소는 데치거나 삶아서 칼륨을 줄인 뒤 섭취했나요?',
    '끼니마다 고기, 생선, 달걀, 두부 등 적절한 단백질을 포함했나요?',
    '가공식품(햄, 소시지, 라면 등)을 피했나요?',
    '탕류는 국물을 남기고 건더기만 섭취했나요?',
    '생채소나 과일 주스를 과량 섭취하지 않았나요?',
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">만성 신부전 환자 식단 체크리스트</h1>
      <ul className="list-disc pl-5">
        {checklistItems.map((item, index) => (
          <li key={index} className="mb-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              {item}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChecklistPage; 