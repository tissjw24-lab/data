// Student & Partner Company Data for Ulsan Technical High School
window.AppData = {
  // Partner Company Database
  companies: [
    {
      id: 'c1', name: '현대모비스(주)', industry: '자동차 부품 제조',
      address: '울산광역시 북구 현대로', icon: '🚙',
      subjects: { g2: '성형가공 / 측정', g3: '기계수동조립' }
    },
    {
      id: 'c2', name: '(주)대성정밀', industry: '금형 및 절삭가공',
      address: '울산광역시 중구 효자로', icon: '⚙️',
      subjects: { g2: '밀링가공 / 도면해독', g3: 'CAM / 기계조립' }
    },
    {
      id: 'c3', name: '현대중공업(주)', industry: '조선 및 해양 플랜트',
      address: '울산광역시 동구 방어진순환도로', icon: '🚢',
      subjects: { g2: '선반가공 / 측정', g3: '기계수동조립' }
    },
    {
      id: 'c4', name: '삼성정밀기계', industry: '정밀 기계 부품',
      address: '울산광역시 남구 산업로', icon: '🔬',
      subjects: { g2: '측정 / 도면해독', g3: 'CAM-밀링가공' }
    },
    {
      id: 'c5', name: '(주)태광공업', industry: '기계 요소 부품',
      address: '울산광역시 울주군 온산읍', icon: '🏗️',
      subjects: { g2: '성형가공', g3: '기계수동조립 / 3D모델링' }
    },
    {
      id: 'c6', name: '케이엠정밀', industry: '항공 부품 및 가공',
      address: '울산광역시 중구 염포로', icon: '✈️',
      subjects: { g2: '밀링가공', g3: 'CAM / 기계요소설계' }
    }
  ],

  // Helper to get automatic status based on day of week
  getAutomaticStatus(grade) {
    const day = new Date().getDay();
    if (day === 0 || day === 6) return '휴무';
    if (grade === 2) {
      if (day === 3) return '등교';
      if (day === 4 || day === 5) return '출근';
      return '등교';
    } else if (grade === 3) {
      if (day === 1 || day === 2 || day === 3) return '출근';
      if (day === 4 || day === 5) return '등교';
      return '출근';
    }
    return '기타';
  },

  students: [
    { name: '강민준', grade: 2, companyId: 'c1', teacher: '김철수' },
    { name: '김도윤', grade: 2, companyId: 'c2', teacher: '김철수' },
    { name: '김서준', grade: 2, companyId: 'c3', teacher: '김철수' },
    { name: '김시우', grade: 3, companyId: 'c4', teacher: '박지성' },
    { name: '박건우', grade: 3, companyId: 'c5', teacher: '박지성' },
    { name: '박서연', grade: 2, companyId: 'c6', teacher: '김철수' },
    { name: '박준서', grade: 3, companyId: 'c1', teacher: '박지성' }, // Reuse c1
    { name: '서연우', grade: 3, companyId: 'c2', teacher: '박지성' },
    { name: '성민재', grade: 2, companyId: 'c3', teacher: '김철수' },
    { name: '신지우', grade: 3, companyId: 'c4', teacher: '박지성' },
    { name: '안지민', grade: 2, companyId: 'c5', teacher: '김철수' },
    { name: '윤서윤', grade: 2, companyId: 'c6', teacher: '김철수' },
    { name: '이민서', grade: 3, companyId: 'c1', teacher: '박지성' },
    { name: '이준혁', grade: 3, companyId: 'c2', teacher: '박지성' },
    { name: '이현우', grade: 2, companyId: 'c3', teacher: '김철수' },
    { name: '정예준', grade: 3, companyId: 'c4', teacher: '박지성' },
    { name: '조주원', grade: 2, companyId: 'c5', teacher: '김철수' },
    { name: '최도윤', grade: 3, companyId: 'c6', teacher: '박지성' },
    { name: '최지우', grade: 2, companyId: 'c1', teacher: '김철수' },
    { name: '한하준', grade: 3, companyId: 'c2', teacher: '박지성' }
  ].sort((a, b) => a.name.localeCompare(b.name, 'ko'))
};

// Map company names for easy lookup
window.AppData.students.forEach(s => {
  s.status = window.AppData.getAutomaticStatus(s.grade);
  const company = window.AppData.companies.find(c => c.id === s.companyId);
  s.company = company ? company.name : '미배정';
  s.companyIcon = company ? company.icon : '❓';
});
