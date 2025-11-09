
export interface Student {
  id: string;
  name: string;
  photo: string; // base64 encoded image
}

export type AttendanceStatus = 'present' | 'absent';

export interface AttendanceRecord {
  [studentId: string]: AttendanceStatus;
}
