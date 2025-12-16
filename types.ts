export interface Student {
  id: string;
  name: string;
  school?: string;
  grade?: string;

  // Existing detailed fields
  careerPath?: string; // 진로
  initialRegistrationDate?: string;
  previousRegistrationMonth?: string;
  registrationStatus?: '등록' | '미등록' | '상담';
  phoneStudent?: string;
  phoneParent?: string;
  classType?: string;
  email?: string;
  address?: string;

  contractEndMonth?: string;
  reRegistrationMonth?: string; // This is for '차기 등록월'
  totalLessons: number;
  lessonsCompleted: number;
  teacherId?: string;

  // New fields
  studentCharacteristics?: string;
  studentCharacteristicsWrittenDate?: string;
  studentGrades?: string;
  studentGradesLastUpdated?: string;
  desiredMajor?: string; // 희망 전공
  desiredMajorLastUpdated?: string;
  studentCallLog?: string;
  studentCallLogWrittenDate?: string;
  parentCallLog?: string;
  parentCallLogWrittenDate?: string;
}

export interface Teacher {
  id: string;
  name: string;
  major: string; // '출신학교'
  contractEndDate?: string; // This was '계약 만료월'

  // New detailed fields from image
  contractTerminationDate?: string; // '계약종료일'
  classStartDate?: string; // '수업시작일'
  phone?: string; // '전화번호'
  policeCheckDate?: string; // '경찰청 조회'
  contractDate?: string; // '계약일'
  dob?: string; // '생년월일'
  address?: string; // '주소'
  residentRegistrationNumber?: string; // '주민번호'
  email?: string; // '이메일 주소'
  bankAccountNumber?: string; // '통장번호'
  mustChangePassword?: boolean;
}

export enum LessonStatus {
  Scheduled = 'SCHEDULED',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
  Pending = 'PENDING',
  None = 'NONE',
}

export interface Lesson {
  id: string;
  date: string; // ISO String for consistency
  status: LessonStatus;

  indexUsage?: string;
  planUploadDate?: string;
  planFileLink?: string;
  planReviewStatus?: '미검수' | '완료' | '수정요청';
  lessonContent?: string;
  reportDeadline?: string;
  reportFileLink?: string; // For the submitted report file
  schoolSubmissionDate?: string;
  schoolSubmissionStatus?: '미제출' | '제출완료';
  firstReminderSent?: boolean;
  secondReminderSent?: boolean;
  thirdReminderSent?: boolean;
  nonSubmissionReason?: string;
}


export interface StudentWithLessons extends Student {
  lessons: Lesson[];
}