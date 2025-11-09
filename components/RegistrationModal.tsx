import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Student } from '../types';
import { UserPlusIcon, CameraIcon as CaptureIcon, CloseIcon } from './icons';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (student: Student) => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, onRegister }) => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    setError(''); // Reset errors
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        if (err instanceof Error) {
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
              setError("Camera permission denied. Please allow camera access in your browser settings.");
            } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
              setError("No camera found. Please ensure a camera is connected and enabled.");
            } else {
              setError("Could not access camera. It might be in use by another application.");
            }
        } else {
            setError("An unknown error occurred while accessing the camera.");
        }
      }
    } else {
        setError("Your browser does not support camera access.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      // Reset form on close
      setName('');
      setStudentId('');
      setPhoto(null);
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && videoRef.current.srcObject) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPhoto(dataUrl);
      }
    } else {
      setError("Camera is not active. Cannot capture photo.");
    }
  };

  const handleSubmit = () => {
    if (!name || !studentId || !photo) {
      setError('All fields and a photo are required.');
      return;
    }
    const newStudent: Student = {
      id: studentId,
      name,
      photo,
    };
    onRegister(newStudent);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md m-4 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-cyan-400 flex items-center"><UserPlusIcon className="w-6 h-6 mr-2" /> Register New Student</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md mb-4">{error}</p>}
        
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-1/2 aspect-square bg-gray-900 rounded-md overflow-hidden flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                {photo ? (
                    <img src={photo} alt="Captured" className="w-full aspect-square object-cover rounded-md" />
                ) : (
                    <div className="w-full aspect-square bg-gray-700 rounded-md flex items-center justify-center text-gray-400">
                        No Photo
                    </div>
                )}
                <button onClick={handleCapture} className="mt-2 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition">
                    <CaptureIcon className="w-5 h-5 mr-2" /> {photo ? 'Retake' : 'Capture'}
                </button>
            </div>
          </div>
          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose} className="py-2 px-6 bg-gray-600 hover:bg-gray-700 rounded-md font-semibold transition">Cancel</button>
          <button onClick={handleSubmit} className="py-2 px-6 bg-green-600 hover:bg-green-700 rounded-md font-semibold transition">Register</button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;