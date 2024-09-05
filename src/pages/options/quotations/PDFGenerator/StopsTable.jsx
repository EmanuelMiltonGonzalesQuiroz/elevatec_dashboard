import 'jspdf-autotable';

const StopsTable = ({ doc, formData }) => {
  const stopsTable = formData['09_PISOS A ANTENDER']?.split('-').map((stop, index) => [
    `Piso ${index + 1}`, stop || "N/A"
  ]) || [["Piso de la parada 1", "N/A"]];

  doc.autoTable({
    startY: 20,
    head: [[{ content: "PISOS A ATENDER", colSpan: 2 }]],
    body: stopsTable,
    theme: 'grid'
  });
};

export default StopsTable;
