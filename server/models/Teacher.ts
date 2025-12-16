import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
    id: string; // We'll keep the string ID for compatibility, or rely on _id
    name: string;
    major: string;
    contractEndDate?: string;
    contractTerminationDate?: string;
    classStartDate?: string;
    phone?: string;
    policeCheckDate?: string;
    contractDate?: string;
    dob?: string;
    address?: string;
    residentRegistrationNumber?: string;
    email?: string;
    bankAccountNumber?: string;
    password?: string;
    mustChangePassword?: boolean;
}

const TeacherSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    major: { type: String, required: true },
    contractEndDate: { type: String },
    contractTerminationDate: { type: String },
    classStartDate: { type: String },
    phone: { type: String },
    policeCheckDate: { type: String },
    contractDate: { type: String },
    dob: { type: String },
    address: { type: String },
    residentRegistrationNumber: { type: String },
    email: { type: String },
    bankAccountNumber: { type: String },
    password: { type: String, default: '1234' },
    mustChangePassword: { type: Boolean, default: true },
});

export default mongoose.model<ITeacher>('Teacher', TeacherSchema);
