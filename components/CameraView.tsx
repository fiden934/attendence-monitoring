import React, { useEffect, useCallback, useState } from 'react';
import { Student } from '../types';
import { RefreshIcon } from './icons';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isMonitoring: boolean;
  detectedStudent: Student | null;
}

const CameraView: React.FC<CameraViewProps> = ({ videoRef, isMonitoring, detectedStudent }) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
    
  const startCamera = useCallback(async () => {
    setCameraError(null);
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
              setCameraError("Camera permission denied. Please allow camera access in your browser settings.");
            } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
              setCameraError("No camera found. Please ensure a camera is connected and enabled.");
            } else {
              setCameraError("Could not access the camera. It might be in use by another application.");
            }
        } else {
            setCameraError("An unknown error occurred while accessing the camera.");
        }
      }
    } else {
      setCameraError("Your browser does not support camera access.");
    }
  }, [videoRef]);

  useEffect(() => {
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-700 shadow-inner">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      {cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 p-4 z-10">
          <p className="text-red-400 text-center font-semibold mb-4">{cameraError}</p>
          <button 
            onClick={startCamera} 
            className="flex items-center justify-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
          >
            <RefreshIcon className="w-5 h-5 mr-2" />
            Try Again
          </button>
        </div>
      )}
      {isMonitoring && !cameraError && (
        <div className="absolute top-3 right-3 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span>MONITORING</span>
        </div>
      )}
      {/* Student Detection Overlay */}
      <div className={`pointer-events-none absolute inset-0 flex items-end justify-center p-4 sm:p-6 transition-opacity duration-500 ease-in-out ${detectedStudent ? 'opacity-100' : 'opacity-0'}`}>
        {detectedStudent && (
            <div className="bg-gray-900/75 backdrop-blur-sm text-white py-3 px-6 rounded-xl shadow-2xl border border-cyan-400/60">
                <p className="text-center font-bold text-xl sm:text-2xl text-cyan-300 tracking-wide">{detectedStudent.name}</p>
                <p className="text-center text-sm text-gray-300">ID: {detectedStudent.id}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default CameraView;