import 'jspdf-autotable';
import techo1 from '../../../../assets/images/Techo1.jpg';
import techo2 from '../../../../assets/images/Techo2.jpg';
import piso from '../../../../assets/images/Piso.jpg';
import sintetizador from '../../../../assets/images/Sintetizador.jpg';
import llave1 from '../../../../assets/images/llave1.jpg';
import llave2 from '../../../../assets/images/llave2.jpg';
import llave3 from '../../../../assets/images/llave3.jpg';
import llave4 from '../../../../assets/images/llave4.jpg';
import puerta1 from '../../../../assets/images/puerta1.jpg';
import puerta2 from '../../../../assets/images/puerta2.jpg';
import TFT from '../../../../assets/images/TFT.jpg';

// Lista de imágenes con sus propiedades
const imageList = {
  Techo: { height: 80, width: 60, images: [techo1, techo2] },
  Piso: { height: 70, width: 93, images: [piso] },
  "Sintetizador de voz": { height: 73, width: 89, images: [sintetizador] },
  "Llave on/off vent/luces": { height: 38, width: 31, images: [llave1, llave2, llave3, llave4] },
  Detector: { height: 62, width: 47, images: [puerta1, puerta2] },
  Indicadores: { height: 60, width: 110, images: [TFT] }
};

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

  const rowsWithLines = [
    "DIMENSIÓN DE POZO (MM)",
    "CABINA",
    "BOTONERA",
    "PUERTAS",
    "SEÑALIZACIÓN"
  ];

  let currentYPosition = startY;

  formData.forEach((dataItem, index) => {
    currentYPosition += 10;

    const technicalDetails = [
      [{ content: "DIMENSIÓN DE POZO (MM)", colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } }],
      ["FRENTE", dataItem['04_Frente'] || " ", "PROFUNDIDAD", dataItem['05_ProfundidadR'] || " "],
      ["FOSO", dataItem['06_Foso'] || " ", "HUIDA", dataItem['07_Huida'] || " "],

      [{ content: "CABINA", colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } }],
      ["Cabina", dataItem['Cabina']?.nombre || " ", { content: "Según catálogo", colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } }],
      ["Dimensiones", { content: "De acuerdo a diseño de ingeniería", colSpan: 3, styles: { halign: 'center', fontStyle: 'bold' } }],

      [{ content: "En cumplimiento a Normativa europea EN81", colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } }],

      // Sección de BOTONERA
      [{ content: "BOTONERA", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: dataItem['TipoBotonera']?.nombre || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
      
      [{ content: "Techo", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: dataItem['SubTecho']?.nombre || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],

      // Imagen de Techo
      [{ content: "Techos ", colSpan: 4, styles: { minCellHeight: imageList["Techo"].height + 15, fontStyle: 'bold' } }],

      [{ content: "Piso", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: dataItem['Piso']?.nombre || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
      // Imagen de Piso
      [{ content: " ", colSpan: 4, styles: { minCellHeight: imageList["Piso"].height + 5 } }],

      [{ content: "Pasamanos", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: ((Number(dataItem['PasamanosAdicional']?.nombre) || 0) + 1) + " (en acero inoxidable cepillado)", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
      [{ content: "Espejo", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: dataItem['EspejoAdicional']?.nombre || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
      [{ content: "Iluminación", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Iluminación LED (encendido y apagado automatizado).", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],

      [{ content: "Intercomunicador", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
      [{ content: "Sintetizador de voz", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Sistema de voz y gong incluido.", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],

      // Imagen de Sintetizador
      [{ content: " ", colSpan: 4, styles: { minCellHeight: imageList["Sintetizador de voz"].height + 5 } }],

      [{ content: "Luz de emergencia", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],

      [{ content: "Ventilación", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
       { content: dataItem['Ventilación']?.valor && dataItem['Ventilación'].valor !== 0 ? "Incluido con Sistema Desinfección covid-19" : "No Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],

      [{ content: "Boton Abre puerta", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
      [{ content: "Boton Cierra Puerta", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
      [{ content: "Llave on/off en PB", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
      [{ content: "Llave de Mudanzas", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
      [{ content: "Llave de Control acceso", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],

      [{ content: "Llave on/off vent/luces", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
       { content: dataItem['Llavines_con_llave']?.UNIDADES && dataItem['Llavines_con_llave'].UNIDADES !== 'llaves' ? "Incluido" : "No Incluido", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],

      // Imagen de Llaves
      [{ content: " ", colSpan: 4, styles: { minCellHeight: imageList["Llave on/off vent/luces"].height + 5 } }],

      [{ content: "Llave on/off en PB", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold', cellWidth: 'auto' } },
       { content: "Llave de mudanzas", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold', cellWidth: 'auto' } },
       { content: "Llave de control de acceso", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold', cellWidth: 'auto' } },
       { content: "Llave on/off vent/luces", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold', cellWidth: 'auto' } }],

      // Sección de PUERTAS
      [{ content: "PUERTAS", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
       { content: "CABINA", styles: { fontStyle: 'bold' } },
       { content: "PISOS", styles: { halign: 'center', fontStyle: 'bold' } }],
      [{content: "Tipo", colSpan: 2}, "Automática", "Automática"],
      [{content: "Hoja", colSpan: 2}, "Normal " + (extractDoorDetails(dataItem['doors']?.nombre)?.hojas || " "),"Normal " + (extractDoorDetails(dataItem['doors']?.nombre)?.hojas || " ")],
      [{ content: "Paso libre", colSpan: 2}, { content: extractDoorDetails(dataItem['doors']?.nombre)?.size + " x 2100mm" || " " }, { content: extractDoorDetails(dataItem['doors']?.nombre)?.size + " x 2100mm" || " "}],
      
      [{ content: "Acabado", colSpan: 2}, "INOXIDABLE (1)", { content: "INOXIDABLE ("+(dataItem['Puertas_en_inoxidable']?.UNIDADES || "0")+ ")",  styles: { halign: 'center', fontStyle: 'bold' } }],
      [{ content: "", colSpan: 2}, "", { content: "EPOXI ("+(dataItem['Puertas_En_Epoxi']?.UNIDADES || "0")+ ")",  styles: { halign: 'center', fontStyle: 'bold' } }],
      [{ content: "", colSpan: 2}, "", { content: "VIDRIO ("+(dataItem['Puertas_En_Vidrio']?.UNIDADES || "0")+ ")",  styles: { halign: 'center', fontStyle: 'bold' } }],
      [{ content: "Detector", colSpan: 2 }, { content: dataItem['PuertaDetector'] || "Barrera Infrarroja", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],

      // Imagen de Puertas
      [{ content: " ", colSpan: 4, styles: { minCellHeight: imageList["Detector"].height + 5 } }],

      [{ content: "Puerta en Inox", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', cellWidth: 'auto' } },
       { content: "Puerta en Acero pintado", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', cellWidth: 'auto' } }],

      // Sección de SEÑALIZACIÓN
      [{ content: "SEÑALIZACIÓN", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, "CABINA", "PISOS"],
      [{ content: "Tipo pulsador", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, dataItem['TipoBotonera']?.nombre || " ", dataItem['TipoBotonera']?.nombre || " "],
      [{ content: "Acabado botoneras", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, dataItem['BotonesCabina']?.nombre || " ", dataItem['BotonesPiso']?.nombre || " "],
      [{ content: "Indicadores", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, dataItem['Indicador_de_Cabina']?.nombre || " ", (dataItem['Indicador_de_piso']?.nombre || " ")+" (en todos los pisos)"],
      [{ content: " ", colSpan: 4, styles: { minCellHeight: imageList["Indicadores"].height + 5 } }],
      [{ content: "TFT A COLOR CON IMÁGENES A GUSTO DEL CLIENTE (MAX 5 IMÁGENES HD)", colSpan: 4, styles: { halign: 'center', fontStyle: 'bold', cellWidth: 'auto' } }]
    ];

    const lineThickness = 0.2; // Grosor de la línea en mm
    let rowContentList = [];
    doc.autoTable({
      startY: currentYPosition + 10,
      head: [[{ content: `INFORMACIÓN TÉCNICA N° ${index + 1}`, colSpan: 4, styles: { halign: 'left' } }]],
      body: technicalDetails,
      theme: 'plain',
      tableWidth: tableWidth,
      margin: { top: topMargin+10, bottom: bottomMargin, left: leftMargin, rightMargin },
      styles: { overflow: 'linebreak' },
      pageBreak: 'auto',
      rowPageBreak: 'avoid',

      willDrawCell: function (data) {
        const rowContent = data.row.raw[0]?.content || "";
        if (rowsWithLines.includes(rowContent)) {
          doc.setDrawColor(0);
          doc.setLineWidth(lineThickness);
          const startX = data.cell.x;
          const endX = data.cell.x + data.cell.width;
          const y = data.cell.y + data.cell.height;

          // Dibujar líneas superior e inferior
          doc.line(startX, data.cell.y, endX, data.cell.y); // Línea superior
          doc.line(startX, y, endX, y); // Línea inferior
        }
      },

      didDrawCell: function (data) {
        const rowContent = data.row.raw[0]?.content || "";

        // Verificar si el contenido de la fila coincide con una entrada de imageList
        if (imageList[rowContent]) {
          // Llenar rowContentList con el nombre y la fila actual (data.row.index)
          rowContentList.push({ name: rowContent, rowIndex: data.row.index + 1 }); // Sumamos 1 para la fila de imágenes
        }

        // Filtrar duplicados por 'name'
        rowContentList = rowContentList.filter((item, index, self) =>
          index === self.findIndex((t) => t.name === item.name)
        );

        // Agregar imágenes basado en el rowContentList
        rowContentList.forEach(({ name, rowIndex }) => {
          if (data.row.index === rowIndex && data.column.index === 0) {
            const { width, height, images } = imageList[name];

            // Asegurarse de que haya imágenes disponibles
            if (images && images.length > 0) {
              const imgSpacing = 10; // Espacio entre imágenes
              const totalWidth = (images.length * width) + ((images.length - 1) * imgSpacing);

              // Centrar las imágenes horizontalmente dentro de la celda
              let startX = data.cell.x + (data.cell.width - totalWidth) / 2;

              // Calcular el espacio disponible para centrar las imágenes verticalmente dentro de la celda
              let availableHeight = data.cell.height;
              let offsetY = (availableHeight - height) / 2; // Desplazamiento vertical para centrar

              // Añadir cada imagen
              images.forEach((img, i) => {
                if (img) {
                  doc.addImage(img, 'JPEG', startX + i * (width + imgSpacing), data.cell.y + offsetY, width, height);
                } 
              });
            }
          }
        });
      }
    });

    currentYPosition = doc.lastAutoTable.finalY + 10;
  });

  return doc.lastAutoTable.finalY;
};

export default TechnicalDetails;
