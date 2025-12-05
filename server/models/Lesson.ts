import mongoose, { Schema, Document } from 'mongoose';

export enum LessonStatus {
    Scheduled = 'SCHEDULED',
    Completed = 'COMPLETED',
    Cancelled = 'CANCELLED',
    Pending = 'PENDING',
    None = 'NONE',
}

export interface ILesson extends Document {
    id: string;
    studentId: string; // Foreign key to Student
    date: string;
    status: LessonStatus;
    indexUsage?: string;
    planUploadDate?: string;
    planFileLink?: string;
    planReviewStatus?: '미검수' | '완료' | '수정요청';
    lessonContent?: string;
    reportDeadline?: string;
    reportFileLink?: string;
    schoolSubmissionDate?: string;
    schoolSubmissionStatus?: '미제출' | '제출완료';
    firstReminderSent?: boolean;
    secondReminderSent?: boolean;
    thirdReminderSent?: boolean;
    nonSubmissionReason?: string;
}

const LessonSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    status: { type: String, enum: Object.values(LessonStatus), required: true },
    indexUsage: { type: String },
    planUploadDate: { type: String },
    planFileLink: { type: String },
    planReviewStatus: { type: String, enum: ['미검수', '완료', '수정요청'] },
    lessonContent: { type: String },
    reportDeadline: { type: String },
    reportFileLink: { type: String },
    schoolSubmissionDate: { type: String },
    schoolSubmissionStatus: { type: String, enum: ['미제출', '제출완료'] },
    firstReminderSent: { type: Boolean },
    secondReminderSent: { type: Boolean },
    thirdReminderSent: { type: Boolean },
    nonSubmissionReason: { type: String },
});

export default mongoose.model<ILesson>('Lesson', LessonSchema);
