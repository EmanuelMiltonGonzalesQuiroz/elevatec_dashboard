import React, { useState } from 'react';
import StopSelect from './StopSelect';
import StopsContainer from './StopsContainer';
import GeneratePDFButton from './GeneratePDFButton';

const PDFGenerator = ({ formData }) => {
  const [numStops, setNumStops] = useState(1);
  const [stops, setStops] = useState([]);
  const [pdfBlob, setPdfBlob] = useState(null);  // Para almacenar el PDF generado

  console.log("formData recibido en PDFGenerator:", formData);

  const handleStopsChange = (newNumStops) => {
    console.log("Número de paradas seleccionado:", newNumStops);
    setNumStops(newNumStops);
    setStops(Array(newNumStops).fill(''));
  };

  const handleStopInputChange = (index, value) => {
    const newStops = [...stops];
    newStops[index] = value;
    console.log(`Actualizando parada en índice ${index}:`, value);
    setStops(newStops);
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <StopSelect numStops={numStops} onStopsChange={handleStopsChange} />
      <StopsContainer stops={stops} onStopInputChange={handleStopInputChange} />
      <GeneratePDFButton config={formData} stops={stops} setPdfBlob={setPdfBlob} />
      {pdfBlob && <a href={pdfBlob} target="_blank" rel="noopener noreferrer">Ver PDF Generado</a>}  {/* Link para visualizar el PDF generado */}
    </div>
  );
};

export default PDFGenerator;
