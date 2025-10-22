import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Brain, 
  User, 
  LogOut,
  GraduationCap,
  Edit,
  Save,
  Eye,
  FileText,
  Plus,
  Calendar
} from 'lucide-react';
import { AIStudyPlans } from './AIStudyPlans';

interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  name: string;
}

interface TeacherPanelProps {
  user: User;
  onLogout: () => void;
}

interface Course {
  id: string;
  name: string;
  grade: string;
  section: string;
  status: 'Abierto' | 'Cerrado';
  students: Student[];
}

interface Student {
  id: string;
  name: string;
  dni: string;
  note1: number | null;
  note2: number | null;
  note3: number | null;
  average: number | null;
}

export function TeacherPanel({ user, onLogout }: TeacherPanelProps) {
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editingGrades, setEditingGrades] = useState(false);
  const [grades, setGrades] = useState<{[key: string]: {note1: string, note2: string, note3: string}}>({});

  // Mock data
  const mockCourses: Course[] = [
    {
      id: '1',
      name: 'Matemática',
      grade: '5to Grado',
      section: 'A',
      status: 'Abierto',
      students: [
        { id: '1', name: 'Ana García López', dni: '12345678', note1: 18, note2: 16, note3: 17, average: 17 },
        { id: '2', name: 'Carlos Mendoza Ruiz', dni: '87654321', note1: 15, note2: 14, note3: 16, average: 15 },
        { id: '3', name: 'María Elena Santos', dni: '11223344', note1: 19, note2: 18, note3: 20, average: 19 }
      ]
    },
    {
      id: '2',
      name: 'Álgebra',
      grade: '4to Grado',
      section: 'B',
      status: 'Cerrado',
      students: [
        { id: '4', name: 'Luis Torres Vega', dni: '44556677', note1: 16, note2: 17, note3: 15, average: 16 },
        { id: '5', name: 'Sandra López Cruz', dni: '88990011', note1: 14, note2: 15, note3: 14, average: 14 }
      ]
    }
  ];

  const [courses, setCourses] = useState(mockCourses);

  const handleEditGrades = (course: Course) => {
    setSelectedCourse(course);
    setEditingGrades(true);
    
    // Initialize grades state
    const initialGrades: {[key: string]: {note1: string, note2: string, note3: string}} = {};
    course.students.forEach(student => {
      initialGrades[student.id] = {
        note1: student.note1?.toString() || '',
        note2: student.note2?.toString() || '',
        note3: student.note3?.toString() || ''
      };
    });
    setGrades(initialGrades);
  };

  const handleGradeChange = (studentId: string, field: 'note1' | 'note2' | 'note3', value: string) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSaveGrades = () => {
    if (!selectedCourse) return;

    // Update courses with new grades
    const updatedCourses = courses.map(course => {
      if (course.id === selectedCourse.id) {
        const updatedStudents = course.students.map(student => {
          const studentGrades = grades[student.id];
          if (studentGrades) {
            const note1 = parseFloat(studentGrades.note1) || null;
            const note2 = parseFloat(studentGrades.note2) || null;
            const note3 = parseFloat(studentGrades.note3) || null;
            const average = note1 && note2 && note3 ? Math.round((note1 + note2 + note3) / 3) : null;
            
            return {
              ...student,
              note1,
              note2,
              note3,
              average
            };
          }
          return student;
        });
        return { ...course, students: updatedStudents };
      }
      return course;
    });

    setCourses(updatedCourses);
    setEditingGrades(false);
    setSelectedCourse(null);
  };

  const getGradeColor = (grade: number | null) => {
    if (grade === null) return 'bg-gray-100 text-gray-500';
    if (grade >= 18) return 'bg-green-100 text-green-800';
    if (grade >= 14) return 'bg-blue-100 text-blue-800';
    if (grade >= 11) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#800020] text-white py-4 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GraduationCap className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-semibold">Panel Docente - SWIAAPE</h1>
                <p className="text-white/90">Bienvenido, {user.name}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onLogout}
              className="text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Mis Cursos
            </TabsTrigger>
            <TabsTrigger value="grades" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Registrar Notas
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Reportes
            </TabsTrigger>
            <TabsTrigger value="ai-plans" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Planes de Estudio IA
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
          </TabsList>

          {/* Mis Cursos */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <Card key={course.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-[#800020]">{course.name}</CardTitle>
                      <Badge 
                        variant={course.status === 'Abierto' ? 'default' : 'secondary'}
                        className={course.status === 'Abierto' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {course.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Grado:</strong> {course.grade}</p>
                      <p><strong>Sección:</strong> {course.section}</p>
                      <p><strong>Estudiantes:</strong> {course.students.length}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button 
                        size="sm" 
                        className="bg-[#007bff] hover:bg-[#0056b3]"
                        onClick={() => handleEditGrades(course)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Registrar Notas
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setActiveTab('ai-plans')}
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        Ver Plan IA
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Registrar Notas */}
          <TabsContent value="grades" className="space-y-6">
            {editingGrades && selectedCourse ? (
              <Card>
                <CardHeader className="bg-gray-50">
                  <CardTitle className="text-[#800020]">
                    Registrar Notas - {selectedCourse.name} ({selectedCourse.grade} - {selectedCourse.section})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-100">
                          <TableHead>Estudiante</TableHead>
                          <TableHead>DNI</TableHead>
                          <TableHead className="text-center">Nota 1</TableHead>
                          <TableHead className="text-center">Nota 2</TableHead>
                          <TableHead className="text-center">Nota 3</TableHead>
                          <TableHead className="text-center">Promedio</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCourse.students.map(student => {
                          const studentGrades = grades[student.id] || { note1: '', note2: '', note3: '' };
                          const note1 = parseFloat(studentGrades.note1) || null;
                          const note2 = parseFloat(studentGrades.note2) || null;
                          const note3 = parseFloat(studentGrades.note3) || null;
                          const average = note1 && note2 && note3 ? Math.round((note1 + note2 + note3) / 3) : null;

                          return (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">{student.name}</TableCell>
                              <TableCell>{student.dni}</TableCell>
                              <TableCell className="text-center">
                                <Input
                                  type="number"
                                  min="0"
                                  max="20"
                                  value={studentGrades.note1}
                                  onChange={(e) => handleGradeChange(student.id, 'note1', e.target.value)}
                                  className="w-16 text-center"
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Input
                                  type="number"
                                  min="0"
                                  max="20"
                                  value={studentGrades.note2}
                                  onChange={(e) => handleGradeChange(student.id, 'note2', e.target.value)}
                                  className="w-16 text-center"
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Input
                                  type="number"
                                  min="0"
                                  max="20"
                                  value={studentGrades.note3}
                                  onChange={(e) => handleGradeChange(student.id, 'note3', e.target.value)}
                                  className="w-16 text-center"
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge 
                                  variant="secondary"
                                  className={getGradeColor(average)}
                                >
                                  {average || '-'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="p-6 bg-gray-50 flex justify-end gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingGrades(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      className="bg-[#007bff] hover:bg-[#0056b3]"
                      onClick={handleSaveGrades}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Edit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona un curso</h3>
                  <p className="text-gray-600">Ve a "Mis Cursos" y selecciona "Registrar Notas" en el curso que deseas editar.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reportes */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#800020]">Generar Reportes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Curso</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Todos los cursos</option>
                      {courses.map(course => (
                        <option key={course.id}>{course.name} - {course.grade}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Período</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>2024-I</option>
                      <option>2023-II</option>
                      <option>2023-I</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-[#28a745] hover:bg-[#218838]">
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Planes de Estudio IA */}
          <TabsContent value="ai-plans" className="space-y-6">
            <AIStudyPlans />
          </TabsContent>

          {/* Perfil */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#800020]">Mi Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre Completo</label>
                    <Input value={user.name} readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Correo Electrónico</label>
                    <Input value={user.email} readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rol</label>
                    <Input value="Docente" readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cursos Asignados</label>
                    <Input value={courses.length.toString()} readOnly />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="bg-[#007bff] hover:bg-[#0056b3]">
                    Actualizar Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}