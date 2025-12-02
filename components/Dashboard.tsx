import React, { useMemo } from 'react';
import { Teacher, StudentWithLessons } from '../types';
import { View } from '../App';

interface DashboardProps {
  teachers: Teacher[];
  students: StudentWithLessons[];
  unassignedStudents: StudentWithLessons[];
  onAddTeacher: () => void;
  onAddStudent: () => void;
  onAssignStudent: () => void;
  setActiveView: (view: View) => void;
}

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode; color: string; onClick?: () => void; }> = ({ title, value, icon, color, onClick }) => (
  <div onClick={onClick} className={`bg-white p-6 rounded-xl shadow-md flex items-center justify-between ${onClick ? 'cursor-pointer hover:shadow-lg hover:scale-105 transition-all' : ''}`}>
    <div>
      <p className="text-base font-medium text-gray-500">{title}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
    <div className={`bg-opacity-20 text-opacity-100 rounded-full p-4 ${color}`}>
      {icon}
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ 
    teachers, 
    students, 
    unassignedStudents,
    onAddTeacher,
    onAddStudent,
    onAssignStudent,
    setActiveView
}) => {
    const teacherMap = useMemo(() => new Map(teachers.map(t => [t.id, t])), [teachers]);

    const sortedStudents = useMemo(() => {
        return [...students].sort((a, b) => {
            const aDate = a.reRegistrationMonth;
            const bDate = b.reRegistrationMonth;

            if (aDate && !bDate) return -1;
            if (!aDate && bDate) return 1;
            if (!aDate && !bDate) return 0;
            
            if (!aDate || !bDate) return 0;

            if (aDate < bDate) return -1;
            if (aDate > bDate) return 1;
            return 0;
        });
    }, [students]);

    const getRegistrationPeriod = (reRegMonth: string | undefined): string => {
        if (!reRegMonth) return '미지정';
        try {
            const [yearStr, monthStr] = reRegMonth.split('-');
            const year = parseInt(yearStr, 10);
            const month = parseInt(monthStr, 10) - 1; 

            if (isNaN(year) || isNaN(month)) return '날짜 형식 오류';

            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 5, 1);

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
    };

  return (
    <div className="space-y-8 md:space-y-10">
        <header>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">대시보드</h2>
            <p className="text-gray-500 mt-2 text-base sm:text-lg">시스템 현황을 한눈에 확인하고 주요 기능을 빠르게 실행하세요.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                title="총 선생님" 
                value={teachers.length}
                color="text-blue-600 bg-blue-100"
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                onClick={() => setActiveView('teachers')}
            />
            <StatCard 
                title="총 학생" 
                value={students.length}
                color="text-green-600 bg-green-100"
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>}
                onClick={() => setActiveView('students')}
            />
            <StatCard 
                title="미배정 학생" 
                value={unassignedStudents.length}
                color="text-red-600 bg-red-100"
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                onClick={() => setActiveView('students')}
            />
            <div className="bg-white p-5 rounded-xl shadow-md flex flex-col gap-3 items-stretch justify-center">
                <button onClick={onAddTeacher} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-3 rounded-lg transition-transform transform hover:scale-105 text-base">
                    선생님 추가
                </button>
                <button onClick={onAddStudent} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-3 rounded-lg transition-transform transform hover:scale-105 text-base">
                    학생 추가
                </button>
                {unassignedStudents.length > 0 && (
                        <button onClick={onAssignStudent} className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-3 rounded-lg transition-transform transform hover:scale-105 text-base">
                        학생 배정
                    </button>
                )}
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">전체 선생님</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {teachers.length > 0 ? teachers.map(teacher => {
                        const assignedStudentsCount = students.filter(s => s.teacherId === teacher.id).length;
                        return (
                            <div key={teacher.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">{teacher.name.charAt(0)}</div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-base sm:text-lg">{teacher.name}</p>
                                        <p className="text-sm text-gray-500">{teacher.major}</p>
                                        <p className="text-sm text-gray-500 mt-1">담당 학생: {assignedStudentsCount}명 • 계약 만료: {teacher.contractEndDate || '미지정'}</p>
                                    </div>
                                </div>
                                <button onClick={() => setActiveView('teachers')} className="ml-4 text-sm sm:text-base bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md transition-colors flex-shrink-0">
                                    관리
                                </button>
                            </div>
                        );
                    }) : <p className="text-center py-4 text-gray-500 text-lg">등록된 선생님이 없습니다.</p>}
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">전체 학생</h3>
                 <div className="space-y-4 max-h-96 overflow-y-auto">
                    {students.length > 0 ? sortedStudents.map(student => {
                        const progress = student.totalLessons > 0 ? (student.lessonsCompleted / student.totalLessons) * 100 : 0;
                        const teacher = student.teacherId ? teacherMap.get(student.teacherId) : null;
                        return (
                         <div key={student.id} className="flex items-start sm:items-center justify-between p-4 rounded-lg bg-gray-50 flex-col sm:flex-row gap-4">
                            <div className="flex-grow w-full">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-gray-800 text-base sm:text-lg">{student.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {student.school} {student.grade}
                                        </p>
                                    </div>
                                    <p className="text-base text-gray-600 font-medium whitespace-nowrap pl-2">{student.lessonsCompleted} / {student.totalLessons}</p>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-2 my-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>

                                <div className="text-sm text-gray-600 space-y-1">
                                    <p><span className="font-semibold">희망 전공:</span> {student.desiredMajor || '미지정'}</p>
                                    <p><span className="font-semibold">등록 기간:</span> {getRegistrationPeriod(student.reRegistrationMonth)}</p>
                                    <p>
                                        <span className="font-semibold">담당:</span> {teacher ? `${teacher.name}T (${teacher.major})` : <span className="text-red-500 font-medium">미배정</span>}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setActiveView('students')} className="ml-0 sm:ml-6 text-sm sm:text-base bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md transition-colors flex-shrink-0 w-full sm:w-auto">
                                관리
                            </button>
                         </div>
                        );
                    }) : <p className="text-center py-4 text-gray-500 text-lg">등록된 학생이 없습니다.</p>}
                </div>
            </div>
        </div>

    </div>
  );
};

export default Dashboard;
