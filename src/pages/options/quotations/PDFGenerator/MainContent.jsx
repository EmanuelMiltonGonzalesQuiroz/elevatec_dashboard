import { convertNumberToWords } from "../../../../components/layout/convertNumberToWords";

const MainContent = ({ doc, config, formData, startY }) => {
  const {
    leftMargin = 20,
    rightMargin = 20,
    fontSize = 12,
    experience,
  } = config;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxTextWidth = pageWidth - leftMargin - rightMargin;

  let currentY = startY || 20;

  const formDataArray = Array.isArray(formData) ? formData : [formData];

  let totalAscensores = 0;

  formDataArray.forEach((data) => {
    totalAscensores += data["08_Número de ascensores"] || 0;
  });

  const lineSpacing = 7; // Menor interlineado

  doc.setFontSize(fontSize);

  // Ref.: Propuesta
  doc.text(
    `Ref.: Presentacion Propuesta Provision e instalacion de ${convertNumberToWords(
      totalAscensores
    )} (${totalAscensores}) Ascensores`,
    leftMargin,
    currentY,
    { maxWidth: maxTextWidth }
  );
  currentY += 10; // Salto de línea reducido

  doc.text("De nuestra mayor consideración:", leftMargin, currentY, {
    maxWidth: maxTextWidth,
  });
  currentY += 10; // Salto de línea reducido

  // Descripción de instalación con texto en negrilla y justificado
  const installationTextSegments = [
    {
      text:
        "De acuerdo a su solicitud, tenemos el agrado de poner en su consideración la Provisión e Instalación de ",
      bold: false,
    },
    {
      text: `${convertNumberToWords(totalAscensores)} (${totalAscensores}) Ascensores Sociales`,
      bold: true,
    },
    {
      text:
        ", marca ELEVATEC de última tecnología, que cumple con todos los requerimientos necesarios para su obra.",
      bold: false,
    },
  ];

  currentY = renderTextWithBold(doc, installationTextSegments, {
    x: leftMargin,
    y: currentY,
    maxWidth: maxTextWidth,
    lineHeight: lineSpacing,
    align: "justify",
  });

  // Añadir espacio después del párrafo
  currentY += 5; // Espacio reducido entre párrafos

  // Información adicional con ISO en negrilla y justificado
  const additionalInfoSegments = [
    {
      text:
        "Los equipos ofertados cumplen con Normativa internacional, en fabricación de Ascensores, y cuentan con la certificación del Sistema de Gestión de Calidad ",
      bold: false,
    },
    { text: "ISO9001", bold: true },
    {
      text: ", certificación en Sistemas de Gestión Ambiental (SGA) ",
      bold: false,
    },
    { text: "ISO 14001", bold: true },
    {
      text:
        ", Certificación en Sistemas de gestión de la seguridad y salud en el trabajo ",
      bold: false,
    },
    { text: "ISO45001", bold: true },
    { text: ".", bold: false },
  ];

  currentY = renderTextWithBold(doc, additionalInfoSegments, {
    x: leftMargin,
    y: currentY,
    maxWidth: maxTextWidth,
    lineHeight: lineSpacing,
    align: "justify",
  });

  // Añadir espacio después del párrafo
  currentY += 5; // Espacio reducido entre párrafos

  // Información de experiencia utilizando renderTextWithBold para respetar márgenes y justificación
  const experienceInfoSegments = [
    { text: `La experiencia de más de `, bold: false },
    { text: `${experience} años`, bold: true },
    { text: ` en el mercado de nuestra Empresa, y los más de `, bold: false },
    { text: `500 equipos`, bold: true },
    { text: ` instalados a nivel nacional, garantizan no solo la calidad de los equipos a instalarse, sino toda la cadena existente desde la Venta, Instalación, Montaje, provisión de repuestos originales, servicios de mantenimiento, modernizaciones, servicios de emergencia las 24 horas del día, etc.`, bold: false },
  ];

  currentY = renderTextWithBold(doc, experienceInfoSegments, {
    x: leftMargin,
    y: currentY,
    maxWidth: maxTextWidth,
    lineHeight: lineSpacing,
    align: "justify",
  });

  // Actualizar currentY para el siguiente contenido
  currentY += 5; // Margen extra al final

  return currentY + 10;
};

function renderTextWithBold(doc, textSegments, options) {
  const { x, y, maxWidth, lineHeight, align } = options;
  let currentY = y;

  const spaceWidth = doc.getTextWidth(" ");
  const lines = [];
  let currentLine = [];
  let currentLineWidth = 0;
  let currentLineSpaces = 0;

  textSegments.forEach((segment) => {
    const words = segment.text.split(" ");
    words.forEach((word) => {
      const wordWidth = doc.getTextWidth(word);

      // Verificar si la palabra cabe en la línea actual
      if (
        currentLine.length > 0 &&
        currentLineWidth + spaceWidth + wordWidth > maxWidth
      ) {
        lines.push({
          words: currentLine,
          width: currentLineWidth,
          spaces: currentLineSpaces,
        });
        currentLine = [];
        currentLineWidth = 0;
        currentLineSpaces = 0;
      }

      if (currentLine.length > 0) {
        currentLineWidth += spaceWidth;
        currentLineSpaces += 1;
      }

      currentLine.push({ text: word, bold: segment.bold });
      currentLineWidth += wordWidth;
    });
  });

  if (currentLine.length > 0) {
    lines.push({
      words: currentLine,
      width: currentLineWidth,
      spaces: currentLineSpaces,
    });
  }

  lines.forEach((line, lineIndex) => {
    let currentX = x;

    if (align === "justify" && lineIndex < lines.length - 1 && line.spaces > 0) {
      const extraSpace = (maxWidth - line.width) / line.spaces;
      line.words.forEach((wordObj, index) => {
        doc.setFont(undefined, wordObj.bold ? "bold" : "normal");
        doc.text(wordObj.text, currentX, currentY);
        const wordWidth = doc.getTextWidth(wordObj.text);
        currentX += wordWidth;
        if (index < line.words.length - 1) {
          currentX += spaceWidth + extraSpace;
        }
      });
    } else {
      // Alineación normal o última línea
      line.words.forEach((wordObj, index) => {
        doc.setFont(undefined, wordObj.bold ? "bold" : "normal");
        doc.text(wordObj.text, currentX, currentY);
        const wordWidth = doc.getTextWidth(wordObj.text);
        currentX += wordWidth;
        if (index < line.words.length - 1) {
          currentX += spaceWidth;
        }
      });
    }

    currentY += lineHeight;
  });

  return currentY;
}


export default MainContent;
