import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Teacher from './models/Teacher';
import Student from './models/Student';
import Lesson, { LessonStatus } from './models/Lesson';

dotenv.config({ path: '../.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studentlms';

const initialTeachers = [
    {
        id: 't1', name: '배한일', major: '연세대 물리학과', contractEndDate: '2025-02', contractTerminationDate: '2024-09-30', classStartDate: '2024-03-15', phone: '01055829031', policeCheckDate: '2024-02-19', contractDate: '2024-02-20', dob: '1997-10-11', address: '경상남도 창원시 마산합포구 자산남4길', residentRegistrationNumber: '971011-1894218', email: 'hi0phy@yonsei.ac.kr', bankAccountNumber: '기업은행 980-006517-01-010',
        password: '1234'
    },
    {
        id: 't2', name: '정서영', major: '연세대 심리학석사', contractEndDate: '2024-12', phone: '01066529121', policeCheckDate: '2024-02-20', contractDate: '2024-02-20', dob: '1997-03-25', address: '서울특별시 관악구 남부순환로 184길 14', residentRegistrationNumber: '970325-2617116', email: 'ppo0325@gmail.com', bankAccountNumber: '카카오뱅크 3333-04-1144370',
        password: '1234'
    },
    { id: 't3', name: '박정훈', major: '고려대학교-화학과', contractEndDate: '2025-08', password: '1234' },
    { id: 't4', name: '원장님', major: 'N/A', password: '1234' },
    { id: 't5', name: '박건우', major: '미지정', password: '1234' },
    { id: 't6', name: '안예원', major: '미지정', password: '1234' },
    { id: 't7', name: '김국중', major: '미지정', password: '1234' },
    { id: 't8', name: '양수민', major: '미지정', password: '1234' },
    { id: 't9', name: '오우빈', major: '미지정', password: '1234' },
    { id: 't10', name: '김준모', major: '미지정', password: '1234' },
    { id: 't11', name: '이지윤', major: '미지정', password: '1234' },
    { id: 't12', name: '이나현', major: '미지정', password: '1234' },
    { id: 't13', name: '서승환', major: '미지정', password: '1234' },
    { id: 't14', name: '이세비', major: '미지정', password: '1234' },
    { id: 't15', name: '고세환', major: '미지정', password: '1234' },
    { id: 't16', name: '윤형남', major: '미지정', password: '1234' },
    { id: 't17', name: '김태성', major: '미지정', password: '1234' },
    { id: 't18', name: '홍용찬', major: '미지정', password: '1234' },
    { id: 't19', name: '고준섭', major: '미지정', password: '1234' },
    { id: 't20', name: '김혜나', major: '미지정', password: '1234' },
    { id: 't21', name: '최윤서', major: '미지정', password: '1234' },
    { id: 't22', name: '박이슬', major: '미지정', password: '1234' },
    { id: 't23', name: '김동현', major: '미지정', password: '1234' },
    { id: 't24', name: '이세진', major: '미지정', password: '1234' },
];

const teacherNameMap: { [key: string]: string } = initialTeachers.reduce((acc: any, teacher) => {
    acc[teacher.name] = teacher.id;
    return acc;
}, {} as { [key: string]: string });

const initialStudents = [
    { id: 's0', name: '허은', school: '광남중', grade: '중3', careerPath: '인문', initialRegistrationDate: '2025-09-17', previousRegistrationMonth: '2025-09', reRegistrationMonth: '2026-01', registrationStatus: '등록', phoneStudent: '01047024254', phoneParent: '01047024254', classType: '자기소개서', teacherId: teacherNameMap['원장님'], desiredMajor: '인문', email: '조사 필요', address: '서울특별시 광진구 구의강변로 94, 601동 901호', totalLessons: 12, lessonsCompleted: 0 },
    { id: 's1', name: '서예림', school: '해운대여고', grade: '고1', careerPath: '사회계열', initialRegistrationDate: '2024-11-09', previousRegistrationMonth: '2024-07', reRegistrationMonth: '2025-01', registrationStatus: '등록', phoneStudent: '01048257608', phoneParent: '01047977608', classType: '탐구보고서', teacherId: teacherNameMap['박건우'], desiredMajor: '인문', email: 'a01048257608@gmail.com', address: '부산 해운대구 해운대로 723 타워마브러스 101동 2211호', totalLessons: 12, lessonsCompleted: 8 },
    { id: 's2', name: '김수연', school: '수원 태장고', grade: '고1', careerPath: '의약학', initialRegistrationDate: '2024-12-28', previousRegistrationMonth: '2024-07', reRegistrationMonth: '2025-01', registrationStatus: '등록', phoneStudent: '01084523712', phoneParent: '01052332192', classType: '병행', teacherId: teacherNameMap['안예원'], desiredMajor: '의약학', email: 'connton1@gmail.com', address: '경기도 수원시 영통구 매영로310번길 27, 651동 106호 (영통동,신나무실미주아파트)', totalLessons: 12, lessonsCompleted: 5 },
    { id: 's3', name: '이하린', school: '청주주성고', grade: '고1', careerPath: '메디컬', initialRegistrationDate: '2024-12-28', previousRegistrationMonth: '2024-07', reRegistrationMonth: '2025-01', registrationStatus: '등록', phoneStudent: '01088860214', phoneParent: '01038394865', classType: '병행', teacherId: teacherNameMap['김국중'], desiredMajor: '메디컬', email: 'cjh041481@gmail.com', address: '충청북도 청주시 흥덕구 대신로 74번길', totalLessons: 12, lessonsCompleted: 3 },
    { id: 's4', name: '한채은', school: '수지고', grade: '고1', careerPath: '공학', initialRegistrationDate: '2024-12-28', previousRegistrationMonth: '2024-07', reRegistrationMonth: '2025-01', registrationStatus: '등록', phoneStudent: '01074163437', phoneParent: '01090213437', classType: '병행', teacherId: teacherNameMap['양수민'], desiredMajor: '공학', email: 'chan.wlq9@gmail.com', address: '경기도 용인시 수지구 진산로34번길 24, 104동 602호 (풍덕천동,진산마을푸르지오아파트)', totalLessons: 12, lessonsCompleted: 10 },
    { id: 's5', name: '차이한', school: '대전 대신고', grade: '고1', careerPath: '대전 대신고 예정', initialRegistrationDate: '2024-12-28', previousRegistrationMonth: '2024-07', reRegistrationMonth: '2025-01', registrationStatus: '등록', phoneStudent: '01063505306', phoneParent: '01063565306', classType: '병행', teacherId: teacherNameMap['오우빈'], desiredMajor: '공학', email: '25_cih0316@dshs.kr', address: '대전광역시 유성구 북유성대로 219, 101동 703호 (지족동,인앤인주상복합)', totalLessons: 12, lessonsCompleted: 12 },
    { id: 's6', name: '박성욱', school: '광주서강고', grade: '고1', careerPath: '의예', initialRegistrationDate: '2025-02-15', previousRegistrationMonth: '2024-08', reRegistrationMonth: '2025-02', registrationStatus: '등록', phoneStudent: '01034849092', phoneParent: '01024849092', classType: '병행', teacherId: teacherNameMap['김준모'], desiredMajor: '의예', email: 'sungwook09@gmail.com', address: '광주광역시 북구 설죽로 391, 101동 603호', totalLessons: 12, lessonsCompleted: 2 },
    { id: 's7', name: '이서준', school: '대원외고', grade: '고2', careerPath: '상경', initialRegistrationDate: '2024-03-10', previousRegistrationMonth: '2024-09', reRegistrationMonth: '2025-03', registrationStatus: '등록', phoneStudent: '01012345678', phoneParent: '01087654321', classType: '생기부 컨설팅', teacherId: teacherNameMap['박정훈'], desiredMajor: '경제학과', email: 'seojun.lee@example.com', address: '서울특별시 강남구 테헤란로 123', totalLessons: 24, lessonsCompleted: 15 },
    { id: 's8', name: '최지우', school: '용인외대부고', grade: '고3', careerPath: '자연과학', initialRegistrationDate: '2023-01-20', previousRegistrationMonth: '2024-07', reRegistrationMonth: '2025-01', registrationStatus: '등록', phoneStudent: '01022223333', phoneParent: '01044445555', classType: '심층면접', teacherId: teacherNameMap['배한일'], desiredMajor: '화학과', email: 'jiwoo.choi@example.com', address: '경기도 용인시 처인구', totalLessons: 30, lessonsCompleted: 28 },
    { id: 's9', name: '미배정학생', school: '미정', grade: '고1', careerPath: '미정', totalLessons: 10, lessonsCompleted: 0 }
];

const initialLessons: { [key: string]: any[] } = {
    's1': [
        { id: 'l1-1', date: '2024-07-15T09:00:00.000Z', status: LessonStatus.Completed, planReviewStatus: '완료', reportFileLink: '서예림_탐구보고서_완료본.pdf', schoolSubmissionStatus: '제출완료' },
        { id: 'l1-2', date: '2024-07-22T09:00:00.000Z', status: LessonStatus.Completed, planReviewStatus: '완료', reportFileLink: '서예림_탐구보고서_초안.pdf' },
        { id: 'l1-3', date: '2024-08-05T09:00:00.000Z', status: LessonStatus.Scheduled, planReviewStatus: '미검수' },
    ],
    's2': [
        { id: 'l2-1', date: '2024-07-18T14:00:00.000Z', status: LessonStatus.Completed, planReviewStatus: '완료', reportFileLink: '김수연_보고서_최종.docx', schoolSubmissionStatus: '미제출' },
        { id: 'l2-2', date: '2024-07-25T14:00:00.000Z', status: LessonStatus.Cancelled },
        { id: 'l2-3', date: '2024-08-01T14:00:00.000Z', status: LessonStatus.Scheduled, planReviewStatus: '수정요청' },
    ],
    's8': [
        { id: 'l8-1', date: '2024-08-02T11:00:00.000Z', status: LessonStatus.Scheduled, planReviewStatus: '미검수' },
    ],
};

const seed = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('Connected to MongoDB for seeding');

        // Clear existing data
        await Teacher.deleteMany({});
        await Student.deleteMany({});
        await Lesson.deleteMany({});
        console.log('Cleared existing data');

        // Insert Teachers
        await Teacher.insertMany(initialTeachers);
        console.log(`Inserted ${initialTeachers.length} teachers`);

        // Insert Students
        await Student.insertMany(initialStudents);
        console.log(`Inserted ${initialStudents.length} students`);

        // Insert Lessons
        const lessonsToInsert: any[] = [];
        for (const [studentId, lessons] of Object.entries(initialLessons)) {
            lessons.forEach(lesson => {
                lessonsToInsert.push({ ...lesson, studentId });
            });
        }
        if (lessonsToInsert.length > 0) {
            await Lesson.insertMany(lessonsToInsert);
            console.log(`Inserted ${lessonsToInsert.length} lessons`);
        }

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seed();
