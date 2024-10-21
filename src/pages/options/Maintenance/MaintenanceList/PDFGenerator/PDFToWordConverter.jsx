import React, { useState, useEffect, useCallback } from 'react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from 'docx';
import { getBoliviaCityByLocation } from '../../../../../components/common/DepartamentOrCity';
import { convertNumberToWords } from '../../../../../components/layout/convertNumberToWords';

// Function to format date into 'day of month, year' format
const formatRecipeDate = (recipeDate) => {
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const date = new Date(recipeDate);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} de ${month} de ${year}`;
};

// Function to calculate the end date (2 years from the start date)
const calculateEndDate = (startDate) => {
  const date = new Date(startDate);
  date.setFullYear(date.getFullYear() + 2);
  return formatRecipeDate(date);
};

// Mapping to identify equipment types
const typeMapping = {
  ASC: "Ascensores",
  MCS: "Monta Coches",
  MCG: "Montacargas",
  ESM: "Escalera Mecánica"
};

// Generate summary of equipment types using the convertNumberToWords function
const generateEquipmentSummary = (filteredItems) => {
  const equipmentCount = {
    Ascensores: 0,
    "Monta Coches": 0,
    Montacargas: 0,
    "Escalera Mecánica": 0
  };

  filteredItems.forEach((item) => {
    const equipmentType = typeMapping[item.type.type];
    if (equipmentType) {
      equipmentCount[equipmentType]++;
    }
  });

  const summary = [];
  Object.entries(equipmentCount).forEach(([equipment, count]) => {
    if (count > 0) {
      summary.push(`${convertNumberToWords(count)} (${count}) ${equipment}`);
    }
  });

  return summary.join(", ");
};

// Function to create reusable paragraphs
const createParagraph = (text, bold = false, size = 20, alignment = "left") => {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        bold: bold,
        size: size,
      }),
    ],
    alignment,
  });
};

// Function to create reusable tables
const createTable = (rows, width = 100) => {
  return new Table({
    rows: rows,
    width: { size: width, type: WidthType.PERCENTAGE },
  });
};

const PDFToWordConverter = ({ recipe, fileName, onConvert }) => {
  const [isConverting, setIsConverting] = useState(false);
  const [entero, decimales] = recipe.finalTotal.split('.'); 

  const convertToWord = useCallback(async () => {
    setIsConverting(true);

    try {
      const doc = new Document({
        sections: [
          {
            children: [
              // Contract Title
              createParagraph(
                `CONTRATO PRIVADO DE MANTENIMIENTO PREVENTIVO Y CORRECTIVO DE ${generateEquipmentSummary(recipe.filteredItems).toUpperCase()}`,
                true,
                24,
                "center"
              ),
              createParagraph(` `, true),
              createParagraph(`CÓDIGO DE CONTRATO: 0${recipe.documentId}`, true),

              // Contract Introduction
              createParagraph(` `, true),
              createParagraph(
                `Conste por el tenor del presente Contrato Privado de Mantenimiento Preventivo y Correctivo de ${generateEquipmentSummary(recipe.filteredItems)}, suscrito al tenor de las siguientes cláusulas:`
              ),
              createParagraph(` `, true),
              createParagraph("PRIMERA: (PARTES).-", true),
              createParagraph(` `, true),
              createParagraph(
                `1. JALDIN MEJIA CONSTRUCCIONES JALMECO LTDA., Empresa legalmente constituida bajo las leyes Bolivianas, con NIT 1021629020, y representado por su Gerente Mantenimientos y Activos, Arq. Alvaro Grover Jaldin Navia con C.I. Nº 6550173 Cbba., con domicilio en la avenida Altamirano S/N Zona Alalay Sud, denominado en adelante y a los efectos del presente documento, el PROVEEDOR.`
              ),
              createParagraph(` `, true),
              createParagraph(
                `2. ${recipe.client.name || "…………………………………………"}, representado por…………………………………………………… con C.I ${recipe.client.ciNIT || "………………………."}; a quién en lo sucesivo y para efectos del presente contrato se denominará, el CLIENTE.`
              ),
              createParagraph(` `, true),
              
              // Contract Object
              createParagraph("SEGUNDA: (OBJETO).-", true),
              createParagraph(` `, true),
              createParagraph(
                `El objeto del presente Contrato es la Provisión del Servicio de Mantenimiento Preventivo y Mantenimiento Correctivo de ${generateEquipmentSummary(recipe.filteredItems)}, a ser realizado por el PROVEEDOR en favor del CLIENTE, instalados en el Edificio ………, de la ciudad de ${getBoliviaCityByLocation(recipe.location.lat, recipe.location.lng)}, de las características descritas a continuación, con el fin de que tengan la conservación adecuada.`
              ),
              createParagraph(` `, true),

              // Equipment Table
              // Tabla de equipos sin el segundo argumento en createTable
                       
              
              createParagraph(` `, true),

              // Service Description
              createParagraph("TERCERA: (DESCRIPCIÓN DEL SERVICIO).-", true),
              createParagraph(` `, true),
              createParagraph("El servicio que brindará el PROVEEDOR contempla:"),
              createParagraph(` `, true),
              createParagraph("I. MANTENIMIENTO PREVENTIVO:", true),
              createParagraph(` `, true),
              createParagraph("1. El Servicio de Mantenimiento Preventivo será proporcionado una (1) vez al mes de acuerdo a fechas y horarios establecidos entre partes."),
              createParagraph(` `, true),
              createParagraph("II. MANTENIMIENTO CORRECTIVO:", true),
              createParagraph(` `, true),
              createParagraph(
                "1. El Servicio de Emergencia será proporcionado todas las veces que sea necesario, vigencia las 24 horas al día, los 7 días a la semana y los 365 días del año, contando Jalmeco Ltda. con números de teléfono fijos para atención en horario de oficina y números celulares disponibles para atención en cualquier otro horario."
              ),
              createParagraph(` `, true),
              createParagraph(
                "2.En caso de que los equipos requieran de cambio de piezas, el mismo será realizado previa presentación de un informe técnico que indique el diagnóstico y el costo de los componentes originales que requieran su cambio. El tiempo estimado para la restitución será de 24 a 48 horas para partes y componentes de existencia en el mercado local y de 30 días cuando se requiera fabricación e importación de los mismos."
              ),
              createParagraph(` `, true),
              createParagraph(
                "3. En caso de autorizar el cambio o sustitución de las piezas dañadas, el PROVEEDOR se compromete a presentar la correspondiente factura proforma."
              ),
              createParagraph(` `, true),
              createParagraph(
                "4. Los repuestos a sustituirse deberán ser originales."
              ),
              createParagraph(` `, true),
              createParagraph(
                "5. Una vez autorizado el cambio de los repuestos que se encuentren en mal estado, estos deberán ser devueltos al CLIENTE."
              ),
              
              // Obligations of the Provider
              createParagraph(` `, true),
              createParagraph("CUARTA: (DE LAS OBLIGACIONES DEL PROVEEDOR).-", true),
              createParagraph(` `, true),
              createParagraph("• Realizar el servicio objeto del presente contrato en forma eficiente, oportuna y en el lugar de destino convenido."),
              createParagraph(` `, true),
              createParagraph("• Durante cada mantenimiento preventivo se realizarán trabajos de limpieza, regulación, ajuste, control de instrumental eléctrico y/o electrónico para el funcionamiento de piezas vitales como ser: Máquina de tracción y polea de desvío, freno, regulador de velocidad, llaves y fusibles en sala de máquinas, cuadro de comando y conexiones del mismo, iluminación de botones y señalización de cabinas, operador de puerta, regla de seguridad, techo y puertas de cabinas, corredizas de cabina y contrapeso, aparato de seguridad, llaves de inducción, placas, emisores, receptores, piso, guías y soportes de contrapeso, límites de curso, cables de tracción, cierre electromecánico, polea de regulador de velocidad."),
              createParagraph(` `, true),
              createParagraph("• Limpieza de cabinas de Ascensor."),
              createParagraph(` `, true),
              createParagraph("• Engrase y lubricado de todos aquellos componentes del ascensor que lo requieran en cada revisión programada."),
              createParagraph(` `, true),
              createParagraph("• Acudir en caso de emergencia cuando se detecten fallas que puedan alterar el buen funcionamiento de los equipos."),
              createParagraph(` `, true),
              createParagraph("QUINTA: (DE LAS OBLIGACIONES DEL CLIENTE).-", true),
                createParagraph(" ", true),
                createParagraph("• Permitir el acceso de técnicos del PROVEEDOR, colaborando al desempeño del servicio; con la obligación de los técnicos de presentar su identificación para el acceso al ascensor."),
                createParagraph(" ", true),
                createParagraph("• No permitir el acceso de personas ajenas a la sala de máquinas y demás instalaciones del ascensor."),
                createParagraph(" ", true),
                createParagraph("• No permitir el cambio de piezas o revisión por personal ajeno al PROVEEDOR. La contravención implica la anulación del contrato, ya que se trata de equipos electrónicos regulados por personal especializado."),
                createParagraph(" ", true),
                createParagraph("• Tener el Ascensor sin códigos de acceso en el control electrónico para un buen desempeño del trabajo."),
                createParagraph(" ", true),
                createParagraph("• Visar el Registro de Control de Mantenimiento Preventivo de Ascensores en cada una de las revisiones de mantenimiento realizadas por el PROVEEDOR."),
                createParagraph(" ", true),
                createParagraph("• Autorizar a los técnicos para la sustitución de piezas previa demostración del defecto de las mismas, siendo el costo del cambio con cargo al CLIENTE."),
                createParagraph(" ", true),

                

                
              
            ],
          },
        ],
      });

      const wordBlob = await Packer.toBlob(doc);
      saveAs(wordBlob, `${fileName}.docx`);
      onConvert();
    } catch (error) {
      console.error('Error converting to Word:', error);
    } finally {
      setIsConverting(false);
    }
  }, [recipe.filteredItems, recipe.documentId, recipe.client.name, recipe.client.ciNIT, recipe.location.lat, recipe.location.lng, recipe.date, recipe.finalTotal, entero, decimales, fileName, onConvert]);

  useEffect(() => {
    if (recipe) {
      convertToWord();
    }
  }, [recipe, convertToWord]);

  return (
    <div>
      {isConverting ? <p>Convirtiendo PDF a Word...</p> : <p>Conversión completada</p>}
    </div>
  );
};

export default PDFToWordConverter;
