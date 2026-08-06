import { jsPDF } from 'jspdf';

export interface CertificateData {
  schemeName: string;
  userName: string;
  cover: string;
  premium: string;
  refId: string;
}

/** Generates and downloads a real enrollment certificate PDF (FR-05-05). */
export function downloadCertificatePdf(cert: CertificateData) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const green = [0, 108, 73] as const;
  const ink = [25, 27, 30] as const;

  doc.setFillColor(...green);
  doc.rect(0, 0, 595, 90, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('DhanSathi', 48, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Enrollment Certificate', 48, 74);

  doc.setTextColor(...ink);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(cert.schemeName, 48, 150);

  const rows: [string, string][] = [
    ['Name', cert.userName],
    ['Coverage', cert.cover],
    ['Premium', cert.premium],
    ['Reference ID', cert.refId],
    ['Issued on', new Date().toLocaleDateString('en-IN')],
  ];
  doc.setFontSize(13);
  let y = 200;
  for (const [label, value] of rows) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    doc.text(label, 48, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...ink);
    doc.text(value, 220, y);
    y += 32;
  }

  doc.setDrawColor(...green);
  doc.setLineWidth(2);
  doc.roundedRect(32, 120, 531, y - 90, 8, 8);

  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'italic');
  doc.text('This certificate confirms enrollment via DhanSathi. Verify scheme details on the official government portal.', 48, y + 40);

  doc.save(`DhanSathi-${cert.refId}.pdf`);
}
