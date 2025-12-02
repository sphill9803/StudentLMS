import React, { useState } from 'react';
import { Teacher, StudentWithLessons, LessonStatus } from '../types';

interface ScheduleGridProps {
  teachers: Teacher[];
  students: StudentWithLessons[];
  onUpdateLesson: (studentId: string, date: Date, status: LessonStatus) => void;
  onDeleteTeacher: (teacherId: string) => void;
  onDeleteStudent: (studentId: string) => void;
}

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ 
  teachers, 
  students, 
  onUpdateLesson,
  onDeleteTeacher,
  onDeleteStudent
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthsToDisplay = [
    { year: currentYear, month: currentMonth },
    { year: currentMonth === 11 ? currentYear + 1 : currentYear, month: (currentMonth + 1) % 12 },
    { year: (currentMonth + 1) % 12 === 11 ? currentYear + 1 : (currentMonth === 11 ? currentYear + 1 : currentYear), month: (currentMonth + 2) % 12 },
  ];

  const renderHeader = () => {
    return (
      <div className="sticky top-0 bg-white z-20">
        <div className="flex">
          <div className="w-48 min-w-[12rem] md:w-96 md:min-w-[24rem] p-2 border-r border-b border-gray-200 bg-gray-50 font-semibold text-gray-700 text-center flex items-center justify-center sticky left-0 z-20">
            강사 / 학생 정보
          </div>
          <div className="flex-grow flex">
            {monthsToDisplay.map(({ year, month }, index) => {
              const daysInMonth = getDaysInMonth(year, month);
              return (
                <div key={`${year}-${month}`} className="grid flex-grow" style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))` }}>
                  <div className={`col-span-${daysInMonth} p-2 border-b border-gray-200 text-center font-semibold text-gray-700 bg-sky-100 ${index < monthsToDisplay.length - 1 ? 'border-r' : ''}`} style={{ gridColumn: `span ${daysInMonth} / span ${daysInMonth}` }}>
                    {year}년 {month + 1}월
                  </div>
                  {Array.from({ length: daysInMonth }, (_, i) => (
                    <div key={i} className={`p-2 border-b border-l border-gray-200 text-center text-sm ${index < monthsToDisplay.length - 1 && i === daysInMonth - 1 ? 'border-r-2 border-r-gray-400' : ''}`}>
                      {i + 1}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  const LessonCell: React.FC<{ student: StudentWithLessons, date: Date }> = ({ student, date }) => {
    // FIX: The `l.date` property is a string. It must be converted to a Date object before using date methods.
    const lesson = student.lessons.find(l => {
      const lessonDate = new Date(l.date);
      return lessonDate.getFullYear() === date.getFullYear() &&
      lessonDate.getMonth() === date.getMonth() &&
      lessonDate.getDate() === date.getDate();
    });

    const [showMenu, setShowMenu] = useState(false);

    const handleStatusChange = (status: LessonStatus) => {
      onUpdateLesson(student.id, date, status);
      setShowMenu(false);
    };

    let cellBgColor = 'bg-white';
    let cellContent: React.ReactNode = null;
    
    if (lesson) {
        switch (lesson.status) {
            case LessonStatus.Completed:
                cellBgColor = 'bg-sky-200';
                cellContent = <span className="text-sky-800 font-bold">{student.lessons.filter(l => l.status === LessonStatus.Completed && new Date(l.date) <= new Date(lesson.date)).length}</span>;
                break;
            case LessonStatus.Scheduled:
                cellBgColor = 'bg-amber-100';
                break;
            case LessonStatus.Cancelled:
                cellBgColor = 'bg-red-200';
                break;
            case LessonStatus.Pending:
                cellBgColor = 'bg-gray-200';
                break;
        }
    }


    return (
        <div 
          className={`relative h-full w-full border-l border-dotted border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors ${cellBgColor}`}
          onClick={() => setShowMenu(!showMenu)}
        >
            {cellContent}
            {showMenu && (
                <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-20">
                    <button onClick={() => handleStatusChange(LessonStatus.Scheduled)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">예정</button>
                    <button onClick={() => handleStatusChange(LessonStatus.Completed)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">완료</button>
                    <button onClick={() => handleStatusChange(LessonStatus.Cancelled)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">취소</button>
                    <div className="border-t my-1"></div>
                    <button onClick={() => handleStatusChange(LessonStatus.None)} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">일정 삭제</button>
                </div>
            )}
        </div>
    );
  };

  const renderBody = () => {
    return teachers.flatMap(teacher => {
        const teacherStudents = students.filter(s => s.teacherId === teacher.id);

        const teacherHeaderRow = (
             <div key={teacher.id} className="flex border-t-2 border-t-gray-400">
                 <div className="w-48 min-w-[12rem] md:w-96 md:min-w-[24rem] p-2 border-r bg-slate-100 flex items-center justify-between sticky left-0 z-10">
                    <span className="font-bold text-base md:text-lg text-slate-700">{teacher.name}</span>
                    <button 
                        onClick={() => onDeleteTeacher(teacher.id)}
                        className="text-xs bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded-md transition-colors"
                    >
                        삭제
                    </button>
                </div>
                <div className="flex-grow bg-slate-100"></div>
            </div>
        );

        const studentRows = teacherStudents.map((student, studentIndex) => (
             <div key={student.id} className="flex border-t">
                <div className={`w-48 min-w-[12rem] md:w-96 md:min-w-[24rem] p-2 border-r bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sticky left-0 z-10`}>
                    <div className="flex items-center gap-2 md:gap-4">
                         <div className="w-4 h-4 rounded-full bg-blue-200 flex-shrink-0"></div>
                         <div>
                            <div className="font-medium text-gray-800 text-sm md:text-base">{student.name}</div>
                            <div className="text-xs md:text-sm text-gray-500">
                                {student.lessonsCompleted} / {student.totalLessons}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-center">
                        <button 
                            onClick={() => onDeleteStudent(student.id)}
                            className="text-xs bg-red-200 hover:bg-red-300 text-red-700 font-semibold py-1 px-2 rounded-md transition-colors"
                        >
                            삭제
                        </button>
                    </div>
                </div>

                <div className="flex-grow flex">
                    {monthsToDisplay.map(({ year, month }, index) => {
                      const daysInMonth = getDaysInMonth(year, month);
                      return (
                        <div key={`${year}-${month}`} className="grid flex-grow" style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))` }}>
                          {Array.from({ length: daysInMonth }, (_, dayIndex) => {
                            const date = new Date(year, month, dayIndex + 1);
                             return (
                              <div key={dayIndex} className={`h-10 text-xs ${index < monthsToDisplay.length - 1 && dayIndex === daysInMonth - 1 ? 'border-r-2 border-r-gray-400' : ''}`}>
                                  <LessonCell student={student} date={date} />
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                </div>
            </div>
        ));

        if (teacherStudents.length === 0) {
             studentRows.push(
                <div key={`${teacher.id}-no-students`} className="flex border-t">
                    <div className="w-48 min-w-[12rem] md:w-96 md:min-w-[24rem] p-3 border-r bg-white text-center text-gray-500 italic sticky left-0 z-10">
                        배정된 학생이 없습니다.
                    </div>
                    <div className="flex-grow flex">
                        {monthsToDisplay.map(({ year, month }, index) => {
                          const daysInMonth = getDaysInMonth(year, month);
                          return (
                            <div key={`${year}-${month}`} className="grid flex-grow" style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))` }}>
                              {Array.from({ length: daysInMonth }, (_, dayIndex) => (
                                <div key={dayIndex} className={`h-10 text-xs border-l border-dotted border-gray-300 ${index < monthsToDisplay.length - 1 && dayIndex === daysInMonth - 1 ? 'border-r-2 border-r-gray-400' : ''}`}></div>
                              ))}
                            </div>
                          );
                        })}
                    </div>
                </div>
            );
        }
        
        return [teacherHeaderRow, ...studentRows];
    });
  };

  return (
    <>
      <div className="md:hidden text-center text-sm bg-yellow-100 text-yellow-800 p-2 rounded-md mb-4">
          표가 넓습니다. 가로로 스크롤하여 모든 내용을 확인하세요. 데스크탑에서 더 나은 경험을 제공합니다.
      </div>
      <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <div className="min-w-max">
          {renderHeader()}
          {renderBody()}
        </div>
      </div>
    </>
  );
};

export default ScheduleGrid;