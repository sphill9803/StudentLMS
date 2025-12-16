import express from 'express';
import Teacher from '../models/Teacher';

const router = express.Router();

// Get all teachers
router.get('/', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching teachers', error: err });
    }
});

// Create a teacher
router.post('/', async (req, res) => {
    try {
        const teacherData = { ...req.body };
        if (teacherData.phone) teacherData.phone = teacherData.phone.replace(/-/g, '');

        const newTeacher = new Teacher(teacherData);
        const savedTeacher = await newTeacher.save();
        res.status(201).json(savedTeacher);
    } catch (err) {
        res.status(400).json({ message: 'Error creating teacher', error: err });
    }
});

// Update a teacher
router.put('/:id', async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.phone) updateData.phone = updateData.phone.replace(/-/g, '');

        const updatedTeacher = await Teacher.findOneAndUpdate(
            { id: req.params.id },
            updateData,
            { new: true }
        );
        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json(updatedTeacher);
    } catch (err) {
        res.status(400).json({ message: 'Error updating teacher', error: err });
    }
});

// Delete a teacher
router.delete('/:id', async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findOneAndDelete({ id: req.params.id });
        if (!deletedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json({ message: 'Teacher deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting teacher', error: err });
    }
});

export default router;
