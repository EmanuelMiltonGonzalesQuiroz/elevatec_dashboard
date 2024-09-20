import jsPDF from 'jspdf';
import 'jspdf-autotable';
import techo1 from '../../../../assets/images/Techo1.jpg';
import techo2 from '../../../../assets/images/Techo2.jpg';

function extractDoorDetails(doorName) {
  const pattern = /(\d+ HOJAS)\s*-\s*(\d+mm)/;
  const match = doorName.match(pattern);

  if (match) {
    const hojas = match[1];
    const size = match[2];
    return { hojas, size };
  }

  return { hojas: null, size: null };
}

const TechnicalDetails = ({ doc, formData, startY, config }) => {
  const { leftMargin = 20, rightMargin = 20, topMargin = 20, bottomMargin = 20 } = config;
  const pageWidth = doc.internal.pageSize.getWidth();
  const tableWidth = pageWidth - leftMargin - rightMargin;

  const technicalDetails = [
    [{ content: "DIMENSIÓN DE POZO (MM)", colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["FRENTE", formData['04_Frente'] || " ", "PROFUNDIDAD", formData['05_ProfundidadR'] || " "],
    ["FOSO", formData['06_Foso'] || "F", "HUIDA", formData['07_Huida'] || " "],

    [{ content: "CABINA", colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["Cabina", formData['Cabina']?.nombre || " ", { content: "Según catálogo", colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["Dimensiones", { content: "De acuerdo a diseño de ingeniería", colSpan: 3, styles: { halign: 'center', fontStyle: 'bold' } }],

    [{ content: "En cumplimiento a Normativa europea EN81", colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } }],

    // Sección de BOTONERA
    [{ content: "BOTONERA", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: formData['TipoBotonera']?.nombre || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Techo", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: formData['SubTecho']?.nombre || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],

    // Aquí van las celdas para las imágenes
    [{ content: " ", colSpan: 2,styles: { minCellHeight: 50 } }, { content: " ", colSpan: 2,styles: { minCellHeight: 50 } }],

    [{ content: "Pasamanos", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: formData['PasamanosAdicional']?.nombre || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Espejo", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: formData['EspejoAdicional']?.nombre || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Iluminación", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Iluminación LED.", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Piso", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: formData['Piso']?.nombre || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    
    [{ content: "Intercomunicador", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Sintetizador de voz", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Sistema de voz y gong incluido.", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Luz de emergencia", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],

    // Sección de PUERTAS
    [{ content: "PUERTAS", styles: { halign: 'center', fontStyle: 'bold' } }, { content: "CABINA", styles: { fontStyle: 'bold' } }, { content: "PISOS", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["Tipo y paso libre", "Automática", { content: extractDoorDetails(formData['doors']?.nombre).size + " x 2100mm" || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["Hoja", "Normal " + extractDoorDetails(formData['doors']?.nombre).hojas || " ", { content: formData['PuertaPisos'] || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["Acabado", "INOXIDABLE", { content: formData['Puertas_en_inoxidable']?.UNIDADES || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["", "EPOXI", { content: formData['Puertas_En_Epoxi']?.UNIDADES || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["", "VIDRIO", { content: formData['Puertas_En_Vidrio']?.UNIDADES || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["Detector", " ", { content: formData['PuertaDetector'] || "Barrera Infrarroja", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],

    // Sección de SEÑALIZACIÓN
    [{ content: "SEÑALIZACIÓN", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, "CABINA", "PISOS"],
    [{ content: "Tipo pulsador", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, formData['TipoBotonera']?.nombre || " ", formData['TipoBotonera']?.nombre || " "],
    [{ content: "Acabado botoneras", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, formData['BotonesCabina']?.nombre || " ", formData['BotonesPiso']?.nombre || " "],
    [{ content: "Indicadores", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, formData['Indicador_de_Cabina']?.nombre || " ", formData['Indicador_de_piso']?.nombre || " "]
  ];

  doc.autoTable({
    startY: startY + 10,
    head: [[{ content: "INFORMACIÓN TÉCNICA", colSpan: 4, styles: { halign: 'center', fillColor: [22, 160, 133] } }]],
    body: technicalDetails,
    theme: 'grid',
    tableWidth: tableWidth,
    margin: { top: topMargin, bottom: bottomMargin, left: leftMargin, right: rightMargin },
    styles: { overflow: 'linebreak' },
    pageBreak: 'auto',

    // Aquí insertamos las imágenes en las celdas vacías
    didDrawCell: function(data) {
      if (data.row.index === 9 && data.column.index === 0) {
        var img = new Image();
        img.src = techo1;
        doc.addImage(img, 'JPEG', data.cell.x + 2, data.cell.y + 2, 40, 40);
      }
      if (data.row.index === 9 && data.column.index === 2) {
        var img = new Image();
        img.src = techo2;
        doc.addImage(img, 'JPEG', data.cell.x + 2, data.cell.y + 2, 40, 40);
      }
    }
  });

  // Retornar la nueva posición de Y
  return doc.lastAutoTable.finalY + 10;
};

export default TechnicalDetails;
