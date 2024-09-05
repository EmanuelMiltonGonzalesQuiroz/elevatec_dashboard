const Header = ({ doc, config }) => {
    const { leftMargin, city, date, refNumber, recipient } = config;
  
    doc.setFontSize(12);
    doc.text(`${city}, ${date}`, leftMargin, 30);
    doc.text(refNumber, leftMargin, 40);
    doc.text("Señor:", leftMargin, 50);
    doc.setFont("Helvetica", "bold");
    doc.text(recipient, leftMargin, 60);
    doc.setFont("Helvetica", "normal");
    doc.text("Presente.-", leftMargin, 80);
  };
  
  export default Header;
  