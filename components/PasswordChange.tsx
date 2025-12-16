import React, { useState } from 'react';

interface PasswordChangeProps {
    id: string; // Teacher's phone number
    onSuccess: (updatedTeacher: any) => void;
}

const PasswordChange: React.FC<PasswordChangeProps> = ({ id, onSuccess }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        if (newPassword.length < 4) {
            setError('비밀번호는 4자리 이상이어야 합니다.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5001/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, currentPassword, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('비밀번호가 변경되었습니다.');
                onSuccess(data.teacher);
            } else {
                setError(data.message || '비밀번호 변경에 실패했습니다.');
            }
        } catch (err) {
            console.error('Password change error:', err);
            setError('서버 연결에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-2 text-center text-blue-600">비밀번호 변경</h2>
                <p className="text-center text-gray-600 mb-6 text-sm">최초 로그인 시 비밀번호 변경이 필요합니다.</p>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">현재 비밀번호</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">새 비밀번호</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="4자리 이상"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">새 비밀번호 확인</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {loading ? '변경 중...' : '비밀번호 변경'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordChange;
