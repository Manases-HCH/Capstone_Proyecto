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
import { AIStudyPlans } from './components/AIStudyPlans';
import { LandingPage } from './components/LandingPage';
import { StudentResults } from './components/StudentResults';
import { TeacherPanel } from './components/TeacherPanel';
import { AdminDashboard } from './components/AdminDashboard';
import { UserManagement } from './components/UserManagement';
import { PasswordRecovery } from './components/PasswordRecovery';

// Types
interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  name: string;
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

interface Course {
  name: string;
  note1: number | null;
  note2: number | null;
  note3: number | null;
  average: number | null;
}

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'student-results' | 'teacher' | 'admin' | 'password-recovery' | 'password-reset'>('landing');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchedStudent, setSearchedStudent] = useState<Student | null>(null);

  // Mock data
  const mockStudents: Student[] = [
    {
      dni: '12345678',
      name: 'Ana María García López',
      code: 'EST2024001',
      grade: '5to Grado',
      section: 'A',
      period: '2024-I',
      courses: [
        { name: 'Matemática', note1: 18, note2: 16, note3: 17, average: 17 },
        { name: 'Comunicación', note1: 15, note2: 17, note3: 16, average: 16 },
        { name: 'Ciencias', note1: 19, note2: 18, note3: 19, average: 19 },
        { name: 'Historia', note1: 16, note2: 15, note3: 17, average: 16 },
        { name: 'Arte', note1: 20, note2: 18, note3: 19, average: 19 }
      ]
    }
  ];

  const handleLogin = (email: string, password: string) => {
    // Mock authentication
    if (email === 'docente@swiaape.edu.pe') {
      setCurrentUser({
        id: '1',
        email: email,
        role: 'teacher',
        name: 'Prof. Juan Carlos Mendoza'
      });
      setCurrentView('teacher');
    } else if (email === 'admin@swiaape.edu.pe') {
      setCurrentUser({
        id: '2',
        email: email,
        role: 'admin',
        name: 'María Elena Vásquez'
      });
      setCurrentView('admin');
    }
  };

  const handleDNISearch = (dni: string) => {
    const student = mockStudents.find(s => s.dni === dni);
    if (student) {
      setSearchedStudent(student);
      setCurrentView('student-results');
    }
    return !!student;
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