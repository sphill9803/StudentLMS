import express from 'express';
import Teacher from '../models/Teacher';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { id, password } = req.body;

    try {
        // 1. Admin Login
        if (id === 'admin' && password === 'admin1234') {
            return res.json({ role: 'admin' });
        }

        // 2. Teacher Login
        // We assume 'id' is the phone number for teachers as per requirement
        // Sanitize Input
        const sanitizedId = id.replace(/-/g, '');
        const teacher = await Teacher.findOne({ phone: sanitizedId });

        if (teacher) {
            if (teacher.password === password) {
                return res.json({ role: 'teacher', teacher });
            } else {
                return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
            }
        }

        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

router.post('/change-password', async (req, res) => {
    const { id, currentPassword, newPassword } = req.body;

    try {
        const teacher = await Teacher.findOne({ phone: id });
        if (!teacher) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        if (teacher.password !== currentPassword) {
            return res.status(400).json({ message: '현재 비밀번호가 일치하지 않습니다.' });
        }

        teacher.password = newPassword;
        teacher.mustChangePassword = false;
        await teacher.save();

        res.json({ success: true, teacher });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

export default router;
