import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import teacherRoutes from './routes/teachers';
import studentRoutes from './routes/students';
import lessonRoutes from './routes/lessons';

dotenv.config({ path: '../.env.local' });

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studentlms';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/lessons', lessonRoutes);

app.get('/', (req, res) => {
    res.send('StudentLMS API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
