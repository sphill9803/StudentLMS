import express from 'express';
import Student from '../models/Student';

const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching students', error: err });
    }
});

// Create a student
router.post('/', async (req, res) => {
    try {
        const studentData = { ...req.body };
        if (studentData.phoneStudent) studentData.phoneStudent = studentData.phoneStudent.replace(/-/g, '');
        if (studentData.phoneParent) studentData.phoneParent = studentData.phoneParent.replace(/-/g, '');

        const newStudent = new Student(studentData);
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        res.status(400).json({ message: 'Error creating student', error: err });
    }
});

// Update a student
router.put('/:id', async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.phoneStudent) updateData.phoneStudent = updateData.phoneStudent.replace(/-/g, '');
        if (updateData.phoneParent) updateData.phoneParent = updateData.phoneParent.replace(/-/g, '');

        const updatedStudent = await Student.findOneAndUpdate(
            { id: req.params.id },
            updateData,
            { new: true }
        );
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: 'Error updating student', error: err });
    }
});

// Delete a student
router.delete('/:id', async (req, res) => {
    try {
        const deletedStudent = await Student.findOneAndDelete({ id: req.params.id });
        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting student', error: err });
    }
});

export default router;
