// Ulsan Technical High School Portal Logic
let dashboardChart = null;

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    navigateTo('home');
});

function initNav() {
    const btns = document.querySelectorAll('.nav-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const pageId = btn.getAttribute('data-page');
            navigateTo(pageId);
        });
    });
}

// Global Semester Toggle
window.changeSemester = function (sem) {
    window.ScheduleData.setSemester(sem);

    // UI Feedback
    document.getElementById('btnSem1').classList.toggle('active', sem === '1');
    document.getElementById('btnSem2').classList.toggle('active', sem === '2');

    // Refresh content with animation
    const content = document.getElementById('mainContent');
    content.classList.remove('fade-in');
    void content.offsetWidth; // trigger reflow
    content.classList.add('fade-in');

    const activeBtn = document.querySelector('.nav-btn.active');
    if (activeBtn) {
        navigateTo(activeBtn.getAttribute('data-page'));
    }
};

function navigateTo(pageId) {
    const mainContent = document.getElementById('mainContent');
    const titleEl = document.getElementById('currentPageTitle');

    // Update Active Link UI
    const btns = document.querySelectorAll('.nav-btn');
    btns.forEach(btn => {
        if (btn.getAttribute('data-page') === pageId) {
            btn.classList.add('active');
            titleEl.textContent = btn.textContent.split(' ').slice(1).join(' '); // Drop emoji
        } else {
            btn.classList.remove('active');
        }
    });

    // Content Router
    switch (pageId) {
        case 'home':
            renderDashboard();
            break;
        case 'intro':
            renderIntro();
            break;
        case 'schedule':
            renderSchedule();
            break;
        case 'students':
            renderStudents();
            break;
        case 'companies':
            renderCompanies();
            break;
        default:
            mainContent.innerHTML = `
                <div class="portal-card" style="text-align:center;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🗓️</div>
                    <h3>해당 학기 일정이 아직 등록되지 않았습니다.</h3>
                    <p style="color: #888; margin-top: 10px;">관리자에게 시스템 업데이트 여부를 확인해 주시기 바랍니다.</p>
                </div>
            `;
    }

    // Workspace scroll reset
    document.querySelector('.content-area').scrollTo(0, 0);
}

