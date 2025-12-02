import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Lesson, LessonStatus } from '../types';
import FileUpload from './FileUpload';

interface LessonDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: Lesson) => void;
  lesson: Lesson;
}

const LessonDetailModal: React.FC<LessonDetailModalProps> = ({ isOpen, onClose, onSave, lesson }) => {
  const [formData, setFormData] = useState<Lesson>(lesson);

  useEffect(() => {
    setFormData(lesson);
  }, [lesson]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleFileChange = (name: keyof Lesson, file: File | null) => {
    setFormData(prev => ({ ...prev, [name]: file ? file.name : undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const renderField = (label: string, name: keyof Lesson, type = 'text', options?: string[]) => (
    <div>
        <label htmlFor={name} className="block text-sm sm:text-base font-medium text-gray-700">{label}</label>
        {type === 'textarea' ? (
            <textarea id={name} name={name} value={String(formData[name] || '')} onChange={handleChange} rows={4} className="mt-1 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full border-gray-300 rounded-md" />
        ) : type === 'select' ? (
            <select id={name} name={name} value={String(formData[name] || '')} onChange={handleChange} className="mt-1 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full border-gray-300 rounded-md p-2">
                <option value="">선택</option>
                {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        ) : (
            <input type={type} id={name} name={name} value={String(formData[name] || '')} onChange={handleChange} className="mt-1 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full border-gray-300 rounded-md" />
        )}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="수업 상세 관리" size="5xl">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            {/* --- Left Column --- */}
            <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {renderField('수업일', 'date', 'date')}
                    <div>
                        <label htmlFor="status" className="block text-sm sm:text-base font-medium text-gray-700">수업 완료 여부</label>
                        <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full border-gray-300 rounded-md p-2">
                            <option value={LessonStatus.Scheduled}>예정</option>
                            <option value={LessonStatus.Completed}>완료</option>
                            <option value={LessonStatus.Cancelled}>취소</option>
                        </select>
                    </div>
                </div>

                {/* Plan Management */}
                <div className="border-t pt-6">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">계획표 관리</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {renderField('인덱스 사용 여부', 'indexUsage', 'select', ['사용', '자체 제작'])}
                        {renderField('계획표 업로드 일자', 'planUploadDate', 'date')}
                        <div>
                            <label className="block text-sm sm:text-base font-medium text-gray-700">계획표 파일</label>
                            <div className="mt-1">
                                <FileUpload fileName={formData.planFileLink} onFileSelect={(file) => handleFileChange('planFileLink', file)} />
                            </div>
                        </div>
                        {renderField('계획표 검수', 'planReviewStatus', 'select', ['미검수', '완료', '수정요청'])}
                    </div>
                </div>
                 
                {/* Reminders */}
                <div className="border-t pt-6">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">제출 기한 초과 리마인더</h4>
                    <div className="flex items-center space-x-4 sm:space-x-8">
                        <div className="flex items-center">
                            <input type="checkbox" id="firstReminderSent" name="firstReminderSent" checked={formData.firstReminderSent || false} onChange={handleChange} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <label htmlFor="firstReminderSent" className="ml-2 block text-sm sm:text-base text-gray-900">1차</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="secondReminderSent" name="secondReminderSent" checked={formData.secondReminderSent || false} onChange={handleChange} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <label htmlFor="secondReminderSent" className="ml-2 block text-sm sm:text-base text-gray-900">2차</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="thirdReminderSent" name="thirdReminderSent" checked={formData.thirdReminderSent || false} onChange={handleChange} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <label htmlFor="thirdReminderSent" className="ml-2 block text-sm sm:text-base text-gray-900">3차</label>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Right Column --- */}
            <div className="mt-6 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l lg:pl-8">
                <div className="space-y-6">
                    <div>
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">수업 및 보고서</h4>
                        <div className="space-y-6">
                            {renderField('수업 내용 (250자 이상)', 'lessonContent', 'textarea')}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {renderField('보고서 제출 기한', 'reportDeadline', 'date')}
                                <div>
                                    <label className="block text-sm sm:text-base font-medium text-gray-700">보고서 제출</label>
                                     <div className="mt-1">
                                        <FileUpload fileName={formData.reportFileLink} onFileSelect={(file) => handleFileChange('reportFileLink', file)} />
                                    </div>
                                </div>
                                {renderField('학교 제출 예정일', 'schoolSubmissionDate', 'date')}
                                {renderField('학교 제출 여부', 'schoolSubmissionStatus', 'select', ['미제출', '제출완료'])}
                            </div>
                            {renderField('보고서 미제출 사유', 'nonSubmissionReason', 'textarea')}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- Buttons --- */}
        <div className="flex flex-col sm:flex-row justify-end pt-8 mt-8 border-t gap-3">
          <button type="button" onClick={onClose} className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-5 rounded text-base">
            취소
          </button>
          <button type="submit" className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded text-base">
            저장
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LessonDetailModal;