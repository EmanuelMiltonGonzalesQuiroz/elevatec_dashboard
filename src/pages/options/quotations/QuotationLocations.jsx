import React, { useState, useEffect } from 'react';
import { db } from '../../../connection/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const QuotationLocations = () => {
  const [locations, setLocations] = useState([]);
  const [mapLocations, setMapLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const locationsCol = collection(db, 'locations');
      const locationSnapshot = await getDocs(locationsCol);
      const locationList = locationSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Obtener las direcciones a partir de las coordenadas
      const enrichedLocations = await Promise.all(locationList.map(async (location) => {
        const address = await getAddressFromLatLng(location.location.lat, location.location.lng);
        return { ...location, address };
      }));

      setLocations(enrichedLocations);
      setMapLocations(enrichedLocations);
    };

    fetchLocations();
  }, []);

  const handleChangeState = async (id, newState) => {
    try {
      const locationDoc = doc(db, 'locations', id);
      await updateDoc(locationDoc, { state: newState });
      const updatedLocations = locations.map(location => 
        location.id === id ? { ...location, state: newState } : location
      );
      setLocations(updatedLocations);
      setMapLocations(updatedLocations); // Actualizar el mapa con los nuevos estados
    } catch (error) {
      console.error('Error updating location state: ', error);
    }
  };

  const getAddressFromLatLng = async (lat, lng) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_API_KEY`);
    const data = await response.json();
    if (data.status === 'OK') {
      return data.results[0]?.formatted_address || 'Dirección no disponible';
    }
    return 'Dirección no disponible';
  };

  const getStateClass = (state) => {
    switch (state) {
      case 'pendiente':
        return 'text-green-600';
      case 'perdida':
        return 'text-gray-600';
      case 'concretada':
        return 'text-blue-600';
      default:
        return 'text-black';
    }
  };

  const getSelectStyle = (state) => {
    switch (state) {
      case 'pendiente':
        return { backgroundColor: 'green', color: 'white' };
      case 'perdida':
        return { backgroundColor: 'gray', color: 'white' };
      case 'concretada':
        return { backgroundColor: 'blue', color: 'white' };
      default:
        return { backgroundColor: 'white', color: 'black' };
    }
  };

  const getMarkerColor = (state) => {
    switch (state) {
      case 'pendiente':
        return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
      case 'perdida':
        return 'http://maps.google.com/mapfiles/ms/icons/gray-dot.png';
      case 'concretada':
        return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
      default:
        return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    }
  };

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg w-full h-full text-black">
      <h2 className="text-xl font-bold mb-4">Ubicaciones de Cotizaciones</h2>
      <table className="table-auto w-full mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Cliente</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Cambiar Estado</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location.id}>
              <td className="border px-4 py-2">{location.client}</td>
              <td className={`border px-4 py-2 ${getStateClass(location.state)}`}>
                {location.state}
              </td>
              <td className="border px-4 py-2">
                <select
                  value={location.state}
                  onChange={(e) => handleChangeState(location.id, e.target.value)}
                  className="p-2 rounded border text-black font-bold"
                  style={getSelectStyle(location.state)}
                >
                  <option value="pendiente" style={{ color: 'green' }}>Pendiente</option>
                  <option value="perdida" style={{ color: 'red' }}>Perdida</option>
                  <option value="concretada" style={{ color: 'blue' }}>Concretada</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mapa de Google para mostrar las ubicaciones */}
      <div className="w-full h-96">
        <LoadScript googleMapsApiKey="AIzaSyBDA9rFE18AAkAMtQUO0Un2Ai1kNXslUPQ">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={{ lat: -16.495543, lng: -68.133543 }} // Centro en La Paz, Bolivia
            zoom={10}
          >
            {mapLocations.map((location) => (
              <Marker
                key={location.id}
                position={{ lat: location.location.lat, lng: location.location.lng }}
                icon={getMarkerColor(location.state)}
                title={`${location.client}: ${location.address}`}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default QuotationLocations;
