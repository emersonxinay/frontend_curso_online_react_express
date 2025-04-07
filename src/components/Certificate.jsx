import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useState } from 'react';
import axios from '../config/axios';

export default function Certificate({ course, completionDate, user }) {
  const certificateRef = useRef();

  const downloadCertificate = async () => {
    const canvas = await html2canvas(certificateRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`certificado-${course.title}.pdf`);
  };

  return (
    <div className="p-8">
      <div
        ref={certificateRef}
        className="bg-white p-12 rounded-lg shadow-lg border-8 border-double border-indigo-600 max-w-4xl mx-auto"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-indigo-600 mb-8">Certificado de Finalización</h1>
          <p className="text-xl text-gray-600 mb-4">Se certifica que</p>
          <p className="text-3xl font-bold text-gray-900 mb-4">{user.name}</p>
          <p className="text-xl text-gray-600 mb-8">ha completado exitosamente el curso</p>
          <p className="text-3xl font-bold text-indigo-600 mb-8">"{course.title}"</p>
          <p className="text-xl text-gray-600 mb-8">
            Completado el {new Date(completionDate).toLocaleDateString('es-ES')}
          </p>

          <div className="flex justify-between items-center mt-16">
            <div className="text-center">
              <img
                src={course.instructor.signature || '/firma-placeholder.png'}
                alt="Firma del Instructor"
                className="h-16 mx-auto mb-2"
              />
              <p className="text-gray-600">{course.instructor.name}</p>
              <p className="text-sm text-gray-500">Instructor del Curso</p>
            </div>
            <div>
              <img
                src="/sello-plataforma.png"
                alt="Sello de la Plataforma"
                className="h-24"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={downloadCertificate}
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
        >
          Descargar Certificado
        </button>
      </div>
    </div>
  );
}

// Componente modal para la descarga del certificado
export function CertificateModal({ courseId, courseName, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`/courses/${courseId}/certificate`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificado-${courseName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Error al descargar el certificado');
      console.error('Error al descargar el certificado:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Felicitaciones!</h2>
        <p className="text-gray-600 mb-6">
          Has completado el curso "{courseName}". Puedes descargar tu certificado ahora.
        </p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cerrar
          </button>
          <button
            onClick={handleDownload}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Descargando...' : 'Descargar Certificado'}
          </button>
        </div>
      </div>
    </div>
  );
}