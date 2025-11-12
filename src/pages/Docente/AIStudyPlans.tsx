import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { AIChatModal } from "./AIChatModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { 
  Brain, 
  Eye, 
  Edit, 
  Check, 
  X, 
  RefreshCw, 
  Download, 
  Clock,
  TrendingUp, 
  BookOpen,
  Target,
  Users,
  Calendar,
  HelpCircle,
  Settings,
  Send
} from 'lucide-react';


interface StudyPlan {
  id: string;
  name: string;
  course: string;
  grade: string;
  version: string;
  generationDate: string;
  accuracy: number;
  status: 'Borrador IA' | 'En revisión' | 'Aprobado' | 'Publicado';
  objectives: string[];
  competencies: string[];
  units: Unit[];
  estimatedHours: number;
  materials: string[];
}

interface Unit {
  id: string;
  name: string;
  duration: number;
  sessions: Session[];
  resources: string[];
}

interface Session {
  id: string;
  name: string;
  duration: number;
  activities: string[];
}

export function AIStudyPlans() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  // Mock data
  const mockPlans: StudyPlan[] = [
    {
      id: '1',
      name: 'Plan de Matemática 5to A - V2.1',
      course: 'Matemática',
      grade: '5to Grado A',
      version: '2.1',
      generationDate: '2024-01-10',
      accuracy: 87.3,
      status: 'En revisión',
      objectives: [
        'Resolver problemas de fracciones complejas',
        'Aplicar conceptos de geometría básica',
        'Desarrollar pensamiento lógico matemático'
      ],
      competencies: [
        'Resuelve problemas de cantidad',
        'Resuelve problemas de forma, movimiento y localización',
        'Resuelve problemas de gestión de datos e incertidumbre'
      ],
      units: [
        {
          id: '1',
          name: 'Fracciones y Decimales',
          duration: 40,
          sessions: [
            {
              id: '1',
              name: 'Introducción a fracciones',
              duration: 90,
              activities: ['Presentación teórica', 'Ejercicios prácticos', 'Evaluación formativa']
            }
          ],
          resources: ['Libro de texto', 'Material concreto', 'Fichas de trabajo']
        }
      ],
      estimatedHours: 120,
      materials: ['Libro de matemática 5to', 'Calculadora', 'Material Base 10', 'Fichas de trabajo']
    },
    {
      id: '2',
      name: 'Plan de Comunicación 4to B - V1.0',
      course: 'Comunicación',
      grade: '4to Grado B',
      version: '1.0',
      generationDate: '2024-01-08',
      accuracy: 92.1,
      status: 'Aprobado',
      objectives: [
        'Mejorar comprensión lectora',
        'Desarrollar expresión oral',
        'Fortalecer producción de textos'
      ],
      competencies: [
        'Se comunica oralmente en su lengua materna',
        'Lee diversos tipos de textos escritos',
        'Escribe diversos tipos de textos'
      ],
      units: [
        {
          id: '2',
          name: 'Comprensión Lectora',
          duration: 35,
          sessions: [
            {
              id: '2',
              name: 'Estrategias de lectura',
              duration: 90,
              activities: ['Lectura dirigida', 'Análisis de texto', 'Discusión grupal']
            }
          ],
          resources: ['Antología de textos', 'Diccionario', 'Cuaderno de trabajo']
        }
      ],
      estimatedHours: 100,
      materials: ['Libro de comunicación 4to', 'Antología', 'Diccionario', 'Cuaderno']
    }
  ];

  const [plans, setPlans] = useState(mockPlans);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Borrador IA': return 'bg-gray-100 text-gray-800';
      case 'En revisión': return 'bg-blue-100 text-blue-800';
      case 'Aprobado': return 'bg-green-100 text-green-800';
      case 'Publicado': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 80) return 'text-blue-600';
    if (accuracy >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredPlans = plans.filter(plan => {
    if (selectedFilter === 'all') return true;
    return plan.status === selectedFilter;
  });

  const handleApprove = (planId: string) => {
    setPlans(plans.map(plan => 
      plan.id === planId ? { ...plan, status: 'Aprobado' as const } : plan
    ));
  };

  const handleRequestNewVersion = () => {
    if (selectedPlan && feedback.trim()) {
      // Mock: Generate new version
      const newVersion = {
        ...selectedPlan,
        version: (parseFloat(selectedPlan.version) + 0.1).toFixed(1),
        generationDate: new Date().toISOString().split('T')[0],
        status: 'Borrador IA' as const
      };
      setPlans([...plans, newVersion]);
      setFeedback('');
      setSelectedPlan(null);
    }
  };

  const handlePublish = (planId: string) => {
    setPlans(plans.map(plan => 
      plan.id === planId ? { ...plan, status: 'Publicado' as const } : plan
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#800020]">Planes de Estudio con IA</h2>
          <p className="text-gray-600">Genera, personaliza y aprueba planes de estudio con inteligencia artificial</p>
        </div>
        <Button
  className="bg-[#007bff] hover:bg-[#0056b3]"
  onClick={() => setChatOpen(true)}
>
  <Brain className="h-4 w-4 mr-2" />
  Generar Nuevo Plan
</Button>

{/* Modal del chatbot IA */}
<AIChatModal open={chatOpen} onClose={() => setChatOpen(false)} />

      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('all')}
            >
              Todos
            </Button>
            <Button 
              variant={selectedFilter === 'Borrador IA' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('Borrador IA')}
            >
              Borrador IA
            </Button>
            <Button 
              variant={selectedFilter === 'En revisión' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('En revisión')}
            >
              En Revisión
            </Button>
            <Button 
              variant={selectedFilter === 'Aprobado' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('Aprobado')}
            >
              Aprobado
            </Button>
            <Button 
              variant={selectedFilter === 'Publicado' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('Publicado')}
            >
              Publicado
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Explorador de Planes IA</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Versión</TableHead>
                  <TableHead>Fecha Generación</TableHead>
                  <TableHead className="text-center">Precisión</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map(plan => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{plan.name}</p>
                        <p className="text-sm text-gray-600">{plan.grade}</p>
                      </div>
                    </TableCell>
                    <TableCell>{plan.course}</TableCell>
                    <TableCell>v{plan.version}</TableCell>
                    <TableCell>{plan.generationDate}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="secondary"
                        className={`${getAccuracyColor(plan.accuracy)} font-semibold`}
                      >
                        {plan.accuracy}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getStatusColor(plan.status)}>
                        {plan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedPlan(plan)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <PlanDetailView plan={plan} onApprove={handleApprove} onPublish={handlePublish} />
                          </DialogContent>
                        </Dialog>
                        
                        {plan.status === 'En revisión' && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(plan.id)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedPlan(plan)}
                                >
                                  <RefreshCw className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Solicitar Nueva Versión</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium">Feedback para la IA</label>
                                    <Textarea
                                      placeholder="Ej: Mayor énfasis en álgebra y problemas aplicados..."
                                      value={feedback}
                                      onChange={(e) => setFeedback(e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setFeedback('')}>
                                      Cancelar
                                    </Button>
                                    <Button 
                                      className="bg-[#007bff] hover:bg-[#0056b3]"
                                      onClick={handleRequestNewVersion}
                                      disabled={!feedback.trim()}
                                    >
                                      <Send className="h-4 w-4 mr-2" />
                                      Solicitar
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                        
                        {plan.status === 'Aprobado' && (
                          <Button 
                            size="sm" 
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={() => handlePublish(plan.id)}
                          >
                            <Send className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface PlanDetailViewProps {
  plan: StudyPlan;
  onApprove: (planId: string) => void;
  onPublish: (planId: string) => void;
}

function PlanDetailView({ plan, onApprove, onPublish }: PlanDetailViewProps) {
  const [activeTab, setActiveTab] = useState('content');

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="text-[#800020]">{plan.name}</DialogTitle>
      </DialogHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="explanation">Explicabilidad IA</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
          {/* Plan Overview */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Curso:</span>
                  <span className="font-medium">{plan.course}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Grado:</span>
                  <span className="font-medium">{plan.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horas estimadas:</span>
                  <span className="font-medium">{plan.estimatedHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precisión IA:</span>
                  <span className="font-medium text-green-600">{plan.accuracy}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Estado y Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge className={`${getStatusColor(plan.status)} mb-2`}>
                  {plan.status}
                </Badge>
                
                <div className="flex flex-col gap-2">
                  {plan.status === 'En revisión' && (
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => onApprove(plan.id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Aprobar
                    </Button>
                  )}
                  
                  {plan.status === 'Aprobado' && (
                    <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => onPublish(plan.id)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Publicar
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4" />
                Objetivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {plan.objectives.map((objective, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-[#800020] mt-1">•</span>
                    {objective}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Competencies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Competencias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {plan.competencies.map((competency, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-[#800020] mt-1">•</span>
                    {competency}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Units */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Unidades de Aprendizaje
              </CardTitle>
            </CardHeader>
            <CardContent>
              {plan.units.map((unit, index) => (
                <div key={unit.id} className="border rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Unidad {index + 1}: {unit.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {unit.duration}h
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Sesiones:</h5>
                      {unit.sessions.map((session, sessionIndex) => (
                        <div key={session.id} className="ml-4 text-sm text-gray-600">
                          • {session.name} ({session.duration} min)
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Recursos:</h5>
                      <div className="ml-4 text-sm text-gray-600">
                        {unit.resources.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="explanation" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                ¿Por qué esta recomendación?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Desempeño Histórico</h4>
                  <p className="text-sm text-blue-800">
                    Los estudiantes de {plan.grade} han mostrado dificultades en fracciones (promedio: 13.2) 
                    pero excelencia en geometría básica (promedio: 17.8)
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Brechas por Competencia</h4>
                  <p className="text-sm text-green-800">
                    Se identificó una brecha del 23% en "Resuelve problemas de cantidad" 
                    comparado con el estándar nacional
                  </p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900">Calendario Académico</h4>
                  <p className="text-sm text-purple-800">
                    El plan se ajusta a las 40 semanas lectivas y considera los períodos de evaluación 
                    establecidos por el MINEDU
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Parámetros de Generación</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Dataset:</span>
                    <span className="ml-2">Notas 2021-2024</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Algoritmo:</span>
                    <span className="ml-2">Random Forest</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Ventana temporal:</span>
                    <span className="ml-2">36 meses</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha entrenamiento:</span>
                    <span className="ml-2">2024-01-07</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Historial y Auditoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Plan generado por IA</p>
                    <p className="text-xs text-gray-600">10 Enero 2024, 14:30 - Sistema IA</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Revisión iniciada</p>
                    <p className="text-xs text-gray-600">11 Enero 2024, 09:15 - Prof. Juan Mendoza</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Edit className="h-4 w-4 text-yellow-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Personalización realizada</p>
                    <p className="text-xs text-gray-600">12 Enero 2024, 11:45 - Prof. Juan Mendoza</p>
                    <p className="text-xs text-gray-500">Comentario: "Ajusté las horas de la Unidad 2"</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Borrador IA': return 'bg-gray-100 text-gray-800';
    case 'En revisión': return 'bg-blue-100 text-blue-800';
    case 'Aprobado': return 'bg-green-100 text-green-800';
    case 'Publicado': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}