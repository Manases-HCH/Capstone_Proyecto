import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Alert, AlertDescription } from './components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { 
  GraduationCap, 
  Users, 
  Settings, 
  BookOpen, 
  BarChart3, 
  Brain,
  Search,
  LogIn,
  Download,
  School,
  Plus,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import { AIStudyPlans } from './pages/Docente/AIStudyPlans';
import { LandingPage } from './pages/Login/LandingPage';
import { StudentResults } from './pages/Estudiante/StudentResults';
import { TeacherPanel } from './pages/Docente/TeacherPanel';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { UserManagement } from './pages/Admin/UserManagement';
import { PasswordRecovery } from './pages/Login/PasswordRecovery';

// Types
interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  name: string;
}

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

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'student-results' | 'teacher' | 'admin' | 'password-recovery' | 'password-reset'>('landing');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchedStudent, setSearchedStudent] = useState<Student | null>(null);

  const handleLogin = async (email: string, password: string) => {
  try {
    const resp = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo: email,
        password: password,
      }),
    });

    if (!resp.ok) {
      const errorData = await resp.json();
      alert(errorData.detail || "Credenciales incorrectas");
      return;
    }

    const data = await resp.json();

    // ✅ Guarda los datos del usuario logueado
    setCurrentUser({
      id: data.idUsuario,
      email: data.correo,
      role:
        data.rol.toLowerCase() === "docente"
          ? "teacher"
          : data.rol.toLowerCase() === "admin"
          ? "admin"
          : "student",
      name: data.nombre,
    });

    // ✅ Redirección según rol
    if (data.rol.toLowerCase() === "docente") {
      setCurrentView("teacher");
    } else if (data.rol.toLowerCase() === "admin") {
      setCurrentView("admin");
    } else {
      setCurrentView("student-results");
    }
  } catch (error) {
    console.error("Error al conectar con el backend:", error);
    alert("Error de conexión con el servidor");
  }
};


  const handleDNISearch = async (dni: string) => {
  try {
    const resp = await fetch(`http://localhost:8000/estudiantes/by-dni/${dni}`);
    if (resp.status === 404) {
      alert("DNI no encontrado");
      return false;
    }
    const data = await resp.json();

    setSearchedStudent({
      dni: data.dni,
      name: data.name,
      code: data.code,
      grade: data.grade,
      section: data.section,
      period: data.period,
      evaluations: data.evaluations, // <-- viene directamente del backend
    });

    setCurrentView('student-results');
    return true;
  } catch (err) {
    console.error("Error consultando backend:", err);
    alert("Error al conectar con el servidor.");
    return false;
  }
};


  const handleLogout = () => {
    setCurrentUser(null);
    setSearchedStudent(null);
    setCurrentView('landing');
  };

  const handleBackToLanding = () => {
    setSearchedStudent(null);
    setResetToken(null);
    setCurrentView('landing');
  };

  const handleForgotPassword = () => {
    setCurrentView('password-recovery');
  };

  const handlePasswordReset = (token: string) => {
    setResetToken(token);
    setCurrentView('password-reset');
  };

  const handleShowPasswordReset = () => {
    setResetToken('demo-token-123');
    setCurrentView('password-reset');
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {currentView === 'landing' && (
        <LandingPage 
          onLogin={handleLogin}
          onDNISearch={handleDNISearch}
          onForgotPassword={handleForgotPassword}
        />
      )}

      {currentView === 'student-results' && searchedStudent && (
        <StudentResults 
          student={searchedStudent}
          onBack={handleBackToLanding}
        />
      )}

      {currentView === 'teacher' && currentUser && (
        <TeacherPanel 
          user={currentUser}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'admin' && currentUser && (
        <AdminDashboard 
          user={currentUser}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'password-recovery' && (
        <PasswordRecovery 
          onBack={handleBackToLanding}
          mode="request"
          onShowReset={handleShowPasswordReset}
        />
      )}

      {currentView === 'password-reset' && (
        <PasswordRecovery 
          onBack={handleBackToLanding}
          mode="reset"
          resetToken={resetToken || undefined}
        />
      )}
    </div>
  );
}

export default App;
