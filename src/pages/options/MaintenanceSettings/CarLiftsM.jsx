import React, { useState, useEffect } from 'react';
import { collection, getDocs} from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import EditPricesForm from '../../../components/UI/EditPricesForm';

const CarLiftsM = () => {
  const [carLifts, setCarLifts] = useState([]);
  const [currentLiftId, setCurrentLiftId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLift, setCurrentLift] = useState({});
  const [shouldReload, setShouldReload] = useState(false);

  useEffect(() => {
    const fetchCarLifts = async () => {
      const carLiftsCollection = collection(db, 'car_lifts_m');
      const carLiftsSnapshot = await getDocs(carLiftsCollection);
      const carLiftsList = carLiftsSnapshot.docs.flatMap(doc => {
        const data = doc.data();
        if (data.items) {
          return data.items.map(item => ({
            id: doc.id, // ID del documento
            ...item,
          }));
        } else {
          return {
            id: doc.id,
            ...data,
          };
        }
      });

      // Ordenar los datos por el campo 'pisos'
      const sortedCarLifts = carLiftsList.sort((a, b) => a.pisos - b.pisos);

      setCarLifts(sortedCarLifts);
      setShouldReload(false);
    };

    fetchCarLifts();
  }, [shouldReload]);

  const handleOpenModal = (lift) => {
    setCurrentLiftId(lift.id); // Guardamos el ID del documento para actualizarlo
    setCurrentLift({
      pisos: lift.pisos,
      precios: lift.precios,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccessfulEdit = () => {
    setShouldReload(true);
  };

  return (
    <div className="p-4 bg-gray-100 text-black max-h-[80vh]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-h-[65vh]">
        <h2 className="text-2xl font-bold mb-6">Monta Coches Mantenimiento</h2>
        <div className="overflow-x-auto max-h-[50vh]">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="text-black font-bold">
                <th className="border px-4 py-2">Pisos</th>
                <th className="border px-4 py-2">Precios</th>
                <th className="border px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {carLifts.map((lift, index) => (
                <tr key={index} className="text-black">
                  <td className="border px-4 py-2">{lift.pisos}</td>
                  <td className="border px-4 py-2">{lift.precios}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
                      onClick={() => handleOpenModal(lift)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <EditPricesForm
          docId={currentLiftId}
          collectionName="car_lifts_m"
          pisos={currentLift.pisos}
          initialPrice={currentLift.precios}
          onClose={handleCloseModal}
          onSuccess={handleSuccessfulEdit}
        />
      )}
    </div>
  );
};

export default CarLiftsM;
