// UI Components for Student Management Portal

/**
 * Creates a student card without photos, using initial-icons and badges.
 */
function createStudentCard(student) {
    const initial = student.name.charAt(0);
    const statusClass = `badge-${student.status === '출근' ? 'work' : (student.status === '등교' ? 'school' : 'absent')}`;

    return `
        <div class="student-card-modern clickable-area" onclick="filterByCompany('${student.companyId}')">
            <div class="student-main">
                <div class="initial-box">${initial}</div>
                <div class="student-info">
                    <div class="name-row">
                        <span class="student-name">${student.name}</span>
                        <span class="status-badge-modern ${statusClass}">${student.status === '출근' ? '기업 출근' : '학교 등교'}</span>
                    </div>
                    <div class="student-meta">${student.grade}학년 | 담당: ${student.teacher}</div>
                </div>
            </div>
            <div class="student-footer">
                <span class="label">배정기업</span>
                <div class="company-box">
                    <span class="company-logo-small">${student.companyIcon || '⚙️'}</span>
                    <span class="company-name">${student.company}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Creates a status summary bar for the dashboard.
 */
function createStatusSummary(students) {
    const atWork = students.filter(s => s.status === '출근').length;
    const atSchool = students.filter(s => s.status === '등교').length;
    const total = students.length;

    return `
        <div class="status-bar-container">
            <div class="status-summary-text">
                전체 <strong>${total}</strong>명 중 
                <span class="txt-work">${atWork}명 기업 실습</span>, 
                <span class="txt-school">${atSchool}명 학교 수업</span> 중
            </div>
            <div class="status-progress-bar">
                <div class="progress-segment work" style="width: ${(atWork / total) * 100}%"></div>
                <div class="progress-segment school" style="width: ${(atSchool / total) * 100}%"></div>
            </div>
        </div>
    `;
}

/**
 * Creates a D-Day Widget for the portal dashboard.
 */
function createDDayWidget(events) {
    if (!events || events.length === 0) return '<p style="color:#888; font-size:0.85rem;">예정된 일정이 없습니다.</p>';

    const upcoming = events.filter(e => e.daysLeft >= -2); // Still relevant if passed within 2 days

    return `
        <div class="dday-list">
            ${upcoming.slice(0, 4).map(e => {
        let urgencyClass = 'normal-blue';
        if (e.daysLeft <= 7 && e.daysLeft >= 0) urgencyClass = 'urgent-red';
        else if (e.daysLeft <= 30 && e.daysLeft >= 0) urgencyClass = 'urgent-orange';
        else if (e.daysLeft < 0) urgencyClass = 'passed';

        const dDayText = e.daysLeft === 0 ? 'D-Day' : (e.daysLeft < 0 ? '종료' : `D-${e.daysLeft}`);

        return `
                    <div class="dday-card ${urgencyClass}">
                        <div class="dday-icon">${e.icon}</div>
                        <div class="dday-info">
                            <div class="dday-name">${e.title}</div>
                            <div class="dday-date">${e.date}</div>
                        </div>
                        <div class="dday-label">${dDayText}</div>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}
/**
 * Creates a company directory card with OJT subject info.
 */
function createCompanyCard(company, isActive = false) {
    return `
        <div class="company-item-card ${isActive ? 'active' : ''}" onclick="selectCompany('${company.id}')">
            <div class="com-header">
                <span class="com-name">${company.name}</span>
                <span class="com-icon">${company.icon}</span>
            </div>
            <div class="com-meta">📍 ${company.address}</div>
            <div class="com-meta">🏭 ${company.industry}</div>
            <div class="ojt-subjects">
                <div style="margin-bottom:5px;"><span class="ojt-tag">2학년</span> ${company.subjects.g2}</div>
                <div><span class="ojt-tag">3학년</span> ${company.subjects.g3}</div>
            </div>
        </div>
    `;
}
