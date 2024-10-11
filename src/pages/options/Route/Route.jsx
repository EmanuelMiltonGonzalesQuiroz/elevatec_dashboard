import React, { useState } from 'react';
import RouteForm from './RouteForm';
import RouteList from './RouteList';

const Route = () => {
  const [activeTab, setActiveTab] = useState('form'); // Estado para cambiar entre formulario y lista

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg w-full text-black overflow-auto">
      <div className="flex space-x-4 mb-4">
        <button
          className={`p-2 ${activeTab === 'form' ? 'text-black font-bold' : 'text-blue-600'}`}
          onClick={() => setActiveTab('form')}
        >
          Recorrido
        </button>
        <button
          className={`p-2 ${activeTab === 'list' ? 'text-black font-bold' : 'text-blue-600'}`}
          onClick={() => setActiveTab('list')}
        >
          Lista de Recorridos
        </button>
      </div>
      <div className="flex-grow mt-4">
        {activeTab === 'form' && <RouteForm />}
        {activeTab === 'list' && <RouteList />}
      </div>
    </div>
  );
};

export default Route;
