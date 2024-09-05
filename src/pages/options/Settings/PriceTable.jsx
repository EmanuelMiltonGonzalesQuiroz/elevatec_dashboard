import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import EditableForm from '../../../components/UI/EditableForm';
import { priceTableText } from '../../../components/common/Text/texts';

const PriceTable = () => {
  const [prices, setPrices] = useState([]);
  const [currentPriceId, setCurrentPriceId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState({});
  const [shouldReload, setShouldReload] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      const priceCollection = collection(db, 'price_table');
      const priceSnapshot = await getDocs(priceCollection);
      const priceList = priceSnapshot.docs.flatMap(doc => {
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
      setPrices(priceList);
      setShouldReload(false);
    };

    fetchPrices();
  }, [shouldReload]);

  const handleOpenModal = (price) => {
    setCurrentPriceId(price.id);
    setCurrentPrice({
      name: price.name,
      precio_unitario: price.precio_unitario,
      volumen_x_pieza_m3: price.volumen_x_pieza_m3,
      index: price.index,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccessfulEdit = () => {
    setShouldReload(true);
    handleCloseModal();
  };

  return (
    <div className="p-4 bg-gray-100 text-black max-h-[80vh]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-h-[65vh]">
        <h2 className="text-2xl font-bold mb-6 ">{priceTableText.title}</h2>
        <div className="overflow-x-auto max-h-[50vh]">
          <table className="min-w-full bg-white border">
          <thead>
            <tr className="text-black font-bold">
              <th className="border px-4 py-2">{priceTableText.index}</th>
              <th className="border px-4 py-2">{priceTableText.name}</th>
              <th className="border px-4 py-2">{priceTableText.volumen}</th>
              <th className="border px-4 py-2">{priceTableText.price}</th>
              <th className="border px-4 py-2">{priceTableText.actions}</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((price, index) => (
              <tr key={index} className="text-black">
                <td className="border px-4 py-2">{price.index}</td>
                <td className="border px-4 py-2">{price.name}</td>
                <td className="border px-4 py-2">{price.volumen_x_pieza_m3}</td>
                <td className="border px-4 py-2">{price.precio_unitario}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
                    onClick={() => handleOpenModal(price)}
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
        <EditableForm 
          docId={currentPriceId}
          collectionName="price_table"
          fields={{
            name: priceTableText.name,
            volumen_x_pieza_m3: priceTableText.volumen,
            precio_unitario: priceTableText.price,
          }}
          initialValues={currentPrice}
          onClose={handleCloseModal}
          onSuccess={handleSuccessfulEdit}
        />
      )}
    </div>
  );
};

export default PriceTable;
