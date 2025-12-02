import React, { useState, useMemo, useEffect } from 'react';
import { Teacher, StudentWithLessons, Lesson } from '../types';
import EditableLessonSheet from './EditableLessonSheet';

const StudentInfoCard: React.FC<{
  registrationPeriod: string;
  remainingMonths: string;
  remainingLessons: string;
}> = ({ registrationPeriod, remainingMonths, remainingLessons }) => (
    <div className="mb-6">
        <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-sm font-medium text-gray-500">등록 기간</p>
                    <p className="text-lg font-bold text-gray-800">{registrationPeriod}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">남은 기간</p>
                    <p className="text-lg font-bold text-green-600">{remainingMonths}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">남은 수업</p>
                    <p className="text-lg font-bold text-blue-600">{remainingLessons}</p>
                </div>
            </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
            등록 기간 이후에는 재등록을 진행하며 다시 6개월간 수업 횟수대로 진행됩니다.
        </p>
    </div>
);


const TeacherPortal: React.FC<{
  teachers: Teacher[];
  students: StudentWithLessons[];
  onSaveLesson: (studentId: string, lesson: Lesson) => void;
}> = ({ teachers, students, onSaveLesson }) => {
    
    // For demonstration, we'll hardcode the logged-in teacher as "박건우".
    const loggedInTeacher = useMemo(() => teachers.find(t => t.name === '박건우'), [teachers]);

    const assignedStudents = useMemo(() => {
        if (!loggedInTeacher) return [];
        return students.filter(s => s.teacherId === loggedInTeacher.id);
    }, [students, loggedInTeacher]);

    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    useEffect(() => {
        if (assignedStudents.length > 0 && !selectedStudentId) {
            setSelectedStudentId(assignedStudents[0].id);
        }
    }, [assignedStudents, selectedStudentId]);
    
    const selectedStudent = useMemo(() => {
        return assignedStudents.find(s => s.id === selectedStudentId);
    }, [assignedStudents, selectedStudentId]);

    const registrationPeriod = useMemo(() => {
        if (!selectedStudent || !selectedStudent.reRegistrationMonth) {
            return '미지정';
        }
        
        try {
            const [yearStr, monthStr] = selectedStudent.reRegistrationMonth.split('-');
            const year = parseInt(yearStr, 10);
            const month = parseInt(monthStr, 10) - 1;

            if (isNaN(year) || isNaN(month)) return '날짜 형식 오류';

            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 5, 1); // 6-month period

            const startYearShort = String(startDate.getFullYear()).slice(2);
            const startMonthPadded = String(startDate.getMonth() + 1).padStart(2, '0');
            const endYearShort = String(endDate.getFullYear()).slice(2);
            const endMonthPadded = String(endDate.getMonth() + 1).padStart(2, '0');

            if (startYearShort === endYearShort) {
                return `${startYearShort}.${startMonthPadded} ~ ${endMonthPadded}`;
            } else {
                return `${startYearShort}.${startMonthPadded} ~ ${endYearShort}.${endMonthPadded}`;
            }
        } catch {
            return '계산 오류';
        }
    }, [selectedStudent]);

    const remainingMonths = useMemo(() => {
        if (!selectedStudent || !selectedStudent.reRegistrationMonth) return '미지정';
        try {
            const [yearStr, monthStr] = selectedStudent.reRegistrationMonth.split('-');
            const year = parseInt(yearStr, 10);
            const month = parseInt(monthStr, 10) - 1;

            if (isNaN(year) || isNaN(month)) return '계산 오류';

            const endDate = new Date(year, month + 6, 0); // Last day of 6th month
            const today = new Date();

            if (today > endDate) return '0 개월';
            
            const monthDiff = (endDate.getFullYear() - today.getFullYear()) * 12 + (endDate.getMonth() - today.getMonth());
            
            return `${monthDiff + 1} 개월`;

        } catch {
            return '계산 오류';
        }
    }, [selectedStudent]);

    const remainingLessons = useMemo(() => {
        if (!selectedStudent) return 'N/A';
        return `${selectedStudent.totalLessons - selectedStudent.lessonsCompleted} 회`;
    }, [selectedStudent]);

    if (!loggedInTeacher) {
        return <div className="p-8 text-center text-red-500">Error: Could not find teacher "박건우".</div>;
    }

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-sans">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-72 bg-white shadow-lg flex-col">
                 <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-green-600">선생님 포털</h1>
                    <p className="text-gray-500 mt-1">{loggedInTeacher.name} 선생님</p>
                </div>
                <nav className="flex-grow p-4 space-y-2">
                    <h2 className="px-3 text-sm font-semibold text-gray-500 uppercase">담당 학생</h2>
                    {assignedStudents.map(student => (
                        <button
                            key={student.id}
                            onClick={() => setSelectedStudentId(student.id)}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${selectedStudentId === student.id ? 'bg-green-500 text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}
                        >
                            <span className="font-semibold text-lg">{student.name}</span>
                            <span className={`block text-sm ${selectedStudentId === student.id ? 'text-green-100' : 'text-gray-500'}`}>{student.school} / {student.grade}</span>
                        </button>
                    ))}
                    {assignedStudents.length === 0 && <p className="px-3 text-gray-500">담당 학생이 없습니다.</p>}
                </nav>
            </aside>
            
            {/* Mobile Header */}
            <header className="md:hidden bg-white shadow-md p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold text-green-600">선생님 포털</h1>
                    <p className="text-gray-600">{loggedInTeacher.name} 선생님</p>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {assignedStudents.map(student => (
                        <button
                            key={student.id}
                            onClick={() => setSelectedStudentId(student.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-lg text-center transition-colors ${selectedStudentId === student.id ? 'bg-green-500 text-white font-semibold' : 'bg-gray-200 text-gray-800'}`}
                        >
                            <span className="font-semibold text-sm">{student.name}</span>
                            <span className={`block text-xs ${selectedStudentId === student.id ? 'text-green-200' : 'text-gray-500'}`}>{student.school}</span>
                        </button>
                    ))}
                </div>
                 {assignedStudents.length === 0 && <p className="text-center text-gray-500 py-2">담당 학생이 없습니다.</p>}
            </header>

            <main className="flex-1 p-4 sm:p-8 overflow-auto">
                {selectedStudent ? (
                    <>
                        <StudentInfoCard 
                            registrationPeriod={registrationPeriod}
                            remainingMonths={remainingMonths}
                            remainingLessons={remainingLessons}
                        />
                        <EditableLessonSheet
                            student={selectedStudent} 
                            teacher={loggedInTeacher} 
                            onSaveLesson={onSaveLesson} 
                        />
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700">학생을 선택해주세요</h2>
                            <p className="mt-2 text-gray-500">관리할 학생을 선택하여 수업 관리를 시작하세요.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default TeacherPortal;