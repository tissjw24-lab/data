// Master Data for Ulsan Technical High School
window.ScheduleData = {
    currentSemester: 1,
    semesters: {
        1: {
            title: '2026학년도 제1학기',
            hours: { grade2: { offjt: 150, ojt: 0 }, grade3: { offjt: 120, ojt: 0 } },
            events: [
                { date: '2026-03-02', title: '개학식' },
                { date: '2026-04-06', title: '지방기능경기대회' },
                { date: '2026-05-01', title: '근로자의 날' }
            ],
            schedule: {
                grade2: {
                    1: [{ type: 'offjt', subject: '기계기초공작' }],
                    2: [{ type: 'offjt', subject: '전기제어' }],
                    3: [{ type: 'offjt', subject: '도면분석' }],
                    4: [{ type: 'normal', subject: '보통교과' }],
                    5: [{ type: 'normal', subject: '보통교과' }]
                },
                grade3: {
                    1: [{ type: 'ojt', subject: '현장 실무' }],
                    2: [{ type: 'ojt', subject: '현장 실무' }],
                    3: [{ type: 'ojt', subject: '현장 실무' }],
                    4: [{ type: 'offjt', subject: '고정밀가공' }],
                    5: [{ type: 'offjt', subject: '프로젝트실습' }]
                }
            }
        },
        2: {
            title: '2026학년도 제2학기',
            hours: { grade2: { offjt: 100, ojt: 100 }, grade3: { offjt: 80, ojt: 150 } },
            events: [
                { date: '2026-08-24', title: '개학식' },
                { date: '2026-09-20', title: '전국기능경기대회' },
                { date: '2026-12-10', title: '외부평가' }
            ],
            schedule: {
                grade2: {
                    1: [{ type: 'offjt', subject: 'CNC선반' }],
                    2: [{ type: 'offjt', subject: '밀링가공' }],
                    3: [{ type: 'ojt', subject: 'OJT 현장실습' }],
                    4: [{ type: 'ojt', subject: 'OJT 현장실습' }],
                    5: [{ type: 'normal', subject: '보통교과' }]
                },
                grade3: {
                    1: [{ type: 'ojt', subject: 'OJT 심화과정' }],
                    2: [{ type: 'ojt', subject: 'OJT 심화과정' }],
                    3: [{ type: 'ojt', subject: 'OJT 심화과정' }],
                    4: [{ type: 'offjt', subject: '융합실습' }],
                    5: [{ type: 'offjt', subject: '최종평가준비' }]
                }
            }
        }
    },
    setSemester(sem) { this.currentSemester = parseInt(sem); },
    getTodaySchedule(grade) {
        const day = new Date().getDay();
        const sem = this.semesters[this.currentSemester];
        if (!sem.schedule[`grade${grade}`]) return [{ type: 'rest', subject: '일정 없음' }];
        if (!sem.schedule[`grade${grade}`][day]) return [{ type: 'rest', subject: '일정 없음' }];
        return sem.schedule[`grade${grade}`][day];
    },
    getUpcomingEvents() {
        const today = new Date();
        const sem = this.semesters[this.currentSemester];

        return sem.events.map(event => {
            const eventDate = new Date(event.date);
            const timeDiff = eventDate.getTime() - today.getTime();
            const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

            // Determine Icon
            let icon = '🏛️';
            if (event.title.includes('기능경기')) icon = '🏆';
            if (event.title.includes('고사')) icon = '✏️';
            if (event.title.includes('평가')) icon = '📝';
            if (event.title.includes('방학')) icon = '🏖️';

            return {
                ...event,
                daysLeft,
                icon
            };
        }).sort((a, b) => a.daysLeft - b.daysLeft);
    }
};
