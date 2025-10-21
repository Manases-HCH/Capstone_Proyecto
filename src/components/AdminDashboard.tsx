import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Brain, 
  LogOut,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  Database,
  Calendar,
  GraduationCap,
  BookOpen,
  Clock
} from 'lucide-react';
import { UserManagement } from './UserManagement';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  name: string;
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for dashboard
  const kpiData = {
    gradeLoadingProgress: 78,
    aiPlansApproved: 85,
    averageAttendance: 92,
    totalStudents: 1250,
    totalTeachers: 45,
    totalCourses: 120
  };

  const courseAveragesData = [
    { name: 'Matemática', average: 16.2 },
    { name: 'Comunicación', average: 15.8 },
    { name: 'Ciencias', average: 17.1 },
    { name: 'Historia', average: 15.5 },
    { name: 'Arte', average: 18.3 },
    { name: 'Educación Física', average: 17.9 }
  ];

  const aiPlansStatusData = [
    { name: 'Aprobados', value: 42, color: '#28a745' },
    { name: 'En Revisión', value: 18, color: '#007bff' },
    { name: 'Pendientes', value: 12, color: '#ffc107' },
    { name: 'Rechazados', value: 3, color: '#dc3545' }
  ];

  const monthlyProgressData = [
    { month: 'Ene', aiApproval: 65, gradeCompletion: 45 },
    { month: 'Feb', aiApproval: 72, gradeCompletion: 58 },
    { month: 'Mar', aiApproval: 78, gradeCompletion: 67 },
    { month: 'Abr', aiApproval: 85, gradeCompletion: 78 },
    { month: 'May', aiApproval: 88, gradeCompletion: 85 }
  ];

  const mockUsers = [
    { id: '1', name: 'Juan Pérez', email: 'juan.perez@swiaape.edu.pe', role: 'teacher', status: 'Activo', lastAccess: '2024-01-15 10:30' },
    { id: '2', name: 'María García', email: 'maria.garcia@swiaape.edu.pe', role: 'teacher', status: 'Activo', lastAccess: '2024-01-14 16:45' },
    { id: '3', name: 'Carlos López', email: 'carlos.lopez@swiaape.edu.pe', role: 'admin', status: 'Activo', lastAccess: '2024-01-15 09:15' },
    { id: '4', name: 'Ana Rodríguez', email: 'ana.rodriguez@swiaape.edu.pe', role: 'teacher', status: 'Inactivo', lastAccess: '2024-01-10 14:20' }
  ];

  const alerts = [
    { id: '1', type: 'warning', message: 'Curso "Álgebra 4to A" tiene promedio bajo (12.3)', course: 'Álgebra' },
    { id: '2', type: 'info', message: '5 planes IA pendientes de revisión por más de 7 días', course: null },
    { id: '3', type: 'success', message: 'Carga de notas completada al 95% este mes', course: null }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'teacher': return 'Docente';
      case 'student': return 'Estudiante';
      default: return role;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#800020] text-white py-4 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-semibold">Panel Administrativo - SWIAAPE</h1>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="ai-config" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Configuración IA
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Carga de Notas</p>
                      <p className="text-2xl font-semibold text-[#800020]">{kpiData.gradeLoadingProgress}%</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-[#800020]" />
                  </div>
                  <Progress value={kpiData.gradeLoadingProgress} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Planes IA Aprobados</p>
                      <p className="text-2xl font-semibold text-[#800020]">{kpiData.aiPlansApproved}%</p>
                    </div>
                    <Brain className="h-8 w-8 text-[#800020]" />
                  </div>
                  <Progress value={kpiData.aiPlansApproved} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Asistencia Promedio</p>
                      <p className="text-2xl font-semibold text-[#800020]">{kpiData.averageAttendance}%</p>
                    </div>
                    <Calendar className="h-8 w-8 text-[#800020]" />
                  </div>
                  <Progress value={kpiData.averageAttendance} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Estudiantes</p>
                      <p className="text-2xl font-semibold text-[#800020]">{kpiData.totalStudents}</p>
                    </div>
                    <GraduationCap className="h-8 w-8 text-[#800020]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Course Averages */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#800020]">Promedios por Curso</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={courseAveragesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 20]} />
                      <Tooltip />
                      <Bar dataKey="average" fill="#800020" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* AI Plans Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#800020]">Estado de Planes IA</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={aiPlansStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {aiPlansStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#800020]">Evolución Mensual</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="aiApproval" stroke="#007bff" strokeWidth={2} name="Aprobación IA %" />
                    <Line type="monotone" dataKey="gradeCompletion" stroke="#28a745" strokeWidth={2} name="Carga de Notas %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#800020]">Alertas del Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map(alert => (
                    <div key={alert.id} className="flex items-start gap-3 p-4 border rounded-lg">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{alert.message}</p>
                        {alert.course && (
                          <Badge variant="secondary" className="mt-1">
                            {alert.course}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#800020]">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button className="h-20 flex-col bg-[#28a745] hover:bg-[#218838]">
                    <UserPlus className="h-6 w-6 mb-2" />
                    Agregar Usuario
                  </Button>
                  <Button className="h-20 flex-col bg-[#007bff] hover:bg-[#0056b3]">
                    <Brain className="h-6 w-6 mb-2" />
                    Configurar IA
                  </Button>
                  <Button className="h-20 flex-col bg-[#800020] hover:bg-[#600018]">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    Exportar Reportes
                  </Button>
                  <Button className="h-20 flex-col bg-[#6f42c1] hover:bg-[#5a2d91]">
                    <Database className="h-6 w-6 mb-2" />
                    Backup Datos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          {/* AI Configuration */}
          <TabsContent value="ai-config" className="space-y-6">
            <div className="grid gap-6">
              {/* Datasets */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#800020]">Datasets Vinculados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold">Notas Históricas</h4>
                      <p className="text-sm text-gray-600">Últimos 3 años</p>
                      <Badge className="mt-2 bg-green-100 text-green-800">Activo</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold">Asistencia</h4>
                      <p className="text-sm text-gray-600">Registro completo</p>
                      <Badge className="mt-2 bg-green-100 text-green-800">Activo</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold">Calendarios</h4>
                      <p className="text-sm text-gray-600">Planificación académica</p>
                      <Badge className="mt-2 bg-green-100 text-green-800">Activo</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Training */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#800020]">Entrenamientos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Entrenamiento Semanal</h4>
                      <p className="text-sm text-gray-600">Cada domingo a las 02:00</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Programado</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Logs de Entrenamiento</h4>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono">
                      <p>[2024-01-14 02:00] Iniciando entrenamiento...</p>
                      <p>[2024-01-14 02:15] Procesando 50,000 registros</p>
                      <p>[2024-01-14 02:45] Entrenamiento completado - Precisión: 87.3%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Models */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#800020]">Modelos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">Modelo Activo v2.1</h4>
                        <p className="text-sm text-gray-600">Random Forest - Precisión: 87.3%</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">En Uso</Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium">MAE (Error Absoluto)</p>
                        <p className="text-2xl font-semibold text-[#800020]">1.2</p>
                      </div>
                      <div>
                        <p className="font-medium">MAPE (Error Porcentual)</p>
                        <p className="text-2xl font-semibold text-[#800020]">8.5%</p>
                      </div>
                      <div>
                        <p className="font-medium">F1 Score</p>
                        <p className="text-2xl font-semibold text-[#800020]">0.89</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#800020]">Configuración de Privacidad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Anonimización de DNI</h4>
                      <p className="text-sm text-gray-600">Los DNI se hashean antes del entrenamiento</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Habilitado</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Retención de Datos</h4>
                      <p className="text-sm text-gray-600">Los datos se eliminan después de 5 años</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Configurado</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#800020]">Configuración General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Configuración de Sistema</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nombre de la Institución</label>
                      <input 
                        type="text" 
                        value="SWIAAPE" 
                        className="w-full p-2 border rounded-md"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Año Académico Actual</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>2024</option>
                        <option>2023</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Políticas de Seguridad</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Autenticación de dos factores</span>
                      <Badge className="bg-green-100 text-green-800">Habilitado</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Expiración de contraseñas</span>
                      <Badge className="bg-blue-100 text-blue-800">90 días</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="bg-[#007bff] hover:bg-[#0056b3]">
                    Guardar Cambios
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