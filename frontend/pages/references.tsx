import React from 'react';

const ReferencesPage = () => {
  const references = [
    {
      title: 'MSD 매뉴얼 일반인용 | 만성 신장 질환',
      url: 'https://www.msdmanuals.com/ko/home/%EC%8B%A0%EC%9E%A5-%EB%B0%8F-%EC%9A%94%EB%A1%9C-%EC%A7%88%ED%99%98/%EC%8B%A0%EB%B6%80%EC%A0%84/%EB%A7%8C%EC%84%B1-%EC%8B%A0%EC%9E%A5-%EC%A7%88%ED%99%98#%EC%A6%9D%EC%83%81_v761491_ko',
    },
    {
      title: '대한신장학회 | 일반인을 위한 Q&A',
      url: 'https://ksn.or.kr/bbs/?code=g_faq&category=3',
    },
    {
      title: '서울대학교병원 | 만성콩팥병',
      url: 'https://www.snuh.org/health/nMedInfo/nView.do?category=DIS&medid=AA000367',
    },
    {
      title: '삼성서울병원 | 만성콩팥병의 영양관리',
      url: 'http://www.samsunghospital.com/dept/medical/dietarySub01.do?content_id=629&DP_CODE=DD2&MENU_ID=002049&ds_code=D0004316',
    },
    {
      title: '대한신장학회 | 혈액투석 환자를 위한 영양-식생활 관리 (PDF)',
      url: 'https://ksn.or.kr/upload/general/ebook/2%EA%B6%8C%20%ED%98%88%EC%95%A1%ED%88%AC%EC%84%9D%20%ED%99%98%EC%9E%90%EB%A5%BC%20%EC%9C%84%ED%95%9C%20%EC%98%81%EC%96%91-%EC%8B%9D%EC%83%9D%ED%99%9C%20%EA%B4%80%EB%A6%AC.pdf',
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">참고문헌</h1>
      <ul className="list-disc pl-5">
        {references.map((ref, index) => (
          <li key={index} className="mb-2">
            <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {ref.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReferencesPage; 