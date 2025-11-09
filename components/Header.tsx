
import React from 'react';
import { CameraIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <CameraIcon className="w-10 h-10 text-cyan-400 mr-4" />
        <div>
          <h1 className="text-3xl font-bold text-white">AI Attendance Monitor</h1>
          <p className="text-gray-400">Automated College Attendance System</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
