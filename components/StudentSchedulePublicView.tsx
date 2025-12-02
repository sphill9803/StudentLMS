import React, { useState, useMemo } from 'react';
import { StudentWithLessons, Lesson, LessonStatus } from '../types';
import LessonDetailModal from './LessonDetailModal';

interface StudentSchedulePublicViewProps {
  student: StudentWithLessons;
  onSaveLesson: (studentId: string, lesson: Lesson) => void;
  onDeleteLesson: (studentId: string, lessonId: string) => void;
}

const generateId = () => `id_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;

const getStatusChip = (status: LessonStatus) => {
    switch (status) {
        case LessonStatus.Completed: return <span className="px-3 py-1 inline-flex text-base leading-5 font-semibold rounded-full bg-sky-100 text-sky-800">완료</span>;
        case LessonStatus.Scheduled: return <span className="px-3 py-1 inline-flex text-base leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">예정</span>;
        case LessonStatus.Cancelled: return <span className="px-3 py-1 inline-flex text-base leading-5 font-semibold rounded-full bg-red-100 text-red-800">취소</span>;
        default: return <span className="px-3 py-1 inline-flex text-base leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">기타</span>;
    }
}

const StudentSchedulePublicView: React.FC<StudentSchedulePublicViewProps> = ({ student, onSaveLesson, onDeleteLesson }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const sortedLessons = useMemo(() => {
    return [...student.lessons].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [student.lessons]);

  const handleOpenModal = (lesson: Lesson | null) => {
    if (lesson) {
      setEditingLesson(lesson);
    } else {
      setEditingLesson({
        id: generateId(),
        date: new Date().toISOString().split('T')[0],
        status: LessonStatus.Scheduled,
      });
    }
    setIsModalOpen(true);
  };
  
  const handleSave = (lesson: Lesson) => {
      onSaveLesson(student.id, lesson);
      setIsModalOpen(false);
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                 <h1 className="text-4xl font-bold text-gray-800 tracking-tight">{student.name} - 수업 시트 관리</h1>
            </div>
        </header>
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
                 <div className="flex justify-end mb-4">
                    <button 
                        onClick={() => handleOpenModal(null)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-5 rounded-lg text-base"
                    >
                        수업 추가
                    </button>
                </div>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-base font-bold text-gray-600">수업일</th>
                                <th className="px-6 py-4 text-left text-base font-bold text-gray-600">완료 여부</th>
                                <th className="px-6 py-4 text-left text-base font-bold text-gray-600">계획표 검수</th>
                                <th className="px-6 py-4 text-left text-base font-bold text-gray-600">보고서 현황</th>
                                <th className="px-6 py-4 text-left text-base font-bold text-gray-600">학교 제출</th>
                                <th className="px-6 py-4 text-right text-base font-bold text-gray-600">관리</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedLessons.map(lesson => (
                                <tr key={lesson.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-5 text-lg text-gray-800">{lesson.date}</td>
                                    <td className="px-6 py-5">{getStatusChip(lesson.status)}</td>
                                    <td className="px-6 py-5 text-lg text-gray-800">{lesson.planReviewStatus || '-'}</td>
                                    <td className="px-6 py-5 text-lg text-gray-800">{lesson.reportSubmissionStatus || '-'}</td>
                                    <td className="px-6 py-5 text-lg text-gray-800">{lesson.schoolSubmissionStatus || '-'}</td>
                                    <td className="px-6 py-5 text-right flex gap-3 justify-end">
                                        <button 
                                            onClick={() => handleOpenModal(lesson)}
                                            className="text-indigo-600 hover:text-indigo-900 font-semibold text-base"
                                        >상세 관리</button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('이 수업 기록을 삭제하시겠습니까?')) {
                                                    onDeleteLesson(student.id, lesson.id);
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-900 font-semibold text-base"
                                        >삭제</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {sortedLessons.length === 0 && (
                        <div className="text-center py-12 text-gray-500 text-lg">
                            <p>등록된 수업이 없습니다. '수업 추가' 버튼을 눌러 시작하세요.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
        
        {editingLesson && <LessonDetailModal 
            isOpen={isModalOpen}
            onClose={() => {
                setIsModalOpen(false);
                setEditingLesson(null);
            }}
            onSave={handleSave}
            lesson={editingLesson}
        />}

    </div>
  );
};

export default StudentSchedulePublicView;