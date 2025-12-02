import React, { useState, useEffect } from 'react';
import { Teacher, StudentWithLessons, Lesson, LessonStatus } from '../types';
import FileUpload from './FileUpload';

const generateId = () => `id_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;

interface EditableLessonSheetProps {
    student: StudentWithLessons;
    teacher: Teacher;
    onSaveLesson: (studentId: string, lesson: Lesson) => void;
}

const EditableLessonSheet: React.FC<EditableLessonSheetProps> = ({ student, teacher, onSaveLesson }) => {
    
    const [localLessons, setLocalLessons] = useState<(Lesson & {isPlaceholder: boolean})[]>([]);

    useEffect(() => {
        const totalLessons = student.totalLessons || 12;
        const existingLessons = [...student.lessons].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        const lessons = Array.from({ length: totalLessons }, (_, i) => {
            if (existingLessons[i]) {
                return { ...existingLessons[i], isPlaceholder: false };
            }
            return {
                id: `placeholder-${student.id}-${i}`,
                date: '',
                status: LessonStatus.Pending,
                isPlaceholder: true,
            } as Lesson & { isPlaceholder: boolean };
        });
        setLocalLessons(lessons);
    }, [student]);

    const handleFieldChange = (index: number, field: keyof Lesson, value: any) => {
        const updatedLessons = [...localLessons];
        const currentLesson = { ...updatedLessons[index], [field]: value };
        
        if (currentLesson.isPlaceholder) {
            currentLesson.isPlaceholder = false;
            if (currentLesson.id.startsWith('placeholder-')) {
                currentLesson.id = generateId();
            }
        }
        updatedLessons[index] = currentLesson;
        setLocalLessons(updatedLessons);
    };
    
    const handleSave = (index: number) => {
        const lessonToSave = localLessons[index];
        if (!lessonToSave.isPlaceholder) {
            // Create a clean lesson object without the `isPlaceholder` flag
            const { isPlaceholder, ...lessonData } = lessonToSave;
            onSaveLesson(student.id, lessonData);
        }
    };

    const handleFileSelected = (index: number, field: 'planFileLink' | 'reportFileLink', file: File | null) => {
        const updatedLessons = [...localLessons];
        const lessonToUpdate = { ...updatedLessons[index] };
        
        lessonToUpdate[field] = file ? file.name : undefined;

        if (lessonToUpdate.isPlaceholder && file) {
            lessonToUpdate.isPlaceholder = false;
            if (lessonToUpdate.id.startsWith('placeholder-')) {
                lessonToUpdate.id = generateId();
            }
        }
        
        updatedLessons[index] = lessonToUpdate;
        setLocalLessons(updatedLessons);
        
        // Auto-save on file change
        if (!lessonToUpdate.isPlaceholder) {
            const { isPlaceholder, ...lessonData } = lessonToUpdate;
            onSaveLesson(student.id, lessonData);
        }
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
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full overflow-hidden">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                {student.name} <span className="text-xl sm:text-2xl font-medium text-gray-500">({student.school} / {student.grade})</span> 학생 수업 관리
            </h2>
            <p className="text-gray-500 mb-6 text-sm sm:text-base">수업 내용을 클릭하여 수정하고, 입력 필드에서 포커스가 벗어나면 자동으로 저장됩니다.</p>
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
                            <tr key={lesson.id} className={lesson.isPlaceholder ? 'bg-gray-50' : 'hover:bg-gray-50'}>
                                {/* 기본 정보 */}
                                <td className="px-3 py-2 whitespace-nowrap">{teacher.name}T</td>
                                <td className="px-3 py-2 whitespace-nowrap">{student.name}</td>
                                <td className="p-1 min-w-[120px]">
                                    <select value={lesson.indexUsage || ''} onChange={e => handleFieldChange(index, 'indexUsage', e.target.value)} onBlur={() => handleSave(index)} className="w-full p-2 border rounded-md bg-white">
                                        <option value="">선택</option>
                                        <option value="사용">사용</option>
                                        <option value="자체 제작">자체 제작</option>
                                    </select>
                                </td>
                                <td className="p-1 w-32"><input type="date" value={lesson.date?.split('T')[0] || ''} onChange={e => handleFieldChange(index, 'date', e.target.value)} onBlur={() => handleSave(index)} className="w-full p-2 border rounded-md" /></td>
                                
                                {/* 계획표 */}
                                <td className="p-1 w-32"><input type="date" value={lesson.planUploadDate || ''} onChange={e => handleFieldChange(index, 'planUploadDate', e.target.value)} onBlur={() => handleSave(index)} className="w-full p-2 border rounded-md" /></td>
                                <td className="p-1 min-w-[200px]"><FileUpload fileName={lesson.planFileLink} onFileSelect={(file) => handleFileSelected(index, 'planFileLink', file)} /></td>
                                <td className="p-1 w-28">
                                    <select value={lesson.planReviewStatus || ''} onChange={e => handleFieldChange(index, 'planReviewStatus', e.target.value)} onBlur={() => handleSave(index)} className="w-full p-2 border rounded-md bg-white">
                                        <option value="">선택</option>
                                        <option value="미검수">미검수</option>
                                        <option value="완료">완료</option>
                                        <option value="수정요청">수정요청</option>
                                    </select>
                                </td>
                                
                                {/* 수업 및 보고서 */}
                                 <td className="p-1 w-24">
                                    <select value={lesson.status || ''} onChange={e => handleFieldChange(index, 'status', e.target.value)} onBlur={() => handleSave(index)} className="w-full p-2 border rounded-md bg-white">
                                        <option value={LessonStatus.Pending}>미예약</option>
                                        <option value={LessonStatus.Scheduled}>예정</option>
                                        <option value={LessonStatus.Completed}>완료</option>
                                        <option value={LessonStatus.Cancelled}>취소</option>
                                    </select>
                                </td>
                                <td className="p-1 min-w-[300px]"><textarea value={lesson.lessonContent || ''} onChange={e => handleFieldChange(index, 'lessonContent', e.target.value)} onBlur={() => handleSave(index)} className="w-full h-16 p-2 border rounded-md" rows={2} /></td>
                                <td className="p-1 w-32"><input type="date" value={lesson.reportDeadline || ''} onChange={e => handleFieldChange(index, 'reportDeadline', e.target.value)} onBlur={() => handleSave(index)} className="w-full p-2 border rounded-md" /></td>
                                <td className="p-1 min-w-[200px]"><FileUpload fileName={lesson.reportFileLink} onFileSelect={(file) => handleFileSelected(index, 'reportFileLink', file)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>
    )
};

export default EditableLessonSheet;