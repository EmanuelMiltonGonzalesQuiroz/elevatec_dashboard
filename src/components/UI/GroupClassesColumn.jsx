import React from 'react';

const GroupClassesColumn = ({ groups, selectedGroup, handleGroupClick, textConfig }) => {
  return (
    <div className="w-1/4 p-4 overflow-y-auto">
      <div className="bg-white p-4 rounded-lg shadow-lg min-h-full flex flex-col">
        {groups.map((group, index) => (
          <div 
            key={group.id} 
            className={`bg-white rounded-lg shadow-md p-1 flex justify-center items-center ${index !== 0 ? 'mt-3' : 'mt-1'}`}
          >
            <button
              className={`w-full p-4 text-left rounded-lg ${selectedGroup === group ? 'bg-teal-700 text-white' : 'bg-white text-black'}`}
              onClick={() => handleGroupClick(group)}
            >
              <h3 className="font-bold text-lg">{group.id}</h3>
              {group.tipo && <p className="text-sm">{textConfig.type} {group.tipo}</p>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupClassesColumn;
