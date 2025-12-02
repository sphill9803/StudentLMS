import React, { useMemo } from 'react';
import { StudentWithLessons, Lesson, Teacher } from '../types';
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

// FIX: Define the props interface for the component.
interface StudentSheetManagerProps {
  students: StudentWithLessons[];
  teachers: Teacher[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
  onSaveLesson: (studentId: string, lesson: Lesson) => void;
}

const StudentSheetManager: React.FC<StudentSheetManagerProps> = ({ students, teachers, selectedStudentId, onSelectStudent, onSaveLesson }) => {
    const selectedStudent = useMemo(() => {
        return students.find(s => s.id === selectedStudentId);
    }, [selectedStudentId, students]);

    const teacherForStudent = useMemo(() => {
        if (!selectedStudent || !selectedStudent.teacherId) return null;
        return teachers.find(t => t.id === selectedStudent.teacherId);
    }, [selectedStudent, teachers]);

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
    
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">학생별 수업 시트</h2>
                    <p className="text-gray-500 mt-2 text-base sm:text-lg">학생을 선택하여 모든 수업 기록을 확인하고 관리합니다.</p>
                </div>
                 <select 
                    value={selectedStudentId} 
                    onChange={e => onSelectStudent(e.target.value)} 
                    className="w-full sm:w-auto p-3 border border-gray-300 rounded-md shadow-sm text-base sm:text-lg focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">학생을 선택하세요</option>
                    {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.school} / {s.grade})</option>
                    ))}
                </select>
            </div>

            {selectedStudent && teacherForStudent ? (
                <>
                    <StudentInfoCard 
                        registrationPeriod={registrationPeriod}
                        remainingMonths={remainingMonths}
                        remainingLessons={remainingLessons}
                    />
                    <EditableLessonSheet
                        student={selectedStudent}
                        teacher={teacherForStudent}
                        onSaveLesson={onSaveLesson}
                    />
                </>
            ) : selectedStudent && !teacherForStudent ? (
                <div className="text-center py-20 border-2 border-dashed border-yellow-400 bg-yellow-50 rounded-lg">
                    <h3 className="mt-2 text-2xl font-semibold text-yellow-800">선생님 미배정</h3>
                    <p className="mt-1 text-lg text-yellow-700">해당 학생에게 담당 선생님이 배정되지 않았습니다. 학생 관리 페이지에서 선생님을 배정해주세요.</p>
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <h3 className="mt-2 text-2xl font-semibold text-gray-900">학생을 선택해주세요</h3>
                    <p className="mt-1 text-lg text-gray-500">위의 드롭다운 메뉴에서 학생을 선택하여 수업 시트를 확인하세요.</p>
                </div>
            )}
        </div>
    );
};

export default StudentSheetManager;