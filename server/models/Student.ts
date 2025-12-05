import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
    id: string;
    name: string;
    school?: string;
    grade?: string;
    careerPath?: string;
    initialRegistrationDate?: string;
    previousRegistrationMonth?: string;
    registrationStatus?: '등록' | '미등록' | '상담';
    phoneStudent?: string;
    phoneParent?: string;
    classType?: string;
    email?: string;
    address?: string;
    contractEndMonth?: string;
    reRegistrationMonth?: string;
    totalLessons: number;
    lessonsCompleted: number;
    teacherId?: string;
    studentCharacteristics?: string;
    studentCharacteristicsWrittenDate?: string;
    studentGrades?: string;
    studentGradesLastUpdated?: string;
    desiredMajor?: string;
    desiredMajorLastUpdated?: string;
    studentCallLog?: string;
    studentCallLogWrittenDate?: string;
    parentCallLog?: string;
    parentCallLogWrittenDate?: string;
}

const StudentSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    school: { type: String },
    grade: { type: String },
    careerPath: { type: String },
    initialRegistrationDate: { type: String },
    previousRegistrationMonth: { type: String },
    registrationStatus: { type: String, enum: ['등록', '미등록', '상담'] },
    phoneStudent: { type: String },
    phoneParent: { type: String },
    classType: { type: String },
    email: { type: String },
    address: { type: String },
    contractEndMonth: { type: String },
    reRegistrationMonth: { type: String },
    totalLessons: { type: Number, default: 0 },
    lessonsCompleted: { type: Number, default: 0 },
    teacherId: { type: String }, // Reference by ID string
    studentCharacteristics: { type: String },
    studentCharacteristicsWrittenDate: { type: String },
    studentGrades: { type: String },
    studentGradesLastUpdated: { type: String },
    desiredMajor: { type: String },
    desiredMajorLastUpdated: { type: String },
    studentCallLog: { type: String },
    studentCallLogWrittenDate: { type: String },
    parentCallLog: { type: String },
    parentCallLogWrittenDate: { type: String },
});

export default mongoose.model<IStudent>('Student', StudentSchema);
