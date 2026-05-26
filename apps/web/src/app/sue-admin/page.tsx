'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  School, 
  Users, 
  UserCheck, 
  Map as MapIcon, 
  ShieldAlert, 
  BookOpen, 
  Brain, 
  Calendar, 
  Award, 
  BellRing, 
  FileSignature, 
  FileText, 
  BarChart3, 
  Bus, 
  RefreshCw, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  UserPlus, 
  ArrowLeft,
  Activity,
  Layers,
  Home,
  Download,
  Check,
  Smartphone,
  UploadCloud,
  MessageSquare,
  LogOut,
  Play,
  Lock
} from 'lucide-react';
import Link from 'next/link';

// Mock Data imports (simulated via local JSON mappings)
import schoolsData from '../../mocks/schools.json';
import teachersData from '../../mocks/teachers.json';
import studentsData from '../../mocks/students.json';
import attendanceData from '../../mocks/attendance.json';
import alertsData from '../../mocks/alerts.json';
import transportData from '../../mocks/transport.json';

interface StudentAttendance {
  id: number;
  name: string;
  dni: string;
  absences: number;
  risk: 'BAJO' | 'MEDIO' | 'ALTO';
  status: 'P' | 'A' | 'T';
}

interface StudentGrade {
  id: number;
  name: string;
  previousGrade: string;
  currentGrade: number;
}

interface LegajoDocument {
  id: number;
  name: string;
  size: string;
  status: 'AUDITADO LEGAL' | 'VERIFICADO JUNTAS' | 'PROCESANDO OCR';
  integrity: string;
  date: string;
}

interface LegajoLicense {
  id: number;
  article: string;
  date: string;
  signature: string;
  status: 'APROBADA' | 'PENDIENTE';
}

interface ChatMessage {
  sender: 'user' | 'ia';
  text: string;
}

