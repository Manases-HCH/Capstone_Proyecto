import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Mail,
  Key
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin' | 'ai';
  status: 'Activo' | 'Inactivo' | 'Pendiente';
  lastAccess: string;
  createdAt: string;
  courses?: string[];
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Juan Carlos Mendoza Pérez',
      email: 'juan.mendoza@swiaape.edu.pe',
      role: 'teacher',
      status: 'Activo',
      lastAccess: '2024-01-15 10:30',
      createdAt: '2023-03-15',
      courses: ['Matemática 5to A', 'Álgebra 4to B']
    },
    {
      id: '2',
      name: 'María Elena García López',
      email: 'maria.garcia@swiaape.edu.pe',
      role: 'teacher',
      status: 'Activo',
      lastAccess: '2024-01-14 16:45',
      createdAt: '2023-02-20',
      courses: ['Comunicación 4to A', 'Literatura 5to A']
    },
    {
      id: '3',
      name: 'Carlos Alberto López Ruiz',
      email: 'carlos.lopez@swiaape.edu.pe',
      role: 'admin',
      status: 'Activo',
      lastAccess: '2024-01-15 09:15',
      createdAt: '2022-08-10'
    },
    {
      id: '4',
      name: 'Ana Patricia Rodríguez Silva',
      email: 'ana.rodriguez@swiaape.edu.pe',
      role: 'teacher',
      status: 'Inactivo',
      lastAccess: '2024-01-10 14:20',
      createdAt: '2023-09-05',
      courses: ['Ciencias 3ro A']
    },
    {
      id: '5',
      name: 'Luis Fernando Torres Vega',
      email: 'luis.torres@swiaape.edu.pe',
      role: 'ai',
      status: 'Activo',
      lastAccess: '2024-01-15 08:00',
      createdAt: '2023-11-12'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'teacher',
    tempPassword: ''
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      case 'ai': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'teacher': return 'Docente';
      case 'student': return 'Estudiante';
      case 'ai': return 'Equipo IA';
      default: return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo': return 'bg-green-100 text-green-800';
      case 'Inactivo': return 'bg-red-100 text-red-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Activo': return <CheckCircle className="h-4 w-4" />;
      case 'Inactivo': return <XCircle className="h-4 w-4" />;
      case 'Pendiente': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.tempPassword) return;

    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as any,
      status: 'Pendiente',
      lastAccess: 'Nunca',
      createdAt: new Date().toISOString().split('T')[0],
      courses: newUser.role === 'teacher' ? [] : undefined
    };

    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'teacher', tempPassword: '' });
    setIsAddingUser(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    setEditingUser(null);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Activo' ? 'Inactivo' : 'Activo' as const }
        : user
    ));
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#800020] flex items-center gap-2">
            <Users className="h-6 w-6" />
            Gestión de Usuarios
          </h2>
          <p className="text-gray-600">Administra usuarios del sistema SWIAAPE</p>
        </div>
        
        <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
          <DialogTrigger asChild>
            <Button className="bg-[#28a745] hover:bg-[#218838]">
              <UserPlus className="h-4 w-4 mr-2" />
              Agregar Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Ej: Juan Carlos Pérez López"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Correo Institucional</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="usuario@swiaape.edu.pe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Docente</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="ai">Equipo IA</SelectItem>
                    <SelectItem value="student">Estudiante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tempPassword">Contraseña Temporal</Label>
                <Input
                  id="tempPassword"
                  type="password"
                  value={newUser.tempPassword}
                  onChange={(e) => setNewUser({...newUser, tempPassword: e.target.value})}
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  El usuario deberá cambiar su contraseña en el primer acceso.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingUser(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="bg-[#28a745] hover:bg-[#218838]"
                  onClick={handleAddUser}
                  disabled={!newUser.name || !newUser.email || !newUser.tempPassword}
                >
                  Crear Usuario
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="teacher">Docente</SelectItem>
                  <SelectItem value="ai">Equipo IA</SelectItem>
                  <SelectItem value="student">Estudiante</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#800020]">
              {users.filter(u => u.status === 'Activo').length}
            </div>
            <div className="text-sm text-gray-600">Usuarios Activos</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#800020]">
              {users.filter(u => u.role === 'teacher').length}
            </div>
            <div className="text-sm text-gray-600">Docentes</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#800020]">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-sm text-gray-600">Administradores</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#800020]">
              {users.filter(u => u.status === 'Pendiente').length}
            </div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Usuarios ({filteredUsers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead>Último Acceso</TableHead>
                  <TableHead>Cursos Asignados</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleName(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getStatusColor(user.status)} variant="secondary">
                        <span className="flex items-center gap-1">
                          {getStatusIcon(user.status)}
                          {user.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {user.lastAccess}
                    </TableCell>
                    <TableCell className="text-sm">
                      {user.courses ? (
                        <div className="space-y-1">
                          {user.courses.slice(0, 2).map((course, idx) => (
                            <div key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {course}
                            </div>
                          ))}
                          {user.courses.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{user.courses.length - 2} más...
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Usuario</DialogTitle>
                            </DialogHeader>
                            {editingUser && (
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Nombre</Label>
                                  <Input
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>Email</Label>
                                  <Input
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>Rol</Label>
                                  <Select 
                                    value={editingUser.role} 
                                    onValueChange={(value) => setEditingUser({...editingUser, role: value as any})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="teacher">Docente</SelectItem>
                                      <SelectItem value="admin">Administrador</SelectItem>
                                      <SelectItem value="ai">Equipo IA</SelectItem>
                                      <SelectItem value="student">Estudiante</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setEditingUser(null)}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button 
                                    className="bg-[#007bff] hover:bg-[#0056b3]"
                                    onClick={handleUpdateUser}
                                  >
                                    Actualizar
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleToggleStatus(user.id)}
                          className={user.status === 'Activo' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                        >
                          {user.status === 'Activo' ? <XCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Password Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#800020] flex items-center gap-2">
            <Key className="h-5 w-5" />
            Políticas de Contraseñas y Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Requisitos de Contraseña</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Mínimo 8 caracteres</li>
                <li>• Al menos una mayúscula</li>
                <li>• Al menos un número</li>
                <li>• Al menos un carácter especial</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Políticas de Seguridad</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Contraseñas expiran cada 90 días</li>
                <li>• MFA requerido para administradores</li>
                <li>• Bloqueo después de 5 intentos fallidos</li>
                <li>• Sesión expira después de 8 horas</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}