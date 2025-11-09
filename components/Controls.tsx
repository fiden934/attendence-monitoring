
import React from 'react';
import { PlayIcon, StopIcon, UserPlusIcon, DocumentTextIcon, RefreshIcon } from './icons';

interface ControlsProps {
  isMonitoring: boolean;
  onStartMonitoring: () => void;
  onStopMonitoring: () => void;
  onRegister: () => void;
  onGenerateReport: () => void;
  onReset: () => void;
  isGeneratingReport: boolean;
  hasSessionStarted: boolean;
  hasStudents: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  isMonitoring,
  onStartMonitoring,
  onStopMonitoring,
  onRegister,
  onGenerateReport,
  onReset,
  isGeneratingReport,
  hasSessionStarted,
  hasStudents,
}) => {
  return (
    <div className="w-full mt-6 space-y-3">
      <button
        onClick={onRegister}
        className="w-full flex items-center justify-center px-4 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition-colors shadow-md disabled:bg-gray-500"
      >
        <UserPlusIcon className="w-6 h-6 mr-2" />
        Register Student
      </button>

      {isMonitoring ? (
        <button
          onClick={onStopMonitoring}
          className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
        >
          <StopIcon className="w-6 h-6 mr-2" />
          Stop Monitoring
        </button>
      ) : (
        <button
          onClick={onStartMonitoring}
          disabled={!hasStudents}
          className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          <PlayIcon className="w-6 h-6 mr-2" />
          {hasSessionStarted ? 'Resume Monitoring' : 'Start Monitoring'}
        </button>
      )}

      <div className="flex space-x-3">
        <button
            onClick={onGenerateReport}
            disabled={!hasSessionStarted || isMonitoring || isGeneratingReport}
            className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors shadow-md disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
            <DocumentTextIcon className="w-6 h-6 mr-2" />
            {isGeneratingReport ? 'Generating...' : 'AI Report'}
        </button>
        <button
            onClick={onReset}
            disabled={!hasSessionStarted || isMonitoring}
            className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors shadow-md disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
            <RefreshIcon className="w-6 h-6 mr-2" />
            Reset
        </button>
      </div>
    </div>
  );
};

export default Controls;
