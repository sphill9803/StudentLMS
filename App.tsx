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
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [lessons, setLessons] = useState<{ [key: string]: Lesson[] }>({});

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teachersRes, studentsRes, lessonsRes] = await Promise.all([
                    fetch('http://localhost:5001/api/teachers'),
                    fetch('http://localhost:5001/api/students'),
                    fetch('http://localhost:5001/api/lessons')
                ]);

                if (!teachersRes.ok || !studentsRes.ok || !lessonsRes.ok) {
                    throw new Error('Failed to fetch data');
                }

                const teachersData = await teachersRes.json();
                const studentsData = await studentsRes.json();
                const lessonsArray = await lessonsRes.json();

                // Process lessons into a map by studentId
                const lessonsMap: { [key: string]: Lesson[] } = {};
                lessonsArray.forEach((lesson: any) => {
                    if (!lessonsMap[lesson.studentId]) {
                        lessonsMap[lesson.studentId] = [];
                    }
                    lessonsMap[lesson.studentId].push(lesson);
                });

                setTeachers(teachersData);
                setStudents(studentsData);
                setLessons(lessonsMap);
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('데이터를 불러오는데 실패했습니다. 서버가 켜져 있는지 확인해주세요.');
            }
        };

        fetchData();
    }, []);

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
        if (activeView !== 'studentDetail') setActiveView('students');
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
                return <StudentDetail student={student} teachers={teachers} onSave={(s) => { handleSaveStudent(s); setViewingStudentId(null); }} onBack={() => setViewingStudentId(null)} />;
            }
        }

        if (viewingTeacherId) {
            const teacher = teachers.find(t => t.id === viewingTeacherId);
            if (teacher) {
                return <TeacherDetail teacher={teacher} onSave={(t) => { handleSaveTeacher(t); setViewingTeacherId(null); }} onBack={() => setViewingTeacherId(null)} />;
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
                return <TeacherManager teachers={teachers} students={studentsWithLessons} onAddTeacher={() => { setEditingTeacher({}); setIsModalOpen(true); setModalContent('addTeacher'); }} onEditTeacher={(teacher) => { setEditingTeacher(teacher); setIsModalOpen(true); setModalContent('addTeacher'); }} onDeleteTeacher={handleDeleteTeacher} onNavigateToPortal={() => { }} onViewTeacherDetail={setViewingTeacherId} />;
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
                return <Dashboard teachers={teachers} students={studentsWithLessons} unassignedStudents={unassignedStudents} onAddTeacher={() => { }} onAddStudent={() => { }} onAssignStudent={() => { }} setActiveView={setActiveView} />;
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
                                        <select value={assignStudentData.studentId} onChange={(e) => setAssignStudentData(prev => ({ ...prev, studentId: e.target.value }))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                                            {unassignedStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.school})</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">선생님 선택</label>
                                        <select value={assignStudentData.teacherId} onChange={(e) => setAssignStudentData(prev => ({ ...prev, teacherId: e.target.value }))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
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
                                        <textarea value={studentFormData.studentCharacteristics || ''} onChange={(e) => setStudentFormData(prev => ({ ...prev, studentCharacteristics: e.target.value }))} rows={4} className="mt-1 w-full border-gray-300 rounded-md" />
                                        <label className="text-xs text-gray-500">작성일</label>
                                        <input type="date" value={studentFormData.studentCharacteristicsWrittenDate || ''} onChange={(e) => setStudentFormData(prev => ({ ...prev, studentCharacteristicsWrittenDate: e.target.value }))} className="mt-1 w-full border-gray-300 rounded-md text-sm p-1" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">학생 통화 내용</label>
                                        {studentFormData.studentCallLog && (
                                            <div className="mt-1 p-2 bg-gray-100 border border-gray-200 rounded-md max-h-32 overflow-y-auto text-sm whitespace-pre-wrap">
                                                {studentFormData.studentCallLog}
                                            </div>
                                        )}
                                        <label className="block text-sm font-medium text-gray-500 mt-2">새 통화 내용 추가</label>
                                        <textarea value={newStudentCallLog} onChange={(e) => setNewStudentCallLog(e.target.value)} rows={3} placeholder="새로운 통화 내용을 입력하세요..." className="mt-1 w-full border-gray-300 rounded-md" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">학부모 통화 내용</label>
                                        {studentFormData.parentCallLog && (
                                            <div className="mt-1 p-2 bg-gray-100 border border-gray-200 rounded-md max-h-32 overflow-y-auto text-sm whitespace-pre-wrap">
                                                {studentFormData.parentCallLog}
                                            </div>
                                        )}
                                        <label className="block text-sm font-medium text-gray-500 mt-2">새 통화 내용 추가</label>
                                        <textarea value={newParentCallLog} onChange={(e) => setNewParentCallLog(e.target.value)} rows={3} placeholder="새로운 통화 내용을 입력하세요..." className="mt-1 w-full border-gray-300 rounded-md" />
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