import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { ArrowLeft, Download, User, Calendar, GraduationCap, Hash, Mail, Award } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// --- INTERFAZ ---
interface Evaluation {
  courseName: string;
  competencyName: string;
  grade: string | null;
  period: string | null;
  date?: string | null;
}

interface Student {
  dni: string;
  name: string;
  email?: string;
  role?: string;
  grade: string;
  section: string;
  performance?: number | null;
  average?: number | null;
  competenciesCount?: number;
  lastEvaluationDate?: string | null;
  evaluations: Evaluation[];
}

interface StudentResultsProps {
  student: Student;
  onBack: () => void;
}

export function StudentResults({ student, onBack }: StudentResultsProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  // --- Colores de calificación ---
  const getGradeColor = (grade: string | null) => {
    if (grade === null) return 'bg-gray-100 text-gray-500';
    if (grade === 'A') return 'bg-green-100 text-green-800';
    if (grade === 'B') return 'bg-blue-100 text-blue-800';
    if (grade === 'C') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-500';
  };

  const formatGrade = (grade: string | null) => (grade ? grade : '-');

  // --- Generar PDF ---
  const handleDownloadPDF = async () => {
  if (!reportRef.current) return;

  const element = reportRef.current;
  const canvas = await html2canvas(element, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 190;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
  pdf.save(`Boleta_${student.name.replace(/\s/g, '_')}.pdf`);
  };

  const currentDate = new Date().toLocaleDateString('es-PE', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- HEADER --- */}
      <header className="bg-[#800020] text-white py-4 shadow-lg">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-xl font-semibold">Consulta de Calificaciones</h1>
          </div>
        </div>
      </header>

      {/* --- CONTENIDO --- */}
      <main className="container mx-auto px-6 py-8" ref={reportRef}>
        {/* --- INFO GENERAL --- */}
        <Card className="mb-8 shadow-md border border-gray-200">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-[#800020] flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Estudiante
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <InfoItem label="Nombre" value={student.name} />
            <InfoItem label="DNI" value={student.dni} icon={<Hash className="h-3 w-3" />} />
            <InfoItem label="Correo" value={student.email || 'No registrado'} icon={<Mail className="h-3 w-3" />} />
            <InfoItem label="Grado" value={student.grade} icon={<GraduationCap className="h-3 w-3" />} />
            <InfoItem label="Sección" value={student.section} />
            <InfoItem label="Rol" value={student.role || 'Estudiante'} />
          </CardContent>
        </Card>

        {/* --- RESUMEN DE RENDIMIENTO --- */}
        <Card className="mb-8 shadow-md border border-gray-200">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-[#800020] flex items-center gap-2">
              <Award className="h-5 w-5" />
              Resumen de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700">
            <InfoItem label="Rendimiento actual" value={`${student.performance ?? '-'} / 20`} />
            <InfoItem label="Promedio general" value={student.average ? `${student.average} / 20` : '-'} />
            <InfoItem label="Competencias evaluadas" value={student.competenciesCount?.toString() ?? '0'} />
            <InfoItem label="Última evaluación" value={student.lastEvaluationDate || 'No disponible'} />
          </CardContent>
        </Card>

        {/* --- REPORTE DE EVALUACIONES --- */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-[#800020]">Reporte de Evaluaciones</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead>Curso</TableHead>
                    <TableHead>Competencia</TableHead>
                    <TableHead>Periodo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-center">Calificación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.evaluations.length > 0 ? (
                    student.evaluations.map((ev, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell>{ev.courseName}</TableCell>
                        <TableCell>{ev.competencyName}</TableCell>
                        <TableCell>{ev.period || '—'}</TableCell>
                        <TableCell>{ev.date || '—'}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="secondary"
                            className={`${getGradeColor(ev.grade)} font-semibold text-base px-3 py-1`}
                          >
                            {formatGrade(ev.grade)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                        Sin evaluaciones registradas.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* --- FOOTER --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
          <p className="text-sm text-gray-600">Actualizado al {currentDate}</p>
          <Button onClick={handleDownloadPDF} className="bg-[#28a745] hover:bg-[#218838]">
            <Download className="h-4 w-4 mr-2" />
            Descargar Boleta PDF
          </Button>
        </div>

        {/* --- LEYENDA --- */}
        <Card className="mt-8 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm text-gray-700">Escala de Calificación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <LegendBadge color="bg-green-100 text-green-800" label="A" text="Logro Destacado (18-20)" />
              <LegendBadge color="bg-blue-100 text-blue-800" label="B" text="Logro Esperado (14-17)" />
              <LegendBadge color="bg-red-100 text-red-800" label="C" text="En Proceso (0-13)" />
              <LegendBadge color="bg-gray-100 text-gray-500" label="-" text="No evaluado" />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// 🔹 Subcomponentes auxiliares
function InfoItem({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm text-gray-600 flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function LegendBadge({ color, label, text }: { color: string; label: string; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Badge className={color}>{label}</Badge>
      <span className="text-gray-600">{text}</span>
    </div>
  );
}
