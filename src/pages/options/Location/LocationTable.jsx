import React from 'react';
import LocationStates from './LocationStates';

const LocationTable = ({ locations, userRole, stateColors, onRowClick, onChangeState }) => (
  <div className="w-2/5 overflow-y-auto h-[68vh]">
    <table className="table-auto w-full bg-white shadow-md rounded-lg border-collapse">
      <thead>
        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <th className="py-3 px-6 text-left">Cliente</th>
          <th className="py-3 px-6 text-left">Descripción</th>
          <th className="py-3 px-6 text-left">
            {userRole === 'Administrador' || userRole === 'Gerencia' ? 'Cambiar Estado' : 'Estado'}
          </th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm font-light">
        {locations.map((location) => (
          location.client && (
            <tr
              key={location.id}
              className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
              onClick={() => onRowClick(location.location)}
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">{location.client}</td>
              <td className="py-3 px-6 text-left">{location.description || 'Sin descripción'}</td>
              {userRole === 'Administrador' || userRole === 'Gerencia' ? (
                <td className="py-3 px-6 text-left">
                  {/* Pasar la función onChangeState aquí */}
                  <LocationStates
                    currentLocationState={location.state}
                    onChangeState={(newState) => onChangeState(location.id, newState)}
                  />
                </td>
              ) : (
                <td className={`py-3 px-6 text-left text-${stateColors[location.state] || 'black'}-600`}>
                  {location.state}
                </td>
              )}
            </tr>
          )
        ))}
      </tbody>
    </table>
  </div>
);

export default LocationTable;
