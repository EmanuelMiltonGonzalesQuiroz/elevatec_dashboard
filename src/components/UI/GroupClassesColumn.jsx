import React from 'react';

const GroupClassesColumn = ({ groups, selectedGroup, handleGroupClick, textConfig }) => {
  return (
    <div className="w-1/4 p-4 overflow-y-auto" style={{ maxHeight: '80vh' }}>
      {groups.map(group => (
        <button
          key={group.id}
          className={`w-full p-4 mb-4 rounded-lg shadow-md text-left ${selectedGroup === group ? 'bg-teal-700 text-white' : 'bg-white text-black'}`}
          onClick={() => handleGroupClick(group)}
        >
          <h3 className="font-bold text-lg">{group.id}</h3>
          <p className="text-sm">{textConfig.type} {group.tipo}</p>
        </button>
      ))}
    </div>
  );
};

export default GroupClassesColumn;
