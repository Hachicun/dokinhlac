import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PDFButtons = ({ elementId }) => {
  const savePDF = async () => {
    const input = document.getElementById(elementId);
    const canvas = await html2canvas(input, { scale: 2 }); // Giảm độ phân giải bằng cách giảm scale
    const imgData = canvas.toDataURL('image/jpeg', 0.8); // Giảm chất lượng hình ảnh bằng cách sử dụng image/jpeg và chất lượng 0.8
    const pdf = new jsPDF();
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST'); // Sử dụng nén FAST
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    pdf.save('result.pdf');
  };

  const sharePDF = async () => {
    const input = document.getElementById(elementId);
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/jpeg', 0.8);
    const pdf = new jsPDF();
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    const pdfBlob = pdf.output('blob');
    const file = new File([pdfBlob], 'result.pdf', { type: 'application/pdf' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Result PDF',
          text: 'Here is the result PDF file.',
        });
      } catch (error) {
        console.error('Error sharing PDF:', error);
      }
    } else {
      console.warn('Your browser does not support sharing files.');
    }
  };

  return (
    <div className="flex justify-center space-x-4 mt-4 w-full">
      <button
        onClick={savePDF}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
      >
        Lưu PDF
      </button>
      <button
        onClick={sharePDF}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
      >
        Chia sẻ
      </button>
    </div>
  );
};

export default PDFButtons;
