import React, { useState, useMemo } from 'react';
import { Teacher, StudentWithLessons, LessonStatus, Lesson } from '../types';

interface CalendarViewProps {
  teachers: Teacher[];
  students: StudentWithLessons[];
  onUpdateLessonStatus: (studentId: string, lessonId: string, status: LessonStatus) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ teachers, students, onUpdateLessonStatus }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const teacherMap = useMemo(() => new Map(teachers.map(t => [t.id, t])), [teachers]);

  const lessonsByDate = useMemo(() => {
    type LessonWithStudent = Lesson & { student: StudentWithLessons };
    const map = new Map<string, LessonWithStudent[]>();
    
    students.forEach(student => {
      student.lessons.forEach(lesson => {
        const dateKey = new Date(lesson.date).toISOString().split('T')[0];
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)!.push({ ...lesson, student });
      });
    });
    return map;
  }, [students]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  // Adjust startDayOfWeek to make Monday the first day (0) and Sunday the last day (6)
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; 

  const weekDays = ['월', '화', '수', '목', '금', '토', '일'];

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };
  
  const getLessonBgColor = (status: LessonStatus) => {
    switch (status) {
        case LessonStatus.Completed: return 'bg-sky-100 border-sky-300';
        case LessonStatus.Scheduled: return 'bg-amber-100 border-amber-300';
        case LessonStatus.Cancelled: return 'bg-red-100 border-red-300';
        default: return 'bg-gray-100 border-gray-300';
    }
  }

  const handleStatusUpdate = (studentId: string, lessonId: string, status: LessonStatus) => {
    onUpdateLessonStatus(studentId, lessonId, status);
    setActiveMenu(null);
  };
  
  return (
    <div className="bg-white p-2 sm:p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
            <button onClick={() => changeMonth(-1)} className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-lg">&lt;</button>
            <h2 className="text-xl sm:text-3xl font-bold text-gray-800">{`${year}년 ${month + 1}월`}</h2>
            <button onClick={() => changeMonth(1)} className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-lg">&gt;</button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-300 border border-gray-300">
            {weekDays.map(day => (
                <div key={day} className={`text-center font-bold py-2 sm:py-3 bg-gray-100 text-sm sm:text-base ${day === '토' || day === '일' ? 'text-red-500' : 'text-gray-600'}`}>{day}</div>
            ))}
            
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-start-${i}`} className="bg-gray-50"></div>
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => {
                const dayNumber = i + 1;
                const date = new Date(year, month, dayNumber);
                const dateKey = date.toISOString().split('T')[0];
                const dayLessons = lessonsByDate.get(dateKey) || [];

                return (
                    <div key={dayNumber} className="bg-white p-1 sm:p-2 min-h-[120px] sm:min-h-[180px] lg:min-h-[240px]">
                        <span className="font-bold text-gray-700 text-sm sm:text-lg">{dayNumber}</span>
                        <div className="mt-1 space-y-1 overflow-y-auto max-h-[160px] lg:max-h-[200px]">
                            {dayLessons.map((lesson) => {
                                const teacher = teacherMap.get(lesson.student.teacherId ?? '');
                                const studentInfo = [lesson.student.school, lesson.student.grade].filter(Boolean).join(' / ');
                                const studentDisplay = studentInfo ? `${lesson.student.name} (${studentInfo})` : lesson.student.name;
                                const teacherDisplay = teacher ? `${teacher.name}` : '미배정';

                                return (
                                <div key={`${lesson.student.id}-${lesson.id}`} className="relative">
                                    <div 
                                        onClick={() => setActiveMenu(activeMenu === lesson.id ? null : lesson.id)}
                                        className={`p-1 sm:p-2 rounded-md border text-xs sm:text-sm text-left shadow-sm cursor-pointer hover:shadow-lg transition-shadow ${getLessonBgColor(lesson.status)}`}>
                                        
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 pr-1">
                                                <p className="font-bold truncate text-gray-800">{studentDisplay}</p>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                        
                                        <div className="mt-1 border-t border-gray-200 pt-1">
                                            <p className="text-xs text-gray-600 truncate">{teacherDisplay}</p>
                                        </div>

                                    </div>
                                    {activeMenu === lesson.id && (
                                        <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-20">
                                            <button onClick={() => handleStatusUpdate(lesson.student.id, lesson.id, LessonStatus.Completed)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">완료</button>
                                            <button onClick={() => handleStatusUpdate(lesson.student.id, lesson.id, LessonStatus.Scheduled)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">예정</button>
                                            <button onClick={() => handleStatusUpdate(lesson.student.id, lesson.id, LessonStatus.Cancelled)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">취소</button>
                                        </div>
                                    )}
                                </div>
                                );
                            })}
                        </div>
                    </div>
                )
            })}
             {Array.from({ length: (7 - (startDayOfWeek + daysInMonth) % 7) % 7 }).map((_, i) => (
                <div key={`empty-end-${i}`} className="bg-gray-50"></div>
            ))}
        </div>
    </div>
  );
};

export default CalendarView;
