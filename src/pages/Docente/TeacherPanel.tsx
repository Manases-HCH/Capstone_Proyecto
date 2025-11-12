import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
  BookOpen,
  BarChart3,
  Brain,
  User,
  LogOut,
  GraduationCap,
  Edit,
  Save,
  FileText,
} from "lucide-react";
import { AIStudyPlans } from "./AIStudyPlans";

interface User {
  id: string;
  email: string;
  role: "student" | "teacher" | "admin";
  name: string;
}

interface TeacherPanelProps {
  user: User;
  onLogout: () => void;
}

interface Student {
  id: string;
  name: string;
  dni: string;
  note1?: number | null;
  note2?: number | null;
  note3?: number | null;
  average: number | null;
}

interface Course {
  id: string;
  name: string;
  grade: string;
  section: string;
  status: "Abierto" | "Cerrado";
  students: Student[];
}

export function TeacherPanel({ user, onLogout }: TeacherPanelProps) {
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editingGrades, setEditingGrades] = useState(false);
  const [grades, setGrades] = useState<{ [key: string]: { note1: string; note2: string; note3: string } }>({});

  // ========================
  // 🔹 Cargar cursos desde la BD
  // ========================
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/docente/cursos/${user.id}`);
        setCourses(response.data);
      } catch (error) {
        console.error("Error al obtener cursos:", error);
      }
    };
    fetchCourses();
  }, [user.id]);

  // ========================
  // 🔹 Manejar edición de notas
  // ========================
  const handleEditGrades = (course: Course) => {
    setSelectedCourse(course);
    setEditingGrades(true);

    const initialGrades: { [key: string]: { note1: string; note2: string; note3: string } } = {};
    course.students.forEach((student) => {
      initialGrades[student.id] = {
        note1: student.note1?.toString() || "",
        note2: student.note2?.toString() || "",
        note3: student.note3?.toString() || "",
      };
    });
    setGrades(initialGrades);
  };

  const handleGradeChange = (studentId: string, field: "note1" | "note2" | "note3", value: string) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  // ========================
  // 🔹 Guardar notas en BD
  // ========================
  const handleSaveGrades = async () => {
    if (!selectedCourse) return;

    try {
      const registros = selectedCourse.students.map((student) => ({
        idEstudiante: Number(student.id),
        idCurso: Number(selectedCourse.id),
        nota1: grades[student.id]?.note1 ? Number(grades[student.id].note1) : null,
        nota2: grades[student.id]?.note2 ? Number(grades[student.id].note2) : null,
        nota3: grades[student.id]?.note3 ? Number(grades[student.id].note3) : null,
      }));

      await axios.post("http://127.0.0.1:8000/docente/actualizar-notas", registros);

      alert("✅ Notas actualizadas correctamente");
      setEditingGrades(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error("Error al guardar notas:", error);
      alert("❌ Error al guardar notas. Ver consola.");
    }
  };

  const getGradeColor = (grade: number | null) => {
    if (grade === null) return "bg-gray-100 text-gray-500";
    if (grade >= 18) return "bg-green-100 text-green-800";
    if (grade >= 14) return "bg-blue-100 text-blue-800";
    if (grade >= 11) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#800020] text-white py-4 shadow-lg">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <GraduationCap className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-semibold">Panel Docente - SWIAAPE</h1>
              <p className="text-white/90">Bienvenido, {user.name}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onLogout} className="text-white hover:bg-white/10">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Mis Cursos
            </TabsTrigger>
            <TabsTrigger value="grades" className="flex items-center gap-2">
              <Edit className="h-4 w-4" /> Registrar Notas
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Reportes
            </TabsTrigger>
            <TabsTrigger value="ai-plans" className="flex items-center gap-2">
              <Brain className="h-4 w-4" /> Planes de Estudio IA
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Perfil
            </TabsTrigger>
          </TabsList>

          {/* Mis Cursos */}
          <TabsContent value="courses" className="space-y-6">
            {courses.length === 0 ? (
              <p className="text-center text-gray-500">No hay cursos asignados.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card key={course.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between">
                        <CardTitle className="text-[#800020]">{course.name}</CardTitle>
                        <Badge
                          variant={course.status === "Abierto" ? "default" : "secondary"}
                          className={course.status === "Abierto" ? "bg-green-100 text-green-800" : ""}
                        >
                          {course.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-gray-700">
                      <p><strong>Grado:</strong> {course.grade}</p>
                      <p><strong>Sección:</strong> {course.section}</p>
                      <p><strong>Estudiantes:</strong> {course.students.length}</p>
                      <Button
                        size="sm"
                        className="bg-[#007bff] hover:bg-[#0056b3]"
                        onClick={() => handleEditGrades(course)}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Registrar Notas
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Registrar Notas */}
          <TabsContent value="grades">
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
                        {selectedCourse.students.map((student) => {
                          const s = grades[student.id] || { note1: "", note2: "", note3: "" };
                          const n1 = parseFloat(s.note1) || null;
                          const n2 = parseFloat(s.note2) || null;
                          const n3 = parseFloat(s.note3) || null;
                          const avg = n1 && n2 && n3 ? Math.round((n1 + n2 + n3) / 3) : null;

                          return (
                            <TableRow key={student.id}>
                              <TableCell>{student.name}</TableCell>
                              <TableCell>{student.dni}</TableCell>
                              {["note1", "note2", "note3"].map((field) => (
                                <TableCell key={field} className="text-center">
                                  <Input
                                    type="number"
                                    min="0"
                                    max="20"
                                    value={s[field as "note1" | "note2" | "note3"]}
                                    onChange={(e) => handleGradeChange(student.id, field as any, e.target.value)}
                                    className="w-16 text-center"
                                  />
                                </TableCell>
                              ))}
                              <TableCell className="text-center">
                                <Badge variant="secondary" className={getGradeColor(avg)}>
                                  {avg || "-"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="p-6 flex justify-end gap-3 bg-gray-50">
                    <Button variant="outline" onClick={() => setEditingGrades(false)}>
                      Cancelar
                    </Button>
                    <Button className="bg-[#007bff] hover:bg-[#0056b3]" onClick={handleSaveGrades}>
                      <Save className="h-4 w-4 mr-2" /> Guardar Cambios
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Edit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Selecciona un curso</h3>
                  <p className="text-gray-600">
                    Ve a "Mis Cursos" y selecciona "Registrar Notas".
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* IA y Perfil */}
          <TabsContent value="ai-plans">
            <AIStudyPlans />
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#800020]">Mi Perfil</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <Input value={user.name} readOnly />
                <Input value={user.email} readOnly />
                <Input value="Docente" readOnly />
                <Input value={courses.length.toString()} readOnly />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
