import React, { useState, useEffect } from 'react';
import { StudentWithLessons, Teacher } from '../types';

interface StudentDetailProps {
  student: StudentWithLessons;
  teachers: Teacher[];
  onSave: (student: StudentWithLessons) => void;
  onBack: () => void;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student, teachers, onSave, onBack }) => {
  const [formData, setFormData] = useState<StudentWithLessons>(student);

  useEffect(() => {
    setFormData(student);
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderInputField = (label: string, name: keyof StudentWithLessons, type = 'text', required = false) => (
    <div>
      <label htmlFor={name as string} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        id={name as string}
        name={name as string}
        value={String(formData[name] || '')}
        onChange={handleChange}
        required={required}
        placeholder="정보 없음"
        className="mt-1 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full border-gray-300 rounded-md"
      />
    </div>
  );
  
  const renderTextareaField = (label: string, name: keyof StudentWithLessons, rows = 3) => (
     <div>
      <label htmlFor={name as string} className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        id={name as string}
        name={name as string}
        rows={rows}
        value={String(formData[name] || '')}
        onChange={handleChange}
        placeholder="내용 없음"
        className="mt-1 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full border-gray-300 rounded-md"
      />
    </div>
  );
  
  const renderReadOnlyInfoBlock = (label: string, content: string | undefined, writtenDate: string | undefined) => (
    <div className="p-4 bg-gray-50 rounded-lg border">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold text-gray-800">{label}</h4>
        <p className="text-sm text-gray-500">
            작성일: {writtenDate || '미지정'}
        </p>
      </div>
      <p className="text-base text-gray-700 whitespace-pre-wrap min-h-[60px]">{content || '내용 없음'}</p>
    </div>
  );


  return (
    <>
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">학생 상세 정보</h2>
            <p className="text-gray-500 mt-2 text-base sm:text-lg">{student.name} 학생의 모든 정보를 관리합니다.</p>
          </div>
          <button onClick={onBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg text-base">
            목록으로
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            
            <section>
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">기본 정보</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderInputField('이름', 'name', 'text', true)}
                {renderInputField('학교', 'school')}
                {renderInputField('학년', 'grade')}
                <div>
                  <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700">담당 선생님</label>
                  <select
                    id="teacherId"
                    name="teacherId"
                    value={formData.teacherId || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  >
                    <option value="">미배정</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">연락처 및 주소</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {renderInputField('학생 연락처', 'phoneStudent', 'tel')}
                {renderInputField('학부모 연락처', 'phoneParent', 'tel')}
                {renderInputField('이메일', 'email', 'email')}
              </div>
              <div className="mt-6">
                {renderInputField('주소', 'address')}
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">수업 및 등록 정보</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderInputField('수업 종류', 'classType')}
                <div>
                  <label htmlFor="registrationStatus" className="block text-sm font-medium text-gray-700">등록 상태</label>
                  <select
                      id="registrationStatus"
                      name="registrationStatus"
                      value={formData.registrationStatus || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  >
                      <option value="">선택</option>
                      <option value="등록">등록</option>
                      <option value="미등록">미등록</option>
                      <option value="상담">상담</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="totalLessons" className="block text-sm font-medium text-gray-700">총 수업 횟수</label>
                  <input
                      type="number"
                      id="totalLessons"
                      name="totalLessons"
                      value={formData.totalLessons}
                      onChange={handleNumberChange}
                      className="mt-1 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full border-gray-300 rounded-md"
                  />
                </div>
                <div className="p-4 bg-gray-100 rounded-md">
                  <label className="block text-sm font-medium text-gray-500">완료한 수업</label>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{formData.lessonsCompleted}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {renderInputField('첫 등록일', 'initialRegistrationDate', 'date')}
                {renderInputField('이전 등록월', 'previousRegistrationMonth', 'month')}
                {renderInputField('차기 등록월', 'reRegistrationMonth', 'month')}
                {renderInputField('계약 마감월', 'contractEndMonth', 'month')}
              </div>
            </section>

            <section>
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">학생 특징</h3>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {renderInputField('계열', 'careerPath')}
                        {renderInputField('희망 전공', 'desiredMajor')}
                    </div>
                     <div className="grid grid-cols-1">
                        {renderTextareaField('성적 관련', 'studentGrades')}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t">
                       {renderReadOnlyInfoBlock('학생 특징', formData.studentCharacteristics, formData.studentCharacteristicsWrittenDate)}
                       {renderReadOnlyInfoBlock('학생 통화 내용', formData.studentCallLog, formData.studentCallLogWrittenDate)}
                       {renderReadOnlyInfoBlock('학부모 통화 내용', formData.parentCallLog, formData.parentCallLogWrittenDate)}
                    </div>
                </div>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row justify-end gap-3">
            <button type="button" onClick={onBack} className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-base">
              취소
            </button>
            <button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-base">
              정보 저장
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default StudentDetail;