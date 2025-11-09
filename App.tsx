
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Student, AttendanceRecord } from './types';
import { generateAttendanceReport } from './services/geminiService';
import Header from './components/Header';
import RegistrationModal from './components/RegistrationModal';
import StudentLists from './components/StudentLists';
import Controls from './components/Controls';
import ReportModal from './components/ReportModal';
import CameraView from './components/CameraView';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord>({});
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [report, setReport] = useState<string>('');
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [detectedStudent, setDetectedStudent] = useState<Student | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const monitorIntervalRef = useRef<number | null>(null);
  const detectionTimeoutRef = useRef<number | null>(null);

  const startSession = useCallback(() => {
    const newAttendance: AttendanceRecord = {};
    students.forEach(student => {
      newAttendance[student.id] = 'absent';
    });
    setAttendance(newAttendance);
  }, [students]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    if (monitorIntervalRef.current) {
      clearInterval(monitorIntervalRef.current);
      monitorIntervalRef.current = null;
    }
    if (detectionTimeoutRef.current) {
        clearTimeout(detectionTimeoutRef.current);
        detectionTimeoutRef.current = null;
    }
    setDetectedStudent(null);
  }, []);

  const startMonitoring = useCallback(() => {
    if (Object.keys(attendance).length === 0) {
      startSession();
    }
    setIsMonitoring(true);
    
    if (detectionTimeoutRef.current) {
        clearTimeout(detectionTimeoutRef.current);
    }

    monitorIntervalRef.current = window.setInterval(() => {
      setAttendance(prev => {
        const absentStudents = students.filter(s => prev[s.id] === 'absent');
        if (absentStudents.length > 0) {
          const randomStudent = absentStudents[Math.floor(Math.random() * absentStudents.length)];
          
          setDetectedStudent(randomStudent);
          detectionTimeoutRef.current = window.setTimeout(() => {
            setDetectedStudent(null);
          }, 3000); // Show for 3 seconds

          return { ...prev, [randomStudent.id]: 'present' };
        } else {
          stopMonitoring();
          return prev;
        }
      });
    }, 4000); // Interval of 4 seconds between detections
  }, [students, attendance, startSession, stopMonitoring]);

  const handleRegister = (student: Student) => {
    setStudents(prev => [...prev, student]);
    setAttendance(prev => ({ ...prev, [student.id]: 'absent' }));
    setIsModalOpen(false);
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    const presentStudents = students.filter(s => attendance[s.id] === 'present');
    const absentStudents = students.filter(s => attendance[s.id] === 'absent');
    try {
      const generatedReport = await generateAttendanceReport(presentStudents, absentStudents);
      setReport(generatedReport);
      setIsReportModalOpen(true);
    } catch (error) {
      console.error("Failed to generate report:", error);
      setReport("Error: Could not generate the report. Please check your API key and try again.");
      setIsReportModalOpen(true);
    } finally {
      setIsGeneratingReport(false);
    }
  };
  
  const resetSession = () => {
      stopMonitoring();
      setAttendance({});
      setReport('');
  }

  useEffect(() => {
    return () => {
      if (monitorIntervalRef.current) {
        clearInterval(monitorIntervalRef.current);
      }
      if (detectionTimeoutRef.current) {
        clearTimeout(detectionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Live Camera Feed</h2>
            <CameraView 
                videoRef={videoRef} 
                isMonitoring={isMonitoring} 
                detectedStudent={detectedStudent} 
            />
            <Controls
              isMonitoring={isMonitoring}
              onStartMonitoring={startMonitoring}
              onStopMonitoring={stopMonitoring}
              onRegister={() => setIsModalOpen(true)}
              onGenerateReport={handleGenerateReport}
              onReset={resetSession}
              isGeneratingReport={isGeneratingReport}
              hasSessionStarted={Object.keys(attendance).length > 0}
              hasStudents={students.length > 0}
            />
          </div>

          <div className="lg:col-span-3">
             <StudentLists students={students} attendance={attendance} />
          </div>
        </div>

        <RegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onRegister={handleRegister}
        />
        
        <ReportModal 
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            reportContent={report}
        />

      </main>
    </div>
  );
};

export default App;
