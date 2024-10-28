import React from 'react';

const InfoModal = ({ isOpen, routeData, onClose }) => {
  if (!isOpen || !routeData) return null;

  const buildingData = routeData.routeData[0]?.TipoDeEdificio || {};
  const additionalData = routeData.routeData[0] || {};
  const resultData = routeData.routeData[0].result[0] || {};
  
  // Generar dinámicamente los campos del edificio
  const generateBuildingFields = (buildingName) => {
    if (
      ['Oficinas Centricas', 'Oficinas Suburbios', 'Edificio empresarial', 'Edificio del gobierno'].includes(buildingName)
    ) {
      return (
        <>
          <p><strong>Pisos:</strong> {buildingData.PISOS || additionalData.PISOS || 'N/A'}</p>
          <p><strong>Áreas:</strong> {buildingData.AREAS || additionalData.AREAS || 'N/A'}</p>
          <p><strong>Oficinas:</strong> {buildingData.OFICINAS || additionalData.OFICINAS || 'N/A'}</p>
        </>
      );
    } else if (['Departamentos Centricos', 'Departamentos Suburbios'].includes(buildingName)) {
      return (
        <>
          <p><strong>Pisos:</strong> {buildingData.PISOS || additionalData.PISOS || 'N/A'}</p>
          <p><strong>Departamentos:</strong> {buildingData.DEPARTAMENTOS || additionalData.DEPARTAMENTOS || 'N/A'}</p>
          <p><strong>Habitaciones:</strong> {buildingData.HABITACIONES || additionalData.HABITACIONES || 'N/A'}</p>
        </>
      );
    } else if (['Hospital privado', 'Hospital publico'].includes(buildingName)) {
      return (
        <>
          <p><strong>Pisos:</strong> {buildingData.PISOS || additionalData.PISOS || 'N/A'}</p>
          <p><strong>Habitaciones:</strong> {buildingData.HABITACIONES || additionalData.HABITACIONES || 'N/A'}</p>
          <p><strong>Camas:</strong> {buildingData.CAMAS || additionalData.CAMAS || 'N/A'}</p>
        </>
      );
    } else if (
      ['Hotel centrico', 'Hotel vacacional', 'Hotel economico', 'Hotel economico vacacional'].includes(buildingName)
    ) {
      return (
        <>
          <p><strong>Pisos:</strong> {buildingData.PISOS || additionalData.PISOS || 'N/A'}</p>
          <p><strong>Habitaciones:</strong> {buildingData.HABITACIONES || additionalData.HABITACIONES || 'N/A'}</p>
        </>
      );
    } else if (buildingName === 'Estacionamiento') {
      return (
        <>
          <p><strong>Pisos:</strong> {buildingData.PISOS || additionalData.PISOS || 'N/A'}</p>
          <p><strong>Automóviles:</strong> {buildingData.AUTOMOVILES || additionalData.AUTOMOVILES || 'N/A'}</p>
        </>
      );
    } else {
      return <p>No hay información específica para este tipo de edificio.</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-end sm:justify-center sm:items-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-[45vh] sm:w-3/5 max-h-[90vh]">
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-3xl font-bold text-blue-700">Información Detallada de la Ruta</h2>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition duration-200"
          >
            X
          </button>
        </div>
        <div className="max-h-[60vh] overflow-auto">
          <div className="mb-6 border-b pb-4 ">
            <h3 className="font-bold text-xl text-blue-600 mb-2">Información General</h3>
            <p><strong>Cliente:</strong> {additionalData.cliente || 'N/A'}</p>
            <p><strong>Lo calculó:</strong> {routeData.user?.username || 'N/A'}</p>
            <p><strong>Fecha:</strong> {new Date(routeData.fecha).toLocaleDateString()}</p>
            <p><strong>Teléfono Cliente:</strong> {additionalData.clientPhone || 'N/A'}</p>
          </div>

          <div className="mb-6 border-b pb-4">
            <h3 className="font-bold text-xl text-blue-600 mb-2">Datos del Edificio</h3>
            <p><strong>Nombre del Edificio:</strong> {buildingData.Nombre || 'N/A'}</p>
            <p><strong>Descripción:</strong> {buildingData.Descripcion || 'N/A'}</p>
            {generateBuildingFields(buildingData.Nombre)}
          </div>

          <div className="mb-6 border-b pb-4">
            <h3 className="font-bold text-xl text-blue-600 mb-2">Datos Adicionales</h3>
            <p><strong>Detención Puertas:</strong> {additionalData['Detencion Puertas'] || 'N/A'}</p>
            <p><strong>Pasajeros:</strong> {additionalData.Pasajeros || 'N/A'}</p>
          </div>

          <div className="mb-6 border-b pb-4">
            <h3 className="font-bold text-xl text-blue-600 mb-2">Resultados del Cálculo</h3>
            {resultData ? (
              <>
                <p><strong>Total Población:</strong> {formatValue(resultData.totalPoblacion)}</p>
                <p><strong>Población Servida:</strong> {formatValue(resultData.poblacionServida)}</p>
                <p><strong>Tiempo Total:</strong> {formatValue(resultData.tiempoTotal)} seg</p>
                <p><strong>Ajustes Finales:</strong> {formatValue(resultData.ajustesFinales)}</p>
                <p><strong>Número de Cabinas Necesarias:</strong> {formatValue(resultData.numeroCabinasNecesarias)}</p>
                <p><strong>Intervalo de Espera:</strong> {formatValue(resultData.intervaloEspera)} seg</p>
                <p><strong>Velocidad Desarrollada:</strong> {formatValue(resultData.velocidadDesarrollada)} m/s</p>
              </>
            ) : (
              <p>No hay resultados disponibles.</p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// Función para formatear valores numéricos a dos decimales
const formatValue = (value) => (typeof value === 'number' ? value.toFixed(2) : 'No disponible');

export default InfoModal;