// DASHBOARD: Portal Style
function renderDashboard() {
    const mainContent = document.getElementById('mainContent');
    const sem = window.ScheduleData.semesters[window.ScheduleData.currentSemester];
    const students = window.AppData.students;

    mainContent.innerHTML = `
        <!-- Real-time Status Summary -->
        ${createStatusSummary(students)}

        <div class="portal-grid">
            <div class="portal-card">
                <div class="card-title">📊 실시간 교육 이수율 (${sem.title})</div>
                <div style="height: 300px;">
                    <canvas id="portalChart"></canvas>
                </div>
            </div>
            <div class="portal-card">
                <div class="card-title">🏆 주요 학사 및 도제 일정 (D-Day)</div>
                ${createDDayWidget(window.ScheduleData.getUpcomingEvents())}
                
                <div class="card-title" style="margin-top: 30px;">📍 금일 주요 학습 및 현장실습</div>
                <div style="margin-top: 10px;">
                    <div style="font-weight:700; font-size: 0.9rem; color: var(--navy-primary); border-bottom:1px solid #eee; padding-bottom:5px;">[3학년 본교/기업 일정]</div>
                    <div style="padding: 15px 0;">
                        ${window.ScheduleData.getTodaySchedule(3).map(s => `
                            <div class="type-${s.type}" style="font-size:0.85rem; margin-bottom:5px; padding: 8px; border-radius: 4px;">• ${s.subject}</div>
                        `).join('')}
                    </div>
                    
                    <div style="font-weight:700; font-size: 0.9rem; color: var(--navy-primary); border-bottom:1px solid #eee; padding-bottom:5px; margin-top:10px;">[2학년 본교/기업 일정]</div>
                    <div style="padding: 15px 0;">
                        ${window.ScheduleData.getTodaySchedule(2).map(s => `
                            <div class="type-${s.type}" style="font-size:0.85rem; margin-bottom:5px; padding: 8px; border-radius: 4px;">• ${s.subject}</div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>

        <div class="portal-card" style="margin-top: 25px;">
            <div class="card-title">📅 행정 주요 일정 안내</div>
            <table class="portal-table">
                <thead>
                    <tr><th>일자</th><th>구분</th><th>주요 내용 및 지침</th></tr>
                </thead>
                <tbody>
                    ${sem.events.map(e => `
                        <tr>
                            <td style="font-weight:700;">${e.date}</td>
                            <td><span style="color:var(--navy-primary); font-weight:500;">학사 행정</span></td>
                            <td>${e.title}에 따른 세부 지침 확인 요망</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    initPortalChart(sem.hours);
}

function initPortalChart(hours) {
    const ctx = document.getElementById('portalChart').getContext('2d');
    if (dashboardChart) dashboardChart.destroy();

    dashboardChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['2학부 Off-JT', '2학부 OJT', '3학부 Off-JT', '3학부 OJT'],
            datasets: [{
                label: '이수 완료(시간)',
                data: [hours.grade2.offjt, hours.grade2.ojt, hours.grade3.offjt, hours.grade3.ojt],
                backgroundColor: ['#1a237e', '#3949ab', '#0277bd', '#0d47a1'],
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: '#f0f0f0' } } }
        }
    });
}

function renderIntro() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="portal-card">
            <h3 style="margin-bottom:20px; border-bottom:2px solid var(--navy-primary); display:inline-block; padding-bottom:5px;">울산공업고등학교 산학일체형 도제학교 교육 지침</h3>
            <p style="line-height:1.8; color: #555;">
                본 사업은 특성화고 학생들이 학교와 기업을 오가며 이론과 실무를 동시에 익히는 산학일체형 인재 양성 프로그램입니다.<br><br>
                <strong>[주요 교육 목표]</strong><br>
                1. 현장 중심의 기술 인재 양성 및 조기 취업 역량 강화<br>
                2. 국가직무능력표준(NCS) 기반의 체계적인 교육과정 운영<br>
                3. 기업체 멘토링을 통한 현장 적응력 및 직업 기초 능력 함양
            </p>
        </div>
    `;
}

function renderSchedule() {
    const mainContent = document.getElementById('mainContent');
    const sem = window.ScheduleData.semesters[window.ScheduleData.currentSemester];
    const days = ['월', '화', '수', '목', '금'];

    mainContent.innerHTML = `
        <div class="portal-grid">
            <div class="portal-card">
                <div class="card-title">📅 제3학년 도제학교 주간 운영표</div>
                <table class="portal-table">
                    <thead>
                        <tr>
                            <th style="width: 80px;">요일</th>
                            <th>구분</th>
                            <th>주요 학습 및 실습 과목</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${days.map(d => {
        const entries = sem.schedule.grade3[d];
        return entries.map(s => `
                                <tr>
                                    <td style="background:#f8f9fa; font-weight:700; text-align:center;">${d}</td>
                                    <td class="type-${s.type}" style="text-align:center; width: 100px;">
                                        ${s.type.toUpperCase()}
                                    </td>
                                    <td class="schedule-cell ${s.type === 'offjt' ? 'type-offjt' : (s.type === 'ojt' ? 'type-ojt' : '')}">
                                        ${s.subject}
                                    </td>
                                </tr>
                            `).join('');
    }).join('')}
                    </tbody>
                </table>
            </div>
            <div class="portal-card">
                <div class="card-title">📅 제2학년 도제학교 주간 운영표</div>
                <table class="portal-table">
                    <thead>
                        <tr>
                            <th style="width: 80px;">요일</th>
                            <th>구분</th>
                            <th>주요 학습 및 실습 과목</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${days.map(d => {
        const entries = sem.schedule.grade2[d];
        return entries.map(s => `
                                <tr>
                                    <td style="background:#f8f9fa; font-weight:700; text-align:center;">${d}</td>
                                    <td class="type-${s.type}" style="text-align:center; width: 100px;">
                                        ${s.type.toUpperCase()}
                                    </td>
                                    <td class="schedule-cell ${s.type === 'offjt' ? 'type-offjt' : (s.type === 'ojt' ? 'type-ojt' : '')}">
                                        ${s.subject}
                                    </td>
                                </tr>
                            `).join('');
    }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="portal-card" style="margin-top: 25px;">
            <div class="card-title">📖 교육과정 안내 및 지침</div>
            <div style="font-size: 0.9rem; color: #666; line-height: 1.6;">
                <p>• <strong>Off-JT (집체교육)</strong>: 학교 내 실습실에서 진행되는 이론 및 기초 기술 교육입니다. <span class="type-offjt" style="padding: 2px 6px; border-radius: 3px;">(파란색 표시)</span></p>
                <p>• <strong>OJT (현장교육)</strong>: 협약 기업체 현장에서 멘토와 함께 진행하는 실무 기술 교육입니다. <span class="type-ojt" style="padding: 2px 6px; border-radius: 3px;">(초록색 표시)</span></p>
                <p>• 본 시간표는 2026학년도 도제학교 운영 계획에 따라 편성되었으며, 기업체 사정에 따라 일부 변경될 수 있습니다.</p>
            </div>
        </div>
    `;
}

function renderStudents(filterCompanyId = null) {
    const mainContent = document.getElementById('mainContent');
    // Ensure data is sorted
    let students = window.AppData.students.sort((a, b) => a.name.localeCompare(b.name, 'ko'));

    if (filterCompanyId) {
        students = students.filter(s => s.companyId === filterCompanyId);
    }

    const companyName = filterCompanyId ? window.AppData.companies.find(c => c.id === filterCompanyId).name : '';

    mainContent.innerHTML = `
        <div class="portal-card">
            <div class="card-title">
                📑 도제 참여 학생 정기 인사 현황 ${filterCompanyId ? `(${companyName} 배정)` : '(가나다순)'}
                ${filterCompanyId ? `<button class="sem-btn" style="margin-left:15px; font-size:0.7rem;" onclick="renderStudents()">전체보기</button>` : ''}
            </div>
            <div class="student-grid-modern">
                ${students.length > 0 ? students.map(s => createStudentCard(s)).join('') : '<p style="padding:20px; color:#999;">배정된 학생이 없습니다.</p>'}
            </div>
        </div>
    `;
}

// COMPANY MAPPING: Portal Style
function renderCompanies() {
    const mainContent = document.getElementById('mainContent');
    const companies = window.AppData.companies;

    mainContent.innerHTML = `
        <div class="company-layout">
            <div class="company-list-pane">
                <div class="pane-header">협약 기업 리스트</div>
                <div class="company-scroll-area">
                    ${companies.map(c => createCompanyCard(c)).join('')}
                </div>
            </div>
            <div class="map-pane">
                <div class="map-placeholder-content" id="mapPlaceholder">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🗺️</div>
                    <h3 style="color: var(--navy-dark);">울산공업고등학교 도제 기업 통합 맵</h3>
                    <p style="margin-top:10px;">기업을 선택하시면 위치 및 배정 학생 정보를 확인할 수 있습니다.</p>
                    <button class="map-btn">지도 엔진 라이선스 활성화</button>
                    
                    <div id="companyDetailOverlay" style="display:none; margin-top:30px; background:white; padding:20px; border-radius:8px; width:80%; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
                        <div id="overlayContent"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Internal Logic per user request
window.selectCompany = function (id) {
    const company = window.AppData.companies.find(c => c.id === id);
    const assignedCount = window.AppData.students.filter(s => s.companyId === id).length;

    // UI Update (Pane)
    document.querySelectorAll('.company-item-card').forEach(card => {
        card.classList.toggle('active', card.innerHTML.includes(company.name));
    });

    // Content Overlay
    const overlay = document.getElementById('companyDetailOverlay');
    const content = document.getElementById('overlayContent');

    overlay.style.display = 'block';
    content.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
                <h2 style="color:var(--navy-primary); margin-bottom:5px;">${company.icon} ${company.name}</h2>
                <div style="font-size:0.9rem; color:#666; margin-bottom:15px;">📍 ${company.address}</div>
            </div>
            <button class="sem-btn active" onclick="renderStudents('${id}')">배정 학생 ${assignedCount}명 관리</button>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; border-top:1px solid #eee; padding-top:15px;">
            <div class="ojt-subjects">
                <div style="color:var(--navy-dark); font-weight:700; margin-bottom:8px;">🛠️ 기업 운영 OJT 과목</div>
                <div style="margin-bottom:5px;"><span class="ojt-tag">2학년</span> ${company.subjects.g2}</div>
                <div><span class="ojt-tag">3학년</span> ${company.subjects.g3}</div>
            </div>
            <div style="font-size:0.85rem; color:#555;">
                <strong>[기업 특이사항]</strong><br>
                • 해당 기업은 울산공고 기계시스템과 중점 협약처입니다.<br>
                • 실습 시간: 09:00 ~ 18:00 (OJT 지침 준수)
            </div>
        </div>
    `;
}

window.filterByCompany = function (id) {
    navigateTo('students');
    setTimeout(() => renderStudents(id), 50); // Small delay to ensure renderStudents is called after switch
}