export default function SUEAdminPortal() {
  // Profiles and Roles State
  const [selectedRole, setSelectedRole] = useState<'MINISTERIO' | 'DIRECTIVO' | 'DOCENTE' | 'PADRE' | 'ALUMNO'>('MINISTERIO');
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Authentication State (Mockup)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Mock credentials for each role
  const mockCredentials = useMemo(() => ({
    MINISTERIO: { email: 'ministerio@sue.sanjuan.edu.ar', password: 'password123' },
    DIRECTIVO: { email: 'directivo.normal@sue.sanjuan.edu.ar', password: 'password123' },
    DOCENTE: { email: 'gabriela.quiroga@sanjuan.edu.ar', password: 'password123' },
    PADRE: { email: 'carlos.castro@sue.sanjuan.edu.ar', password: 'password123' },
    ALUMNO: { email: 'thiago.castro@sue.sanjuan.edu.ar', password: 'password123' }
  }), []);

  // Helper to select role and show login screen
  const handleSelectPortal = useCallback((role: 'MINISTERIO' | 'DIRECTIVO' | 'DOCENTE' | 'PADRE' | 'ALUMNO') => {
    setSelectedRole(role);
    setLoginEmail(mockCredentials[role].email);
    setLoginPassword(mockCredentials[role].password);
    setLoginError('');
    setShowLogin(true);
  }, [mockCredentials]);

  // Animated KPI Counter states
  const [schoolsCount, setSchoolsCount] = useState(0);
  const [teachersCount, setTeachersCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [deptsCount, setDeptsCount] = useState(0);

  // Live state simulations
  const [localStudents, setLocalStudents] = useState(studentsData);
  const [localTeachers, setLocalTeachers] = useState(teachersData);
  const [localAlerts, setLocalAlerts] = useState(alertsData);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiChatResponse, setAiChatResponse] = useState('');
  const [aiChatLoading, setAiChatLoading] = useState(false);
  const [signedPermits, setSignedPermits] = useState<number[]>([]);
  const [substituteTeacher, setSubstituteTeacher] = useState({ name: '', position: '', schoolId: 1 });
  const [substituteMessage, setSubstituteMessage] = useState('');

  // --- NEW DOCENTE PORTAL STATES (1:1 with Screenshots) ---
  const [isLegajoOpen, setIsLegajoOpen] = useState(false);
  const [activeDocenteTab, setActiveDocenteTab] = useState<'attendance' | 'grades' | 'ia' | 'reports'>('attendance');
  const [activeLegajoTab, setActiveLegajoTab] = useState<'profile' | 'ocr' | 'attendance' | 'chat'>('profile');
  
  // Custom Docente Students State (Asistencia Panel)
  const [attendanceStudents, setAttendanceStudents] = useState<StudentAttendance[]>([
    { id: 1, name: "Mateo Fernández", dni: "45.342.129", absences: 0, risk: "BAJO", status: "P" },
    { id: 2, name: "Sofía Benítez", dni: "46.129.834", absences: 0, risk: "BAJO", status: "P" },
    { id: 3, name: "Thiago Castro", dni: "47.930.234", absences: 3, risk: "ALTO", status: "A" },
    { id: 4, name: "Valentina Agüero", dni: "48.234.901", absences: 0, risk: "MEDIO", status: "P" }
  ]);

  // Custom Docente Grades State (Notas Panel)
  const [gradesStudents, setGradesStudents] = useState<StudentGrade[]>([
    { id: 1, name: "Mateo Fernández", previousGrade: "9 / 10", currentGrade: 9 },
    { id: 2, name: "Sofía Benítez", previousGrade: "10 / 10", currentGrade: 10 },
    { id: 3, name: "Thiago Castro", previousGrade: "5 / 10", currentGrade: 5 },
    { id: 4, name: "Valentina Agüero", previousGrade: "7 / 10", currentGrade: 7 }
  ]);

  const [selectedMateria, setSelectedMateria] = useState('Matemática');
  const [aiPlanGenerated, setAiPlanGenerated] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [downloadingActaId, setDownloadingActaId] = useState<number | null>(null);

  // --- NEW INTERACTIVE LEGAJO DIGITAL STATES ---
  const [uploadedDocs, setUploadedDocs] = useState<LegajoDocument[]>([
    { id: 1, name: "Titulo_Profesorado_Primaria_Validos.pdf", size: "2.4 MB", status: "AUDITADO LEGAL", integrity: "100% OK", date: "21/05/2026" },
    { id: 2, name: "Certificado_Especializacion_Gestion.pdf", size: "1.8 MB", status: "VERIFICADO JUNTAS", integrity: "100% OK", date: "19/05/2026" }
  ]);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  const [selectedLicenseArticle, setSelectedLicenseArticle] = useState('Artículo 24 - Cuidado de familiar enfermo');
  const [registeredLicenses, setRegisteredLicenses] = useState<LegajoLicense[]>([
    { id: 1, article: "Artículo 24 - Cuidado de familiar enfermo", date: "2026-04-10", signature: "Digital Signature CID valid.", status: "APROBADA" },
    { id: 2, article: "Artículo 18 - Licencia por Capacitación Certificada", date: "2025-10-05", signature: "Digital Signature CID valid.", status: "APROBADA" }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'ia', text: '¡Hola! Soy Sanjuanito IA Legajo. ¿En qué puedo ayudarte hoy respecto a la clasificación, puntaje de Juntas o regulaciones ministeriales?' }
  ]);
  const [aiLegajoInput, setAiLegajoInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);

  // --- NEW INTERACTIVE STATES FOR PADRE AND MINISTERIO PORTALS ---
  const [isPadreAlertClosed, setIsPadreAlertClosed] = useState(false);
  const [padrePin, setPadrePin] = useState('');
  const [isPadrePermitSigned, setIsPadrePermitSigned] = useState(false);
  const [padreChatMessage, setPadreChatMessage] = useState('');
  const [padreChatList, setPadreChatList] = useState<ChatMessage[]>([
    { sender: 'ia', text: 'Estimado Carlos, le escribo de parte del equipo directivo de la Escuela Normal Sarmiento. Hemos notado el ausentismo reiterado de Thiago esta última semana. ¿Desea justificar las inasistencias o agendar una consulta presencial?' }
  ]);
  const [selectedDepartmentMin, setSelectedDepartmentMin] = useState('Capital');
  const [isSincronizandoMin, setIsSincronizandoMin] = useState(false);

  // Counter Animation on Mount with Real Database Counts
  useEffect(() => {
    // Helper to animate count
    const animateCount = (target: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
      if (target <= 0) {
        setter(0);
        return;
      }
      let start = 0;
      const duration = 1200; // 1.2s
      const steps = 40;
      const intervalTime = duration / steps;
      
      const timer = setInterval(() => {
        start += 1;
        const progress = start / steps;
        setter(Math.min(Math.floor(target * progress), target));
        if (start >= steps) {
          clearInterval(timer);
        }
      }, intervalTime);
    };

    async function loadStats() {
      try {
        const res = await fetch('/api/modalidades/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          const realSchools = data.totalEstablecimientos || 0;
          const realEdificios = data.totalEdificios || 0;

          animateCount(realSchools, setSchoolsCount);
          animateCount(realEdificios, setDeptsCount);
        } else {
          setSchoolsCount(0);
          setDeptsCount(0);
        }
      } catch (err) {
        console.error('Error fetching database stats:', err);
        setSchoolsCount(0);
        setDeptsCount(0);
      }
    }

    loadStats();
    
    // Docentes and Alumnos counts stay at 0
    setTeachersCount(0);
    setStudentsCount(0);
  }, []);

  // Reset activeTab to overview when selectedRole changes
  useEffect(() => {
    setActiveTab('overview');
    setIsLegajoOpen(false);
  }, [selectedRole]);

  // Show premium floating toast
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  }, []);

  // AI Lesson Generator (Docente Role)
  const generateLessonPlan = useCallback(() => {
    if (!aiPrompt) return;
    setAiLoading(true);
    setAiOutput('');

    setTimeout(() => {
      setAiOutput(`### PLAN PEDAGÓGICO JURISDICCIONAL: MATEMÁTICA 5TO GRADO 🚀
*Alineado al Plan de Modernización Jurisdiccional de San Juan*

**1. OBJETIVOS ESPECÍFICOS:**
* Resolver problemas algebraicos de proporcionalidad aplicados al desarrollo local.
* Fomentar el pensamiento lógico computacional integrado en la estimación presupuestaria escolar.

**2. CONTEXTUALIZACIÓN REGIONAL (SAN JUAN):**
* Integración del **Parque Solar Ullum**: Los alumnos analizarán datos numéricos reales de generación de energía solar en megavatios para calcular proporcionalidades directas e inversas.
* Análisis hídrico del **Río San Juan**: Ejercicios estructurados basados en caudal cúbico y distribución hídrica por departamentos.

**3. SECUENCIA DIDÁCTICA DE AULA:**
* **Inicio (20 min):** Planteamiento del desafío energético en Ullum. ¿Cómo calculamos cuántos hogares se abastecen con 10 MW?
* **Desarrollo (40 min):** Modelado algebraico en el pizarrón. Resolución de fórmulas en equipos cooperativos.
* **Cierre (20 min):** Evaluación formativa interactiva en la plataforma SUE Alumnos. Carga de resultados digitales.`);
      setAiLoading(false);
      setAiPlanGenerated(true);
      showToast('✨ Plan de clase generado con éxito y guardado en tu currículum oficial');
    }, 1200);
  }, [aiPrompt, showToast]);

  // AI Tutor Chat Simulator (Alumno Role)
  const askAITutor = useCallback(() => {
    if (!aiQuestion) return;
    setAiChatLoading(true);
    setAiChatResponse('');

    setTimeout(() => {
      setAiChatResponse(`¡Hola! Excelente pregunta. Sobre "${aiQuestion}": Recuerda que este tema es crucial para tu currícula escolar de San Juan. Te recomiendo repasar las páginas 42-45 de tu módulo de estudio oficial en la biblioteca SUE. ¿Te gustaría que resolvamos juntos un ejercicio práctico paso a paso?`);
      setAiChatLoading(false);
    }, 1000);
  }, [aiQuestion]);

  // Digital Sign Authorization (Padre Role)
  const signPermit = useCallback((permitId: number) => {
    if (signedPermits.includes(permitId)) return;
    setSignedPermits(prev => [...prev, permitId]);
  }, [signedPermits]);

  // Submit Parent Chat Message
  const handlePadreChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!padreChatMessage.trim()) return;

    const userMsg: ChatMessage = { sender: 'user', text: padreChatMessage };
    setPadreChatList(prev => [...prev, userMsg]);
    setPadreChatMessage('');

    setTimeout(() => {
      const replyMsg: ChatMessage = { 
        sender: 'ia', 
        text: 'Muchas gracias por responder. He tomado nota del justificativo. Estaré registrándolo formalmente en el legajo de Thiago para informar al preceptor. ¡Saludos cordiales!' 
      };
      setPadreChatList(prev => [...prev, replyMsg]);
    }, 1200);
  };

  // Submit Parent PIN signature validation
  const handlePadrePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (padrePin === '1234') {
      setIsPadrePermitSigned(true);
      showToast('✍️ Firma digital estampada con éxito. Autorización cargada en el SED.');
    } else {
      showToast('❌ PIN inválido. Recuerde usar el PIN asignado (clave: 1234).');
    }
  };

  // Sync Ministry Panel data
  const handleSincronizarMin = () => {
    setIsSincronizandoMin(true);
    setTimeout(() => {
      setIsSincronizandoMin(false);
      showToast('🔄 Base de datos provincial Sincronizada con el SED (Sistema Escolar Digital).');
    }, 1500);
  };

  // Substitute Hiring (Directivo Role)
  const handleHireSubstitute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!substituteTeacher.name || !substituteTeacher.position) return;

    const newSubstitute = {
      id: localTeachers.length + 1,
      dni: `38.${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}`,
      name: `Prof. ${substituteTeacher.name} (Suplente)`,
      school_id: Number(substituteTeacher.schoolId),
      school_name: schoolsData.find(s => s.id === Number(substituteTeacher.schoolId))?.name || 'Escuela Asignada',
      position: substituteTeacher.position,
      email: `${substituteTeacher.name.toLowerCase().replace(' ', '.')}@sue.sanjuan.edu.ar`,
      attendance_rate: '100%',
      status: 'Activo'
    };

    setLocalTeachers(prev => [newSubstitute, ...prev]);
    setSubstituteMessage(`¡Suplencia registrada con éxito! El Prof. ${substituteTeacher.name} ha sido asignado a la cátedra de ${substituteTeacher.position}.`);
    setSubstituteTeacher({ name: '', position: '', schoolId: 1 });

    setTimeout(() => setSubstituteMessage(''), 5000);
  };

  // Resolve Alert (Ministerio Role)
  const resolveAlert = useCallback((alertId: number) => {
    setLocalAlerts(prev => 
      prev.map(al => al.id === alertId ? { ...al, status: 'Resuelta', severity: 'Baja' } : al)
    );
  }, []);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // --- INTERACTIVE DOCENTE TAB ACTIONS ---
  
  // Calculate attendance counters dynamically based on state
  const attendanceCounters = useMemo(() => {
    let p = 0, a = 0, t = 0;
    attendanceStudents.forEach(st => {
      if (st.status === 'P') p++;
      if (st.status === 'A') a++;
      if (st.status === 'T') t++;
    });
    return { present: p, absent: a, tardy: t };
  }, [attendanceStudents]);

  // Update a student's status (P/A/T) dynamically
  const handleSetStudentStatus = (studentId: number, status: 'P' | 'A' | 'T') => {
    setAttendanceStudents(prev => 
      prev.map(st => st.id === studentId ? { ...st, status } : st)
    );
  };

  // Handle grade input change
  const handleGradeChange = (studentId: number, val: string) => {
    let numVal = parseFloat(val);
    if (isNaN(numVal)) numVal = 0;
    if (numVal > 10) numVal = 10;
    if (numVal < 0) numVal = 0;

    setGradesStudents(prev => 
      prev.map(st => st.id === studentId ? { ...st, currentGrade: numVal } : st)
    );
  };

  // Download official reports
  const triggerDownloadActa = (actaId: number, title: string) => {
    setDownloadingActaId(actaId);
    setTimeout(() => {
      setDownloadingActaId(null);
      showToast(`📥 Descarga de acta finalizada con éxito: "${title}"`);
    }, 1500);
  };

  // --- INTERACTIVE LEGAJO DOCENTE DIGITAL HANDLERS ---

  // Simulated PDF Upload
  const handleDocUploadSimulate = () => {
    setIsUploadingDoc(true);
    setTimeout(() => {
      const newDoc: LegajoDocument = {
        id: uploadedDocs.length + 1,
        name: `Certificado_Curso_Innovacion_TIC_${Math.floor(10 + Math.random() * 90)}.pdf`,
        size: "1.5 MB",
        status: "AUDITADO LEGAL",
        integrity: "100% OK",
        date: new Date().toLocaleDateString('es-AR')
      };
      setUploadedDocs(prev => [...prev, newDoc]);
      setIsUploadingDoc(false);
      showToast('📄 Documento subido y auditado por IA OCR exitosamente');
    }, 2000);
  };

  // Simulated Medical Certificate / License registry
  const handleRegisterLicense = (e: React.FormEvent) => {
    e.preventDefault();
    const newLicense: LegajoLicense = {
      id: registeredLicenses.length + 1,
      article: selectedLicenseArticle,
      date: new Date().toISOString().split('T')[0],
      signature: "Digital Signature CID valid.",
      status: "APROBADA"
    };
    setRegisteredLicenses(prev => [newLicense, ...prev]);
    showToast('✓ Solicitud de licencia médica homologada y aprobada en su legajo');
  };

  // Chat with Sanjuanito IA Juntas Assistant
  const handleSendLegajoMessage = useCallback((customText?: string) => {
    const textToSend = customText || aiLegajoInput;
    if (!textToSend.trim()) return;

    // Add user message
    setChatMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setAiLegajoInput('');
    setIsChatTyping(true);

    setTimeout(() => {
      let reply = '';
      const textClean = textToSend.toLowerCase();

      if (textClean.includes('puntaje') || textClean.includes('juntas')) {
        reply = 'El puntaje de Juntas consolidado de 38.120 Ptos se calcula en base a tu título docente base (9.00 Ptos), tu promedio homologado (8.45 Ptos), tus 12 años de trayectoria y antigüedad (12.00 Ptos) y cursos acreditados homologados (8.67 Ptos).';
      } else if (textClean.includes('art') || textClean.includes('licencia') || textClean.includes('24')) {
reply = 'El Artículo 24 contempla licencias justificadas por cuidado de familiar enfermo de primer grado de consanguinidad, otorgando hasta 20 días hábiles justificados anuales mediante certificado digital oficial homologado.';
      } else {
        reply = 'Hola Prof. Gabriela, he revisado sus antecedentes en el Ministerio de Educación de San Juan. Todo su legajo civil y títulos están completamente regularizados (94% auditoría completada). ¿Desea consultar algo específico sobre cursos para sumar puntaje?';
      }

      setChatMessages(prev => [...prev, { sender: 'ia', text: reply }]);
      setIsChatTyping(false);
    }, 1200);
  }, [aiLegajoInput]);

  // ==========================================
  // --- MOCKUP LOGIN SCREEN (WHITE & ORANGE) ---
  // ==========================================
  if (!isLoggedIn && showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#fffcf9] to-orange-50/20 text-slate-700 font-sans select-none overflow-x-hidden relative flex flex-col justify-between">
        
        {/* Decorative Ambient Soft Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
        
        {/* Floating Toast Notification overlay */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-[#fe8204] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-black text-xs border border-orange-600/30">
            <CheckCircle2 className="h-5 w-5 text-white" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Navbar */}
        <header className="w-full px-8 py-5 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-[#fe8204]/20 text-[#fe8204]">
              <School className="h-5.5 w-5.5" />
            </div>
            <div>
              <h1 className="text-xs font-black uppercase tracking-[0.2em] text-[#fe8204] leading-none">
                Ministerio de Educación
              </h1>
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mt-1">
                Ecosistema Integrado SUE
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowLogin(false)}
            className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-500 hover:text-slate-700 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Volver a Portales</span>
          </button>
        </header>

        {/* Main Section */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 z-10">
          
          {/* Left Column: Premium pitch */}
          <div className="flex-1 space-y-5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 text-[#fe8204] border border-[#fe8204]/20 text-[9px] font-black uppercase tracking-widest leading-none">
              <Activity className="h-3 w-3 text-[#fe8204] animate-pulse" />
              <span>Acceso de Seguridad SUE</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black uppercase leading-tight tracking-tight text-slate-800">
              Portal {selectedRole === 'MINISTERIO' ? 'Ministerio' :
                       selectedRole === 'DIRECTIVO' ? 'Directivos' :
                       selectedRole === 'DOCENTE' ? 'Docentes' :
                       selectedRole === 'PADRE' ? 'Padres y Tutores' : 'Alumnos'}
            </h2>

            <p className="text-slate-500 font-medium text-xs leading-relaxed max-w-sm mx-auto md:mx-0">
              Para ingresar al panel de {selectedRole.toLowerCase()} simulado, valide su clave única con firma digital autorizada por la Junta de Clasificación.
            </p>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 w-fit mx-auto md:mx-0 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider">Conexión de Seguridad Activa</span>
            </div>
          </div>

          {/* Right Column: White and Orange Login Form Card */}
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50 space-y-6 relative overflow-hidden">
            
            {/* Login Header */}
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[#fe8204] text-[9px] font-black uppercase tracking-[0.25em] block">
                INICIO DE SESIÓN MOCKUP
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">
                ¡Logueate!
              </h3>
              <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">
                Ingresa tus credenciales oficiales de {selectedRole.toLowerCase()}.
              </p>
            </div>

            {/* Inputs Block */}
            <div className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-[10px] font-bold">
                  {loginError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block pl-1">
                  Email Institucional:
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    setLoginError('');
                  }}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#fe8204] focus:ring-1 focus:ring-[#fe8204]/30 focus:outline-none text-xs font-bold text-slate-800 transition-all placeholder-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block pl-1">
                  Clave de Acceso Único:
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setLoginError('');
                  }}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#fe8204] focus:ring-1 focus:ring-[#fe8204]/30 focus:outline-none text-xs font-bold text-slate-800 transition-all placeholder-slate-400"
                />
              </div>
            </div>

            {/* Aux Actions */}
            <div className="flex items-center justify-between text-[9px] font-bold uppercase text-slate-400 px-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="accent-[#fe8204] rounded border-slate-200"
                />
                <span>Recordar mi firma</span>
              </label>
              <span className="hover:text-slate-650 transition-all cursor-pointer">¿Ayuda?</span>
            </div>

            {/* Login Action Button */}
            <button
              onClick={() => {
                if (!loginEmail || !loginPassword) {
                  setLoginError('⚠️ Por favor completa el email institucional y la clave.');
                  return;
                }
                setIsLoggedIn(true);
                showToast(`🔑 Bienvenido al Ecosistema SUE: Sesión iniciada como ${selectedRole}`);
              }}
              className="w-full bg-[#fe8204] hover:bg-orange-600 text-white font-black text-[10px] py-4 rounded-2xl uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-md shadow-[#fe8204]/10 cursor-pointer"
            >
              <Lock className="h-4 w-4 text-white" />
              <span>Iniciar Sesión en SUE</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="w-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 font-black text-[9px] py-3 rounded-2xl uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Cambiar de Portal</span>
            </button>
          </div>
        </main>

        {/* Footer Branding */}
        <footer className="w-full border-t border-slate-200 bg-white py-6 text-center text-slate-400 text-[9px] font-bold uppercase tracking-widest z-10 px-6">
          <div className="flex justify-center items-center gap-2 text-[#fe8204]">
            <School className="h-4 w-4" />
            <span>SUE - Gobierno de la Provincia de San Juan</span>
          </div>
        </footer>

      </div>
    );
  }

  // ==========================================
  // --- RENDER DEDICATED FULLSCREEN DOCENTE ---
  const isDocente = (selectedRole as string) === 'DOCENTE';
  if (isDocente) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-700 font-sans select-none overflow-x-hidden relative">
        
        {/* Toast notification overlay */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-[#fe8204] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-black text-xs border border-orange-600/30">
            <CheckCircle2 className="h-5 w-5 text-white" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* HEADER BREADCRUMB BAR (Light Mode Cohesive White/Orange) */}
        <header className="w-full px-8 py-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5 text-xs font-black text-slate-500">
            <Home className="h-4.5 w-4.5 text-[#fe8204]" />
            <span>SUE</span>
            <span className="text-slate-300 font-medium">/</span>
            <span className="text-slate-700">Docente Portal</span>
          </div>
          
          <button 
            onClick={() => {
              setIsLoggedIn(false);
              showToast('👋 Sesión cerrada correctamente');
            }} 
            className="text-red-500 hover:text-red-600 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </button>
        </header>

        {/* MAIN CONTAINER */}
        <main className="max-w-6xl mx-auto px-8 py-8 space-y-6">

          {/* INSTITUTIONAL HEADER CARD (Light Mode Pure White) */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
            
            <div className="space-y-3 z-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-orange-500/10 text-[#fe8204] font-black text-[9px] uppercase tracking-widest border border-orange-500/20">
                  Escuela Normal Sarmiento
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  • CUE: 7000142
                </span>
              </div>
              
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">
                Panel de Docente: Prof. Gabriela Quiroga
              </h2>
              
              <p className="text-[11px] text-slate-500 font-bold">
                Grado Asignado: <span className="text-slate-800 font-black">5° Grado "A" (Turno Mañana)</span> — 32 alumnos inscriptos.
              </p>
            </div>

            <div className="flex items-center gap-2.5 z-10 self-end md:self-auto">
              <button 
                onClick={() => setIsLegajoOpen(true)}
                className="bg-[#fe8204] hover:bg-orange-600 border border-orange-600 text-white rounded-xl px-4 py-2.5 shadow-md hover:scale-105 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                <span>Mi Legajo Digital</span>
              </button>
              
              <button 
                onClick={() => setActiveDocenteTab('attendance')}
                className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm hover:scale-105 transition-all text-slate-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
              >
                <span>Ver Flujo Asistencia</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#fe8204]" />
              </button>
            </div>
          </section>

          {/* PORTAL NAV TABS BAR */}
          <nav className="border-b border-slate-200 flex items-center gap-2">
            <button 
              onClick={() => setActiveDocenteTab('attendance')}
              className={`px-5 py-3.5 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
                activeDocenteTab === 'attendance' 
                  ? 'border-[#fe8204] text-[#fe8204]' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span>Control de Asistencia del Curso</span>
            </button>

            <button 
              onClick={() => setActiveDocenteTab('grades')}
              className={`px-5 py-3.5 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
                activeDocenteTab === 'grades' 
                  ? 'border-[#fe8204] text-[#fe8204]' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <FileSignature className="h-4 w-4" />
              <span>Carga de Notas Trimestrales</span>
            </button>

            <button 
              onClick={() => setActiveDocenteTab('ia')}
              className={`px-5 py-3.5 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
                activeDocenteTab === 'ia' 
                  ? 'border-[#fe8204] text-[#fe8204]' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Brain className="h-4 w-4" />
              <span>IA Docente & Planificación</span>
            </button>

            <button 
              onClick={() => setActiveDocenteTab('reports')}
              className={`px-5 py-3.5 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
                activeDocenteTab === 'reports' 
                  ? 'border-[#fe8204] text-[#fe8204]' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Planillas de Calificación y Reportes</span>
            </button>
          </nav>

          {/* TAB CONTENTS (Crisp Light Cards) */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            
            {/* 1. CONTROL DE ASISTENCIA */}
            {activeDocenteTab === 'attendance' && (
              <div className="space-y-6">
                
                {/* Title block */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-[14px] font-black uppercase text-slate-800 tracking-wide">
                      Planilla del Día: 22/5/2026
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold">
                      Haz clic en los selectores rápidos para alternar entre Presente, Ausente y Tarde.
                    </p>
                  </div>

                  {/* Dynamic counters */}
                  <div className="flex items-center gap-2.5 p-1 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-black tracking-widest uppercase">
                    <span className="px-3 py-1.5 rounded-lg text-emerald-600">
                      Presentes: <span className="text-slate-800 text-xs font-black">{attendanceCounters.present}</span>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="px-3 py-1.5 rounded-lg text-red-500">
                      Ausentes: <span className="text-slate-800 text-xs font-black">{attendanceCounters.absent}</span>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="px-3 py-1.5 rounded-lg text-amber-500">
                      Tarde: <span className="text-slate-800 text-xs font-black">{attendanceCounters.tardy}</span>
                    </span>
                  </div>
                </div>

                {/* Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                        <th className="p-4 pl-6">Alumno</th>
                        <th className="p-4">Faltas Trimestrales</th>
                        <th className="p-4">Riesgo Escolar</th>
                        <th className="p-4 pr-6 text-right">Marcar Asistencia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attendanceStudents.map((st) => (
                        <tr key={st.id} className="hover:bg-slate-50 transition-all">
                          {/* Profile */}
                          <td className="p-4 pl-6 flex items-center gap-3.5">
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-[#fe8204] border border-orange-200 font-black flex items-center justify-center text-[10px]">
                              {st.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-black text-slate-800">{st.name}</div>
                              <div className="text-[9px] text-slate-400 font-bold tracking-wider mt-0.5">DNI: *******</div>
                            </div>
                          </td>

                          {/* Absences */}
                          <td className="p-4 text-slate-600 font-bold">
                            {st.absences} faltas
                          </td>

                          {/* Risk Level Badge */}
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                              st.risk === 'BAJO' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 bg-emerald-50' :
                              st.risk === 'MEDIO' ? 'bg-amber-50 text-amber-700 border border-amber-200 bg-amber-50' :
                              'bg-red-50 text-red-700 border border-red-200 bg-red-50'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                st.risk === 'BAJO' ? 'bg-emerald-500' :
                                st.risk === 'MEDIO' ? 'bg-amber-500' :
                                'bg-red-500'
                              }`} />
                              <span>{st.risk}</span>
                            </span>
                          </td>

                          {/* Buttons selectors (P/A/T) */}
                          <td className="p-4 pr-6 text-right">
                            <div className="inline-flex p-1 rounded-xl bg-slate-50 border border-slate-200 gap-1">
                              <button 
                                onClick={() => handleSetStudentStatus(st.id, 'P')}
                                className={`w-7 h-7 rounded-lg text-[9px] font-black uppercase transition-all flex items-center justify-center ${
                                  st.status === 'P' 
                                    ? 'bg-emerald-500 text-white font-black shadow-sm' 
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                P
                              </button>
                              <button 
                                onClick={() => handleSetStudentStatus(st.id, 'A')}
                                className={`w-7 h-7 rounded-lg text-[9px] font-black uppercase transition-all flex items-center justify-center ${
                                  st.status === 'A' 
                                    ? 'bg-red-500 text-white font-black shadow-sm' 
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                A
                              </button>
                              <button 
                                onClick={() => handleSetStudentStatus(st.id, 'T')}
                                className={`w-7 h-7 rounded-lg text-[9px] font-black uppercase transition-all flex items-center justify-center ${
                                  st.status === 'T' 
                                    ? 'bg-amber-500 text-white font-black shadow-sm' 
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                T
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Save Action */}
                <div className="flex justify-end pt-3">
                  <button 
                    onClick={() => showToast('✓ Registro de asistencia de grado firmado y enviado al servidor provincial')}
                    className="bg-[#fe8204] hover:bg-orange-600 text-white font-black text-[10px] px-6 py-3.5 rounded-xl uppercase tracking-widest transition-all hover:scale-105 flex items-center gap-2 shadow-sm"
                  >
                    <Check className="h-4 w-4" />
                    <span>Firmar y Guardar Asistencia</span>
                  </button>
                </div>

              </div>
            )}

            {/* 2. CARGA DE NOTAS TRIMESTRALES */}
            {activeDocenteTab === 'grades' && (
              <div className="space-y-6">
                
                {/* Title block */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-[14px] font-black uppercase text-slate-800 tracking-wide">
                      Planilla de Registro de Calificaciones
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold">
                      Cargue los promedios formativos trimestrales para cada materia obligatoria.
                    </p>
                  </div>

                  {/* Subject selector dropdown */}
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                      Materia:
                    </span>
                    <select 
                      value={selectedMateria}
                      onChange={(e) => setSelectedMateria(e.target.value)}
                      className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-black text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                      <option value="Matemática">Matemática</option>
                      <option value="Física">Física Aplicada</option>
                      <option value="Lengua">Lengua y Literatura</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                        <th className="p-4 pl-6">Alumno</th>
                        <th className="p-4 text-center">Nota Anterior</th>
                        <th className="p-4 text-center">Nueva Nota a Cargar (1-10)</th>
                        <th className="p-4 pr-6 text-right">Estado Evaluativo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {gradesStudents.map((st) => (
                        <tr key={st.id} className="hover:bg-slate-50 transition-all">
                          
                          {/* Profile */}
                          <td className="p-4 pl-6 font-black text-slate-800">
                            {st.name}
                          </td>

                          {/* Previous grade */}
                          <td className="p-4 text-center text-slate-400 font-bold">
                            {st.previousGrade}
                          </td>

                          {/* Grade Input box */}
                          <td className="p-4 text-center">
                            <input 
                              type="number"
                              min={1}
                              max={10}
                              value={st.currentGrade || ''}
                              onChange={(e) => handleGradeChange(st.id, e.target.value)}
                              className="w-16 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-center font-black text-xs text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                            />
                          </td>

                          {/* Evaluative Status */}
                          <td className="p-4 pr-6 text-right">
                            <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider ${
                              st.currentGrade >= 6 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                st.currentGrade >= 6 ? 'bg-emerald-500' : 'bg-red-500'
                              }`} />
                              <span>{st.currentGrade >= 6 ? 'Aprobado' : 'Requiere Recuperatorio Intensivo'}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Save Action */}
                <div className="flex justify-end pt-3">
                  <button 
                    onClick={() => showToast(`✓ Promedios de libreta digital cargados correctamente en la asignatura: ${selectedMateria}`)}
                    className="bg-[#fe8204] hover:bg-orange-600 text-white font-black text-[10px] px-6 py-3.5 rounded-xl uppercase tracking-widest transition-all hover:scale-105 flex items-center gap-2 shadow-sm"
                  >
                    <span>+ Registrar Libreta Digital</span>
                  </button>
                </div>

              </div>
            )}

            {/* 3. IA DOCENTE Y PLANIFICACIÓN */}
            {activeDocenteTab === 'ia' && (
              <div className="space-y-6">
                
                {/* Title block */}
                <div className="space-y-1">
                  <h3 className="text-[14px] font-black uppercase text-slate-800 tracking-wide flex items-center gap-2">
                    <Brain className="h-5 w-5 text-[#fe8204]" />
                    <span>Planificación de Clases con IA Decisional</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold">
                    Sugerencias curriculares de clases alineadas al Plan de Modernización Jurisdiccional de San Juan.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  
                  {/* Left parameter column */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                        OBJETIVO TEMÁTICO / MATERIA
                      </label>
                      <input 
                        type="text" 
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Creame una clase de matemática de 5to..."
                        className="w-full pl-4 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-orange-500 text-xs transition-all text-slate-800 placeholder-slate-400 font-bold"
                      />
                    </div>

                    {/* Regional Context Box */}
                    <div className="bg-orange-500/5 p-4 rounded-2xl border border-orange-500/10 space-y-2 text-xs">
                      <h5 className="font-black uppercase text-[#fe8204] text-[10px] flex items-center gap-1.5">
                        <Activity className="h-4 w-4 text-[#fe8204] animate-pulse" />
                        <span>Asistente Inteligente Curricular</span>
                      </h5>
                      <p className="text-[9.5px] text-slate-600 font-medium leading-relaxed">
                        Incorpore en su solicitud temas locales de la provincia de San Juan para una integración de contextualización regional áulica de mayor impacto escolar.
                      </p>
                    </div>

                    {/* Action Button */}
                    <button 
                      onClick={generateLessonPlan}
                      disabled={!aiPrompt || aiLoading}
                      className="w-full bg-[#fe8204] hover:bg-orange-600 text-white font-black text-[10px] py-4 rounded-xl uppercase tracking-widest transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-40 disabled:hover:bg-[#fe8204]"
                    >
                      {aiLoading ? <RefreshCw className="h-4 w-4 animate-spin text-white" /> : <Brain className="h-4 w-4 text-white" />}
                      <span>Generar Plan de Clase</span>
                    </button>
                  </div>

                  {/* Right Output column */}
                  <div className="lg:col-span-3 border border-slate-200 rounded-3xl bg-slate-50 p-5 flex flex-col justify-between min-h-[300px]">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                        Planificador Pedagógico SUE
                      </span>
                      <span className="text-[8px] font-black text-[#fe8204] bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                        CURRÍCULUM OFICIAL
                      </span>
                    </div>

                    {aiLoading ? (
                      <div className="flex-1 flex flex-col items-center justify-center gap-3">
                        <RefreshCw className="h-8 w-8 animate-spin text-[#fe8204]" />
                        <span className="text-[9px] text-[#fe8204] font-black uppercase tracking-widest animate-pulse">
                          SUE-IA formulando itinerario áulico...
                        </span>
                      </div>
                    ) : aiPlanGenerated ? (
                      <div className="flex-1 text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap custom-scrollbar overflow-y-auto max-h-[320px] pr-2">
                        {aiOutput}
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-10">
                        <BookOpen className="h-10 w-10 text-slate-300" />
                        <div className="space-y-1">
                          <h6 className="text-xs font-black uppercase text-slate-600">Planificación Vacía</h6>
                          <p className="text-[9px] text-slate-400 font-bold max-w-xs leading-relaxed">
                            Escriba un tema en la columna lateral o pulse el botón para invocar de inmediato sugerencias oficiales automatizadas.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* 4. PLANILLAS Y REPORTES */}
            {activeDocenteTab === 'reports' && (
              <div className="space-y-6">
                
                {/* Title block */}
                <div className="space-y-1">
                  <h3 className="text-[14px] font-black uppercase text-slate-800 tracking-wide">
                    Planillas de Calificación Oficiales y Actas
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold">
                    Documentos oficiales validados con firma digital para su descarga legal provincial.
                  </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Report Card 1 */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-40">
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-black text-[#fe8204] bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded uppercase tracking-wider w-fit">
                        PDF
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 leading-tight">
                        Inasistencias Acumuladas Mayo 2026
                      </h4>
                      <p className="text-[9px] text-slate-400 font-bold">
                        Peso: 1.2 MB
                      </p>
                    </div>

                    <button 
                      onClick={() => triggerDownloadActa(1, 'Inasistencias Acumuladas Mayo 2026')}
                      disabled={downloadingActaId !== null}
                      className="w-full bg-white hover:bg-slate-100 text-slate-700 font-black text-[9px] py-2.5 rounded-xl uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-200"
                    >
                      {downloadingActaId === 1 ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#fe8204]" />
                      ) : (
                        <Download className="h-3.5 w-3.5 text-[#fe8204]" />
                      )}
                      <span>Descargar Acta</span>
                    </button>
                  </div>

                  {/* Report Card 2 */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-40">
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase tracking-wider w-fit">
                        EXCEL
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 leading-tight">
                        Planilla de Calificaciones - Primer Trimestre 5° "A"
                      </h4>
                      <p className="text-[9px] text-slate-400 font-bold">
                        Peso: 640 KB
                      </p>
                    </div>

                    <button 
                      onClick={() => triggerDownloadActa(2, 'Planilla de Calificaciones - Primer Trimestre 5° "A"')}
                      disabled={downloadingActaId !== null}
                      className="w-full bg-white hover:bg-slate-100 text-slate-700 font-black text-[9px] py-2.5 rounded-xl uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-200"
                    >
                      {downloadingActaId === 2 ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#fe8204]" />
                      ) : (
                        <Download className="h-3.5 w-3.5 text-[#fe8204]" />
                      )}
                      <span>Descargar Acta</span>
                    </button>
                  </div>

                  {/* Report Card 3 */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-40">
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-black text-[#fe8204] bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded uppercase tracking-wider w-fit">
                        PDF
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 leading-tight">
                        Informe de Diagnóstico de Trayectorias Escolares
                      </h4>
                      <p className="text-[9px] text-slate-400 font-bold">
                        Peso: 2.5 MB
                      </p>
                    </div>

                    <button 
                      onClick={() => triggerDownloadActa(3, 'Informe de Diagnóstico de Trayectorias Escolares')}
                      disabled={downloadingActaId !== null}
                      className="w-full bg-white hover:bg-slate-100 text-slate-700 font-black text-[9px] py-2.5 rounded-xl uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-200"
                    >
                      {downloadingActaId === 3 ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#fe8204]" />
                      ) : (
                        <Download className="h-3.5 w-3.5 text-[#fe8204]" />
                      )}
                      <span>Descargar Acta</span>
                    </button>
                  </div>

                </div>

              </div>
            )}

          </section>

        </main>

        {/* ===========================================
            --- 5. FULL LEGAJO OVERLAY (LIGHT THEME) ---
            =========================================== */}
        {isLegajoOpen && (
          <div className="fixed inset-0 z-50 bg-[#f8fafc] overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar text-slate-700">
            
            {/* Top Bar Navigation */}
            <div className="w-full pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-[#fe8204] text-white font-black text-[9px] uppercase tracking-wider">
                  AR v1.2
                </span>
                <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
                  LEGAJO DOCENTE DIGITAL
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Consola Provincial - Licencia Distribuida
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[9px] font-black uppercase text-[#fe8204]">
                  Prototipo Interactivo
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-[9px] font-black uppercase text-slate-500">
                  Propuesta Técnica (PM)
                </span>
                <button 
                  onClick={() => setIsLegajoOpen(false)}
                  className="bg-[#fe8204] border border-orange-600 text-white px-4 py-1.5 rounded-xl hover:bg-orange-600 transition-all text-[9.5px] font-black uppercase tracking-wider"
                >
                  Volver al Panel
                </button>
              </div>
            </div>

            {/* Profile Legajo Header Card (Light Mode White) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
              
              {/* Profile Image & Meta */}
              <div className="lg:col-span-3 flex flex-col sm:flex-row items-center gap-5">
                
                {/* Styled Professional Female Avatar block */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-orange-500/20 bg-slate-50 relative flex items-center justify-center flex-shrink-0 shadow-sm">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 to-transparent" />
                  <svg className="w-16 h-16 text-slate-400 mt-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#fe8204] text-[8px] font-black uppercase text-white leading-none">
                    G.J.D
                  </span>
                </div>

                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                      Prof. Gabriela Quiroga
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[8px] font-black uppercase border border-amber-200">
                      LEGAJO 446.1B
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase border border-emerald-200">
                      Puntaje de Juntas: 38.120 Ptos. (Sociales)
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Ciencias Sociales y Comunicación — <span className="text-[#fe8204] font-black">Docente de Grado Titular</span>
                  </p>
                  <p className="text-[10.5px] text-slate-500 font-bold">
                    Institución: Escuela Normal Sarmiento
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-[10px]">
                    <div><span className="text-slate-400 block font-bold">DNI / CUIL</span><span className="font-bold text-slate-800">27-32.454.894-3</span></div>
                    <div><span className="text-slate-400 block font-bold">ANTIGÜEDAD</span><span className="font-bold text-slate-800">12 años de trayectoria</span></div>
                    <div>
                      <span className="text-slate-400 block font-bold">ESTADO LABORAL</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span>Activo (Planta)</span>
                      </span>
                    </div>
                    <div><span className="text-slate-400 block font-bold">PUNTAJE HOMOLOGADO</span><span className="font-bold text-[#fe8204]">38.120 Ptos.</span></div>
                  </div>
                </div>

              </div>

              {/* Scoring card */}
              <div className="lg:col-span-1 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-[9px] font-black uppercase">
                  <span className="text-slate-400">SCORING DE COMPLETITUD</span>
                  <span className="text-[#fe8204]">94% Auditado Legal</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#fe8204] h-full rounded-full" style={{ width: '94%' }} />
                </div>
                <button 
                  onClick={() => showToast('📥 Certificado de legajo oficial descargado')}
                  className="w-full bg-[#fe8204] hover:bg-orange-600 text-white font-black text-[9px] py-2 rounded-xl uppercase tracking-widest transition-all shadow-sm"
                >
                  ↓ DESCARGAR CERTIFICADO OFICIAL
                </button>
              </div>

            </div>

            {/* Legajo Navbar */}
            <nav className="border-b border-slate-200 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider">
              <button 
                onClick={() => setActiveLegajoTab('profile')}
                className={`px-4 py-2 border-b-2 transition-all ${
                  activeLegajoTab === 'profile' ? 'border-[#fe8204] text-[#fe8204]' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Mi Perfil & Historial
              </button>
              <button 
                onClick={() => setActiveLegajoTab('ocr')}
                className={`px-4 py-2 border-b-2 transition-all ${
                  activeLegajoTab === 'ocr' ? 'border-[#fe8204] text-[#fe8204]' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Documentos & OCR por IA
              </button>
              <button 
                onClick={() => setActiveLegajoTab('attendance')}
                className={`px-4 py-2 border-b-2 transition-all ${
                  activeLegajoTab === 'attendance' ? 'border-[#fe8204] text-[#fe8204]' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Asistencia y Licencias
              </button>
              <button 
                onClick={() => setActiveLegajoTab('chat')}
                className={`px-4 py-2 border-b-2 transition-all ${
                  activeLegajoTab === 'chat' ? 'border-[#fe8204] text-[#fe8204]' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Asistente Conversacional IA
              </button>
            </nav>

            {/* LEGAJO DYNAMIC TAB CONTENT */}
            
            {/* TAB 1: MI PERFIL Y HISTORIAL */}
            {activeLegajoTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Left Details column */}
                <div className="lg:col-span-2 space-y-4">
                  
                  {/* INFORMACION DECLARADA */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-2">
                      INFORMACIÓN DECLARADA
                    </h4>
                    <div className="space-y-3.5 text-[10.5px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">DNI / CUIL:</span>
                        <span className="font-bold text-slate-700">27-32.454.894-3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">EMAIL INSTITUCIONAL:</span>
                        <span className="font-bold text-[#fe8204]">gabriela.quiroga@sanjuan.edu.ar</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">CONTACTO:</span>
                        <span className="font-bold text-slate-700">+54 9 264 458-1290</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">DOMICILIO DECLARADO:</span>
                        <span className="font-bold text-slate-700">Av. Libertador 742, Ciudad de San Juan</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-bold">ESTADO DE CUENTA:</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-black text-[8px] uppercase tracking-wider">
                          ACTIVADO
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CARRERA Y FORMACIÓN */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-2">
                      CARRERA & FORMACIÓN
                    </h4>
                    
                    <div className="space-y-4 text-[10px]">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-bold">Tramo de Desarrollo (CPEIP)</span>
                        <span className="px-2.5 py-1 rounded bg-[#fe8204] text-white font-black text-[8px] uppercase tracking-widest">
                          Experto I
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-slate-500 font-bold block">
                          COMPETENCIA DIGITAL (MARCO UE)
                        </span>
                        <div className="grid grid-cols-6 gap-1.5 text-center font-black text-[8px]">
                          {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((item, idx) => (
                            <div 
                              key={idx} 
                              className={`py-1 rounded border ${
                                item === 'B2' 
                                  ? 'bg-[#fe8204] border-orange-600 text-white font-black' 
                                  : 'bg-slate-50 border-slate-200 text-slate-400'
                              }`}
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="bg-slate-50 p-2.5 border border-slate-200 rounded-xl space-y-0.5">
                          <span className="text-slate-500 text-[8.5px] font-black uppercase block">Trienios activos</span>
                          <span className="text-xs font-black text-slate-700">4 (12 años)</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 border border-slate-200 rounded-xl space-y-0.5">
                          <span className="text-slate-500 text-[8.5px] font-black uppercase block">Sexenios formación</span>
                          <span className="text-xs font-black text-slate-700">2 (12 años)</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                        <span className="text-slate-500 font-bold">Capacitación Continua</span>
                        <span className="font-black text-[#fe8204]">180 hs</span>
                      </div>
                    </div>
                  </div>

                  {/* DESGLOSE DE PUNTAJE DE JUNTAS */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-2">
                      DESGLOSE DE PUNTAJE DE JUNTAS
                    </h4>
                    <div className="space-y-3.5 text-[10.5px]">
                      <div className="flex justify-between"><span className="text-slate-500 font-bold">Título Docente Base:</span> <span className="font-bold text-slate-700">9.00 Ptos</span></div>
                      <div className="flex justify-between"><span className="text-slate-500 font-bold">Promedio de Calificaciones:</span> <span className="font-bold text-slate-700">8.45 Ptos</span></div>
                      <div className="flex justify-between"><span className="text-slate-500 font-bold">Cargos & Antigüedad:</span> <span className="font-bold text-slate-700">12.00 Ptos</span></div>
                      <div className="flex justify-between"><span className="text-slate-500 font-bold">Cursos & Postgrados extra:</span> <span className="font-bold text-slate-700">8.67 Ptos</span></div>
                      <div className="flex justify-between items-center border-t border-slate-200 pt-3.5">
                        <span className="text-slate-500 font-black uppercase text-[10px]">PUNTAJE TOTAL:</span>
                        <span className="font-black text-[#fe8204] text-sm">38.120 Ptos. (Sociales)</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right History column */}
                <div className="lg:col-span-3 space-y-4">
                  
                  {/* Historial de Cargos y Antigüedad */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
                        <Calendar className="h-4.5 w-4.5 text-[#fe8204]" />
                        <span>Historial de Cargos y Antigüedad</span>
                      </h4>
                      <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">
                        Registros consolidados sincronizados de carrera docente interconectada.
                      </p>
                    </div>

                    {/* Timeline block */}
                    <div className="space-y-4 relative pl-4 border-l border-slate-100">
                      
                      {/* Item 1 */}
                      <div className="space-y-2 relative">
                        <div className="absolute -left-[20.5px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#fe8204] border border-white flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 text-[10px]">
                          <div className="flex items-center gap-2.5">
                            <h5 className="font-black text-slate-800 text-xs uppercase">
                              Maestra de Grado Titular 5° Grado A
                            </h5>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase tracking-wider border border-emerald-100">
                              TITULAR
                            </span>
                          </div>
                          <span className="text-slate-400 font-bold">2020-02-15 AL PRESENTE</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">
                          Escuela Normal Sarmiento
                        </p>
                        <p className="text-[9.5px] text-slate-400 font-medium">
                          Carga Horaria: 25 horas cátedra semanales.
                        </p>
                      </div>

                      {/* Item 2 */}
                      <div className="space-y-2 relative pt-4 border-t border-slate-100">
                        <div className="absolute -left-[20.5px] top-5 w-3.5 h-3.5 rounded-full bg-slate-300 border border-white flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-50" />
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 text-[10px]">
                          <div className="flex items-center gap-2.5">
                            <h5 className="font-black text-slate-700 text-xs uppercase">
                              Docente Suplente de Ciencias Sociales
                            </h5>
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[8px] font-black uppercase tracking-wider border border-amber-100">
                              INTERINO
                            </span>
                          </div>
                          <span className="text-slate-400 font-bold">2016-03-01 AL 2020-02-10</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">
                          Colegio Monseñor Pablo Cabrera
                        </p>
                        <p className="text-[9.5px] text-slate-400 font-medium">
                          Carga Horaria: 15 horas cátedra semanales.
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Juridical federal consolidador box */}
                  <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span>CONSOLIDADOR JURÍDICO FEDERAL</span>
                      </span>
                      <p className="text-[9.5px] text-slate-600 leading-relaxed font-medium">
                        Firmas distribuidas CHD-RST validadas en Junta de Clasificación de la provincia de San Juan.
                      </p>
                    </div>

                    <span className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-[9px] uppercase tracking-widest text-center flex-shrink-0">
                      CERTIFICADO VALIDADO
                    </span>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: DOCUMENTOS & OCR POR IA (1:1 with Screenshot 3) */}
            {activeLegajoTab === 'ocr' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                
                {/* Title */}
                <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase text-slate-800 tracking-wide flex items-center gap-2">
                    <UploadCloud className="h-5 w-5 text-[#fe8204]" />
                    <span>Auditoría de Títulos y Certificados mediante IA OCR</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 font-bold">
                    Sube tus archivos y diplomas. El motor de Inteligencia Artificial extraerá automáticamente metadatos legales y registrará tu puntaje ante el Ministerio de Educación.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  
                  {/* Left Upload Drag Box */}
                  <div 
                    onClick={handleDocUploadSimulate}
                    className="lg:col-span-2 border-2 border-dashed border-slate-200 hover:border-[#fe8204] bg-slate-50 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3 cursor-pointer group transition-all"
                  >
                    {isUploadingDoc ? (
                      <RefreshCw className="h-10 w-10 text-[#fe8204] animate-spin" />
                    ) : (
                      <UploadCloud className="h-10 w-10 text-slate-300 group-hover:text-[#fe8204] transition-all" />
                    )}
                    
                    <div className="space-y-1">
                      <span className="text-xs font-black text-slate-700 block group-hover:text-[#fe8204] transition-all">
                        {isUploadingDoc ? 'Subiendo y Auditando...' : 'Examinar archivos del legajo'}
                      </span>
                      <span className="text-[9px] text-slate-400 block font-bold">
                        Soporta PDF, PNG, JPG, JPEG
                      </span>
                    </div>

                    <span className="text-[8px] text-slate-400 font-bold block mt-2">
                      Estándar Seguro CID-931
                    </span>
                  </div>

                  {/* Right Document list table */}
                  <div className="lg:col-span-3 space-y-3">
                    <h5 className="text-[9.5px] font-black uppercase text-slate-400 tracking-widest">
                      DOCUMENTOS SINCRONIZADOS EN LEGAJO DIGITAL
                    </h5>

                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black uppercase text-slate-500 tracking-wider">
                            <th className="p-3">Nombre del Archivo</th>
                            <th className="p-3">Peso</th>
                            <th className="p-3">Estado Legal</th>
                            <th className="p-3 text-center">Integridad</th>
                            <th className="p-3 text-right">Fecha Auditoría</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-bold">
                          {uploadedDocs.map(doc => (
                            <tr key={doc.id} className="hover:bg-slate-50 transition-all text-slate-600">
                              <td className="p-3 text-slate-700 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-[#fe8204]" />
                                <span className="truncate max-w-[140px]">{doc.name}</span>
                              </td>
                              <td className="p-3 text-[10px] text-slate-400">{doc.size}</td>
                              <td className="p-3">
                                <span className={`inline-flex items-center gap-1 text-[8px] font-black ${
                                  doc.status === 'AUDITADO LEGAL' ? 'text-emerald-600' : 'text-amber-500'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    doc.status === 'AUDITADO LEGAL' ? 'bg-emerald-500' : 'bg-amber-500'
                                  }`} />
                                  <span>{doc.status}</span>
                                </span>
                              </td>
                              <td className="p-3 text-center text-emerald-600 text-[10px]">{doc.integrity}</td>
                              <td className="p-3 text-right text-[10px] text-slate-400">{doc.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 3: ASISTENCIA Y LICENCIAS (1:1 with Screenshot 4) */}
            {activeLegajoTab === 'attendance' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  
                  {/* Left License Solicitud Form */}
                  <form onSubmit={handleRegisterLicense} className="lg:col-span-2 space-y-4 bg-slate-50 p-5 border border-slate-200 rounded-2xl">
                    <h4 className="text-[10px] font-black uppercase text-slate-600 tracking-widest border-b border-slate-200 pb-2">
                      SOLICITUD DE LICENCIAS SANITARIAS Y ARTICULADAS
                    </h4>

                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        Motivo correspondiente / Artículo:
                      </label>
                      <select 
                        value={selectedLicenseArticle}
                        onChange={(e) => setSelectedLicenseArticle(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs focus:outline-none focus:ring-1 focus:ring-[#fe8204]"
                      >
                        <option value="Artículo 24 - Cuidado de familiar enfermo">Artículo 24 - Cuidado de familiar enfermo</option>
                        <option value="Artículo 18 - Licencia por Capacitación Certificada">Artículo 18 - Licencia por Capacitación Certificada</option>
                        <option value="Artículo 12 - Licencia por Asuntos Particulares">Artículo 12 - Licencia por Asuntos Particulares</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        Cargar Copia de Certificado Médico o Acta (PDF/JPG):
                      </label>
                      <div className="border-2 border-dashed border-slate-200 bg-white rounded-xl p-6 text-center flex flex-col items-center justify-center gap-2">
                        <UploadCloud className="h-6 w-6 text-slate-300" />
                        <span className="text-[9px] font-black text-[#fe8204] uppercase">
                          Elegir desde dispositivo
                        </span>
                        <span className="text-[8px] text-slate-400 font-bold">
                          Certificado firmado por profesional matriculado
                        </span>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#fe8204] hover:bg-orange-600 text-white font-black text-[10px] py-3 rounded-xl uppercase tracking-widest transition-all shadow-sm"
                    >
                      REGISTRAR SOLICITUD EN LEGAJO
                    </button>
                  </form>

                  {/* Right History panel */}
                  <div className="lg:col-span-3 space-y-4">
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                        Historial de Licencias e Inasistencias Justificadas
                      </h4>
                      <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">
                        Auditoría en tiempo real de cobertura docente en toda la Provincia de San Juan.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {registeredLicenses.map(lic => (
                        <div key={lic.id} className="bg-slate-50 p-4 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h5 className="text-xs font-black text-slate-700">{lic.article}</h5>
                            <p className="text-[9.5px] text-slate-400 font-bold">
                              Presentado: {lic.date} — <span className="text-slate-400 font-medium">{lic.signature}</span>
                            </p>
                          </div>
                          
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 font-black text-[8px] uppercase tracking-widest text-center flex-shrink-0">
                            APROBADA
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 4: ASISTENTE CONVERSACIONAL IA (1:1 with Screenshot 5) */}
            {activeLegajoTab === 'chat' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-5">
                
                {/* Chat window */}
                <div className="border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden flex flex-col justify-between h-[380px]">
                  
                  {/* Header info */}
                  <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 text-[#fe8204] flex items-center justify-center font-black text-xs">
                      S.IA
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-800 leading-none">
                        Sanjuanito IA Consultor Juntas
                      </h4>
                      <span className="text-[8px] text-slate-400 font-black uppercase tracking-wider block mt-1">
                        NORMAS, PUNTAJES Y REGULACIÓN DE JUNTAS
                      </span>
                    </div>
                  </div>

                  {/* Messages list */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar text-xs font-bold">
                    {chatMessages.map((msg, i) => (
                      <div 
                        key={i} 
                        className={`flex gap-3 max-w-[85%] ${
                          msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                        }`}
                      >
                        <div className={`w-6.5 h-6.5 rounded-full flex-shrink-0 flex items-center justify-center font-black text-[9px] ${
                          msg.sender === 'user' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-[#fe8204]'
                        }`}>
                          {msg.sender === 'user' ? 'G.Q' : 'IA'}
                        </div>

                        <div className={`p-3.5 rounded-2xl text-slate-700 leading-relaxed font-medium ${
                          msg.sender === 'user' 
                            ? 'bg-[#fe8204]/10 rounded-tr-none' 
                            : 'bg-white border border-slate-200 rounded-tl-none'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}

                    {isChatTyping && (
                      <div className="flex gap-3 mr-auto max-w-[85%]">
                        <div className="w-6.5 h-6.5 rounded-full bg-orange-100 text-[#fe8204] flex items-center justify-center font-black text-[9px]">
                          IA
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 rounded-tl-none text-[10px] text-slate-400 font-black tracking-widest animate-pulse">
                          Sanjuanito IA escribiendo...
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom input area */}
                  <div className="p-3 border-t border-slate-200 bg-white">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={aiLegajoInput}
                        onChange={(e) => setAiLegajoInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendLegajoMessage()}
                        placeholder="Pregúntame sobre puntaje, Artículo 24 o validación de títulos..."
                        className="flex-1 pl-4 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#fe8204] text-xs font-bold text-slate-800 placeholder-slate-400"
                      />
                      <button 
                        onClick={() => handleSendLegajoMessage()}
                        className="bg-[#fe8204] hover:bg-orange-600 text-white font-black text-[10px] px-5 py-2 rounded-xl uppercase tracking-wider transition-all flex items-center gap-1.5"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Preguntar</span>
                      </button>
                    </div>

                    {/* Quick suggestion buttons */}
                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100 mt-2 text-[9px] font-black uppercase text-slate-400">
                      <span>Consultas Sugeridas:</span>
                      <button 
                        onClick={() => handleSendLegajoMessage('Puntaje Docente')}
                        className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 hover:border-[#fe8204] hover:text-[#fe8204] transition-all flex items-center gap-1 text-[8.5px]"
                      >
                        <FileText className="h-3 w-3" />
                        <span>Puntaje Docente</span>
                      </button>
                      <button 
                        onClick={() => handleSendLegajoMessage('Artículo 24 Licencias')}
                        className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 hover:border-[#fe8204] hover:text-[#fe8204] transition-all flex items-center gap-1 text-[8.5px]"
                      >
                        <Calendar className="h-3 w-3" />
                        <span>Artículo 24 Licencias</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </div>
    );
  }

  // ==========================================
  // --- GENERAL MULTI-PORTAL SELECTION VIEW ---
  // ==========================================
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 font-sans selection:bg-orange-500/30 overflow-x-hidden">
      
      {/* Header Bar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link 
            href="/mapa"
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all hover:scale-105"
            title="Volver al Mapa Escolar"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500/10 text-[#fe8204] border border-orange-500/20">
              <School className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xs font-black uppercase tracking-widest text-[#fe8204] leading-none">
                Ministerio de Educación
              </h1>
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block mt-1">
                Ecosistema Integrado SUE
              </span>
            </div>
          </div>
        </div>

        {/* Unified Profile Switcher Pills + Cerrar Sesión */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-slate-50 border border-slate-200">
            <button 
              onClick={() => setSelectedRole('MINISTERIO')}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                selectedRole === 'MINISTERIO' 
                  ? 'bg-[#fe8204] text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
              }`}
            >
              Ministerio
            </button>
            <button 
              onClick={() => setSelectedRole('DIRECTIVO')}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                selectedRole === 'DIRECTIVO' 
                  ? 'bg-[#fe8204] text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
              }`}
            >
              Directivo
            </button>
            <button 
              onClick={() => setSelectedRole('DOCENTE')}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                selectedRole === 'DOCENTE' 
                  ? 'bg-[#fe8204] text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
              }`}
            >
              Docente
            </button>
            <button 
              onClick={() => setSelectedRole('PADRE')}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                selectedRole === 'PADRE' 
                  ? 'bg-[#fe8204] text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
              }`}
            >
              Padres
            </button>
            <button 
              onClick={() => setSelectedRole('ALUMNO')}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                selectedRole === 'ALUMNO' 
                  ? 'bg-[#fe8204] text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
              }`}
            >
              Alumnos
            </button>
          </div>

          <button 
            onClick={() => {
              setIsLoggedIn(false);
              showToast('👋 Sesión cerrada correctamente');
            }}
            className="bg-red-50 hover:bg-red-100 text-red-500 rounded-xl px-4 py-2.5 border border-red-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all hover:scale-105 shadow-sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">

        {/* 1. Hero Block */}
        <section className="text-center py-6 space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-[#fe8204] border border-orange-500/20 text-[9px] font-black uppercase tracking-widest animate-pulse">
            <Activity className="h-3 w-3" />
            <span>Consola de Simulación Administrativa</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-800 leading-none">
            SUE - <span className="text-[#fe8204]">Sistema Único Educativo</span>
          </h2>
          <p className="text-slate-500 font-medium text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            "Toda la educación de San Juan en un solo lugar"<br/>
            <span className="text-[11px] text-slate-400 block mt-1.5 font-bold">
              El ecosistema digital integrado que moderniza la gestión, el aprendizaje, el acompañamiento familiar y la toma de decisiones estatales.
            </span>
          </p>
        </section>

        {/* 2. Interactive KPI Counter Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden group">
            <div className="p-3.5 rounded-2xl bg-orange-500/10 text-[#fe8204] border border-orange-500/10">
              <School className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[20px] font-black text-slate-800 leading-none block">
                {schoolsCount}
              </span>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black mt-1 block">
                Escuelas Activas
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden group">
            <div className="p-3.5 rounded-2xl bg-orange-500/10 text-[#fe8204] border border-orange-500/10">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[20px] font-black text-slate-800 leading-none block">
                {formatNumber(teachersCount)}
              </span>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black mt-1 block">
                Docentes Registrados
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden group">
<div className="p-3.5 rounded-2xl bg-orange-500/10 text-[#fe8204] border border-orange-500/10">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[20px] font-black text-slate-800 leading-none block">
                {formatNumber(studentsCount)}
              </span>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black mt-1 block">
                Alumnos Matriculados
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden group">
            <div className="p-3.5 rounded-2xl bg-orange-500/10 text-[#fe8204] border border-orange-500/10">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[20px] font-black text-slate-800 leading-none block">
                {deptsCount}
              </span>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black mt-1 block">
                Edificios Escolares
              </span>
            </div>
          </div>

        </section>

        {/* 3. Elegí tu portal de acceso Cards */}
        <section className="space-y-4">
          
          <div className="text-center space-y-1">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">
              Elegí tu portal de acceso
            </h3>
            <p className="text-[10px] text-slate-400 font-bold">
              La experiencia se adapta automáticamente según las funciones de cada miembro de la comunidad educativa.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            {/* Docente Card */}
            <button 
              onClick={() => handleSelectPortal('DOCENTE')}
              className="bg-white p-5 rounded-3xl text-left transition-all hover:border-[#fe8204] hover:shadow-md flex flex-col justify-between h-44 border border-slate-200"
            >
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-[#fe8204] border border-orange-500/20 w-fit">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 mt-4">
                <span className="text-[8px] font-black uppercase tracking-wider text-[#fe8204]">Aula Conectada</span>
                <h4 className="text-xs font-black uppercase tracking-wide text-slate-800">Docentes</h4>
                <p className="text-[9px] text-slate-500 font-medium leading-snug line-clamp-3">
                  Carga de notas, asistencia, planificaciones guiadas por IA y legajo digital.
                </p>
              </div>
            </button>

            {/* Alumno Card */}
            <button 
              onClick={() => handleSelectPortal('ALUMNO')}
              className="bg-white p-5 rounded-3xl text-left transition-all hover:border-[#fe8204] hover:shadow-md flex flex-col justify-between h-44 border border-slate-200"
            >
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-[#fe8204] border border-orange-500/20 w-fit">
                <Brain className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 mt-4">
                <span className="text-[8px] font-black uppercase tracking-wider text-[#fe8204]">Estudiante Digital</span>
                <h4 className="text-xs font-black uppercase tracking-wide text-slate-800">Alumnos</h4>
                <p className="text-[9px] text-slate-500 font-medium leading-snug line-clamp-3">
                  Tareas, progreso gamificado, insignias y tutor virtual de aprendizaje.
                </p>
              </div>
            </button>

            {/* Padres Card */}
            <button 
              onClick={() => handleSelectPortal('PADRE')}
              className="bg-white p-5 rounded-3xl text-left transition-all hover:border-[#fe8204] hover:shadow-md flex flex-col justify-between h-44 border border-slate-200"
            >
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-[#fe8204] border border-orange-500/20 w-fit">
                <Users className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 mt-4">
                <span className="text-[8px] font-black uppercase tracking-wider text-[#fe8204]">Familia Activa</span>
                <h4 className="text-xs font-black uppercase tracking-wide text-slate-800">Padres / Tutores</h4>
                <p className="text-[9px] text-slate-500 font-medium leading-snug line-clamp-3">
                  Boletín digital, firma electrónica de autorizaciones y control de asistencia.
                </p>
              </div>
            </button>

            {/* Directivos Card */}
            <button 
              onClick={() => handleSelectPortal('DIRECTIVO')}
              className="bg-white p-5 rounded-3xl text-left transition-all hover:border-[#fe8204] hover:shadow-md flex flex-col justify-between h-44 border border-slate-200"
            >
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-[#fe8204] border border-orange-500/20 w-fit">
                <Layers className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 mt-4">
                <span className="text-[8px] font-black uppercase tracking-wider text-[#fe8204]">Gestión Institucional</span>
                <h4 className="text-xs font-black uppercase tracking-wide text-slate-800">Directivos</h4>
                <p className="text-[9px] text-slate-500 font-medium leading-snug line-clamp-3">
                  Análisis institucional de rendimiento, asistencia general y ausentismo docente.
                </p>
              </div>
            </button>

            {/* Ministerio Card */}
            <button 
              onClick={() => handleSelectPortal('MINISTERIO')}
              className="bg-white p-5 rounded-3xl text-left transition-all hover:border-[#fe8204] hover:shadow-md flex flex-col justify-between h-44 border border-slate-200"
            >
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-[#fe8204] border border-orange-500/20 w-fit">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 mt-4">
                <span className="text-[8px] font-black uppercase tracking-wider text-[#fe8204]">Torre de Control</span>
                <h4 className="text-xs font-black uppercase tracking-wide text-slate-800">Ministerio</h4>
                <p className="text-[9px] text-slate-500 font-medium leading-snug line-clamp-3">
                  Monitoreo provincial, mapas en tiempo real, alertas de infraestructura y conectividad.
                </p>
              </div>
            </button>

          </div>
        </section>

        {/* 4. Active Role Portal Dynamic Dashboard Workspace (Ministerio/Directivo/Padre/Alumno) */}
        {isLoggedIn ? (
          <section className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
          
          {/* Workspace Title Bar */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fe8204] animate-ping" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 flex items-center gap-2">
                Ecosistema Simulado SUE: 
                <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-orange-500/10 text-[#fe8204]">
                  Portal {selectedRole}
                </span>
              </h3>
            </div>
            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              Autenticación RBAC Simulada
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[500px]">
            
            {/* Workspace Navigation Sidebar */}
            <aside className="lg:col-span-1 border-r border-slate-200 bg-slate-50/50 p-4 space-y-1">
              {selectedRole === 'ALUMNO' && (
                <>
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={`w-full px-4 py-3 rounded-xl text-left text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                      activeTab === 'overview' ? 'bg-[#fe8204] text-white font-black' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Layers className="h-4 w-4" />
                    <span>Mi Ruta Escolar</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('grades')}
                    className={`w-full px-4 py-3 rounded-xl text-left text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                      activeTab === 'grades' ? 'bg-[#fe8204] text-white font-black' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <FileSignature className="h-4 w-4" />
                    <span>Boletín & Notas</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('attendance')}
                    className={`w-full px-4 py-3 rounded-xl text-left text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                      activeTab === 'attendance' ? 'bg-[#fe8204] text-white font-black' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>Asistencia & Faltas</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('discipline')}
                    className={`w-full px-4 py-3 rounded-xl text-left text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                      activeTab === 'discipline' ? 'bg-[#fe8204] text-white font-black' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ShieldAlert className="h-4 w-4" />
                    <span>Amonestaciones</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('schedule')}
                    className={`w-full px-4 py-3 rounded-xl text-left text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                      activeTab === 'schedule' ? 'bg-[#fe8204] text-white font-black' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Horarios</span>
                  </button>
                </>
              )}

              {selectedRole === 'PADRE' && (
                <>
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={`w-full px-4 py-3 rounded-xl text-left text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                      activeTab === 'overview' ? 'bg-[#fe8204] text-white font-black' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Ficha de Asistencia</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('authorizations')}
                    className={`w-full px-4 py-3 rounded-xl text-left text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                      activeTab === 'authorizations' ? 'bg-[#fe8204] text-white font-black' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <FileSignature className="h-4 w-4" />
                    <span>Autorizaciones</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('alerts')}
                    className={`w-full px-4 py-3 rounded-xl text-left text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                      activeTab === 'alerts' ? 'bg-[#fe8204] text-white font-black' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <BellRing className="h-4 w-4" />
                    <span>Comunicados</span>
                  </button>
                </>
              )}

              {selectedRole === 'DIRECTIVO' && (
                <>
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={`w-full px-4 py-3 rounded-xl text-left text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                      activeTab === 'overview' ? 'bg-[#fe8204] text-white font-black' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Estadísticas de Escuela</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('recruitment')}
                    className={`w-full px-4 py-3 rounded-xl text-left text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                      activeTab === 'recruitment' ? 'bg-[#fe8204] text-white font-black' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Cargar Suplencia</span>
                  </button>
                </>
              )}

              {selectedRole === 'MINISTERIO' && (
                <>
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={`w-full px-4 py-3 rounded-xl text-left text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                      activeTab === 'overview' ? 'bg-[#fe8204] text-white font-black' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ShieldAlert className="h-4 w-4" />
                    <span>Torre de Alertas</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('transit')}
                    className={`w-full px-4 py-3 rounded-xl text-left text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                      activeTab === 'transit' ? 'bg-[#fe8204] text-white font-black' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Bus className="h-4 w-4" />
                    <span>Redes de Colectivo</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('audit-logs')}
                    className={`w-full px-4 py-3 rounded-xl text-left text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                      activeTab === 'audit-logs' ? 'bg-[#fe8204] text-white font-black' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Auditoría de Procesos</span>
                  </button>
                </>
              )}

              <div className="pt-8 border-t border-slate-200 mt-8 px-2 space-y-2">
                <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest block">Establecimiento Oficial</span>
                <span className="text-[10px] text-slate-700 font-bold block leading-tight">Col. Nac. Pablo Cabrera</span>
                <span className="text-[9px] text-slate-400 font-medium block">CUE: 700012300</span>
              </div>
            </aside>

            {/* Workspace Active Dashboard Page Content */}
            <div className="lg:col-span-3 p-6 bg-slate-50/20">
              
              {/* -------------------- PORTAL ALUMNO PANEL -------------------- */}
              {selectedRole === 'ALUMNO' && (
                <div className="space-y-6">
                  
                  {/* GAMIFIED TOP CARD PROFILE (letters MA, progress bar, streak, ranking) */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-2xl" />
                    
                    {/* Left profile name */}
                    <div className="flex items-center gap-4 z-10">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500 border border-emerald-600 text-white font-black flex items-center justify-center text-lg shadow-sm">
                        MA
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-black text-slate-800 uppercase tracking-tight leading-none">
                          Mateo Fernández
                        </h4>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                          5° Grado "A" - Turno Mañana
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-black text-[7.5px] uppercase tracking-widest border border-emerald-200">
                          AULA DIGITAL ACTIVA
                        </span>
                      </div>
                    </div>

                    {/* XP Progress Bar */}
                    <div className="flex-1 max-w-sm w-full space-y-2 z-10">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase">
                        <span className="text-slate-400">Progreso de Nivel</span>
                        <span className="text-slate-700 font-bold">2.450 / 5.000 XP</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full border border-slate-200 overflow-hidden">
                        <div className="bg-[#fe8204] h-full rounded-full" style={{ width: '49%' }} />
                      </div>
                      <span className="text-[8px] text-[#fe8204] font-black uppercase block tracking-wider">
                        🏆 Siguiente meta: Guardapolvo de Oro (+1550 XP)
                      </span>
                    </div>

                    {/* Streak Count & Rank */}
                    <div className="flex items-center gap-4 z-10 self-stretch justify-around md:self-auto">
                      <div className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-150">
                        <span className="text-[10px] text-slate-400 font-black uppercase block tracking-widest">Racha de Días</span>
                        <span className="text-sm font-black text-[#fe8204] uppercase flex items-center justify-center gap-1 mt-0.5">
                          🔥 12 Días
                        </span>
                      </div>
                      <div className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-150">
                        <span className="text-[10px] text-slate-400 font-black uppercase block tracking-widest">Ranking</span>
                        <span className="text-sm font-black text-[#fe8204] mt-0.5 block">
                          #4 de 5° "A"
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* TAB 1: RUTA ESCOLAR (Duolingo Timeline path left + Sanjuanito & Biblioteca right) */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        
                        {/* Left column - Route Roadmap Timeline */}
                        <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-8 relative overflow-hidden">
                          
                          {/* Header */}
                          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <div>
                              <h5 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                                <Award className="h-4.5 w-4.5 text-[#fe8204]" />
                                <span>Ruta Escolar Interactiva</span>
                              </h5>
                              <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
                                Completa lecciones para habilitar proezas académicas e insignias.
                              </p>
                            </div>

                            <span className="px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[9px] font-black uppercase text-[#fe8204]">
                              Curso: Matemática
                            </span>
                          </div>

                          {/* Gamified Route nodes (Duolingo-style centered vertical path) */}
                          <div className="flex flex-col items-center space-y-6 py-6 relative">
                            
                            {/* Running connecting vertical line */}
                            <div className="absolute top-10 bottom-10 w-1 bg-gradient-to-b from-emerald-500 via-[#fe8204] to-slate-200" />

                            {/* Node 1: Comenzando Fracciones (Completed) */}
                            <div className="flex flex-col items-center text-center space-y-1 relative z-10">
                              <button 
                                onClick={() => showToast('✓ Lección "Comenzando Fracciones" completada. ¡Buen trabajo!')}
                                className="w-12 h-12 rounded-full bg-emerald-500 border-2 border-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-110 transition-all"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                              <span className="text-[10px] font-black text-slate-800 uppercase block">Comenzando Fracciones</span>
                              <span className="text-[8px] text-slate-400 font-bold uppercase block tracking-wider">BÁSICO — +150 XP</span>
                            </div>

                            {/* Node 2: Fracciones Equivalentes (Completed) */}
                            <div className="flex flex-col items-center text-center space-y-1 relative z-10">
                              <button 
                                onClick={() => showToast('✓ Lección "Fracciones Equivalentes" completada. ¡Sumaste +300 XP!')}
                                className="w-12 h-12 rounded-full bg-emerald-500 border-2 border-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-110 transition-all"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                              <span className="text-[10px] font-black text-slate-800 uppercase block">Fracciones Equivalentes</span>
                              <span className="text-[8px] text-slate-400 font-bold uppercase block tracking-wider">DESAFÍO — +300 XP</span>
                            </div>

                            {/* Node 3: Suma de Fracciones (Current Active) */}
                            <div className="flex flex-col items-center text-center space-y-1 relative z-10">
                              
                              {/* Pulse notification label */}
                              <span className="px-2 py-0.5 rounded bg-red-500 text-white text-[7px] font-black uppercase tracking-widest animate-bounce mb-1">
                                ¡AQUÍ!
                              </span>
                              
                              <button 
                                onClick={() => showToast('✨ Iniciando Lección Interactiva: "Suma de Fracciones"')}
                                className="w-14 h-14 rounded-full bg-[#fe8204] border-2 border-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 hover:scale-110 transition-all relative animate-pulse"
                              >
                                <Play className="h-6 w-6 fill-current text-white translate-x-0.5" />
                              </button>
                              <span className="text-[10.5px] font-black text-slate-800 uppercase block">Suma de Fracciones</span>
                              <span className="text-[8px] text-[#fe8204] font-black uppercase block tracking-wider">LECCIÓN — +200 XP</span>
                            </div>

                            {/* Node 4: Resta y Números Mixtos (Locked) */}
                            <div className="flex flex-col items-center text-center space-y-1 relative z-10 opacity-60">
                              <button 
                                disabled
                                className="w-12 h-12 rounded-full bg-slate-200 border-2 border-slate-300 text-slate-400 flex items-center justify-center cursor-not-allowed"
                              >
                                <Lock className="h-5 w-5" />
                              </button>
                              <span className="text-[10px] font-black text-slate-800 uppercase block">Resta y Números Mixtos</span>
                              <span className="text-[8px] text-slate-400 font-bold uppercase block tracking-wider">LECCIÓN — +200 XP</span>
                            </div>

                            {/* Node 5: Desafío del Rector (Locked Jefe) */}
                            <div className="flex flex-col items-center text-center space-y-1 relative z-10 opacity-50">
                              <button 
                                disabled
                                className="w-12 h-12 rounded-full bg-slate-200 border-2 border-slate-300 text-slate-400 flex items-center justify-center cursor-not-allowed"
                              >
                                <Lock className="h-5 w-5" />
                              </button>
                              <span className="text-[10px] font-black text-slate-800 uppercase block">Desafío del Rector</span>
                              <span className="text-[8px] text-slate-400 font-bold uppercase block tracking-wider">JEFE — +500 XP</span>
                            </div>

                          </div>

                        </div>

                        {/* Right column - Sanjuanito Tutor chat widget & Biblioteca */}
                        <div className="lg:col-span-2 space-y-6">
                          
                          {/* Sanjuanito Tutor */}
                          <div className="border border-slate-200 rounded-3xl bg-slate-50 overflow-hidden flex flex-col justify-between h-[310px] shadow-sm">
                            
                            {/* Header */}
                            <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-orange-100 border border-orange-200 text-[#fe8204] flex items-center justify-center font-black text-xs">
                                  S.T
                                </div>
                                <div>
                                  <h6 className="text-[10.5px] font-black uppercase text-slate-800 leading-none">
                                    Sanjuanito Tutor
                                  </h6>
                                  <span className="text-[7.5px] text-slate-400 font-black uppercase tracking-wider block mt-0.5">
                                    IA TUTOR ESCOLAR
                                  </span>
                                </div>
                              </div>

                              <button 
                                onClick={() => showToast('✨ Tutor Virtual maximizado')}
                                className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 font-black text-[8px] uppercase tracking-wider"
                              >
                                PANTALLA COMPLETA
                              </button>
                            </div>

                            {/* Message box */}
                            <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar text-[10.5px] font-bold">
                              
                              <div className="flex gap-2 mr-auto max-w-[85%]">
                                <div className="w-6 h-6 rounded-full bg-orange-100 text-[#fe8204] flex items-center justify-center font-black text-[8.5px] flex-shrink-0">
                                  IA
                                </div>
                                <div className="p-3 rounded-2xl bg-white border border-slate-200 rounded-tl-none text-slate-600 font-medium leading-relaxed">
                                  ¡Hola Mateo! Soy Sanjuanito, tu tutor virtual. 😉 ¿En qué tarea te ayudo hoy de la escuela?
                                </div>
                              </div>

                              {aiChatResponse && (
                                <div className="flex gap-2 mr-auto max-w-[85%]">
                                  <div className="w-6 h-6 rounded-full bg-orange-100 text-[#fe8204] flex items-center justify-center font-black text-[8.5px] flex-shrink-0">
                                    IA
                                  </div>
                                  <div className="p-3 rounded-2xl bg-white border border-slate-200 rounded-tl-none text-slate-600 font-medium leading-relaxed font-mono">
                                    {aiChatResponse}
                                  </div>
                                </div>
                              )}

                              {aiChatLoading && (
                                <div className="flex gap-2 mr-auto max-w-[85%]">
                                  <div className="w-6 h-6 rounded-full bg-orange-100 text-[#fe8204] flex items-center justify-center font-black text-[8.5px] flex-shrink-0">
                                    IA
                                  </div>
                                  <div className="p-3 rounded-2xl bg-white border border-slate-200 rounded-tl-none text-slate-400 font-black tracking-widest animate-pulse text-[8.5px]">
                                    Sanjuanito IA pensando...
                                  </div>
                                </div>
                              )}

                            </div>

                            {/* Suggestions and input bar */}
                            <div className="p-3 border-t border-slate-200 bg-white space-y-2.5">
                              
                              {/* Suggestions */}
                              <div className="flex gap-1.5 text-[8px] font-black uppercase text-slate-400 items-center">
                                <button 
                                  onClick={() => {
                                    setAiQuestion('Explicar fracciones');
                                    showToast('📚 Consultando fracciones...');
                                    setTimeout(() => askAITutor(), 100);
                                  }}
                                  className="px-2 py-0.5 rounded bg-slate-50 border border-slate-250 hover:border-[#fe8204] hover:text-[#fe8204] transition-all flex items-center gap-1"
                                >
                                  <span>Explicar Fracciones 📚</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    setAiQuestion('Viento Zonda en San Juan');
                                    showToast('☁️ Consultando zonda...');
                                    setTimeout(() => askAITutor(), 100);
                                  }}
                                  className="px-2 py-0.5 rounded bg-slate-50 border border-slate-250 hover:border-[#fe8204] hover:text-[#fe8204] transition-all flex items-center gap-1"
                                >
                                  <span>Viento Zonda ☁️</span>
                                </button>
                              </div>

                              {/* Input bar */}
                              <div className="flex gap-1.5">
                                <input 
                                  type="text"
                                  value={aiQuestion}
                                  onChange={(e) => setAiQuestion(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && askAITutor()}
                                  placeholder="Pregúntame lo que desees sobre la tarea..."
                                  className="flex-1 pl-3 pr-2 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#fe8204] text-[10px] text-slate-800 placeholder-slate-400 font-bold"
                                />
                                <button 
                                  onClick={askAITutor}
                                  className="bg-[#fe8204] hover:bg-orange-600 text-white rounded-xl px-3 py-2 flex items-center justify-center transition-all"
                                >
                                  <Send className="h-3.5 w-3.5" />
                                </button>
                              </div>

                            </div>

                          </div>

                          {/* Biblioteca Escolar Indigo Card */}
                          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-5 rounded-3xl border border-indigo-700/20 text-white space-y-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl" />
                            
                            <div className="space-y-1.5 z-10">
                              <h6 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                                <BookOpen className="h-4.5 w-4.5" />
                                <span>Biblioteca Escolar</span>
                              </h6>
                              <p className="text-[10px] text-indigo-100 font-medium leading-relaxed">
                                Accede a más de 120 libros de autores regionales sanjuaninos y guías de Ischigualasto en PDF.
                              </p>
                            </div>

                            <button 
                              onClick={() => showToast('📖 Accediendo a la biblioteca provincial SUE...')}
                              className="w-fit bg-white hover:bg-slate-50 text-indigo-700 font-black text-[9px] px-4 py-2 rounded-xl uppercase tracking-widest transition-all shadow-sm z-10"
                            >
                              Ver Libros Provinciales
                            </button>
                          </div>

                        </div>

                      </div>

                      {/* Bottom Section - Insignias de Honor */}
                      <div className="space-y-3.5">
                        <h5 className="text-xs font-black uppercase text-slate-700">
                          Mis Insignias de Honor
                        </h5>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          
                          {/* Insignia 1 */}
                          <div className="bg-white p-4 border border-slate-200 rounded-2xl text-center flex flex-col items-center justify-center space-y-2 hover:border-orange-500/30 transition-all shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#fe8204] flex items-center justify-center">
                              <Award className="h-5 w-5" />
                            </div>
                            <div>
                              <span className="text-[9.5px] font-black text-slate-800 uppercase block leading-none">Asistencia Perfecta</span>
                              <span className="text-[8px] text-slate-400 font-bold block mt-1 leading-tight">Concurrido todos los días de clase</span>
                            </div>
                          </div>

                          {/* Insignia 2 */}
                          <div className="bg-white p-4 border border-slate-200 rounded-2xl text-center flex flex-col items-center justify-center space-y-2 hover:border-orange-500/30 transition-all shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
                              <Award className="h-5 w-5" />
                            </div>
                            <div>
                              <span className="text-[9.5px] font-black text-slate-800 uppercase block leading-none">Matemático Estrella</span>
                              <span className="text-[8px] text-slate-400 font-bold block mt-1 leading-tight">Cien puntos en problemas lógicos</span>
                            </div>
                          </div>

                          {/* Insignia 3 */}
                          <div className="bg-white p-4 border border-slate-200 rounded-2xl text-center flex flex-col items-center justify-center space-y-2 hover:border-orange-500/30 transition-all shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center">
                              <Award className="h-5 w-5" />
                            </div>
                            <div>
                              <span className="text-[9.5px] font-black text-slate-800 uppercase block leading-none">Lector Voraz</span>
                              <span className="text-[8px] text-slate-400 font-bold block mt-1 leading-tight">Terminó todas las lecturas de Lengua</span>
                            </div>
                          </div>

                          {/* Insignia 4 */}
                          <div className="bg-white p-4 border border-slate-200 rounded-2xl text-center flex flex-col items-center justify-center space-y-2 hover:border-orange-500/30 transition-all shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center">
                              <Award className="h-5 w-5" />
                            </div>
                            <div>
                              <span className="text-[9.5px] font-black text-slate-800 uppercase block leading-none">Buen Compañero</span>
                              <span className="text-[8px] text-slate-400 font-bold block mt-1 leading-tight">Elegido tutor de aula virtual</span>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: BOLETÍN & NOTAS (User requested grades list) */}
                  {activeTab === 'grades' && (
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                      <div>
                        <h5 className="text-xs font-black uppercase text-slate-800">Boletín Oficial de Calificaciones</h5>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Consolidado digital del primer trimestre homologado.</p>
                      </div>

                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
                        <table className="w-full text-left border-collapse font-bold">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black uppercase text-slate-500 tracking-wider">
                              <th className="p-3">Asignatura</th>
                              <th className="p-3 text-center">Trimestre 1</th>
                              <th className="p-3 text-center">Calificación Promedio</th>
                              <th className="p-3 text-right">Estado Académico</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-600">
                            <tr className="hover:bg-slate-50 transition-all">
                              <td className="p-3 text-slate-800">Matemática</td>
                              <td className="p-3 text-center text-slate-700">9 / 10</td>
                              <td className="p-3 text-center text-[#fe8204]">9.00</td>
                              <td className="p-3 text-right">
                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-black uppercase">Aprobado</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition-all">
                              <td className="p-3 text-slate-800">Lengua y Literatura</td>
                              <td className="p-3 text-center text-slate-700">8 / 10</td>
                              <td className="p-3 text-center text-[#fe8204]">8.00</td>
                              <td className="p-3 text-right">
                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-black uppercase">Aprobado</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition-all">
                              <td className="p-3 text-slate-800">Ciencias Sociales</td>
                              <td className="p-3 text-center text-slate-700">10 / 10</td>
                              <td className="p-3 text-center text-[#fe8204]">10.00</td>
                              <td className="p-3 text-right">
                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-black uppercase">Aprobado</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition-all">
                              <td className="p-3 text-slate-800">Ciencias Naturales</td>
                              <td className="p-3 text-center text-slate-700">8 / 10</td>
                              <td className="p-3 text-center text-[#fe8204]">8.00</td>
                              <td className="p-3 text-right">
                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-black uppercase">Aprobado</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition-all">
                              <td className="p-3 text-slate-800">Educación Física</td>
                              <td className="p-3 text-center text-slate-700">9 / 10</td>
                              <td className="p-3 text-center text-[#fe8204]">9.00</td>
                              <td className="p-3 text-right">
                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-black uppercase">Aprobado</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: ASISTENCIA & FALTAS (User requested attendance summary) */}
                  {activeTab === 'attendance' && (
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                      <div>
                        <h5 className="text-xs font-black uppercase text-slate-800">Regularidad y Control de Inasistencias</h5>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Auditoría diaria para justificación oficial.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center space-y-1">
                          <span className="text-[20px] font-black text-emerald-600 block">97%</span>
                          <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">ASISTENCIA TOTAL</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center space-y-1">
                          <span className="text-[20px] font-black text-[#fe8204] block">1</span>
                          <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">FALTA JUSTIFICADA</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center space-y-1">
                          <span className="text-[20px] font-black text-red-500 block">0</span>
                          <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">FALTAS INJUSTIFICADAS</span>
                        </div>
                      </div>

                      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-[10px] text-emerald-700 font-black uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <span>¡Habilitado! Tienes regularidad óptima de cursado provincial.</span>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: AMONESTACIONES & CONDUCTA (User requested disciplinary warnings) */}
                  {activeTab === 'discipline' && (
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                      <div>
                        <h5 className="text-xs font-black uppercase text-slate-800">Registro de Convivencia y Amonestaciones</h5>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Seguimiento institucional de disciplina civil.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-center text-center">
                          <span className="text-slate-400 text-[10px] font-black uppercase block tracking-widest">AMONESTACIONES APLICADAS</span>
                          <span className="text-3xl font-black text-emerald-600 block">0 / 25</span>
                          <span className="text-[8px] text-slate-400 font-bold uppercase block tracking-wider mt-1">Ninguna sanción registrada</span>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-center text-center">
                          <span className="text-slate-400 text-[10px] font-black uppercase block tracking-widest">CALIFICACIÓN DE CONDUCTA</span>
                          <span className="text-2xl font-black text-[#fe8204] block">Sobresaliente</span>
                          <span className="text-[8px] text-slate-400 font-bold uppercase block tracking-wider mt-1">Conducta General: 10 / 10</span>
                        </div>
                      </div>

                      <div className="border border-slate-200 p-4.5 rounded-2xl space-y-1.5">
                        <span className="text-[8px] font-black text-[#fe8204] uppercase tracking-widest block">Observaciones del Rectorado:</span>
                        <p className="text-[10px] text-slate-600 font-medium leading-relaxed italic">
                          "Mateo demuestra un excelente compromiso con sus compañeros de grado y un liderazgo sobresaliente en las dinámicas del aula digital. Mantiene una conducta intachable."
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: HORARIO SEMANAL */}
                  {activeTab === 'schedule' && (
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                      <h4 className="text-xs font-black uppercase text-slate-700">Horario Semanal de Cursado</h4>
                      <div className="grid grid-cols-5 gap-3 text-center">
                        <div className="bg-slate-50 p-3 border border-slate-200 rounded-xl"><span className="text-[9px] font-black uppercase text-[#fe8204] block mb-1">Lunes</span><span className="text-[10px] font-bold text-slate-700">Matemática</span><span className="text-[8px] text-slate-400 block mt-1">07:30 - 08:50</span></div>
                        <div className="bg-slate-50 p-3 border border-slate-200 rounded-xl"><span className="text-[9px] font-black uppercase text-[#fe8204] block mb-1">Martes</span><span className="text-[10px] font-bold text-slate-700">Física I</span><span className="text-[8px] text-slate-400 block mt-1">08:55 - 10:15</span></div>
                        <div className="bg-slate-50 p-3 border border-slate-200 rounded-xl"><span className="text-[9px] font-black uppercase text-[#fe8204] block mb-1">Miércoles</span><span className="text-[10px] font-bold text-slate-700">Construcciones</span><span className="text-[8px] text-slate-400 block mt-1">07:30 - 08:50</span></div>
                        <div className="bg-slate-50 p-3 border border-slate-200 rounded-xl"><span className="text-[9px] font-black uppercase text-[#fe8204] block mb-1">Jueves</span><span className="text-[10px] font-bold text-slate-700">Taller Práctico</span><span className="text-[8px] text-slate-400 block mt-1">10:30 - 11:50</span></div>
                        <div className="bg-slate-50 p-3 border border-slate-200 rounded-xl"><span className="text-[9px] font-black uppercase text-[#fe8204] block mb-1">Viernes</span><span className="text-[10px] font-bold text-slate-700">Inglés Técnico</span><span className="text-[8px] text-slate-400 block mt-1">08:55 - 10:15</span></div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* -------------------- PORTAL PADRES PANEL -------------------- */}
              {selectedRole === 'PADRE' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Top Red Notification Alert Bar */}
                  {!isPadreAlertClosed && (
                    <div className="bg-gradient-to-r from-red-600 to-rose-500 text-white p-4.5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md border border-red-500/20">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shrink-0 text-white animate-pulse">
                          <ShieldAlert className="h-5 w-5" />
                        </div>
                        <div>
                          <h5 className="text-[11px] font-black uppercase tracking-wider text-red-100 flex items-center gap-1.5">
                            <span>🚨 Notificación de Inasistencia de SUE</span>
                          </h5>
                          <p className="text-[10px] text-white font-bold leading-relaxed mt-0.5">
                            Atención: Su tutorado <span className="underline font-black">Thiago Castro</span> fue marcado como <span className="underline font-black uppercase bg-white/10 px-1 rounded">AUSENTE</span> hoy en la Escuela Normal Sarmiento.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            showToast('✓ Inasistencia justificada formalmente por el tutor Carlos Castro.');
                            setIsPadreAlertClosed(true);
                          }}
                          className="bg-white hover:bg-slate-100 text-red-700 text-[9.5px] font-black px-4 py-2 rounded-xl uppercase tracking-wider transition-all shadow-sm shrink-0"
                        >
                          Justificar Inasistencia
                        </button>
                        <button 
                          onClick={() => setIsPadreAlertClosed(true)}
                          className="text-white hover:bg-white/10 text-[9.5px] font-bold px-3 py-2 rounded-xl uppercase tracking-wider transition-all shrink-0"
                        >
                          Cerrar Alerta
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Legajo Familiar Header Card */}
                  <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block">TUTOR DE ALUMNO REGULAR</span>
                      <h4 className="text-[18px] font-black text-slate-800 tracking-tight mt-0.5">Legajo Familiar de: Thiago Castro</h4>
                      <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Escuela Normal Sarmiento — 5° Grado "A"</p>
                    </div>
                    <button 
                      onClick={() => showToast('🤖 Sanjuanito IA: "Thiago posee un promedio general de 5.80 y registra 3 inasistencias en este trimestre."')}
                      className="bg-orange-500/5 hover:bg-orange-500/10 text-[#fe8204] border border-orange-500/15 font-black text-[9.5px] px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Brain className="h-4 w-4" />
                      <span>✨ IA para Padres boletin info</span>
                    </button>
                  </div>

                  {/* Two-Column Grid Layout matching reference layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    
                    {/* LEFT COLUMN: Boletín and Digital Signature */}
                    <div className="lg:col-span-3 space-y-6">
                      
                      {/* Boletín Escolar Trimestral Card */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <div>
                            <h5 className="text-[12px] font-black uppercase text-slate-800 flex items-center gap-1.5">
                              <BookOpen className="h-4 w-4 text-[#fe8204]" />
                              <span>Boletín Escolar Trimestral</span>
                            </h5>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Notas reportadas al ciclo actual</p>
                          </div>
                          <span className="bg-orange-500/10 text-[#fe8204] border border-orange-500/15 text-[8.5px] font-black uppercase px-2.5 py-1 rounded-lg">
                            1er Trimestre Cierre
                          </span>
                        </div>

                        {/* Subject Score Cards */}
                        <div className="space-y-2">
                          
                          {/* Matematica */}
                          <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-2xl flex justify-between items-center hover:border-slate-300 transition-all">
                            <div>
                              <span className="text-[11px] font-black text-slate-800 block">Matemática</span>
                              <span className="text-[8px] text-slate-400 font-bold uppercase block">Docente a cargo: Escuela Normal</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 flex items-center justify-center text-xs font-black">
                              5
                            </div>
                          </div>

                          {/* Lengua */}
                          <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-2xl flex justify-between items-center hover:border-slate-300 transition-all">
                            <div>
                              <span className="text-[11px] font-black text-slate-800 block">Lengua y Literatura</span>
                              <span className="text-[8px] text-slate-400 font-bold uppercase block">Docente a cargo: Escuela Normal</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center text-xs font-black">
                              6
                            </div>
                          </div>

                          {/* Ciencias Naturales */}
                          <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-2xl flex justify-between items-center hover:border-slate-300 transition-all">
                            <div>
                              <span className="text-[11px] font-black text-slate-800 block">Ciencias Naturales</span>
                              <span className="text-[8px] text-slate-400 font-bold uppercase block">Docente a cargo: Escuela Normal</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 flex items-center justify-center text-xs font-black">
                              5
                            </div>
                          </div>

                          {/* Ciencias Sociales */}
                          <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-2xl flex justify-between items-center hover:border-slate-300 transition-all">
                            <div>
                              <span className="text-[11px] font-black text-slate-800 block">Ciencias Sociales</span>
                              <span className="text-[8px] text-slate-400 font-bold uppercase block">Docente a cargo: Escuela Normal</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center text-xs font-black">
                              6
                            </div>
                          </div>

                          {/* Plastica */}
                          <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-2xl flex justify-between items-center hover:border-slate-300 transition-all">
                            <div>
                              <span className="text-[11px] font-black text-slate-800 block">Educación Plástica</span>
                              <span className="text-[8px] text-slate-400 font-bold uppercase block">Docente a cargo: Escuela Normal</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center text-xs font-black">
                              7
                            </div>
                          </div>

                        </div>

                        {/* Attendance summary row matching Image 1 */}
                        <div className="bg-slate-900 text-white/90 p-3 rounded-xl flex justify-between items-center text-[9px] uppercase tracking-wider font-bold">
                          <span className="text-slate-400">Asistencia total trimestral: <span className="text-white font-black">2 / 5 días</span></span>
                          <span className="text-red-400 font-black">Faltas: 3</span>
                        </div>
                      </div>

                      {/* Firma Digital de Autorizaciones Escolares */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                        <div>
                          <h5 className="text-[12px] font-black uppercase text-slate-800 flex items-center gap-1.5">
                            <FileSignature className="h-4 w-5 text-[#fe8204]" />
                            <span>Firma Digital de Autorizaciones Escolares</span>
                          </h5>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Autorice de forma rápida e inmediata los consentimientos de la institución desde Casa.</p>
                        </div>

                        <div className="border border-slate-200 rounded-2xl p-4.5 space-y-3 bg-slate-50">
                          <div>
                            <span className="bg-[#fe8204]/10 text-[#fe8204] text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded">DOCUMENTO PENDIENTE</span>
                            <h6 className="text-[11px] font-black text-slate-800 mt-1.5">Concurrencia de Estudio Ischigualasto (28 de Mayo)</h6>
                            <p className="text-[9.5px] text-slate-500 leading-relaxed mt-1">
                              Por la presente autorizo que mi hijo/tutorado <span className="font-bold text-slate-700">Thiago Castro</span> asista a la actividad programada por el Ministerio de Educación en Jáchal / Ischigualasto.
                            </p>
                          </div>

                          {isPadrePermitSigned ? (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-xl text-center space-y-1">
                              <span className="text-[10px] font-black uppercase tracking-wider block">✓ Autorización firmada e inscrita digitalmente</span>
                              <span className="text-[8px] font-mono text-emerald-500 block">HASH: 0x93FA22B7E102F3BC8821B2</span>
                            </div>
                          ) : (
                            <form onSubmit={handlePadrePinSubmit} className="space-y-3">
                              <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">
                                  INGRESE SU PIN DE FIRMA (CLAVE: 1234)
                                </label>
                                <input 
                                  type="password" 
                                  maxLength={4}
                                  value={padrePin}
                                  onChange={(e) => setPadrePin(e.target.value)}
                                  placeholder="Ej: 1234"
                                  className="w-full text-center tracking-widest pl-4 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 text-xs text-slate-800 font-bold"
                                />
                              </div>
                              <button 
                                type="submit"
                                className="w-full bg-slate-900 hover:bg-black text-white font-black text-[9.5px] py-3 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm"
                              >
                                <FileSignature className="h-4 w-4" />
                                <span>Estampar Firma Digital</span>
                              </button>
                            </form>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* RIGHT COLUMN: Familia Chat & Scholarships */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* Family Messenger Chat Card */}
                      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col h-[350px] overflow-hidden">
                        
                        {/* Chat Header */}
                        <div className="bg-slate-900 text-white p-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black uppercase shadow-inner shrink-0 border border-white/10">
                            GQ
                          </div>
                          <div className="leading-tight">
                            <span className="text-[10px] font-black uppercase tracking-wider block">Prof. Gabriela Quiroga</span>
                            <span className="text-[8px] text-indigo-300 font-bold block">Mensajería Familias</span>
                          </div>
                          <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                        </div>

                        {/* Chat Messages List */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 text-[10px]">
                          {padreChatList.map((msg, idx) => (
                            <div 
                              key={idx} 
                              className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'items-start'}`}
                            >
                              <span className="text-[7.5px] font-black uppercase text-slate-400 mb-1">
                                {msg.sender === 'user' ? 'Carlos (Tutor)' : 'Mtra. Gabriela'}
                              </span>
                              <div 
                                className={`p-3 rounded-2xl leading-relaxed ${
                                  msg.sender === 'user' 
                                    ? 'bg-orange-500 text-white rounded-tr-none' 
                                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                                }`}
                              >
                                {msg.text}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Chat Form */}
                        <form onSubmit={handlePadreChatSubmit} className="p-3 border-t border-slate-200 bg-white flex gap-2">
                          <input 
                            type="text" 
                            value={padreChatMessage}
                            onChange={(e) => setPadreChatMessage(e.target.value)}
                            placeholder="Escribir mensaje..."
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-orange-500 text-xs text-slate-800 placeholder-slate-400 font-bold"
                          />
                          <button 
                            type="submit"
                            className="w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-all shrink-0 shadow-sm"
                          >
                            <Send className="h-4.5 w-4.5" />
                          </button>
                        </form>
                      </div>

                      {/* Scholarships Beca Card */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3.5">
                        <div className="flex items-center gap-2">
                          <Bus className="h-5 w-5 text-[#fe8204]" />
                          <h5 className="text-[11px] font-black uppercase text-slate-800">
                            BECAS Y SUBVENCIONES ESCOLARES
                          </h5>
                        </div>
                        <p className="text-[9.5px] text-slate-400 font-bold uppercase leading-relaxed">
                          Presente la solicitud digital de ayuda de transporte escolar financiada por el Ministerio Especial San Juan.
                        </p>
                        <button 
                          onClick={() => showToast('✓ Solicitud de Beca enviada al Ministerio. Código de trámite: #TR-9824')}
                          className="w-full border border-slate-900 text-slate-900 hover:bg-slate-50 font-black text-[9px] py-3 rounded-xl uppercase tracking-wider transition-all"
                        >
                          Solicitar Beca de Transporte Educativo
                        </button>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* -------------------- PORTAL DIRECTIVO PANEL -------------------- */}
              {selectedRole === 'DIRECTIVO' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Dashboard Header */}
                  <div>
                    <h4 className="text-[20px] font-black text-slate-800 tracking-tight">Dashboard Directivo: Escuela Normal Sarmiento</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      Consola de Inteligencia Escolar y Alertas Tempranas del Establecimiento (CUE: 7000142)
                    </p>
                  </div>

                  {/* KPI Summary Grid (4 Cards) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Card 1 */}
                    <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block">PRESENTISMO PROMEDIO</span>
                        <span className="bg-emerald-500/10 text-emerald-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-md border border-emerald-500/10">
                          +1.2% m/m
                        </span>
                      </div>
                      <span className="text-[26px] font-black text-slate-850 block tracking-tight leading-none">95.2%</span>
                      <span className="text-[8.5px] text-slate-400 font-bold uppercase block">Meta ministerial: 92% escolaridad</span>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block">MATRÍCULA ESCOLAR</span>
                        <span className="bg-blue-500/10 text-blue-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-md border border-blue-500/10">
                          35 Nuevos
                        </span>
                      </div>
                      <span className="text-[26px] font-black text-slate-850 block tracking-tight leading-none">1250</span>
                      <span className="text-[8.5px] text-slate-400 font-bold uppercase block">Alumnos regulares inscriptos</span>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block">AUSENTISMO DOCENTE</span>
                        <span className="bg-red-500/10 text-red-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-md border border-red-500/10">
                          Tasa: 4.2%
                        </span>
                      </div>
                      <span className="text-[26px] font-black text-slate-850 block tracking-tight leading-none">2</span>
                      <span className="text-[8.5px] text-slate-400 font-bold uppercase block">Docentes de licencia médica hoy</span>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block">NIVEL DE CONECTIVIDAD</span>
                        <span className="bg-emerald-500/10 text-emerald-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-md border border-emerald-500/10">
                          ARSAT 1
                        </span>
                      </div>
                      <span className="text-[26px] font-black text-slate-850 block tracking-tight leading-none">98%</span>
                      <span className="text-[8.5px] text-slate-400 font-bold uppercase block">Canal de fibra simétrica estable</span>
                    </div>

                  </div>

                  {/* Two-Column Grid Layout matching reference layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    
                    {/* LEFT COLUMN: Rendimiento & Infraestructura */}
                    <div className="lg:col-span-3 space-y-6">
                      
                      {/* Rendimiento por Ciclo Escolar */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-5">
                        <div>
                          <h5 className="text-[12px] font-black uppercase text-slate-800">
                            Rendimiento y Presentismo por Ciclo Escolar
                          </h5>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                            Distribución de matrículas y rendimiento medio de cada curso registrado.
                          </p>
                        </div>

                        {/* Progress bars rows */}
                        <div className="space-y-4.5 text-[10px] font-bold">
                          
                          {/* 1 Año */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[9px] uppercase tracking-wider text-slate-600">
                              <span className="font-black text-slate-800">1° Año</span>
                              <span>Presentismo: 96%</span>
                              <span>Promedio Gral: <span className="text-[#fe8204]">8.8 / 10</span></span>
                              <span className="text-slate-400">140 Alumnos</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '96%' }}></div>
                            </div>
                          </div>

                          {/* 2 Año */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[9px] uppercase tracking-wider text-slate-600">
                              <span className="font-black text-slate-800">2° Año</span>
                              <span>Presentismo: 95%</span>
                              <span>Promedio Gral: <span className="text-[#fe8204]">8.6 / 10</span></span>
                              <span className="text-slate-400">132 Alumnos</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '95%' }}></div>
                            </div>
                          </div>

                          {/* 3 Año */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[9px] uppercase tracking-wider text-slate-600">
                              <span className="font-black text-slate-800">3° Año</span>
                              <span>Presentismo: 93%</span>
                              <span>Promedio Gral: <span className="text-[#fe8204]">8.2 / 10</span></span>
                              <span className="text-slate-400">151 Alumnos</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-orange-500 rounded-full" style={{ width: '93%' }}></div>
                            </div>
                          </div>

                          {/* 4 Año */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[9px] uppercase tracking-wider text-slate-600">
                              <span className="font-black text-slate-800">4° Año</span>
                              <span>Presentismo: 91%</span>
                              <span>Promedio Gral: <span className="text-[#fe8204]">7.9 / 10</span></span>
                              <span className="text-slate-400">142 Alumnos</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-orange-500 rounded-full" style={{ width: '91%' }}></div>
                            </div>
                          </div>

                          {/* 5 Año A */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[9px] uppercase tracking-wider text-slate-600">
                              <span className="font-black text-slate-800">5° Año A</span>
                              <span>Presentismo: 90.4%</span>
                              <span>Promedio Gral: <span className="text-[#fe8204]">7.2 / 10</span></span>
                              <span className="text-slate-400">32 Alumnos</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-orange-500 rounded-full" style={{ width: '90.4%' }}></div>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Estado de Infraestructura Edilicia */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                        <div>
                          <h5 className="text-[12px] font-black uppercase text-slate-800">
                            Estado de Infraestructura Edilicia
                          </h5>
                        </div>
                        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-[9.5px] leading-relaxed font-bold">
                          ⚠️ Mantenimiento de Red: Conexión de respaldo en el laboratorio de informática requiere reemplazo de router UBIQUITI de 24 puertos corporativos. Reclamo enviado a Soporte General del Ministerio de San Juan (Nº Ref: #SJ_INF_89201).
                        </div>
                      </div>

                    </div>

                    {/* RIGHT COLUMN: Early Warnings Intervention List */}
                    <div className="lg:col-span-2 space-y-4">
                      
                      <div className="border-b border-slate-200 pb-2">
                        <h5 className="text-[12px] font-black uppercase text-slate-800 flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4 text-red-500 animate-bounce" />
                          <span>Consola de Alertas Tempranas</span>
                        </h5>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                          Intervenga en las alertas institucionales críticas de forma digital.
                        </p>
                      </div>

                      {/* Alert 1 */}
                      <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="bg-red-500/10 text-red-700 text-[7.5px] font-black uppercase px-2 py-0.5 rounded-md border border-red-500/10">
                            ALUMNO RIESGO
                          </span>
                          <span className="text-[8.5px] text-slate-400 font-bold">2026-05-21</span>
                        </div>
                        <h6 className="text-[11px] font-black text-slate-850">Riesgo Crítico de Abandono</h6>
                        <p className="text-[9.5px] text-slate-500 leading-relaxed">
                          El alumno Thiago Castro de la Escuela Normal Sarmiento registra 3 ausencias consecutivas injustificadas y un promedio general inferior a 5.0.
                        </p>
                        <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 mt-2">
                          <span className="text-[8px] font-bold text-slate-400 uppercase">Escuela Normal Sarmiento</span>
                          <button 
                            onClick={() => showToast('⚙️ Iniciando protocolo de retención escolar para Thiago Castro...')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[8px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all"
                          >
                            Activar Resolución
                          </button>
                        </div>
                      </div>

                      {/* Alert 2 */}
                      <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="bg-orange-500/10 text-orange-700 text-[7.5px] font-black uppercase px-2 py-0.5 rounded-md border border-orange-500/10">
                            DOCENTE AUSENTE
                          </span>
                          <span className="text-[8.5px] text-slate-400 font-bold">2026-05-21</span>
                        </div>
                        <h6 className="text-[11px] font-black text-slate-850">Clave Directiva: Ausencia Docente</h6>
                        <p className="text-[9.5px] text-slate-500 leading-relaxed">
                          El docente de Matemática de 5° Año (Prof. Juan Gomez) ha reportado carpeta médica por 5 días. Se requiere activar plan de contingencia curricular.
                        </p>
                        <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 mt-2">
                          <span className="text-[8px] font-bold text-slate-400 uppercase">Colegio Monseñor Pablo Cabrera</span>
                          <button 
                            onClick={() => showToast('⚙️ Generando orden de suplencia inmediata en el portal SED...')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[8px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all"
                          >
                            Activar Resolución
                          </button>
                        </div>
                      </div>

                      {/* Alert 3 */}
                      <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="bg-red-500/10 text-red-700 text-[7.5px] font-black uppercase px-2 py-0.5 rounded-md border border-red-500/10">
                            BAJA CONECTIVIDAD
                          </span>
                          <span className="text-[8.5px] text-slate-400 font-bold">2026-05-20</span>
                        </div>
                        <h6 className="text-[11px] font-black text-slate-850">Alerta de Infraestructura Digital</h6>
                        <p className="text-[9.5px] text-slate-500 leading-relaxed">
                          La Escuela Albergue Pichiciego (Iglesia) ha reportado caída total de enlace satelital ARSAT por tormentas eléctricas de montaña. Red de contingencia offline activada.
                        </p>
                        <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 mt-2">
                          <span className="text-[8px] font-bold text-slate-400 uppercase">Escuela Albergue Pichiciego</span>
                          <button 
                            onClick={() => showToast('⚙️ Solicitando soporte técnico satelital de emergencia a ARSAT...')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[8px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all"
                          >
                            Activar Resolución
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* -------------------- PORTAL MINISTERIO PANEL -------------------- */}
              {selectedRole === 'MINISTERIO' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Dashboard Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                      <div>
                        <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block">Torre de Control Unificada</span>
                        <h4 className="text-[20px] font-black text-slate-800 tracking-tight mt-0.5">Ministerio de Educación de San Juan</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                          Monitoreo en tiempo real de trayectorias, riesgo edilicio y conectividad satelital en toda la provincia.
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={handleSincronizarMin}
                      disabled={isSincronizandoMin}
                      className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-black text-[9.5px] px-4.5 py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                    >
                      <RefreshCw className={`h-4 w-4 text-[#fe8204] ${isSincronizandoMin ? 'animate-spin' : ''}`} />
                      <span>{isSincronizandoMin ? 'Sincronizando...' : 'Sincronizar Panel (SED)'}</span>
                    </button>
                  </div>

                  {/* KPI Summary Grid (4 Cards) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Card 1 */}
                    <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm space-y-2">
                      <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block">TASA DE DESERCIÓN ESCOLAR</span>
                      <span className="text-[26px] font-black text-red-600 block tracking-tight leading-none">3.12%</span>
                      <span className="text-[8.5px] text-slate-400 font-bold uppercase block">Nivel Inicial, Primario y Medio</span>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm space-y-2">
                      <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block">ASISTENCIA PROVINCIAL REAL</span>
                      <span className="text-[26px] font-black text-emerald-600 block tracking-tight leading-none">91.4%</span>
                      <span className="text-[8.5px] text-slate-400 font-bold uppercase block">Cierre diario promedio consolidado</span>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm space-y-2">
                      <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block">ESCUELAS CONECTADAS</span>
                      <span className="text-[26px] font-black text-orange-500 block tracking-tight leading-none">94.8%</span>
                      <span className="text-[8.5px] text-slate-400 font-bold uppercase block">Canal satelital ARSAT o fibra simétrica</span>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm space-y-2">
                      <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block">ALERTAS DE ALTA PRIORIDAD</span>
                      <span className="text-[26px] font-black text-[#fe8204] block tracking-tight leading-none">4 Activas</span>
                      <span className="text-[8.5px] text-slate-400 font-bold uppercase block">Intervención inmediata requerida</span>
                    </div>

                  </div>

                  {/* Two-Column Grid Layout matching reference layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    
                    {/* LEFT COLUMN: Educational Heatmap Map Card */}
                    <div className="lg:col-span-3 space-y-6">
                      
                      {/* Mapa Educativo Interactivo S.J. Card */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-5">
                        
                        {/* Map Header */}
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <div>
                            <h5 className="text-[12px] font-black uppercase text-slate-800 flex items-center gap-1.5">
                              <MapIcon className="h-4 w-4 text-[#fe8204]" />
                              <span>Mapa Educativo Interactivo S.J.</span>
                            </h5>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                              Pulsa sobre cualquier departamento para auditar inasistencias, abandono y conectividad.
                            </p>
                          </div>
                          <span className="bg-amber-500/10 text-amber-600 border border-amber-500/15 text-[8.5px] font-black uppercase px-2.5 py-1 rounded-lg">
                            MODO: INFOGRAFÍA GEOGRÁFICA
                          </span>
                        </div>

                        {/* Interactive Geographic Split Row */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                          
                          {/* Map Visual (SVG Georeferenced Heatmap representation) */}
                          <div className="md:col-span-7 flex flex-col items-center">
                            <div className="w-full max-w-[280px] aspect-square bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-center relative shadow-inner">
                              
                              {/* Central Interactive SVG Map */}
                              <svg viewBox="0 0 320 280" className="w-full h-full select-none cursor-pointer">
                                
                                {/* Department: Chimbas (North, Red) */}
                                <g onClick={() => setSelectedDepartmentMin('Chimbas')}>
                                  <rect 
                                    x={110} y={40} width={90} height={45} rx={8} 
                                    className="transition-all duration-300 animate-fade-in"
                                    fill={selectedDepartmentMin === 'Chimbas' ? '#fca5a5' : '#fee2e2'} 
                                    stroke={selectedDepartmentMin === 'Chimbas' ? '#fe8204' : '#f87171'} 
                                    strokeWidth={selectedDepartmentMin === 'Chimbas' ? 3 : 1.5}
                                  />
                                  <text x={155} y={66} textAnchor="middle" className="text-[9px] font-black uppercase fill-red-800 tracking-wider">Chimbas</text>
                                  <circle cx={155} cy={48} r={3} fill="#ef4444" className="animate-ping" />
                                </g>

                                {/* Department: Rivadavia (West, Yellow) */}
                                <g onClick={() => setSelectedDepartmentMin('Rivadavia')}>
                                  <rect 
                                    x={25} y={95} width={80} height={90} rx={8} 
                                    className="transition-all duration-300 animate-fade-in"
                                    fill={selectedDepartmentMin === 'Rivadavia' ? '#fde047' : '#fef9c3'} 
                                    stroke={selectedDepartmentMin === 'Rivadavia' ? '#fe8204' : '#eab308'} 
                                    strokeWidth={selectedDepartmentMin === 'Rivadavia' ? 3 : 1.5}
                                  />
                                  <text x={65} y={145} textAnchor="middle" className="text-[9px] font-black uppercase fill-yellow-800 tracking-wider">Rivadavia</text>
                                  <circle cx={65} cy={105} r={3} fill="#eab308" className="animate-pulse" />
                                </g>

                                {/* Department: Capital (Center, Green) */}
                                <g onClick={() => setSelectedDepartmentMin('Capital')}>
                                  <rect 
                                    x={115} y={105} width={80} height={70} rx={8} 
                                    className="transition-all duration-300 animate-fade-in"
                                    fill={selectedDepartmentMin === 'Capital' ? '#86efac' : '#dcfce7'} 
                                    stroke={selectedDepartmentMin === 'Capital' ? '#fe8204' : '#4ade80'} 
                                    strokeWidth={selectedDepartmentMin === 'Capital' ? 3 : 1.5}
                                  />
                                  <text x={155} y={145} textAnchor="middle" className="text-[9px] font-black uppercase fill-emerald-800 tracking-wider">Capital</text>
                                  <circle cx={155} cy={115} r={3} fill="#10b981" />
                                </g>

                                {/* Department: Santa Lucía (East, Yellow) */}
                                <g onClick={() => setSelectedDepartmentMin('Santa Lucía')}>
                                  <rect 
                                    x={205} y={110} width={80} height={60} rx={8} 
                                    className="transition-all duration-300 animate-fade-in"
                                    fill={selectedDepartmentMin === 'Santa Lucía' ? '#fde047' : '#fef9c3'} 
                                    stroke={selectedDepartmentMin === 'Santa Lucía' ? '#fe8204' : '#eab308'} 
                                    strokeWidth={selectedDepartmentMin === 'Santa Lucía' ? 3 : 1.5}
                                  />
                                  <text x={245} y={145} textAnchor="middle" className="text-[9px] font-black uppercase fill-yellow-800 tracking-wider">S. Lucía</text>
                                  <circle cx={245} cy={120} r={3} fill="#eab308" />
                                </g>

                                {/* Department: Rawson (South, Red) */}
                                <g onClick={() => setSelectedDepartmentMin('Rawson')}>
                                  <rect 
                                    x={110} y={195} width={90} height={50} rx={8} 
                                    className="transition-all duration-300 animate-fade-in"
                                    fill={selectedDepartmentMin === 'Rawson' ? '#fca5a5' : '#fee2e2'} 
                                    stroke={selectedDepartmentMin === 'Rawson' ? '#fe8204' : '#f87171'} 
                                    strokeWidth={selectedDepartmentMin === 'Rawson' ? 3 : 1.5}
                                  />
                                  <text x={155} y={225} textAnchor="middle" className="text-[9px] font-black uppercase fill-red-800 tracking-wider">Rawson</text>
                                  <circle cx={155} cy={205} r={3} fill="#ef4444" className="animate-ping" />
                                </g>

                              </svg>

                            </div>

                            {/* Map Legend */}
                            <div className="flex flex-wrap gap-2.5 mt-3 text-[8.5px] font-black uppercase text-slate-400">
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Deserción Baja (&lt;2%)</span>
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Riesgo (2%-4%)</span>
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Crítico (&gt;4%)</span>
                            </div>

                          </div>

                          {/* Interactive Department Details Panel (matching Image 3 layout) */}
                          <div className="md:col-span-5 space-y-4">
                            
                            <div className="border-b border-slate-100 pb-2.5">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">DETALLE DEPARTAMENTAL</span>
                              <h6 className="text-[15px] font-black text-slate-800 mt-0.5">Dpto. {selectedDepartmentMin}</h6>
                            </div>

                            <div className="space-y-3.5 text-[10px] font-bold text-slate-600">
                              
                              <div className="flex justify-between items-center">
                                <span>Escuelas Reportadas:</span>
                                <span className="text-slate-800 font-black">
                                  {selectedDepartmentMin === 'Capital' && '84 escuela/s'}
                                  {selectedDepartmentMin === 'Chimbas' && '42 escuela/s'}
                                  {selectedDepartmentMin === 'Rawson' && '53 escuela/s'}
                                  {selectedDepartmentMin === 'Rivadavia' && '48 escuela/s'}
                                  {selectedDepartmentMin === 'Santa Lucía' && '32 escuela/s'}
                                </span>
                              </div>

                              <div className="flex justify-between items-center">
                                <span>Alumnos Totales:</span>
                                <span className="text-slate-800 font-black">
                                  {selectedDepartmentMin === 'Capital' && '22.400 alumnos'}
                                  {selectedDepartmentMin === 'Chimbas' && '11.500 alumnos'}
                                  {selectedDepartmentMin === 'Rawson' && '15.100 alumnos'}
                                  {selectedDepartmentMin === 'Rivadavia' && '12.300 alumnos'}
                                  {selectedDepartmentMin === 'Santa Lucía' && '8.800 alumnos'}
                                </span>
                              </div>

                              <div className="flex justify-between items-center">
                                <span>Presentismo Promedio:</span>
                                <span className={`font-black ${
                                  selectedDepartmentMin === 'Capital' || selectedDepartmentMin === 'Rivadavia' || selectedDepartmentMin === 'Santa Lucía'
                                    ? 'text-emerald-600' : 'text-amber-600'
                                }`}>
                                  {selectedDepartmentMin === 'Capital' && '94.5%'}
                                  {selectedDepartmentMin === 'Chimbas' && '91.2%'}
                                  {selectedDepartmentMin === 'Rawson' && '92.4%'}
                                  {selectedDepartmentMin === 'Rivadavia' && '93.8%'}
                                  {selectedDepartmentMin === 'Santa Lucía' && '93.9%'}
                                </span>
                              </div>

                              <div className="flex justify-between items-center">
                                <span>Tasa de Abandono Escolar:</span>
                                <span className={`font-black px-2 py-0.5 rounded ${
                                  selectedDepartmentMin === 'Capital' ? 'bg-emerald-50 text-emerald-700' :
                                  selectedDepartmentMin === 'Chimbas' || selectedDepartmentMin === 'Rawson' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                                }`}>
                                  {selectedDepartmentMin === 'Capital' && '1.2% (Bajo)'}
                                  {selectedDepartmentMin === 'Chimbas' && '3.4% (Crítico)'}
                                  {selectedDepartmentMin === 'Rawson' && '2.8% (Crítico)'}
                                  {selectedDepartmentMin === 'Rivadavia' && '1.8% (Riesgo)'}
                                  {selectedDepartmentMin === 'Santa Lucía' && '1.5% (Riesgo)'}
                                </span>
                              </div>

                              <div className="flex justify-between items-center">
                                <span>Conectividad Media:</span>
                                <span className="text-slate-800 font-black">
                                  {selectedDepartmentMin === 'Capital' && '96% promedio'}
                                  {selectedDepartmentMin === 'Chimbas' && '91% promedio'}
                                  {selectedDepartmentMin === 'Rawson' && '92% promedio'}
                                  {selectedDepartmentMin === 'Rivadavia' && '95% promedio'}
                                  {selectedDepartmentMin === 'Santa Lucía' && '94% promedio'}
                                </span>
                              </div>

                            </div>

                            {/* Network status check */}
                            <div className={`p-3 rounded-xl border text-[9.5px] leading-relaxed font-bold transition-all ${
                              selectedDepartmentMin === 'Capital' || selectedDepartmentMin === 'Rivadavia' || selectedDepartmentMin === 'Santa Lucía'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                            }`}>
                              {selectedDepartmentMin === 'Capital' || selectedDepartmentMin === 'Rivadavia' || selectedDepartmentMin === 'Santa Lucía' ? (
                                <span>✅ ESTADO CONECTIVIDAD: Infraestructura digital saludable con respaldo de enlace ARSAT sin interferencias.</span>
                              ) : (
                                <span>⚠️ ESTADO CONECTIVIDAD: Se detectaron atenuaciones en tramos troncales de conectividad terrestre.</span>
                              )}
                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* RIGHT COLUMN: Comparativa Departamental */}
                    <div className="lg:col-span-2 space-y-4">
                      
                      <div className="border-b border-slate-200 pb-2">
                        <h5 className="text-[12px] font-black uppercase text-slate-800 flex items-center gap-1.5">
                          <BarChart3 className="h-4 w-4 text-[#fe8204]" />
                          <span>Comparativa Departamental</span>
                        </h5>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                          Auditoría del Ministerio para detectar vulnerabilidad por regiones.
                        </p>
                      </div>

                      {/* Department Comparative List (fully interactive clicks) */}
                      <div className="space-y-2">
                        
                        {/* Capital */}
                        <div 
                          onClick={() => setSelectedDepartmentMin('Capital')}
                          className={`p-3.5 border rounded-2xl cursor-pointer hover:border-orange-500/40 transition-all flex justify-between items-center ${
                            selectedDepartmentMin === 'Capital' ? 'border-[#fe8204] bg-orange-500/5' : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div>
                            <span className="text-[11px] font-black text-slate-800 block">Capital</span>
                            <span className="text-[8.5px] text-slate-400 font-bold uppercase block">84 Escuelas / 22400 Alumnos</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black text-emerald-600 block">Abandono: 1.2%</span>
                            <span className="text-[8px] text-slate-400 font-bold block uppercase mt-0.5">Presentismo: 94.5%</span>
                          </div>
                        </div>

                        {/* Chimbas */}
                        <div 
                          onClick={() => setSelectedDepartmentMin('Chimbas')}
                          className={`p-3.5 border rounded-2xl cursor-pointer hover:border-orange-500/40 transition-all flex justify-between items-center ${
                            selectedDepartmentMin === 'Chimbas' ? 'border-[#fe8204] bg-orange-500/5' : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div>
                            <span className="text-[11px] font-black text-slate-800 block">Chimbas</span>
                            <span className="text-[8.5px] text-slate-400 font-bold uppercase block">42 Escuelas / 11500 Alumnos</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black text-red-600 block">Abandono: 3.4%</span>
                            <span className="text-[8px] text-slate-400 font-bold block uppercase mt-0.5">Presentismo: 91.2%</span>
                          </div>
                        </div>

                        {/* Rawson */}
                        <div 
                          onClick={() => setSelectedDepartmentMin('Rawson')}
                          className={`p-3.5 border rounded-2xl cursor-pointer hover:border-orange-500/40 transition-all flex justify-between items-center ${
                            selectedDepartmentMin === 'Rawson' ? 'border-[#fe8204] bg-orange-500/5' : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div>
                            <span className="text-[11px] font-black text-slate-800 block">Rawson</span>
                            <span className="text-[8.5px] text-slate-400 font-bold uppercase block">53 Escuelas / 15100 Alumnos</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black text-red-600 block">Abandono: 2.8%</span>
                            <span className="text-[8px] text-slate-400 font-bold block uppercase mt-0.5">Presentismo: 92.4%</span>
                          </div>
                        </div>

                        {/* Rivadavia */}
                        <div 
                          onClick={() => setSelectedDepartmentMin('Rivadavia')}
                          className={`p-3.5 border rounded-2xl cursor-pointer hover:border-orange-500/40 transition-all flex justify-between items-center ${
                            selectedDepartmentMin === 'Rivadavia' ? 'border-[#fe8204] bg-orange-500/5' : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div>
                            <span className="text-[11px] font-black text-slate-800 block">Rivadavia</span>
                            <span className="text-[8.5px] text-slate-400 font-bold uppercase block">48 Escuelas / 12300 Alumnos</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black text-yellow-600 block">Abandono: 1.8%</span>
                            <span className="text-[8px] text-slate-400 font-bold block uppercase mt-0.5">Presentismo: 93.8%</span>
                          </div>
                        </div>

                        {/* Santa Lucía */}
                        <div 
                          onClick={() => setSelectedDepartmentMin('Santa Lucía')}
                          className={`p-3.5 border rounded-2xl cursor-pointer hover:border-orange-500/40 transition-all flex justify-between items-center ${
                            selectedDepartmentMin === 'Santa Lucía' ? 'border-[#fe8204] bg-orange-500/5' : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div>
                            <span className="text-[11px] font-black text-slate-800 block">Santa Lucía</span>
                            <span className="text-[8.5px] text-slate-400 font-bold uppercase block">32 Escuelas / 8800 Alumnos</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black text-yellow-600 block">Abandono: 1.5%</span>
                            <span className="text-[8px] text-slate-400 font-bold block uppercase mt-0.5">Presentismo: 93.9%</span>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              )}

            </div>

          </div>

          </section>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-orange-500/10 text-[#fe8204] border border-orange-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <School className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-black uppercase text-slate-800 tracking-wider">Acceso Restringido al Ecosistema</h4>
              <p className="text-[10px] text-slate-400 font-bold max-w-sm mx-auto leading-relaxed uppercase">
                Selecciona uno de los 5 portales de acceso de arriba para loguearte y visualizar el panel interactivo en tiempo real.
              </p>
            </div>
          </div>
        )}

      </main>

      {/* Footer Branding */}
      <footer className="border-t border-slate-200 bg-white py-10 mt-16 px-6 text-center text-slate-400 text-[10px] font-bold uppercase tracking-wider space-y-4">
        <div className="flex justify-center items-center gap-2.5">
          <School className="h-4.5 w-4.5 text-[#fe8204]" />
          <span>SUE - Gobierno de la Provincia de San Juan</span>
        </div>
        <p className="text-[9px] text-slate-400 max-w-lg mx-auto font-medium">
          Este ecosistema digital se encuentra bajo normas estrictas de auditoría oficial, cifrado asimétrico y firma digital unificada para toda la comunidad académica.
        </p>
      </footer>

    </div>
  );
}
