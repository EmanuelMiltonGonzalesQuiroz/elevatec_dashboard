import React, { useState, useEffect } from 'react';
import CustomSelect from '../../../components/UI/CustomSelect';
import { homeText } from '../../../components/common/Text/texts';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import PDFContent from './PDFGenerator/PDFContent';
import CustomModal from '../../../components/UI/CustomModal';
import Modal from './Calculation/Modal';
import { useAuth } from '../../../context/AuthContext';
import deleteQuotation from './deleteQuotation'; 
import getFieldValue from '../../../components/layout/getFieldValue';

// Función para formatear la fecha a partir del ID del documento
const formatDateFromDocId = (docId) => {
  const parts = docId.split('_');
  
  if (parts.length < 4) return 'N/A';
  
  const year = parts[1];
  const month = parts[2];
  const day = parts[3].split('T')[0];
  
  const monthNames = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];
  const formattedMonth = monthNames[parseInt(month, 10) - 1];
  const formattedDate = `${day}/${formattedMonth}/${year.slice(-2)}`;

  return formattedDate;
};

const QuotationList = ({ showDeleted }) => {
  const { currentUser} = useAuth(); 
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [selectedPDFOption, setSelectedPDFOption] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false); // Estado para manejar el segundo modal de PDF
  const [deletedByName, setDeletedByName] = useState({});


  useEffect(() => {
    const fetchQuotations = async () => {
      const db = getFirestore();
      const quotationsCol = collection(db, 'list of quotations');
      const quotationSnapshot = await getDocs(quotationsCol);

      const quotationList = await Promise.all(
        quotationSnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const quotationDetails = data.quotationDetails[0] || {};
          const clientName = quotationDetails['02_CLIENTE'];

          if (!clientName) {
            return null;
          }

          const clientQuery = collection(db, 'clients');
          const clientSnapshot = await getDocs(clientQuery);
          const clientDoc = clientSnapshot.docs.find(
            (clientDoc) => clientDoc.data().name === clientName
          );

          let clientData = {};
          if (clientDoc) {
            clientData = clientDoc.data();
          }

          const total = data.calculatedValues
            ? (() => {
                // Sumar todos los valores de VAR7 en el array calculatedValues
                const totalSum = data.calculatedValues.reduce((acc, currentValue) => {
                  return acc + (currentValue.VAR7 || 0);
                }, 0);

                // Verificar si existe un descuento en MetodoDePago dentro de quotationDetails
                const discountMethod = data.quotationDetails[0].MetodoDePago?.find(
                  (method) => method.nombre === "Descuento"
                );

                if (discountMethod && discountMethod.porcentaje) {
                  const discountPercentage = discountMethod.porcentaje;
                  const discountedTotal = totalSum - totalSum * (discountPercentage / 100);
                  return discountedTotal.toFixed(2); // Retorna el total con el descuento aplicado
                }

                return totalSum.toFixed(2); // Retorna el total sin descuento
              })()
            : 'N/A';


          const date = formatDateFromDocId(doc.id);

          return {
            id: doc.id,
            data: data,
            ...data,
            clientName: clientName,
            clientPhone: clientData.phone || 'N/A',
            city: data.quotationDetails[0]["Ciudad"].nombre || 'N/A',
            address: data.quotationDetails[0]["Ubicacion_nombre"] || 'N/A',
            quotedBy: data.solicitante.username,
            total: total,
            date: date,
            clientId: data.clientId,
          };
        })
      );

      setQuotations(quotationList.filter(Boolean));
    };

    fetchQuotations();
  }, []);

  useEffect(() => {
    const filtered = quotations.filter((quotation) => {
      const matchesDeletedState = showDeleted ? quotation.state === 'deleted' : quotation.state !== 'deleted';
      const matchesClient = selectedClient ? quotation.clientName === selectedClient.label : true;
      const matchesDate = selectedDate ? quotation.date === formatDate(selectedDate) : true;
      return matchesDeletedState && matchesClient && matchesDate;
    });
    setFilteredQuotations(filtered);
  }, [selectedClient, selectedDate, quotations, showDeleted]);

  const handleClientChange = (selectedOption) => {
    setSelectedClient(selectedOption);
  };
  const updateQuotationStatus = async (id, status) => {
    const db = getFirestore();
    const quotationRef = doc(db, 'list of quotations', id);
    
    try {
      const updateData = { state: status };
  
      // Si el estado es "deleted", añade el campo DeletedBy con el ID del usuario actual
      if (status === 'deleted' && currentUser) {
        updateData.DeletedBy = currentUser.id;
      }
  
      await updateDoc(quotationRef, updateData);
  
      // Actualizar el estado local para reflejar el cambio en la interfaz de usuario
      setQuotations((prevQuotations) =>
        prevQuotations.map((quotation) =>
          quotation.id === id ? { ...quotation, ...updateData } : quotation
        )
      );
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };
  

  const handleDateChange = (event) => {
    let selectedDate = new Date(event.target.value + "T00:00:00");
    selectedDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(selectedDate.toISOString().split('T')[0]);
  };

  const handleViewPDF = (quotation) => {
    setSelectedQuotation(quotation);
    setShowModal(true); // Abrir el primer modal con opciones de PDF
  };

  const handlePDFOption = (quotationData, option) => {
    setSelectedPDFOption({ data: quotationData, option });
    setShowPDFModal(true); // Abrir el segundo modal para ver el PDF
  };

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = dateObj.getMonth();
    const year = String(dateObj.getFullYear()).slice(-2);
    const monthNames = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];
    return `${day}/${monthNames[month]}/${year}`;
  };
  const [clientNames, setClientNames] = useState({});

  useEffect(() => {
    // Función para cargar los nombres de los clientes basados en el clientId
    const fetchClientNames = async () => {
      const clientsCollection = collection(db, 'clients');
      const clientsSnapshot = await getDocs(clientsCollection);
      
      const clientsData = {};
      clientsSnapshot.docs.forEach((doc) => {
        clientsData[doc.id] = doc.data().name; // Crear un mapeo de clientId a nombre del cliente
      });
      
      setClientNames(clientsData);
    };

    fetchClientNames();
  }, []);
  const getClientName = (location) => {
    // Buscar el nombre del cliente basado en clientId primero, luego usar location.client si no se encuentra
    return clientNames[location.clientId] || location.client;
  };
  const fetchDeletedByName = async (userId) => {
    if (userId && !deletedByName[userId]) { // Carga solo si el usuario no está ya en el estado
      const username = await getFieldValue("login firebase", userId, "username");
      setDeletedByName((prev) => ({ ...prev, [userId]: username || 'N/A' }));
    }
  };

  useEffect(() => {
    // Cargar nombres de usuarios que eliminaron las cotizaciones cuando `showDeleted` está activo
    if (showDeleted) {
      filteredQuotations.forEach((quotation) => {
        if (quotation.state === 'deleted') {
          fetchDeletedByName(quotation.DeletedBy);
        }
      });
    }
  }, [filteredQuotations, showDeleted]);

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg max-h-[75vh] text-black">
      <h1 className="text-xl font-bold mb-4">{homeText.listOfQuotations}</h1>
      
      <div className="mb-4">
        <label htmlFor="client" className="mr-2 text-black">{homeText.selectClient}</label>
        <CustomSelect
          collectionName="clients"
          placeholder={homeText.searchClient}
          onChange={handleClientChange}
          selectedValue={selectedClient}
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="date" className="mr-2 text-black">{homeText.selectDate}</label>
        <input
          type="date"
          id="date"
          className="p-2 border rounded"
          onChange={handleDateChange}
        />
      </div>
      <div className="overflow-auto">
        <table className="bg-white w-full">
          <thead>
            <tr>
              <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">{homeText.number}</th>
              <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">{homeText.client}</th>
              <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">{homeText.clientPhone}</th>
              <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">{homeText.city}</th>
              <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">{homeText.location}</th>
              <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">{homeText.quotedBy}</th>
              {showDeleted && (
                <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">{homeText.DeletedBy}</th>
              )}
              <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">{homeText.total}</th>
              <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">{homeText.date}</th>
              <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">{homeText.actions}</th>
            </tr>
          </thead>
          <tbody>
          {filteredQuotations
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Ordena por fecha, del más nuevo al más viejo
            .map((quotation, index) => (
              <tr key={quotation.id} className="bg-gray-100">
                <td className="py-2 px-4 text-black">{index + 1}</td>
                <td className="py-3 px-6 text-left">{getClientName(quotation) || quotation.clientName}</td>
                <td className="py-2 px-4 text-black">{quotation.clientPhone}</td>
                <td className="py-2 px-4 text-black">{quotation.city}</td>
                <td className="py-2 px-4 text-black">{quotation.address}</td>
                <td className="py-2 px-4 text-black">{quotation.quotedBy}</td>
                {showDeleted && (
                  <td className="py-2 px-4 text-black">{deletedByName[quotation.DeletedBy] || ""}</td>
                )}
                <td className="py-2 px-4 text-black">{quotation.total}</td> 
                <td className="py-2 px-4 text-black">{quotation.date}</td>
                <td className="py-2 px-4">
                  <div className="flex gap-2"> {/* Flex sin flex-wrap para que se mantengan en una fila */}
                    <button
                      className="bg-blue-500 text-white p-2 rounded"
                      onClick={() => handleViewPDF(quotation)}
                    >
                      Ver PDF
                    </button>

                    {(currentUser.role === 'Administrador' || currentUser.role === 'Gerencia' || currentUser.role === 'Super Usuario' || currentUser.role === 'Usuario') && (
                      showDeleted ? (
                        <button
                          className="bg-green-500 text-white p-2 rounded"
                          onClick={() => updateQuotationStatus(quotation.id, 'active')}
                        >
                          Restaurar
                        </button>
                      ) : (
                        <button
                          className="bg-red-500 text-white p-2 rounded"
                          onClick={() => updateQuotationStatus(quotation.id, 'deleted')}
                        >
                          Eliminar
                        </button>
                      )
                    )}

                    {showDeleted && currentUser.role === 'Administrador' && (
                      <button
                        className="bg-red-700 text-white p-2 rounded"
                        onClick={() => deleteQuotation(quotation.id, setQuotations)}
                      >
                        Eliminar Definitivamente
                      </button>
                    )}
                  </div>


                </td>
              </tr>
            ))}
        </tbody>

        </table>
      </div>

      {/* Modal con opciones de PDF */}
      {showModal && (
        <CustomModal show={showModal} >
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-center">Selecciona una opción de PDF</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Botón principal que ocupa las dos columnas */}
              <button
                className="col-span-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-full text-center"
                onClick={() => handlePDFOption(selectedQuotation.data, 'sin_membretado')}
              >
                Ver PDF
              </button>

              {/* Botones azules (a la izquierda) */}
              <div className="flex flex-col items-center space-y-4">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-full text-center"
                  onClick={() => handlePDFOption(selectedQuotation.data, 'con_membretado_Jalmeco')}
                >
                  Ver PDF Jalmeco
                </button>

                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-full text-center"
                  onClick={() => handlePDFOption(selectedQuotation.data, 'con_membretado_Tecnolift')}
                >
                  Ver PDF Tecnolift
                </button> 
              </div>

              {/* Botones verdes (a la derecha) */}
              <div className="flex flex-col items-center space-y-4">
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition w-full text-center"
                  onClick={() => handlePDFOption(selectedQuotation.data, 'sin_membretado_Jalmeco')}
                >
                  Ver PDF Jalmeco Sin Membretado
                </button>

                <button
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition w-full text-center"
                  onClick={() => handlePDFOption(selectedQuotation.data, 'sin_membretado_Tecnolift')}
                >
                  Ver PDF Tecnolift Sin Membretado
                </button>
              </div>
            </div>
            {/* Botón para cerrar */}
            <button
              className="bg-gray-500 text-white py-2 px-4 mt-4 rounded hover:bg-gray-700 transition w-[140px] text-center"
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </button>
          </div>
        </CustomModal>
      )}

      {/* Modal para mostrar el PDF */}
      {showPDFModal && (
        <Modal show={showPDFModal} onClose={() => setShowPDFModal(false)}>
          <PDFContent
            formData={selectedPDFOption.data.quotationDetails}
            values={selectedPDFOption.data.calculatedValues}
            timestamp={selectedPDFOption.data.timestamp}
            type={selectedPDFOption.option}
          />
        </Modal>
      )}
    </div>
  );
};

export default QuotationList;
