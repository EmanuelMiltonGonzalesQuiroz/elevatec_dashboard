import React from 'react';

// Función para capitalizar las palabras, exceptuando las palabras especificadas
const capitalizeWords = (str) => {
  const exceptions = ['de', 'la', 'el', 'y', 'a', 'en', 'con', 'por', 'para', 'del'];
  
  return str
    .replace(/_/g, '/') // Reemplaza _ por /
    .split(' ')
    .map((word, index) => {
      if (exceptions.includes(word.toLowerCase()) && index !== 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

const GroupClassesColumn = ({ groups, selectedGroup, handleGroupClick, textConfig }) => {
  console.log(groups);
  return (
    <div className="w-1/4 p-4 overflow-y-auto max-h-[60vh]">
      <div className="bg-white p-4 rounded-lg shadow-lg min-h-full flex flex-col min-h-[50vh] overflow-x-auto">
        {groups.map((group, index) => (
          <div 
            key={group.id} 
            className={`bg-white rounded-lg shadow-md p-1 flex justify-center items-center ${index !== 0 ? 'mt-3' : 'mt-1'}`}
          >
            <button
              className={`w-full p-4 text-left rounded-lg ${selectedGroup === group ? 'bg-teal-700 text-white' : 'bg-white text-black'}`}
              onClick={() => handleGroupClick(group)}
            >
              <h3 className="font-bold text-lg">{capitalizeWords(group.id)}</h3>
              {group.tipo && <p className="text-sm">{textConfig.type} {group.tipo.replace(/_/g, '/')}</p>} {/* Reemplaza _ por / */}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupClassesColumn;
