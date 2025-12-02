import React, { useState, useCallback, useEffect } from 'react';
import { Teacher, Student, StudentWithLessons, Lesson, LessonStatus } from './types';
import Modal from './components/Modal';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import TeacherManager from './components/TeacherManager';
import StudentManager from './components/StudentManager';
import ScheduleManager from './components/ScheduleManager';
import StudentSchedulePublicView from './components/StudentSchedulePublicView';
import LessonDetailModal from './components/LessonDetailModal';
import StudentSheetManager from './components/StudentSheetManager';
import TeacherPortal from './components/TeacherPortal';
import StudentDetail from './components/StudentDetail';
import TeacherDetail from './components/TeacherDetail';
import ScheduleGrid from './components/ScheduleGrid';

// FIX: Export the View type for other components to use.
export type View =
  | 'dashboard'
  | 'scheduleGrid'
  | 'calendar'
  | 'teachers'
  | 'students'
  | 'schedules'
  | 'studentSheet'
  | 'teacherPortal'
  | 'studentDetail'
  | 'teacherDetail';


const generateId = () => `id_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;

const initialTeachers: Teacher[] = [
    { 
        id: 't1', name: '배한일', major: '연세대 물리학과', contractEndDate: '2025-02', contractTerminationDate: '2024-09-30', classStartDate: '2024-03-15', phone: '010-5582-9031', policeCheckDate: '2024-02-19', contractDate: '2024-02-20', dob: '1997-10-11', address: '경상남도 창원시 마산합포구 자산남4길', residentRegistrationNumber: '971011-1894218', email: 'hi0phy@yonsei.ac.kr', bankAccountNumber: '기업은행 980-006517-01-010',
    },
    { 
        id: 't2', name: '정서영', major: '연세대 심리학석사', contractEndDate: '2024-12', phone: '010-6652-9121', policeCheckDate: '2024-02-20', contractDate: '2024-02-20', dob: '1997-03-25', address: '서울특별시 관악구 남부순환로 184길 14', residentRegistrationNumber: '970325-2617116', email: 'ppo0325@gmail.com', bankAccountNumber: '카카오뱅크 3333-04-1144370',
    },
    { id: 't3', name: '박정훈', major: '고려대학교-화학과', contractEndDate: '2025-08' },
    { id: 't4', name: '원장님', major: 'N/A' },
    { id: 't5', name: '박건우', major: '미지정' },
    { id: 't6', name: '안예원', major: '미지정' },
    { id: 't7', name: '김국중', major: '미지정' },
    { id: 't8', name: '양수민', major: '미지정' },
    { id: 't9', name: '오우빈', major: '미지정' },
    { id: 't10', name: '김준모', major: '미지정' },
    { id: 't11', name: '이지윤', major: '미지정' },
    { id: 't12', name: '이나현', major: '미지정' },
    { id: 't13', name: '서승환', major: '미지정' },
    { id: 't14', name: '이세비', major: '미지정' },
    { id: 't15', name: '고세환', major: '미지정' },
    { id: 't16', name: '윤형남', major: '미지정' },
    { id: 't17', name: '김태성', major: '미지정' },
    { id: 't18', name: '홍용찬', major: '미지정' },
    { id: 't19', name: '고준섭', major: '미지정' },
    { id: 't20', name: '김혜나', major: '미지정' },
    { id: 't21', name: '최윤서', major: '미지정' },
    { id: 't22', name: '박이슬', major: '미지정' },
    { id: 't23', name: '김동현', major: '미지정' },
    { id: 't24', name: '이세진', major: '미지정' },
];

const teacherNameMap: { [key: string]: string } = initialTeachers.reduce((acc, teacher) => {
    acc[teacher.name] = teacher.id;
    return acc;
}, {} as { [key: string]: string });

const initialStudents: Student[] = [
    { id: 's0', name: '허은', school: '광남중', grade: '중3', careerPath: '인문', initialRegistrationDate: '2025-09-17', previousRegistrationMonth: '2025-09', reRegistrationMonth: '2026-01', registrationStatus: '등록', phoneStudent: '010-4702-4254', phoneParent: '010-4702-4254', classType: '자기소개서', teacherId: teacherNameMap['원장님'], desiredMajor: '인문', email: '조사 필요', address: '서울특별시 광진구 구의강변로 94, 601동 901호', totalLessons: 12, lessonsCompleted: 0 },
    { id: 's1', name: '서예림', school: '해운대여고', grade: '고1', careerPath: '사회계열', initialRegistrationDate: '2024-11-09', previousRegistrationMonth: '2024-07', reRegistrationMonth: '2025-01', registrationStatus: '등록', phoneStudent: '010-4825-7608', phoneParent: '010-4797-7608', classType: '탐구보고서', teacherId: teacherNameMap['박건우'], desiredMajor: '인문', email: 'a01048257608@gmail.com', address: '부산 해운대구 해운대로 723 타워마브러스 101동 2211호', totalLessons: 12, lessonsCompleted: 8 },
    { id: 's2', name: '김수연', school: '수원 태장고', grade: '고1', careerPath: '의약학', initialRegistrationDate: '2024-12-28', previousRegistrationMonth: '2024-07', reRegistrationMonth: '2025-01', registrationStatus: '등록', phoneStudent: '010-8452-3712', phoneParent: '010-5233-2192', classType: '병행', teacherId: teacherNameMap['안예원'], desiredMajor: '의약학', email: 'connton1@gmail.com', address: '경기도 수원시 영통구 매영로310번길 27, 651동 106호 (영통동,신나무실미주아파트)', totalLessons: 12, lessonsCompleted: 5 },
    { id: 's3', name: '이하린', school: '청주주성고', grade: '고1', careerPath: '메디컬', initialRegistrationDate: '2024-12-28', previousRegistrationMonth: '2024-07', reRegistrationMonth: '2025-01', registrationStatus: '등록', phoneStudent: '010-8886-0214', phoneParent: '010-3839-4865', classType: '병행', teacherId: teacherNameMap['김국중'], desiredMajor: '메디컬', email: 'cjh041481@gmail.com', address: '충청북도 청주시 흥덕구 대신로 74번길', totalLessons: 12, lessonsCompleted: 3 },
    { id: 's4', name: '한채은', school: '수지고', grade: '고1', careerPath: '공학', initialRegistrationDate: '2024-12-28', previousRegistrationMonth: '2024-07', reRegistrationMonth: '2025-01', registrationStatus: '등록', phoneStudent: '010-7416-3437', phoneParent: '010-9021-3437', classType: '병행', teacherId: teacherNameMap['양수민'], desiredMajor: '공학', email: 'chan.wlq9@gmail.com', address: '경기도 용인시 수지구 진산로34번길 24, 104동 602호 (풍덕천동,진산마을푸르지오아파트)', totalLessons: 12, lessonsCompleted: 10 },
    { id: 's5', name: '차이한', school: '대전 대신고', grade: '고1', careerPath: '대전 대신고 예정', initialRegistrationDate: '2024-12-28', previousRegistrationMonth: '2024-07', reRegistrationMonth: '2025-01', registrationStatus: '등록', phoneStudent: '010-6350-5306', phoneParent: '010-6356-5306', classType: '병행', teacherId: teacherNameMap['오우빈'], desiredMajor: '공학', email: '25_cih0316@dshs.kr', address: '대전광역시 유성구 북유성대로 219, 101동 703호 (지족동,인앤인주상복합)', totalLessons: 12, lessonsCompleted: 12 },
    // FIX: Completed student data and added missing properties `totalLessons` and `lessonsCompleted`.
    { id: 's6', name: '박성욱', school: '광주서강고', grade: '고1', careerPath: '의예', initialRegistrationDate: '2025-02-15', previousRegistrationMonth: '2024-08', reRegistrationMonth: '2025-02', registrationStatus: '등록', phoneStudent: '010-3484-9092', phoneParent: '010-2484-9092', classType: '병행', teacherId: teacherNameMap['김준모'], desiredMajor: '의예', email: 'sungwook09@gmail.com', address: '광주광역시 북구 설죽로 391, 101동 603호', totalLessons: 12, lessonsCompleted: 2 },
    { id: 's7', name: '이서준', school: '대원외고', grade: '고2', careerPath: '상경', initialRegistrationDate: '2024-03-10', previousRegistrationMonth: '2024-09', reRegistrationMonth: '2025-03', registrationStatus: '등록', phoneStudent: '010-1234-5678', phoneParent: '010-8765-4321', classType: '생기부 컨설팅', teacherId: teacherNameMap['박정훈'], desiredMajor: '경제학과', email: 'seojun.lee@example.com', address: '서울특별시 강남구 테헤란로 123', totalLessons: 24, lessonsCompleted: 15 },
    { id: 's8', name: '최지우', school: '용인외대부고', grade: '고3', careerPath: '자연과학', initialRegistrationDate: '2023-01-20', previousRegistrationMonth: '2024-07', reRegistrationMonth: '2025-01', registrationStatus: '등록', phoneStudent: '010-2222-3333', phoneParent: '010-4444-5555', classType: '심층면접', teacherId: teacherNameMap['배한일'], desiredMajor: '화학과', email: 'jiwoo.choi@example.com', address: '경기도 용인시 처인구', totalLessons: 30, lessonsCompleted: 28 },
    { id: 's9', name: '미배정학생', school: '미정', grade: '고1', careerPath: '미정', totalLessons: 10, lessonsCompleted: 0 }
];

const initialLessons: { [key: string]: Lesson[] } = {
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

const RoleSwitcher = ({ role, setRole }: { role: string; setRole: (role: 'admin' | 'teacher') => void }) => (
    <div className="bg-gray-800 text-white p-2 flex justify-center items-center gap-4 fixed top-0 left-0 w-full z-[100]">
      <span className="font-bold text-sm sm:text-base">View as:</span>
      <button onClick={() => setRole('admin')} className={`rounded px-3 py-1 transition-colors text-sm sm:text-base ${role === 'admin' ? 'bg-blue-500 font-semibold' : 'bg-gray-600 hover:bg-gray-500'}`}>
        관리자
      </button>
      <button onClick={() => setRole('teacher')} className={`rounded px-3 py-1 transition-colors text-sm sm:text-base ${role === 'teacher' ? 'bg-green-500 font-semibold' : 'bg-gray-600 hover:bg-gray-500'}`}>
        선생님
      </button>
    </div>
);


const App: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const [lessons, setLessons] = useState<{ [key: string]: Lesson[] }>(initialLessons);

    const [studentsWithLessons, setStudentsWithLessons] = useState<StudentWithLessons[]>([]);
    const [unassignedStudents, setUnassignedStudents] = useState<StudentWithLessons[]>([]);
    
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<'addTeacher' | 'addStudent' | 'assignStudent' | 'studentCharacteristics' | null>(null);

    const [editingTeacher, setEditingTeacher] = useState<Partial<Teacher> | null>(null);
    const [editingStudent, setEditingStudent] = useState<Partial<StudentWithLessons> | null>(null);
    
    const [selectedStudentIdForSheet, setSelectedStudentIdForSheet] = useState<string>('');
    const [viewingStudentId, setViewingStudentId] = useState<string | null>(null);
    const [viewingTeacherId, setViewingTeacherId] = useState<string | null>(null);

    const [isLessonDetailModalOpen, setIsLessonDetailModalOpen] = useState(false);
    const [editingLessonInfo, setEditingLessonInfo] = useState<{ studentId: string; lesson: Lesson } | null>(null);

    const [role, setRole] = useState<'admin' | 'teacher'>('admin');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Form states for modals
    const [teacherFormData, setTeacherFormData] = useState<Partial<Teacher> | null>(null);
    const [studentFormData, setStudentFormData] = useState<Partial<StudentWithLessons> | null>(null);
    const [assignStudentData, setAssignStudentData] = useState<{ studentId: string, teacherId: string }>({ studentId: '', teacherId: '' });
    
    // New states for characteristics modal
    const [newStudentCallLog, setNewStudentCallLog] = useState('');
    const [newParentCallLog, setNewParentCallLog] = useState('');

    useEffect(() => {
        const studentLessonData: StudentWithLessons[] = students.map(student => ({
            ...student,
            lessons: lessons[student.id] || [],
            lessonsCompleted: (lessons[student.id] || []).filter(l => l.status === LessonStatus.Completed).length,
        }));
        setStudentsWithLessons(studentLessonData);
        setUnassignedStudents(studentLessonData.filter(s => !s.teacherId));
        if (studentLessonData.length > 0 && !selectedStudentIdForSheet) {
            setSelectedStudentIdForSheet(studentLessonData[0].id);
        }
    }, [students, lessons, selectedStudentIdForSheet]);
    
    // Effect to manage form data when a modal opens
    useEffect(() => {
        if (!isModalOpen) {
            setEditingTeacher(null);
            setEditingStudent(null);
            setNewStudentCallLog('');
            setNewParentCallLog('');
            return;
        };

        if (modalContent === 'addTeacher' && editingTeacher) {
            setTeacherFormData(editingTeacher);
        }
        if ((modalContent === 'addStudent' || modalContent === 'studentCharacteristics') && editingStudent) {
            setStudentFormData(editingStudent);
        }
        if (modalContent === 'assignStudent') {
            const firstUnassigned = unassignedStudents.length > 0 ? unassignedStudents[0].id : '';
            setAssignStudentData({ studentId: firstUnassigned, teacherId: '' });
        }
    }, [isModalOpen, modalContent, editingTeacher, editingStudent, unassignedStudents]);


    const handleSaveTeacher = useCallback((teacherToSave: Partial<Teacher>) => {
        if (teacherToSave.id) {
            setTeachers(prev => prev.map(t => t.id === teacherToSave.id ? { ...t, ...teacherToSave } as Teacher : t));
        } else {
            setTeachers(prev => [...prev, { ...teacherToSave, id: generateId() } as Teacher]);
        }
        setIsModalOpen(false);
    }, []);

    const handleSaveStudent = useCallback((studentToSave: Partial<StudentWithLessons>) => {
        const studentData: Partial<Student> = { ...studentToSave };
        delete (studentData as Partial<StudentWithLessons>).lessons;

        if (studentToSave.id) {
            setStudents(prev => prev.map(s => s.id === studentToSave.id ? { ...s, ...studentData } as Student : s));
        } else {
            const newStudent = { ...studentData, id: generateId() } as Student;
            setStudents(prev => [...prev, newStudent]);
            setLessons(prev => ({ ...prev, [newStudent.id]: [] }));
        }
        setIsModalOpen(false);
        if(activeView !== 'studentDetail') setActiveView('students');
    }, [activeView]);

    const handleDeleteTeacher = useCallback((teacherId: string) => {
        if (window.confirm('정말로 이 선생님을 삭제하시겠습니까? 연관된 모든 학생들의 배정이 해제됩니다.')) {
            setTeachers(prev => prev.filter(t => t.id !== teacherId));
            setStudents(prev => prev.map(s => s.teacherId === teacherId ? { ...s, teacherId: undefined } : s));
        }
    }, []);

    const handleDeleteStudent = useCallback((studentId: string) => {
        if (window.confirm('정말로 이 학생을 삭제하시겠습니까? 모든 수업 기록도 함께 삭제됩니다.')) {
            setStudents(prev => prev.filter(s => s.id !== studentId));
            setLessons(prev => {
                const newLessons = { ...prev };
                delete newLessons[studentId];
                return newLessons;
            });
        }
    }, []);

    const handleUpdateLesson = useCallback((studentId: string, date: Date, status: LessonStatus) => {
        setLessons(prev => {
            const studentLessons = prev[studentId] ? [...prev[studentId]] : [];
            const dateString = date.toISOString().split('T')[0];
            const lessonIndex = studentLessons.findIndex(l => new Date(l.date).toISOString().split('T')[0] === dateString);

            if (lessonIndex > -1) {
                if (status === LessonStatus.None) {
                    studentLessons.splice(lessonIndex, 1);
                } else {
                    studentLessons[lessonIndex] = { ...studentLessons[lessonIndex], status };
                }
            } else if (status !== LessonStatus.None) {
                studentLessons.push({
                    id: generateId(),
                    date: date.toISOString(),
                    status: status,
                });
            }

            return { ...prev, [studentId]: studentLessons };
        });
    }, []);

    const handleSaveLesson = useCallback((studentId: string, lessonToSave: Lesson) => {
        setLessons(prev => {
            const studentLessons = prev[studentId] ? [...prev[studentId]] : [];
            const lessonIndex = studentLessons.findIndex(l => l.id === lessonToSave.id);

            if (lessonIndex > -1) {
                studentLessons[lessonIndex] = lessonToSave;
            } else {
                studentLessons.push(lessonToSave);
            }
            return { ...prev, [studentId]: studentLessons };
        });
        setIsLessonDetailModalOpen(false);
        setEditingLessonInfo(null);
    }, []);

    const handleDeleteLesson = useCallback((studentId: string, lessonId: string) => {
        setLessons(prev => {
            const studentLessons = (prev[studentId] || []).filter(l => l.id !== lessonId);
            return { ...prev, [studentId]: studentLessons };
        });
    }, []);

    const handleCharacteristicsSave = () => {
        if (!studentFormData) return;

        let updatedData = { ...studentFormData };
        const today = new Date().toISOString().split('T')[0];

        if (newStudentCallLog.trim()) {
            const entry = `[${today}]\n${newStudentCallLog.trim()}`;
            updatedData.studentCallLog = updatedData.studentCallLog
                ? `${entry}\n\n---\n\n${updatedData.studentCallLog}`
                : entry;
            updatedData.studentCallLogWrittenDate = today;
        }

        if (newParentCallLog.trim()) {
            const entry = `[${today}]\n${newParentCallLog.trim()}`;
            updatedData.parentCallLog = updatedData.parentCallLog
                ? `${entry}\n\n---\n\n${updatedData.parentCallLog}`
                : entry;
            updatedData.parentCallLogWrittenDate = today;
        }
        
        handleSaveStudent(updatedData);
    };

    const renderContent = () => {
        if (viewingStudentId) {
            const student = studentsWithLessons.find(s => s.id === viewingStudentId);
            if (student) {
                return <StudentDetail student={student} teachers={teachers} onSave={(s) => {handleSaveStudent(s); setViewingStudentId(null);}} onBack={() => setViewingStudentId(null)} />;
            }
        }

        if (viewingTeacherId) {
            const teacher = teachers.find(t => t.id === viewingTeacherId);
            if (teacher) {
                return <TeacherDetail teacher={teacher} onSave={(t) => {handleSaveTeacher(t); setViewingTeacherId(null);}} onBack={() => setViewingTeacherId(null)} />;
            }
        }
        
        switch (activeView) {
            case 'dashboard':
                return <Dashboard teachers={teachers} students={studentsWithLessons} unassignedStudents={unassignedStudents} onAddTeacher={() => { setEditingTeacher({}); setIsModalOpen(true); setModalContent('addTeacher'); }} onAddStudent={() => { setEditingStudent({ name: '', totalLessons: 12, lessonsCompleted: 0 }); setIsModalOpen(true); setModalContent('addStudent'); }} onAssignStudent={() => { setIsModalOpen(true); setModalContent('assignStudent'); }} setActiveView={setActiveView} />;
            case 'scheduleGrid':
                return <ScheduleGrid teachers={teachers} students={studentsWithLessons} onUpdateLesson={handleUpdateLesson} onDeleteTeacher={handleDeleteTeacher} onDeleteStudent={handleDeleteStudent} />;
            case 'calendar':
                return <CalendarView teachers={teachers} students={studentsWithLessons} onUpdateLessonStatus={(studentId, lessonId, status) => {
                    const lessonToUpdate = lessons[studentId]?.find(l => l.id === lessonId);
                    if (lessonToUpdate) {
                        handleSaveLesson(studentId, { ...lessonToUpdate, status });
                    }
                }} />;
            case 'teachers':
                return <TeacherManager teachers={teachers} students={studentsWithLessons} onAddTeacher={() => { setEditingTeacher({}); setIsModalOpen(true); setModalContent('addTeacher'); }} onEditTeacher={(teacher) => { setEditingTeacher(teacher); setIsModalOpen(true); setModalContent('addTeacher'); }} onDeleteTeacher={handleDeleteTeacher} onNavigateToPortal={() => {}} onViewTeacherDetail={setViewingTeacherId} />;
            case 'students':
                return <StudentManager students={studentsWithLessons} teachers={teachers} unassignedStudents={unassignedStudents} onAddStudent={() => { setEditingStudent({ name: '', totalLessons: 12, lessonsCompleted: 0 }); setIsModalOpen(true); setModalContent('addStudent'); }} onAssignStudent={() => { setIsModalOpen(true); setModalContent('assignStudent'); }} onEditStudent={(student) => { setEditingStudent(student); setIsModalOpen(true); setModalContent('addStudent'); }} onDeleteStudent={handleDeleteStudent} onViewStudentSheet={(studentId) => { setSelectedStudentIdForSheet(studentId); setActiveView('studentSheet'); }} onViewStudentDetail={setViewingStudentId} onOpenCharacteristicsModal={(student) => { setEditingStudent(student); setIsModalOpen(true); setModalContent('studentCharacteristics'); }} />;
            case 'schedules':
                return <ScheduleManager 
                    students={studentsWithLessons} 
                    teachers={teachers} 
                    onOpenLessonDetailModal={(studentId, lesson) => {
                        setEditingLessonInfo({ studentId, lesson: lesson || { id: generateId(), date: new Date().toISOString().split('T')[0], status: LessonStatus.Scheduled } });
                        setIsLessonDetailModalOpen(true);
                    }} 
                    onDeleteLesson={handleDeleteLesson}
                    onSaveLesson={handleSaveLesson}
                />;
            case 'studentSheet':
                return <StudentSheetManager 
                            students={studentsWithLessons} 
                            teachers={teachers}
                            selectedStudentId={selectedStudentIdForSheet} 
                            onSelectStudent={setSelectedStudentIdForSheet} 
                            onSaveLesson={handleSaveLesson}
                        />;
            default:
                return <Dashboard teachers={teachers} students={studentsWithLessons} unassignedStudents={unassignedStudents} onAddTeacher={() => {}} onAddStudent={() => {}} onAssignStudent={() => {}} setActiveView={setActiveView} />;
        }
    };

    const navItems: { key: View; label: string }[] = [
        { key: 'dashboard', label: '대시보드' },
        { key: 'scheduleGrid', label: '수업 그리드' },
        { key: 'calendar', label: '캘린더' },
        { key: 'teachers', label: '선생님 관리' },
        { key: 'students', label: '학생 관리' },
        { key: 'schedules', label: '수업 관리' },
        { key: 'studentSheet', label: '학생별 수업 시트' },
    ];
    
    return (
        <div className="pt-12">
            <RoleSwitcher role={role} setRole={setRole} />
            {role === 'admin' ? (
                 <div className="flex h-screen bg-gray-100">
                    {isSidebarOpen && (
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        ></div>
                    )}
                    <aside className={`fixed top-0 left-0 w-64 bg-white shadow-md flex flex-col h-full z-40 transform transition-transform md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="p-6 text-2xl font-bold text-blue-600 border-b">
                            열정스토리
                        </div>
                        <nav className="flex-grow p-4">
                            <ul>
                                {navItems.map(item => (
                                    <li key={item.key}>
                                        <button
                                            onClick={() => {
                                                setViewingStudentId(null);
                                                setViewingTeacherId(null);
                                                setActiveView(item.key)
                                                setIsSidebarOpen(false);
                                            }}
                                            className={`w-full text-left font-semibold text-lg p-3 my-1 rounded-lg transition-colors ${activeView === item.key ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            {item.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>
                    <div className="flex-1 flex flex-col">
                         <header className="md:hidden bg-white shadow-sm flex items-center justify-between p-4 sticky top-12 z-20">
                            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h1 className="text-xl font-bold text-gray-800">
                                {navItems.find(item => item.key === activeView)?.label}
                            </h1>
                            <div className="w-6"></div>
                        </header>
                        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-auto">
                            {renderContent()}
                        </main>
                    </div>
                    {isLessonDetailModalOpen && editingLessonInfo && (
                        <LessonDetailModal
                            isOpen={isLessonDetailModalOpen}
                            onClose={() => setIsLessonDetailModalOpen(false)}
                            onSave={(lesson) => handleSaveLesson(editingLessonInfo.studentId, lesson)}
                            lesson={editingLessonInfo.lesson}
                        />
                    )}
                    {isModalOpen && (
                        <Modal 
                            isOpen={isModalOpen} 
                            onClose={() => setIsModalOpen(false)} 
                            title={
                                modalContent === 'addTeacher' ? (editingTeacher?.id ? '선생님 정보 수정' : '새 선생님 추가') :
                                modalContent === 'addStudent' ? (editingStudent?.id ? '학생 정보 수정' : '새 학생 추가') :
                                modalContent === 'assignStudent' ? '학생 배정' :
                                modalContent === 'studentCharacteristics' ? `${editingStudent?.name} 학생 특징 관리` : ''
                            }
                            size={modalContent === 'studentCharacteristics' ? '2xl' : 'lg'}
                        >
                            {modalContent === 'addTeacher' && teacherFormData && (
                                <form onSubmit={(e) => { e.preventDefault(); handleSaveTeacher(teacherFormData); }} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">이름</label>
                                        <input type="text" value={teacherFormData.name || ''} onChange={(e) => setTeacherFormData(prev => ({ ...prev, name: e.target.value }))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">출신학교</label>
                                        <input type="text" value={teacherFormData.major || ''} onChange={(e) => setTeacherFormData(prev => ({ ...prev, major: e.target.value }))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">계약 만료월</label>
                                        <input type="month" value={teacherFormData.contractEndDate || ''} onChange={(e) => setTeacherFormData(prev => ({ ...prev, contractEndDate: e.target.value }))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                    <div className="flex justify-end pt-4 gap-2">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">취소</button>
                                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">저장</button>
                                    </div>
                                </form>
                            )}
                            {modalContent === 'addStudent' && studentFormData && (
                                <form onSubmit={(e) => { e.preventDefault(); handleSaveStudent(studentFormData); }} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">이름</label>
                                        <input type="text" value={studentFormData.name || ''} onChange={(e) => setStudentFormData(prev => ({ ...prev, name: e.target.value }))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">학교</label>
                                            <input type="text" value={studentFormData.school || ''} onChange={(e) => setStudentFormData(prev => ({ ...prev, school: e.target.value }))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">학년</label>
                                            <input type="text" value={studentFormData.grade || ''} onChange={(e) => setStudentFormData(prev => ({ ...prev, grade: e.target.value }))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4 gap-2">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">취소</button>
                                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">저장</button>
                                    </div>
                                </form>
                            )}
                             {modalContent === 'assignStudent' && (
                                <form onSubmit={(e) => { e.preventDefault(); const student = students.find(s => s.id === assignStudentData.studentId); if (student) handleSaveStudent({ ...student, teacherId: assignStudentData.teacherId }); }} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">학생 선택</label>
                                        <select value={assignStudentData.studentId} onChange={(e) => setAssignStudentData(prev => ({...prev, studentId: e.target.value}))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                                            {unassignedStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.school})</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">선생님 선택</label>
                                        <select value={assignStudentData.teacherId} onChange={(e) => setAssignStudentData(prev => ({...prev, teacherId: e.target.value}))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                                            <option value="">선생님 선택</option>
                                            {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    </div>
                                     <div className="flex justify-end pt-4 gap-2">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">취소</button>
                                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" disabled={!assignStudentData.studentId || !assignStudentData.teacherId}>배정</button>
                                    </div>
                                </form>
                            )}
                             {modalContent === 'studentCharacteristics' && studentFormData && (
                                <form onSubmit={(e) => { e.preventDefault(); handleCharacteristicsSave(); }} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">학생 특징</label>
                                        <textarea value={studentFormData.studentCharacteristics || ''} onChange={(e) => setStudentFormData(prev => ({...prev, studentCharacteristics: e.target.value}))} rows={4} className="mt-1 w-full border-gray-300 rounded-md"/>
                                        <label className="text-xs text-gray-500">작성일</label>
                                        <input type="date" value={studentFormData.studentCharacteristicsWrittenDate || ''} onChange={(e) => setStudentFormData(prev => ({...prev, studentCharacteristicsWrittenDate: e.target.value}))} className="mt-1 w-full border-gray-300 rounded-md text-sm p-1"/>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">학생 통화 내용</label>
                                        {studentFormData.studentCallLog && (
                                          <div className="mt-1 p-2 bg-gray-100 border border-gray-200 rounded-md max-h-32 overflow-y-auto text-sm whitespace-pre-wrap">
                                            {studentFormData.studentCallLog}
                                          </div>
                                        )}
                                        <label className="block text-sm font-medium text-gray-500 mt-2">새 통화 내용 추가</label>
                                        <textarea value={newStudentCallLog} onChange={(e) => setNewStudentCallLog(e.target.value)} rows={3} placeholder="새로운 통화 내용을 입력하세요..." className="mt-1 w-full border-gray-300 rounded-md"/>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">학부모 통화 내용</label>
                                        {studentFormData.parentCallLog && (
                                          <div className="mt-1 p-2 bg-gray-100 border border-gray-200 rounded-md max-h-32 overflow-y-auto text-sm whitespace-pre-wrap">
                                            {studentFormData.parentCallLog}
                                          </div>
                                        )}
                                        <label className="block text-sm font-medium text-gray-500 mt-2">새 통화 내용 추가</label>
                                        <textarea value={newParentCallLog} onChange={(e) => setNewParentCallLog(e.target.value)} rows={3} placeholder="새로운 통화 내용을 입력하세요..." className="mt-1 w-full border-gray-300 rounded-md"/>
                                    </div>

                                     <div className="flex justify-end pt-4 gap-2">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">취소</button>
                                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">저장</button>
                                    </div>
                                </form>
                            )}
                        </Modal>
                    )}
                </div>
            ) : (
                <TeacherPortal 
                    teachers={teachers} 
                    students={studentsWithLessons} 
                    onSaveLesson={handleSaveLesson} 
                />
            )}
        </div>
    );
};

// FIX: Add default export to be consumed by index.tsx
export default App;