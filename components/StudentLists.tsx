
import React from 'react';
import { Student, AttendanceRecord } from '../types';

interface StudentCardProps {
  student: Student;
  status?: 'present' | 'absent';
}

const StudentCard: React.FC<StudentCardProps> = ({ student, status }) => {
  const statusColor = status === 'present' ? 'border-green-500' : 'border-red-500';
  const statusIndicator = status === 'present' ? 'bg-green-500' : 'bg-red-500';
  
  return (
    <div className="bg-gray-700 rounded-lg p-3 flex items-center space-x-3 shadow-md transform hover:scale-105 transition-transform duration-200">
      <div className={`relative ${status ? statusColor : 'border-gray-500'} border-2 rounded-full`}>
        <img src={student.photo} alt={student.name} className="w-14 h-14 rounded-full object-cover" />
        {status && <span className={`absolute bottom-0 right-0 block h-4 w-4 rounded-full ${statusIndicator} border-2 border-gray-700`}></span>}
      </div>
      <div>
        <p className="font-bold text-white truncate">{student.name}</p>
        <p className="text-sm text-gray-400">ID: {student.id}</p>
      </div>
    </div>
  );
};

interface StudentListsProps {
  students: Student[];
  attendance: AttendanceRecord;
}

const StudentLists: React.FC<StudentListsProps> = ({ students, attendance }) => {
  const presentStudents = students.filter(s => attendance[s.id] === 'present');
  const absentStudents = students.filter(s => attendance[s.id] === 'absent');
  const hasSessionStarted = Object.keys(attendance).length > 0;

  if (students.length === 0) {
      return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl h-full flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-cyan-400 mb-2">No Students Registered</h2>
                <p className="text-gray-400">Please register students to begin an attendance session.</p>
            </div>
        </div>
      );
  }

  return (
    <div className="space-y-6">
      {!hasSessionStarted ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Registered Students ({students.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto">
            {students.map(student => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Present ({presentStudents.length})</h2>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {presentStudents.length > 0 ? (
                presentStudents.map(student => (
                  <StudentCard key={student.id} student={student} status="present" />
                ))
              ) : <p className="text-gray-400">No students marked present yet.</p>}
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Absent ({absentStudents.length})</h2>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {absentStudents.length > 0 ? (
                absentStudents.map(student => (
                  <StudentCard key={student.id} student={student} status="absent" />
                ))
              ) : <p className="text-gray-400">All students are present.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLists;
