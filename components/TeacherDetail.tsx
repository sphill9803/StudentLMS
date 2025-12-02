import React, { useState, useEffect } from 'react';
import { Teacher } from '../types';

interface TeacherDetailProps {
  teacher: Teacher;
  onSave: (teacher: Teacher) => void;
  onBack: () => void;
}

const TeacherDetail: React.FC<TeacherDetailProps> = ({ teacher, onSave, onBack }) => {
  const [formData, setFormData] = useState<Teacher>(teacher);

  useEffect(() => {
    setFormData(teacher);
  }, [teacher]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderInputField = (label: string, name: keyof Teacher, type = 'text', required = false) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={String(formData[name] || '')}
        onChange={handleChange}
        required={required}
        placeholder="정보 없음"
        className="mt-1 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full border-gray-300 rounded-md"
      />
    </div>
  );

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">선생님 상세 정보</h2>
          <p className="text-gray-500 mt-2 text-base sm:text-lg">{teacher.name} 선생님의 모든 정보를 관리합니다.</p>
        </div>
        <button onClick={onBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg text-base">
          목록으로
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          
          <section>
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">기본 정보</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderInputField('성명', 'name', 'text', true)}
              {renderInputField('출신학교', 'major', 'text', true)}
              {renderInputField('생년월일', 'dob', 'date')}
              {renderInputField('전화번호', 'phone', 'tel')}
              {renderInputField('이메일 주소', 'email', 'email')}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">주소 및 개인 정보</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {renderInputField('주민번호', 'residentRegistrationNumber')}
              {renderInputField('통장번호', 'bankAccountNumber')}
            </div>
             <div className="mt-6">
                {renderInputField('주소', 'address')}
            </div>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">계약 정보</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {renderInputField('계약일', 'contractDate', 'date')}
              {renderInputField('수업시작일', 'classStartDate', 'date')}
              {renderInputField('계약종료일', 'contractTerminationDate', 'date')}
              {renderInputField('경찰청 조회일', 'policeCheckDate', 'date')}
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
  );
};

export default TeacherDetail;