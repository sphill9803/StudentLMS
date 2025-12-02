import React from 'react';
import { Teacher, StudentWithLessons } from '../types';

interface TeacherManagerProps {
  teachers: Teacher[];
  students: StudentWithLessons[];
  onAddTeacher: () => void;
  onEditTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (teacherId: string) => void;
  onNavigateToPortal: (path: string) => void;
  onViewTeacherDetail: (teacherId: string) => void;
}

const TeacherManager: React.FC<TeacherManagerProps> = ({ teachers, students, onAddTeacher, onEditTeacher, onDeleteTeacher, onNavigateToPortal, onViewTeacherDetail }) => {
  
  const getFirstClassMonth = (teacher: Teacher) => {
    const assignedStudents = students.filter(s => s.teacherId === teacher.id);
    const allTeacherLessons = assignedStudents.flatMap(s => s.lessons);
    
    if (allTeacherLessons.length > 0) {
        const firstLesson = allTeacherLessons.reduce((earliest, current) => {
            return new Date(current.date) < new Date(earliest.date) ? current : earliest;
        });
        
        const firstDate = new Date(firstLesson.date);
        const year = firstDate.getFullYear();
        const month = (firstDate.getMonth() + 1).toString().padStart(2, '0');
        return `${year}-${month}`;
    }
    return '미지정';
  };

  const isProfileIncomplete = (teacher: Teacher) => {
    return !teacher.phone || !teacher.email || !teacher.address || !teacher.dob || !teacher.contractDate || !teacher.residentRegistrationNumber;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">선생님 관리</h2>
          <p className="text-gray-500 mt-2 text-base sm:text-lg">새로운 선생님을 등록하거나 기존 선생님 정보를 관리합니다.</p>
        </div>
        <button onClick={onAddTeacher} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-5 rounded-lg text-base self-start sm:self-center">
          선생님 추가
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white shadow-md rounded-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-600">성명</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-600">출신학교</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-600">담당 학생 수</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-600">첫 수업 월</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-600">계약 만료월</th>
              <th scope="col" className="px-6 py-4 text-right text-base font-bold text-gray-600">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map(teacher => (
              <tr key={teacher.id} className="hover:bg-gray-50">
                <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        <div className="text-lg font-medium text-gray-900">{teacher.name}T</div>
                        {isProfileIncomplete(teacher) && (
                            <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">상세 정보 필요</span>
                        )}
                    </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-lg text-gray-500">{teacher.major}</td>
                <td className="px-6 py-5 whitespace-nowrap text-lg text-gray-500">{students.filter(s => s.teacherId === teacher.id).length}명</td>
                <td className="px-6 py-5 whitespace-nowrap text-lg text-gray-500">{getFirstClassMonth(teacher)}</td>
                <td className="px-6 py-5 whitespace-nowrap text-lg text-gray-500">{teacher.contractEndDate || '미지정'}</td>
                <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-2">
                        <button onClick={() => onNavigateToPortal(`/teacher/${teacher.id}`)} className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-md hover:bg-green-200 transition-colors">수업 확인</button>
                        <button onClick={() => onViewTeacherDetail(teacher.id)} className="px-3 py-1 text-sm font-semibold text-indigo-800 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors">상세 정보</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => onEditTeacher(teacher)} className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">간단 수정</button>
                        <button onClick={() => onDeleteTeacher(teacher.id)} className="px-3 py-1 text-sm font-semibold text-red-800 bg-red-100 rounded-md hover:bg-red-200 transition-colors">삭제</button>
                    </div>
                </td>
              </tr>
            ))}
            {teachers.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-lg">
                        등록된 선생님이 없습니다.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {teachers.map(teacher => {
          const assignedStudentsCount = students.filter(s => s.teacherId === teacher.id).length;
          return (
            <div key={teacher.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-gray-900">{teacher.name}T</p>
                      {isProfileIncomplete(teacher) && (
                        <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">상세 정보 필요</span>
                      )}
                  </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{teacher.major}</p>
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="font-semibold text-gray-500">담당 학생:</span> <span>{assignedStudentsCount}명</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-gray-500">첫 수업:</span> <span>{getFirstClassMonth(teacher)}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-gray-500">계약 만료:</span> <span>{teacher.contractEndDate || '미지정'}</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2 justify-end">
                  <button onClick={() => onNavigateToPortal(`/teacher/${teacher.id}`)} className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-md hover:bg-green-200">수업 확인</button>
                  <button onClick={() => onViewTeacherDetail(teacher.id)} className="px-3 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-md hover:bg-indigo-200">상세 정보</button>
                  <button onClick={() => onEditTeacher(teacher)} className="px-3 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300">수정</button>
                  <button onClick={() => onDeleteTeacher(teacher.id)} className="px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-md hover:bg-red-200">삭제</button>
              </div>
            </div>
          )
        })}
        {teachers.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-md">
            <p>등록된 선생님이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherManager;