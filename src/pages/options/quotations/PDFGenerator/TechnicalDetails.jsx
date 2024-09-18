import 'jspdf-autotable';

const TechnicalDetails = ({ doc, formData, startY }) => {
  const technicalDetails = [
    [{ content: "DIMENSIÓN DE POZO (MM)", colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["FRENTE", formData['04_Frente'] || " ", "PROFUNDIDAD", formData['05_ProfundidadR'] || " "],
    ["FOSO", formData['06_Foso'] || "F", "HUIDA", formData['07_Huida'] || " "],

    [{ content: "CABINA", colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["Cabina", formData['Cabina']?.nombre || " ", { content: "Segun catalogo", colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["Dimensiones", { content: "De acuerdo a diseño de ingeniería", colSpan: 3, styles: { halign: 'center', fontStyle: 'bold' } }], 

    [{ content: "En cumplimiento a Normativa europea EN81", colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } }],

    // BOTONERA section
    [{ content: "BOTONERA", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: formData['TipoBotonera']?.nombre || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Techo", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: formData['SubTecho']?.nombre || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Pasamanos", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: formData['PasamanosAdicional']?.nombre || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Espejo", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: formData['EspejoAdicional']?.nombre || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Iluminación", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Iluminación LED.", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Piso", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: formData['Piso']?.nombre || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Intercomunicador", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Incluido ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Sintetizador de voz", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Sistema de voz y gong incluido. ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    [{ content: "Luz de emergencia", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Incluido ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],

    // PUERTAS section
    [{ content: "PUERTAS", styles: { halign: 'center', fontStyle: 'bold' } }, { content: "CABINA", styles: { fontStyle: 'bold' } }, { content: "PISOS", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["Tipo y paso libre", formData['PuertaTipo'] || " ", { content: formData['PuertaCabina'] || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["Hoja", formData['doors']?.nombre || " 1", { content: formData['PuertaPisos'] || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["Acabado", "INOXIDABLE", { content: formData['Puertas_en_inoxidable']?.UNIDADES || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["", "EPOXI", { content: formData['Puertas_En_Epoxi']?.UNIDADES || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["", "VIDRIO", { content: formData['Puertas_En_Vidrio']?.UNIDADES || " ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["Detector", " ", { content: formData['PuertaDetector'] || "Barrera Infrarroja ", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],

    // SEÑALIZACION section
    [{ content: "SEÑALIZACIÓN", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, "CABINA", "PISOS"],
    [{ content: "Tipo pulsador", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, formData['TipoBotonera'].nombre || " ", formData['TipoBotonera'].nombre || " "],
    [{ content: "Acabado botoneras", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, formData['BotonesCabina']?.nombre || " ", formData['BotonesPiso']?.nombre || " "],
    [{ content: "Indicadores", colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, formData['Indicador_de_Cabina'].nombre || " ", formData['Indicador_de_piso'].nombre || " "]
  ];

  doc.autoTable({
    startY: startY, // Usar startY proporcionado para la posición inicial
    head: [[{ content: "INFORMACIÓN TÉCNICA", colSpan: 4, styles: { halign: 'center', fillColor: [22, 160, 133] } }]],
    body: technicalDetails,
    theme: 'grid',
  });
};

export default TechnicalDetails;
