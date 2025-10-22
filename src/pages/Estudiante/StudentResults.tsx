import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { ArrowLeft, Download, User, Calendar, GraduationCap, Hash } from 'lucide-react';

interface Course {
  name: string;
  note1: number | null;
  note2: number | null;
  note3: number | null;
  average: number | null;
}

interface Student {
  dni: string;
  name: string;
  code: string;
  grade: string;
  section: string;
  period: string;
  courses: Course[];
}

interface StudentResultsProps {
  student: Student;
  onBack: () => void;
}

export function StudentResults({ student, onBack }: StudentResultsProps) {
  const getGradeColor = (grade: number | null) => {
    if (grade === null) return 'bg-gray-100 text-gray-500';
    if (grade >= 18) return 'bg-green-100 text-green-800';
    if (grade >= 14) return 'bg-blue-100 text-blue-800';
    if (grade >= 11) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatGrade = (grade: number | null) => {
    return grade !== null ? grade.toString() : '-';
  };

  const handleDownloadPDF = () => {
    // Mock PDF download
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Boleta de calificaciones - Mock PDF');
    link.download = `boleta_${student.name.replace(/\s+/g, '_')}_${student.period}.pdf`;
    link.click();
  };

  const currentDate = new Date().toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      <main className="container mx-auto px-6 py-8">
        {/* Student Information */}
        <Card className="mb-8 shadow-sm">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-[#800020] flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Estudiante
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-semibold">{student.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  DNI
                </p>
                <p className="font-semibold">{student.dni}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Código</p>
                <p className="font-semibold">{student.code}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  Grado
                </p>
                <p className="font-semibold">{student.grade}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Sección</p>
                <p className="font-semibold">{student.section}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Periodo
                </p>
                <p className="font-semibold">{student.period}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grades Table */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-[#800020]">Calificaciones</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="font-semibold text-gray-700">Curso</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700">Nota 1</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700">Nota 2</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700">Nota 3</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700">Promedio Final</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.courses.map((course, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{course.name}</TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant="secondary" 
                          className={`${getGradeColor(course.note1)} font-semibold`}
                        >
                          {formatGrade(course.note1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant="secondary" 
                          className={`${getGradeColor(course.note2)} font-semibold`}
                        >
                          {formatGrade(course.note2)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant="secondary" 
                          className={`${getGradeColor(course.note3)} font-semibold`}
                        >
                          {formatGrade(course.note3)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant="secondary" 
                          className={`${getGradeColor(course.average)} font-semibold text-base px-3 py-1`}
                        >
                          {formatGrade(course.average)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Actions and Info */}
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

        {/* Grade Legend */}
        <Card className="mt-8 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm text-gray-700">Escala de Calificación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">18-20</Badge>
                <span className="text-gray-600">Excelente</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">14-17</Badge>
                <span className="text-gray-600">Bueno</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-100 text-yellow-800">11-13</Badge>
                <span className="text-gray-600">Regular</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800">0-10</Badge>
                <span className="text-gray-600">Deficiente</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}