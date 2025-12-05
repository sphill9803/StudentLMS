import express from 'express';
import Lesson from '../models/Lesson';

const router = express.Router();

// Get lessons for a student
router.get('/:studentId', async (req, res) => {
    try {
        const lessons = await Lesson.find({ studentId: req.params.studentId });
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching lessons', error: err });
    }
});

// Get all lessons (optional, for dashboard if needed)
router.get('/', async (req, res) => {
    try {
        const lessons = await Lesson.find();
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching all lessons', error: err });
    }
});


// Create a lesson
router.post('/:studentId', async (req, res) => {
    try {
        const newLesson = new Lesson({ ...req.body, studentId: req.params.studentId });
        const savedLesson = await newLesson.save();
        res.status(201).json(savedLesson);
    } catch (err) {
        res.status(400).json({ message: 'Error creating lesson', error: err });
    }
});

// Update a lesson
router.put('/:studentId/:lessonId', async (req, res) => {
    try {
        const updatedLesson = await Lesson.findOneAndUpdate(
            { id: req.params.lessonId, studentId: req.params.studentId },
            req.body,
            { new: true }
        );
        if (!updatedLesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        res.json(updatedLesson);
    } catch (err) {
        res.status(400).json({ message: 'Error updating lesson', error: err });
    }
});

// Delete a lesson
router.delete('/:studentId/:lessonId', async (req, res) => {
    try {
        const deletedLesson = await Lesson.findOneAndDelete({ id: req.params.lessonId, studentId: req.params.studentId });
        if (!deletedLesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        res.json({ message: 'Lesson deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting lesson', error: err });
    }
});

export default router;
