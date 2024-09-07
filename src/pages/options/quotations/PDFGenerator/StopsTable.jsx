import 'jspdf-autotable';

const StopsTable = ({ doc, formData, startY }) => {
  const stopsTable = formData['09_PISOS A ANTENDER']?.split('-').map((stop, index) => [
    `Piso ${index + 1}`, stop || "N/A"
  ]) || [["Piso de la parada 1", "N/A"]];

  // Asegurarse de que la tabla comience en la posición correcta
  doc.autoTable({
    startY: startY, // Posición dinámica para evitar superposición
    head: [[{ content: "PISOS A ATENDER", colSpan: 2 }]],
    body: stopsTable,
    theme: 'grid'
  });

  return doc; // Devuelve el documento modificado
};

export default StopsTable;
