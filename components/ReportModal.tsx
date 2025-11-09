
import React from 'react';
import { CloseIcon, DocumentTextIcon } from './icons';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportContent: string;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, reportContent }) => {
  if (!isOpen) return null;

  // Simple Markdown to HTML conversion
  const formatReport = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\n/g, '<br />'); // Newlines
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-2xl m-4 transform transition-all text-gray-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-400 flex items-center">
            <DocumentTextIcon className="w-6 h-6 mr-2" /> AI Attendance Report
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div 
          className="bg-gray-900 p-6 rounded-md max-h-[60vh] overflow-y-auto prose prose-invert prose-p:text-gray-300 prose-strong:text-white"
          dangerouslySetInnerHTML={{ __html: formatReport(reportContent) }}
        />
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="py-2 px-6 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold transition text-white">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
