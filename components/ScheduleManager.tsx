import React, { useState, useMemo, useEffect } from 'react';
import { StudentWithLessons, Lesson, LessonStatus, Teacher } from '../types';
import FileUpload from './FileUpload';

interface ScheduleManagerProps {
  students: StudentWithLessons[];
  teachers: Teacher[];
  onSaveLesson: (studentId: string, lesson: Lesson) => void;
  onDeleteLesson: (studentId: string, lessonId: string) => void;
  onOpenLessonDetailModal: (studentId: string, lesson: Lesson | null) => void;
}

const today = new Date();
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

type LessonDisplayInfo = Lesson & { 
  studentId: string;
  studentName: string;
  teacherName: string;
  isPlaceholder?: boolean; // This won't be used here but keeps type compatibility
};


const ScheduleManager: React.FC<ScheduleManagerProps> = ({ students, teachers, onSaveLesson, onDeleteLesson }) => {
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);
  
  const teacherMap = useMemo(() => new Map(teachers.map(t => [t.id, t.name])), [teachers]);
  const studentMap = useMemo(() => new Map(students.map(s => [s.id, s.name])), [students]);
  
  const allLessons = useMemo(() => {
    const lessons: LessonDisplayInfo[] = [];
    students.forEach(student => {
      student.lessons.forEach(lesson => {
        lessons.push({
          ...lesson,
          studentId: student.id,
          studentName: student.name,
          teacherName: student.teacherId ? teacherMap.get(student.teacherId) || '미배정' : '미배정',
        });
      });
    });

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return lessons
      .filter(lesson => {
        const lessonDate = new Date(lesson.date);
        return lessonDate >= start && lessonDate <= end;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [students, teachers, startDate, endDate, teacherMap]);

  const [localLessons, setLocalLessons] = useState<LessonDisplayInfo[]>([]);
  
  useEffect(() => {
    setLocalLessons(allLessons);
  }, [allLessons]);

  const handleFieldChange = (index: number, field: keyof Lesson, value: any) => {
    const updatedLessons = [...localLessons];
    updatedLessons[index] = { ...updatedLessons[index], [field]: value };
    setLocalLessons(updatedLessons);
  };
    
  const handleSave = (index: number) => {
    const lessonToSave = localLessons[index];
    const { studentId, studentName, teacherName, ...lessonData } = lessonToSave;
    onSaveLesson(studentId, lessonData as Lesson);
  };

  const handleFileSelected = (index: number, field: 'planFileLink' | 'reportFileLink', file: File | null) => {
    const updatedLessons = [...localLessons];
    const lessonToUpdate = { ...updatedLessons[index] };
    lessonToUpdate[field] = file ? file.name : undefined;
    updatedLessons[index] = lessonToUpdate;
    setLocalLessons(updatedLessons);

    // Auto-save on file change
    const { studentId, studentName, teacherName, ...lessonData } = lessonToUpdate;
    onSaveLesson(studentId, lessonData as Lesson);
  };


  const headerGroups = [
    { name: '기본 정보', colSpan: 4, color: 'bg-slate-100' },
    { name: '계획표', colSpan: 3, color: 'bg-teal-100' },
    { name: '수업 및 보고서', colSpan: 4, color: 'bg-sky-100' },
  ];

  const headers = [
    // 기본 정보
    '선생님 이름', '학생 이름', '인덱스 사용 여부', '수업 일자',
    // 계획표
    '계획표 업로드 일자', '계획표 파일', '계획표 검수',
    // 수업 및 보고서
    '수업 완료 여부', '수업 내용 (250자 이상)', '보고서 제출 기한', '보고서 제출'
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <div>
            <h2 className="text-4xl font-bold text-gray-800">수업 관리</h2>
            <p className="text-gray-500 mt-2 text-lg">기간을 선택하여 전체 수업 현황을 확인하고 수정합니다.</p>
        </div>
        <div className="flex gap-2 flex-col sm:flex-row items-center">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full sm:w-auto p-3 border border-gray-300 rounded-md shadow-sm text-lg"/>
            <span className="text-gray-500 font-bold">~</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full sm:w-auto p-3 border border-gray-300 rounded-md shadow-sm text-lg"/>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                      {headerGroups.map(group => (
                          <th key={group.name} colSpan={group.colSpan} className={`px-4 py-2 text-center text-sm font-bold text-gray-700 ${group.color} border-b-2 border-gray-300`}>{group.name}</th>
                      ))}
                  </tr>
                  <tr>
                      {headers.map(header => (
                          <th key={header} className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{header}</th>
                      ))}
                  </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {localLessons.map((lesson, index) => (
                      <tr key={lesson.id} className={'hover:bg-gray-50'}>
                          {/* 기본 정보 */}
                          <td className="px-3 py-2 whitespace-nowrap">{lesson.teacherName}T</td>
                          <td className="px-3 py-2 whitespace-nowrap">{lesson.studentName}</td>
                          <td className="p-1 min-w-[120px]">
                            <select value={lesson.indexUsage || ''} onChange={e => handleFieldChange(index, 'indexUsage', e.target.value)} onBlur={() => handleSave(index)} className="w-full p-2 border rounded-md bg-white">
                                <option value="">선택</option>
                                <option value="사용">사용</option>
                                <option value="자체 제작">자체 제작</option>
                            </select>
                          </td>
                          <td className="p-1 w-36"><input type="date" value={lesson.date?.split('T')[0] || ''} onChange={e => handleFieldChange(index, 'date', e.target.value)} onBlur={() => handleSave(index)} className="w-full p-2 border rounded-md" /></td>
                          
                          {/* 계획표 */}
                          <td className="p-1 w-36"><input type="date" value={lesson.planUploadDate || ''} onChange={e => handleFieldChange(index, 'planUploadDate', e.target.value)} onBlur={() => handleSave(index)} className="w-full p-2 border rounded-md" /></td>
                          <td className="p-1 min-w-[200px]"><FileUpload fileName={lesson.planFileLink} onFileSelect={(file) => handleFileSelected(index, 'planFileLink', file)} /></td>
                          <td className="p-1 w-32">
                              <select value={lesson.planReviewStatus || ''} onChange={e => handleFieldChange(index, 'planReviewStatus', e.target.value)} onBlur={() => handleSave(index)} className="w-full p-2 border rounded-md bg-white">
                                  <option value="">선택</option>
                                  <option value="미검수">미검수</option>
                                  <option value="완료">완료</option>
                                  <option value="수정요청">수정요청</option>
                              </select>
                          </td>
                          
                          {/* 수업 및 보고서 */}
                           <td className="p-1 w-28">
                              <select value={lesson.status || ''} onChange={e => handleFieldChange(index, 'status', e.target.value)} onBlur={() => handleSave(index)} className="w-full p-2 border rounded-md bg-white">
                                  <option value={LessonStatus.Pending}>미예약</option>
                                  <option value={LessonStatus.Scheduled}>예정</option>
                                  <option value={LessonStatus.Completed}>완료</option>
                                  <option value={LessonStatus.Cancelled}>취소</option>
                              </select>
                          </td>
                          <td className="p-1 min-w-[300px]"><textarea value={lesson.lessonContent || ''} onChange={e => handleFieldChange(index, 'lessonContent', e.target.value)} onBlur={() => handleSave(index)} className="w-full h-16 p-2 border rounded-md" rows={2} /></td>
                          <td className="p-1 w-36"><input type="date" value={lesson.reportDeadline || ''} onChange={e => handleFieldChange(index, 'reportDeadline', e.target.value)} onBlur={() => handleSave(index)} className="w-full p-2 border rounded-md" /></td>
                          <td className="p-1 min-w-[200px]"><FileUpload fileName={lesson.reportFileLink} onFileSelect={(file) => handleFileSelected(index, 'reportFileLink', file)} /></td>
                      </tr>
                  ))}
              </tbody>
          </table>
           {allLessons.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-lg">
                  <p>선택된 기간에 수업이 없습니다.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default ScheduleManager;