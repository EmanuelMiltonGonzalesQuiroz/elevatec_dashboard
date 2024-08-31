import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import calculateValues from './../Calculation/calculateValues';

const PDFContent = ({ formData }) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Configuración inicial basada en formData
    const config = {
      headerText: "Encabezado del Documento",
      footerText: "Pie de Página del Documento",
      leftMargin: 20,
      topMargin: 20,
      bottomMargin: 20,
      city: formData['Ciudad'] || "N/A",
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      refNumber: "COT-061/2021/SC.",
      recipient: formData['02_CLIENTE'] || "N/A",
      proposalTitle: "Presentación Propuesta Provisión e Instalación de 1 Ascensor(es)",
      installationDescription: "De acuerdo a su solicitud, tenemos el agrado de poner en su consideración la Provisión e Instalación de 1, marca ELEVATEC, de última tecnología, que cumple todos los requerimientos necesarios para su obra.",
      additionalInfo: "Ascensores Elevatec, fabricados por Teknolift SRL, del grupo Empresarial Jaldin, cumple con Normativa europea EN 81, compatible con la Norma Boliviana NB 135001, Sistema de Gestión de Calidad ISO 9001: 2015 y Sistema de Gestión Ambiental ISO 14001: 2015.",
      servinfo: "La experiencia de más de 30 años en el mercado de nuestra Empresa, y los más de 500 equipos instalados a nivel nacional, garantizan no solo la calidad de los equipos a instalarse, sino toda la cadena existente desde la Venta, Instalación, Montaje, provisión de repuestos originales, servicios de mantenimiento, modernizaciones, servicios de emergencia las 24 horas del día, etc.",
      quantity: formData['08_Número de ascensores'] || "N/A"
    };

    const specifications = {
      type: formData['Tipo']?.nombre || "N/A",
      traction: formData['Traccion']?.nombre || "N/A",
      capacity: formData['Capacidad'] || "N/A",
      speed: formData['Velocidad'] || "N/A",
      control: formData['Control'] || "N/A",
      drive: formData['Drive'] || "N/A",
      stops: formData['01_PARADAS'] || "N/A",
      travel: formData['03_RECORRIDO'] || "N/A",
      boarding: formData['Embarque']?.nombre || "N/A",
      electricData: formData['EnergiaElectrica'] || "N/A",
      tractionMachine: formData['MaquinaTraccion']?.nombre || "N/A"
    };

    // Funciones para manejar encabezado y pie de página
    const addHeader = () => {
      doc.setFontSize(12).setFont("Helvetica", "bold").text(config.headerText, config.leftMargin, config.topMargin).setFont("Helvetica", "normal");
    };

    const addFooter = (pageNumber) => {
      doc.setFontSize(10).text(config.footerText, config.leftMargin, doc.internal.pageSize.height - config.bottomMargin + 10);
      doc.text(`Página ${pageNumber}`, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - config.bottomMargin + 10);
    };

    const addNewPageWithHeaderAndFooter = () => {
      doc.addPage();
      addHeader();
      addFooter(doc.internal.getNumberOfPages());
    };

    const addTableWithPagination = (startY, tableData, title, colSpan = 2) => {
      doc.autoTable({
        startY,
        margin: { top: 5, left: config.leftMargin, right: config.leftMargin },
        head: [[{ content: title, colSpan }]],
        headStyles: { halign: 'center' },
        body: tableData,
        styles: { fontSize: 11, fontStyle: 'bold', cellPadding: 1.5 },
        columnStyles: colSpan === 2 ? { 0: { cellWidth: 50 } } : undefined,
        theme: 'grid',
        didDrawPage: function () {
          addFooter(doc.internal.getNumberOfPages());
        }
      });
    };

    // Valores calculados
    const calculatedValues = calculateValues(formData);

    // Generar el contenido del PDF
    addHeader();
    doc.setFontSize(12).setFont("Helvetica", "normal");
    doc.text(`${config.city}, ${config.date}`, config.leftMargin, config.topMargin + 30);
    doc.text(config.refNumber, config.leftMargin, config.topMargin + 40);
    doc.text("Señor:", config.leftMargin, config.topMargin + 50);
    doc.setFont("Helvetica", "bold").text(config.recipient, config.leftMargin, config.topMargin + 60);
    doc.setFont("Helvetica", "normal");
    doc.text("Presente.-", config.leftMargin, config.topMargin + 80);
    doc.text(`Ref.: ${config.proposalTitle}`, config.leftMargin, config.topMargin + 90, { maxWidth: 170, align: "justify" });
    doc.text("De nuestra mayor consideración:", config.leftMargin, config.topMargin + 108);
    doc.text(config.installationDescription, config.leftMargin, config.topMargin + 120, { maxWidth: 170, align: "justify" });
    doc.text(config.additionalInfo, config.leftMargin, config.topMargin + 140, { maxWidth: 170, align: "justify" });
    doc.text(config.servinfo, config.leftMargin, config.topMargin + 160, { maxWidth: 170, align: "justify" });
    addFooter(doc.internal.getNumberOfPages());

    addNewPageWithHeaderAndFooter();
    
    // Tabla con especificaciones técnicas
    const additionalTableData = [
      [{ content: "Ciudad de Instalación", styles: { fontStyle: 'bold' } }, config.city],
      [{ content: "Marca", styles: { fontStyle: 'bold' } }, "Elevatec"],
      [{ content: "Componentes principales de fabricación europea. Acabados y estética de cabina de fabricación boliviana", colSpan: 2, styles: { halign: 'center' } }],
      [{ content: "Cantidad", styles: { fontStyle: 'bold' } }, config.quantity],
      [{ content: "Tipo", styles: { fontStyle: 'bold' } }, specifications.type],
      [{ content: "Tracción", styles: { fontStyle: 'bold' } }, specifications.traction],
      [{ content: "Capacidad", styles: { fontStyle: 'bold' } }, specifications.capacity],
      [{ content: "Velocidad", styles: { fontStyle: 'bold' } }, specifications.speed],
      [{ content: "Control", styles: { fontStyle: 'bold' } }, specifications.control],
      [{ content: "Accionamiento", styles: { fontStyle: 'bold' } }, specifications.drive],
      [{ content: "N° Paradas", styles: { fontStyle: 'bold' } }, specifications.stops],
      [{ content: "Recorrido", styles: { fontStyle: 'bold' } }, specifications.travel],
      [{ content: "Embarque", styles: { fontStyle: 'bold' } }, specifications.boarding],
      [{ content: "Datos eléctricos", styles: { fontStyle: 'bold' } }, specifications.electricData],
      [{ content: "Máquina de tracción", styles: { fontStyle: 'bold' } }, specifications.tractionMachine],
      [{ content: "PISOS A ATENDER", colSpan: 2, styles: { halign: 'center' } }],
    ];

    const stopsTable = formData['09_PISOS A ANTENDER']?.split('-').map((stop, index) => [
        `Piso ${index + 1}`, stop || "N/A"
    ]) || [];
    stopsTable.forEach(stop => additionalTableData.push(stop));

    addTableWithPagination(config.topMargin + 15, additionalTableData, "ESPECIFICACIONES TÉCNICAS");

    // Otras tablas y contenido según sea necesario...

    // Generar el blob del PDF para mostrarlo en el iframe
    const pdfBlob = doc.output('blob');
    return URL.createObjectURL(pdfBlob);
  };

  const pdfUrl = generatePDF();

  return (
    <iframe src={pdfUrl} width="100%" height="600px" title="Vista PDF" />
  );
};

export default PDFContent;
