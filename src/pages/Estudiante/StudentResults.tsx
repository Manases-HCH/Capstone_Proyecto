import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { ArrowLeft, Download, User, Calendar, GraduationCap, Hash } from 'lucide-react';

// --- INTERFAZ ---
// Debe coincidir con la estructura que devuelve tu backend (FastAPI)
interface Evaluation {
  courseName: string;
  competencyName: string;
  grade: string | null;
  period: string | null;
}

interface Student {
  dni: string;
  name: string;
  code: string;
  grade: string;
  section: string;
  period: string;
  evaluations: Evaluation[];
}

interface StudentResultsProps {
  student: Student;
  onBack: () => void;
}

export function StudentResults({ student, onBack }: StudentResultsProps) {
  const getGradeColor = (grade: string | null) => {
    if (grade === null) return 'bg-gray-100 text-gray-500';
    if (grade === 'A') return 'bg-green-100 text-green-800';
    if (grade === 'B') return 'bg-blue-100 text-blue-800';
    if (grade === 'C') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-500';
  };

  const formatGrade = (grade: string | null) => {
    return grade !== null ? grade : '-';
  };

  const handleDownloadPDF = () => {
    alert("Iniciando descarga de PDF (simulación)...");
  };

  const currentDate = new Date().toLocaleDateString('es-PE', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- HEADER --- */}
      <header className="bg-[#800020] text-white py-4 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <h1 className="text-xl font-semibold">Consulta de Calificaciones</h1>
            </div>
          </div>
        </div>
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="container mx-auto px-6 py-8">
        {/* --- INFO DEL ESTUDIANTE --- */}
        <Card className="mb-8 shadow-sm">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-[#800020] flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Estudiante
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-semibold">{student.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Hash className="h-3 w-3" /> DNI
                </p>
                <p className="font-semibold">{student.dni}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Código</p>
                <p className="font-semibold">{student.code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" /> Grado
                </p>
                <p className="font-semibold">{student.grade}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sección</p>
                <p className="font-semibold">{student.section}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Periodo
                </p>
                <p className="font-semibold">{student.period}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- TABLA DE EVALUACIONES --- */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-[#800020]">Reporte de Evaluaciones</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="font-semibold text-gray-700">Curso</TableHead>
                    <TableHead className="font-semibold text-gray-700">Competencia</TableHead>
                    <TableHead className="font-semibold text-gray-700">Periodo</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700">Calificación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.evaluations.map((ev, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell>{ev.courseName}</TableCell>
                      <TableCell>{ev.competencyName}</TableCell>
                      <TableCell>{ev.period || 'Bimestre 1'}</TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant="secondary" 
                          className={`${getGradeColor(ev.grade)} font-semibold text-base px-3 py-1`}
                        >
                          {formatGrade(ev.grade)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* --- FOOTER --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-gray-600">
            <p>Actualizado al {currentDate}</p>
          </div>
          <Button 
            onClick={handleDownloadPDF}
            className="bg-[#28a745] hover:bg-[#218838]"
          >
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
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">A</Badge>
                <span className="text-gray-600">Logro Destacado (18-20)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">B</Badge>
                <span className="text-gray-600">Logro Esperado (14-17)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800">C</Badge>
                <span className="text-gray-600">En Proceso (0-13)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-gray-100 text-gray-500">-</Badge>
                <span className="text-gray-600">No evaluado</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
