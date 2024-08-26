import React, { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const RegeneratePDF = ({ documentId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const regeneratePDF = async () => {
    setLoading(true);
    setError(null);

    try {
      // Obtener el documento de Firebase
      const docRef = doc(db, 'list of quotations', documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const pdfData = docSnap.data().pdfData;
        const doc = new jsPDF();
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

        // Encabezado
        doc.setFontSize(12);
        doc.text(`La Paz, ${formattedDate}`, 20, 20);
        doc.text('COT-061/2024/SC.', 20, 30);

        // Cliente
        doc.setFontSize(14);
        doc.text(`Señor(a): ${pdfData.client}`, 20, 50);
        doc.text('Presente.-', 20, 60);

        // Cuerpo del documento
        doc.setFontSize(12);
        doc.text(`Ref.: Presentación Propuesta Provisión e Instalación de ${pdfData.numElevators} Ascensor(es)`, 20, 80);
        doc.text('De nuestra mayor consideración:', 20, 90);

        doc.setFontSize(10);
        const text1 = `De acuerdo a su solicitud, tenemos el agrado de poner en su consideración la Provisión e Instalación de ${pdfData.numElevators} Ascensor(es), marca ELEVATEC, de última tecnología, que cumple todos los requerimientos necesarios para su obra.`;
        const text2 = `Ascensores Elevatec, fabricados por Teknolift SRL, del grupo Empresarial Jaldin, cumple con Normativa europea EN 81, compatible con la Norma Boliviana NB 135001, Sistema de Gestión de Calidad ISO 9001: 2015 y Sistema de Gestión Ambiental ISO 14001: 2015.`;

        doc.text(text1, 20, 100);
        doc.text(text2, 20, 110);

        // Especificaciones técnicas
        doc.setFontSize(12);
        doc.text('ESPECIFICACIONES TÉCNICAS', 20, 130);

        const technicalDetails = [
          { label: 'Ciudad de Instalación:', value: pdfData.city },
          { label: 'Cantidad:', value: pdfData.numElevators },
          { label: 'Tipo:', value: pdfData.type },
          { label: 'Tracción:', value: pdfData.traction },
          { label: 'Capacidad:', value: pdfData.persons },
          { label: 'Velocidad:', value: pdfData.speed },
          { label: 'Nº Paradas:', value: pdfData.stops },
          { label: 'Recorrido:', value: pdfData.recorrido },
          { label: 'Máquina de Tracción:', value: pdfData.tractionMachine },
          { label: 'Control:', value: pdfData.controlPanel },
          { label: 'Piso:', value: pdfData.floor },
          { label: 'Cabina:', value: pdfData.cabin },
          { label: 'Techo:', value: pdfData.subCeiling },
          { label: 'Pasamanos:', value: pdfData.additionalHandrail },
        ];

        technicalDetails.forEach((detail, index) => {
          doc.text(`${detail.label} ${detail.value}`, 20, 140 + index * 10);
        });

        // Tablas de costos
        doc.autoTable({
          startY: 200,
          head: [['ÍTEM', 'DESCRIPCIÓN', 'CANT.', 'VEL.', 'CAP.', 'PARADAS', 'PRECIO UNITARIO $us.', 'PRECIO TOTAL $us.']],
          body: [
            ['1', 'Sin sala MRL', pdfData.numElevators, pdfData.speed, pdfData.persons, pdfData.stops, pdfData.totals.minimumSale, pdfData.totals.totalSale]
          ]
        });

        // Pie de página
        doc.text('Valor Total del Equipo Instalado y Funcionando', 20, doc.autoTable.previous.finalY + 20);
        doc.text(`Son: ${pdfData.totals.totalSale} USD`, 20, doc.autoTable.previous.finalY + 30);

        // Guardar o mostrar el PDF
        doc.save(`${pdfData.client}-cotizacion.pdf`);
      } else {
        setError('El documento no existe.');
      }
    } catch (err) {
      console.error('Error al regenerar el PDF:', err);
      setError('Ocurrió un error al intentar regenerar el PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={regeneratePDF} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        Regenerar PDF
      </button>
      {loading && <p>Generando PDF...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default RegeneratePDF;
