import mongoose, { Schema, model, models } from 'mongoose';

const CourseSchema = new Schema({
  courseId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, required: true },
  chapters: [
    {
      title: String,
      content: String, // 나중에 HTML이나 Markdown으로 저장
      completed: { type: Boolean, default: false }
    }
  ],
  createdBy: { type: String, required: true }, // User Email or ID
}, { timestamps: true });

// Next.js는 모델을 자꾸 다시 컴파일하려 해서, 이미 있으면 그거 씀 (models.Course || ...)
const Course = models.Course || model('Course', CourseSchema);

export default Course;
