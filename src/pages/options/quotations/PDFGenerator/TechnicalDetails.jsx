import 'jspdf-autotable';
import techo1 from '../../../../assets/images/Techo1.jpg';
import techo2 from '../../../../assets/images/Techo2.jpg';
import piso from '../../../../assets/images/Piso.jpg';
import sintetizador from '../../../../assets/images/Sintetizador.jpg';
import llave1 from '../../../../assets/images/llave1.jpg'
import llave2 from '../../../../assets/images/llave2.jpg'
import llave3 from '../../../../assets/images/llave3.jpg'
import llave4 from '../../../../assets/images/llave4.jpg'
import puerta1 from '../../../../assets/images/puerta1.jpg'
import puerta2 from '../../../../assets/images/puerta2.jpg'
import TFT from '../../../../assets/images/TFT.jpg'

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
    ["FOSO", formData['06_Foso'] || " ", "HUIDA", formData['07_Huida'] || " "],

    [{ content: "CABINA", colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["Cabina", formData['Cabina']?.nombre || " ", { content: "Según catálogo", colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["Dimensiones", { content: "De acuerdo a diseño de ingeniería", colSpan: 3, styles: { halign: 'center', fontStyle: 'bold' } }],

    [{ content: "En cumplimiento a Normativa europea EN81", colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } }],

    // Sección de BOTONERA
    [{ content: "BOTONERA", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: formData['TipoBotonera']?.nombre || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Techo", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: formData['SubTecho']?.nombre || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],

    // Aquí van las celdas para las imágenes
    [{ content: " ", colSpan: 4, styles: { minCellHeight: 60 } }],

    [{ content: "Piso", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: formData['Piso']?.nombre || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: " ", colSpan: 4, styles: { minCellHeight: 60 } }],
    [{ content: "Pasamanos", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: formData['PasamanosAdicional']?.nombre || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Espejo", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: formData['EspejoAdicional']?.nombre || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Iluminación", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Iluminación LED.", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
   
    [{ content: "Intercomunicador", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Sintetizador de voz", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Sistema de voz y gong incluido.", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: " ", colSpan: 4, styles: { minCellHeight: 50 } }],
    [{ content: "Luz de emergencia", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    
    [{ content: "Ventilación", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, 
     { content: formData['Ventilación']?.valor && formData['Ventilación'].valor !== 0 ? "Incluido con Sistema Desinfección covid-19" : "No Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],

    [{ content: "Boton Abre puerta", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Boton Cierra Puerta", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Llave on/off en PB", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Llave de Mudanzas", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Llave de Control acceso", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    
    [{ content: "Llave on/off vent/luces", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, 
     { content: formData['Llavines_con_llave']?.UNIDADES && formData['Llavines_con_llave'].UNIDADES !== 'llaves' ? "Incluido" : "No Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],

    [{ content: " ", colSpan: 4, styles: { minCellHeight: 40 } }],
    [{ content: "Llave on/off en PB", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold', cellWidth: 'auto' } }, 
     { content: "Llave de mudanzas", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold', cellWidth: 'auto' } }, 
     { content: "Llave de control de acceso", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold', cellWidth: 'auto' } }, 
     { content: "Llave on/off vent/luces", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold', cellWidth: 'auto' } }],

    // Sección de PUERTAS
    [{ content: "PUERTAS", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, 
     { content: "CABINA", styles: { fontStyle: 'bold' } }, 
     { content: "PISOS", styles: { halign: 'center', fontStyle: 'bold' } }],
    ["Tipo y paso libre", "Automática", { content: extractDoorDetails(formData['doors']?.nombre)?.size + " x 2100mm" || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["Hoja", "Normal " + (extractDoorDetails(formData['doors']?.nombre)?.hojas || " "), 
 { content: "Normal " + (extractDoorDetails(formData['doors']?.nombre)?.hojas || " "), colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],

    ["Acabado", "INOXIDABLE", { content: formData['Puertas_en_inoxidable']?.UNIDADES || "0", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["", "EPOXI", { content: formData['Puertas_En_Epoxi']?.UNIDADES || "0", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["", "VIDRIO", { content: formData['Puertas_En_Vidrio']?.UNIDADES || "0", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{content: "Detector", colSpan: 2},  { content: formData['PuertaDetector'] || "Barrera Infrarroja", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],

    [{ content: " ", colSpan: 4, styles: { minCellHeight: 60 } }],
    [{ content: "Puerta en Inox", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', cellWidth: 'auto' } }, 
     { content: "Puerta en Acero pintado", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', cellWidth: 'auto' } }],

    // Sección de SEÑALIZACIÓN
    [{ content: "SEÑALIZACIÓN", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, "CABINA", "PISOS"],
    [{ content: "Tipo pulsador", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, formData['TipoBotonera']?.nombre || " ", formData['TipoBotonera']?.nombre || " "],
    [{ content: "Acabado botoneras", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, formData['BotonesCabina']?.nombre || " ", formData['BotonesPiso']?.nombre || " "],
    [{ content: "Indicadores", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, formData['Indicador_de_Cabina']?.nombre || " ", formData['Indicador_de_piso']?.nombre || " "],
    [{ content: " ", colSpan: 4, styles: { minCellHeight: 50 } }],
    [{ content: "TFT A COLOR CON IMÁGENES A GUSTO DEL CLIENTE (MAX 5 IMÁGENES HD)", colSpan: 4, styles: { halign: 'center', fontStyle: 'bold', cellWidth: 'auto' } }]
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
      // Colocar techo1 y techo2 en la misma columna, alineados uno debajo del otro y centrados
      if (data.row.index === 9 && data.column.index === 0) {
        var imgWidth = 40; // Ancho de la imagen (40 mm)
        var imgHeight = 50; // Altura de la imagen (50 mm)
        var imgSpacing = 10; // Separación entre las imágenes (10 mm)
      
        var img1 = new Image();
        img1.src = techo1;
        var img2 = new Image();
        img2.src = techo2;
      
        // Calcular el ancho total de las imágenes más el espacio entre ellas
        var totalWidth = (2 * imgWidth) + imgSpacing;
      
        // Centrar las imágenes horizontalmente dentro de la celda
        var startX = data.cell.x + (data.cell.width - totalWidth) / 2; // Ajuste inicial centrado
      
        // Añadir la primera imagen
        doc.addImage(img1, 'JPEG', startX, data.cell.y + 5, imgWidth, imgHeight);
        
        // Añadir la segunda imagen, a la derecha de la primera, separada por 'imgSpacing'
        doc.addImage(img2, 'JPEG', startX + imgWidth + imgSpacing, data.cell.y + 5, imgWidth, imgHeight);
      }
      
      
    
      // Centrar la imagen del piso en la columna
      if (data.row.index === 11 && data.column.index === 0) {
        var img = new Image();
        img.src = piso;
    
        var imgWidth = 50; // Ancho de la imagen
        var imgHeight = 60; // Alto de la imagen
        var xPos = data.cell.x + (data.cell.width - imgWidth) / 2; // Centrar horizontalmente
        var yPos = data.cell.y + (data.cell.height - imgHeight) / 2; // Centrar verticalmente
        
        doc.addImage(img, 'JPEG', xPos, yPos, imgWidth, imgHeight);
      }
    
      // Centrar la imagen del sintetizador
      if (data.row.index === 17 && data.column.index === 0) {
        var img = new Image();
        img.src = sintetizador;
    
        var imgWidth = 40;
        var imgHeight = 50;
        var xPos = data.cell.x + (data.cell.width - imgWidth) / 2; // Centrar horizontalmente
        var yPos = data.cell.y + (data.cell.height - imgHeight) / 2; // Centrar verticalmente
    
        doc.addImage(img, 'JPEG', xPos, yPos, imgWidth, imgHeight);
      }
    
      // Colocar 4 imágenes en la fila 26 (index 25) en columnas 0, con ancho de 3 cm y separación de 0.5 cm
      if (data.row.index === 26 && data.column.index === 0) {
        var imgWidth = 30; // 3 cm de ancho (30 mm)
        var imgHeight = 40; // Altura ajustada (40 mm)
        var imgSpacing = 5; // Separación de 0.5 cm (5 mm)
    
        var img1 = new Image();
        img1.src = llave1;
        var img2 = new Image();
        img2.src = llave2;
        var img3 = new Image();
        img3.src = llave3;
        var img4 = new Image();
        img4.src = llave4;
    
        // Posiciones de las imágenes en la fila, separadas por 5 mm
        var startX = data.cell.x + (data.cell.width - (4 * imgWidth + 3 * imgSpacing)) / 2; // Ajuste inicial centrado
    
        doc.addImage(img1, 'JPEG', startX, data.cell.y + 5, imgWidth, imgHeight);
        doc.addImage(img2, 'JPEG', startX + imgWidth + imgSpacing, data.cell.y + 5, imgWidth, imgHeight);
        doc.addImage(img3, 'JPEG', startX + 2 * (imgWidth + imgSpacing), data.cell.y + 5, imgWidth, imgHeight);
        doc.addImage(img4, 'JPEG', startX + 3 * (imgWidth + imgSpacing), data.cell.y + 5, imgWidth, imgHeight);
      }
      if (data.row.index === 35 && data.column.index === 0) {
        var imgWidth = 40; // Ancho de la imagen (40 mm)
        var imgHeight = 50; // Altura de la imagen (50 mm)
        var imgSpacing = 10; // Separación entre las imágenes (10 mm)
      
        var img1 = new Image();
        img1.src = puerta1;
        var img2 = new Image();
        img2.src = puerta2;
      
        // Calcular el ancho total de las imágenes más el espacio entre ellas
        var totalWidth = (2 * imgWidth) + imgSpacing;
      
        // Centrar las imágenes horizontalmente dentro de la celda
        var startX = data.cell.x + (data.cell.width - totalWidth) / 2; // Ajuste inicial centrado
      
        // Añadir la primera imagen
        doc.addImage(img1, 'JPEG', startX, data.cell.y + 5, imgWidth, imgHeight);
        
        // Añadir la segunda imagen, a la derecha de la primera, separada por 'imgSpacing'
        doc.addImage(img2, 'JPEG', startX + imgWidth + imgSpacing, data.cell.y + 5, imgWidth, imgHeight);
      }
      if (data.row.index === 41 && data.column.index === 0) {
        var img = new Image();
        img.src = TFT;
    
        var imgWidth = 60;
        var imgHeight = 30;
        var xPos = data.cell.x + (data.cell.width - imgWidth) / 2; // Centrar horizontalmente
        var yPos = data.cell.y + (data.cell.height - imgHeight) / 2; // Centrar verticalmente
    
        doc.addImage(img, 'JPEG', xPos, yPos, imgWidth, imgHeight);
      }
    }
    
    
  });

  // Retornar la nueva posición de Y
  return doc.lastAutoTable.finalY + 10;
};

export default TechnicalDetails;
