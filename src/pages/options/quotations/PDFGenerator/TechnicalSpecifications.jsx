import 'jspdf-autotable';
import { convertNumberToWords } from '../../../../components/layout/convertNumberToWords';

const TechnicalSpecifications = ({ doc, formData, startY, config }) => {
  const { leftMargin = 20, rightMargin = 20, topMargin = 20, bottomMargin = 20 } = config; // Obtener márgenes de config
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const tableWidth = pageWidth - leftMargin - rightMargin; // Calcular el ancho disponible para la tabla

  const maxTableHeight = pageHeight - topMargin - bottomMargin - startY; // Altura máxima disponible para la tabla

  const pisosAtender = formData['09_PISOS A ANTENDER']?.split('-') || [];

  // Generar filas dinámicas para pisos
  const pisosFilas = pisosAtender.map((piso, index) => (
    [{ content: `Piso de la parada ${index + 1}`, styles: { fontStyle: 'bold' } }, piso || "N/A"]
  ));

  const technicalSpecifications = [
    [{ 
      content: "Ciudad de Instalación", 
      styles: { fontStyle: 'bold' } 
    }, 
    formData['Ciudad']?.nombre?.toLowerCase().includes("transporte por el cliente") 
      ? "_____________" 
      : formData['Ciudad']?.nombre || "Falta"
    ],
    [{ content: "Marca", styles: { fontStyle: 'bold' } }, "Elevatec"],
    [{ content: "Componentes principales de fabricación europea. Acabados y estética de cabina de fabricación boliviana", colSpan: 2, styles: { halign: 'center' } }],
    [{ content: "Cantidad", styles: { fontStyle: 'bold' } }, convertNumberToWords(formData['08_Número de ascensores']) +" ("+formData['08_Número de ascensores']+") "+"Ascensores Sociales de alto trafico"|| "Falta"],
    [{ content: "Tipo", styles: { fontStyle: 'bold' } }, "Eléctrico " + formData['Tipo']?.nombre +" de maquinas" || "Falta"],
    [{ content: "Tracción", styles: { fontStyle: 'bold' } }, formData['Traccion']?.nombre || "Falta"],
    [{ content: "Capacidad", styles: { fontStyle: 'bold' } }, formData['00_Capacidad'] || formData['03_PERSONAS']+ " Personas o "+formData['03_PERSONAS'] * 75 +"Kg."],
    [{ content: "Velocidad", styles: { fontStyle: 'bold' } }, formData['Velocidad']?.nombre || "Falta"],
    [{ content: "Control", styles: { fontStyle: 'bold' } }, "Selectivo microprocesado simplex."],
    [{ content: "Accionamiento", styles: { fontStyle: 'bold' } }, "Voltaje y Frecuencia Variable VVVF"],
    [{ content: "N° Paradas", styles: { fontStyle: 'bold' } }, formData['01_PARADAS'] + "/"+formData['01_PARADAS'] || "Falta"],
    [{ content: "Recorrido", styles: { fontStyle: 'bold' } }, formData['03_RECORRIDO'] || "Falta"],
    [{ content: "Embarque", styles: { fontStyle: 'bold' } }, formData['Embarque']?.nombre || "Falta"],
    [{ content: "Datos eléctricos", styles: { fontStyle: 'bold' } }, "Fuerza trifásica 380v– 50Hz / Iluminación 220 v."],
    [{ content: "Máquina de tracción", styles: { fontStyle: 'bold' } }, formData['MaquinaTraccion']?.nombre+", sin engranajes, de funcionamiento silencioso y ahorro energético, tecnología de magneto síncrono permanente" || "Falta"],
    [{ content: "PISOS A ATENDER", colSpan: 2, styles: { halign: 'center' } }],
    ...pisosFilas
  ];

  // Calcular el espacio disponible antes de agregar la tabla
  doc.autoTable({
    startY: startY + 10, // Añadir 10 puntos a la posición inicial Y
    head: [[{ content: "ESPECIFICACIONES TÉCNICAS", colSpan: 2, styles: { halign: 'center', fillColor: [22, 160, 133] } }]],
    body: technicalSpecifications,
    theme: 'grid',
    tableWidth: tableWidth, // Asegurar que la tabla respete los márgenes laterales
    styles: { overflow: 'linebreak' }, // Hacer que el texto largo haga saltos de línea
    margin: { top: topMargin, bottom: bottomMargin, left: leftMargin, right: rightMargin }, // Márgenes verticales
    pageBreak: 'auto', // Romper la tabla si no cabe en la página
  });

  // Retornar la nueva posición de Y, considerando si la tabla continúa en una nueva página
  return doc.lastAutoTable.finalY + 10;
};

export default TechnicalSpecifications;
