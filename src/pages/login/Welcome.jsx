import React, { useEffect } from 'react';
import logo from '../../assets/images/COTA LOGO/logo.png';
import { welcomeText } from '../../components/common/Text/texts';

const Welcome = () => {
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-10 bg-white rounded-lg shadow-lg">
        <div className="mb-6">
          <img src={logo} alt="Logo" className="w-32 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{welcomeText.title}</h1>
        <p className="text-gray-600 mb-8">{welcomeText.description}</p>
        <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          {welcomeText.button}
        </a>
      </div>
    </div>
  );
};

export default Welcome;
