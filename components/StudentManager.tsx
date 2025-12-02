import React, { useState, useMemo } from 'react';
import { Teacher, StudentWithLessons } from '../types';

interface StudentManagerProps {
  students: StudentWithLessons[];
  teachers: Teacher[];
  unassignedStudents: StudentWithLessons[];
  onAddStudent: () => void;
  onAssignStudent: () => void;
  onEditStudent: (student: StudentWithLessons) => void;
  onDeleteStudent: (studentId: string) => void;
  onViewStudentSheet: (studentId: string) => void;
  onViewStudentDetail: (studentId: string) => void;
  onOpenCharacteristicsModal: (student: StudentWithLessons) => void;
}

const StudentManager: React.FC<StudentManagerProps> = ({ 
    students, 
    teachers, 
    unassignedStudents, 
    onAddStudent, 
    onAssignStudent, 
    onEditStudent, 
    onDeleteStudent, 
    onViewStudentSheet,
    onViewStudentDetail,
    onOpenCharacteristicsModal
}) => {
  const [gradeFilter, setGradeFilter] = useState('all');
  const teacherMap = new Map(teachers.map(t => [t.id, t.name]));

  const processedStudents = useMemo(() => {
    const gradeOrder: { [key: string]: number } = { '중3': 1, '고1': 2, '고2': 3, '고3': 4 };

    return students
        .filter(student => gradeFilter === 'all' || student.grade === gradeFilter)
        .sort((a, b) => {
            const gradeA = a.grade || '';
            const gradeB = b.grade || '';
            const orderA = gradeOrder[gradeA] || 99;
            const orderB = gradeOrder[gradeB] || 99;
            if (orderA !== orderB) {
                return orderA - orderB;
            }
            return a.name.localeCompare(b.name);
        });
  }, [students, gradeFilter]);

  const isProfileIncomplete = (student: StudentWithLessons) => {
    return !student.school || !student.grade || !student.phoneStudent || !student.phoneParent || !student.address || !student.initialRegistrationDate || !student.reRegistrationMonth;
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '미지정';
    try {
        const parts = dateString.split('-');
        if (parts.length !== 3) return dateString;
        const year = parts[0].slice(2);
        return `${year}.${parts[1]}.${parts[2]}`;
    } catch {
        return '날짜 오류';
    }
  };

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
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">학생 관리</h2>
          <p className="text-gray-500 mt-2 text-base sm:text-lg">새로운 학생을 등록하거나 기존 학생 정보를 관리합니다.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg justify-between">
                <span className="text-sm font-medium text-gray-600 pl-2 hidden sm:inline">학년:</span>
                {['all', '중3', '고1', '고2', '고3'].map(grade => (
                    <button
                        key={grade}
                        onClick={() => setGradeFilter(grade)}
                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors ${gradeFilter === grade ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {grade === 'all' ? '전체' : grade}
                    </button>
                ))}
            </div>
            <div className="flex gap-3">
              <button onClick={onAddStudent} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-sm sm:text-base">
                학생 추가
              </button>
              {unassignedStudents.length > 0 && (
                <button onClick={onAssignStudent} className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg text-sm sm:text-base">
                  학생 배정
                </button>
              )}
            </div>
        </div>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white shadow-md rounded-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-600">학생 이름</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-600">학교</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-600">학년</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-600">담당 선생님</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-600">희망 전공</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-600">수업 진행률</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-600">첫 등록일</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-600">등록 기간</th>
              <th scope="col" className="px-6 py-4 text-right text-base font-bold text-gray-600">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {processedStudents.map(student => {
              const progress = student.totalLessons > 0 ? (student.lessonsCompleted / student.totalLessons) * 100 : 0;
              return (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        <div className="text-lg font-medium text-gray-900">{student.name}</div>
                        {isProfileIncomplete(student) && (
                            <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">상세 정보 필요</span>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-lg text-gray-500">{student.school}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-lg text-gray-500">{student.grade}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-lg text-gray-500">
                    {student.teacherId ? `${teacherMap.get(student.teacherId)}T` : <span className="text-red-500">미배정</span>}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-lg text-gray-500">{student.desiredMajor || '-'}</td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>
                      <span className="text-lg text-gray-600">{student.lessonsCompleted}/{student.totalLessons}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-lg text-gray-500">{formatDate(student.initialRegistrationDate)}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-lg text-gray-500">{getRegistrationPeriod(student.reRegistrationMonth)}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-2">
                        <button onClick={() => onViewStudentSheet(student.id)} className="px-3 py-1 text-sm font-semibold text-cyan-800 bg-cyan-100 rounded-md hover:bg-cyan-200 transition-colors">수업 확인</button>
                        <button onClick={() => onViewStudentDetail(student.id)} className="px-3 py-1 text-sm font-semibold text-indigo-800 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors">상세 정보</button>
                        <button onClick={() => onOpenCharacteristicsModal(student)} className="px-3 py-1 text-sm font-semibold text-teal-800 bg-teal-100 rounded-md hover:bg-teal-200 transition-colors">학생 특징</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => onEditStudent(student)} className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">간단 수정</button>
                        <button onClick={() => onDeleteStudent(student.id)} className="px-3 py-1 text-sm font-semibold text-red-800 bg-red-100 rounded-md hover:bg-red-200 transition-colors">삭제</button>
                    </div>
                  </td>
                </tr>
              );
            })}
             {processedStudents.length === 0 && (
                <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500 text-lg">
                       {gradeFilter === 'all' ? '등록된 학생이 없습니다.' : '해당 학년의 학생이 없습니다.'}
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {processedStudents.map(student => {
          const progress = student.totalLessons > 0 ? (student.lessonsCompleted / student.totalLessons) * 100 : 0;
          return (
            <div key={student.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-gray-900">{student.name}</p>
                      {isProfileIncomplete(student) && (
                        <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">상세 정보 필요</span>
                      )}
                  </div>
                  <span className="text-base font-semibold text-gray-700">{student.lessonsCompleted}/{student.totalLessons}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{student.school} / {student.grade}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 my-3">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200 space-y-1 text-sm">
                  <p><span className="font-semibold text-gray-500">담당:</span> {student.teacherId ? `${teacherMap.get(student.teacherId)}T` : <span className="text-red-500">미배정</span>}</p>
                  <p><span className="font-semibold text-gray-500">희망 전공:</span> {student.desiredMajor || '-'}</p>
                  <p><span className="font-semibold text-gray-500">등록 기간:</span> {getRegistrationPeriod(student.reRegistrationMonth)}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2 justify-end">
                  <button onClick={() => onViewStudentSheet(student.id)} className="px-3 py-1 text-xs font-semibold text-cyan-800 bg-cyan-100 rounded-md">수업</button>
                  <button onClick={() => onViewStudentDetail(student.id)} className="px-3 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-md">정보</button>
                  <button onClick={() => onOpenCharacteristicsModal(student)} className="px-3 py-1 text-xs font-semibold text-teal-800 bg-teal-100 rounded-md">특징</button>
                  <button onClick={() => onEditStudent(student)} className="px-3 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-md">수정</button>
                  <button onClick={() => onDeleteStudent(student.id)} className="px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-md">삭제</button>
              </div>
            </div>
          );
        })}
        {processedStudents.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-md">
            <p>{gradeFilter === 'all' ? '등록된 학생이 없습니다.' : '해당 학년의 학생이 없습니다.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManager;