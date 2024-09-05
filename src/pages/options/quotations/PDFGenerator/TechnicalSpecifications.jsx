import 'jspdf-autotable';

const TechnicalSpecifications = ({ doc, formData }) => {
  const pisosAtender = formData['09_PISOS A ANTENDER']?.split('-') || [];
  
  // Generar filas dinámicas para pisos
  const pisosFilas = pisosAtender.map((piso, index) => (
    [{ content: `Piso de la parada ${index + 1}`, styles: { fontStyle: 'bold' } }, piso || "N/A"]
  ));

  const technicalSpecifications = [
    [{ content: "Ciudad de Instalación", styles: { fontStyle: 'bold' } }, formData['Ciudad']?.nombre || "Falta"],
    [{ content: "Marca", styles: { fontStyle: 'bold' } }, "Elevatec"],
    [{ content: "Componentes principales de fabricación europea. Acabados y estética de cabina de fabricación boliviana", colSpan: 2, styles: { halign: 'center' } }],
    [{ content: "Cantidad", styles: { fontStyle: 'bold' } }, formData['08_Número de ascensores'] || "Falta"],
    [{ content: "Tipo", styles: { fontStyle: 'bold' } }, formData['Tipo']?.nombre || "Falta"],
    [{ content: "Tracción", styles: { fontStyle: 'bold' } }, formData['Traccion']?.nombre || "Falta"],
    [{ content: "Capacidad", styles: { fontStyle: 'bold' } }, formData['00_Capacidad'] || formData['03_PERSONAS'] * 75],
    [{ content: "Velocidad", styles: { fontStyle: 'bold' } }, formData['Velocidad']?.nombre || "Falta"],
    [{ content: "Control", styles: { fontStyle: 'bold' } }, "Selectivo microprocesado simplex."],
    [{ content: "Accionamiento", styles: { fontStyle: 'bold' } }, "Voltaje y Frecuencia Variable VVVF"],
    [{ content: "N° Paradas", styles: { fontStyle: 'bold' } }, formData['01_PARADAS'] || "Falta"],
    [{ content: "Recorrido", styles: { fontStyle: 'bold' } }, formData['03_RECORRIDO'] || "Falta"],
    [{ content: "Embarque", styles: { fontStyle: 'bold' } }, formData['Embarque']?.nombre || "Falta"],
    [{ content: "Datos eléctricos", styles: { fontStyle: 'bold' } }, formData['DatosElectricos'] || "Falta"],
    [{ content: "Máquina de tracción", styles: { fontStyle: 'bold' } }, formData['MaquinaTraccion']?.nombre || "Falta"],
    [{ content: "PISOS A ATENDER", colSpan: 2, styles: { halign: 'center' } }],
    ...pisosFilas
  ];

  doc.autoTable({
    startY: 20,
    head: [[{ content: "ESPECIFICACIONES TÉCNICAS", colSpan: 2, styles: { halign: 'center', fillColor: [22, 160, 133] } }]],
    body: technicalSpecifications,
    theme: 'grid',
  });
};

export default TechnicalSpecifications;
