import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

// Components
import { Header } from './components/Header';
import { CompetencyHero } from './components/CompetencyHero';
import { RadarChart } from './components/RadarChart';
import { IndicatorList } from './components/IndicatorList';
import { ActionPlanTimeline } from './components/ActionPlanTimeline';
import { GamifiedAssessmentModal } from './components/GamifiedAssessmentModal';
import { DigitalFootprintSimulator } from './components/DigitalFootprintSimulator';
import { ArchitectureModal } from './components/ArchitectureModal';
import { HelpTutorialModal } from './components/HelpTutorialModal';
import {
  DigitalIndicators12,
  DigitalActionPlan,
  ToolUsageLog,
  DigitalReadinessLevel,
  IndicatorKey,
} from './types';
import { CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function App() {
  const { user: activeUser, token, isLoading: authLoading, logout } = useAuth();
  
  // State
  const [indicators, setIndicators] = useState<DigitalIndicators12 | null>(null);
  const [actionPlan, setActionPlan] = useState<DigitalActionPlan | null>(null);
  const [toolLogs, setToolLogs] = useState<ToolUsageLog[]>([]);
  const [readinessLevel, setReadinessLevel] = useState<DigitalReadinessLevel>('intermediate');

  // Modals
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isSubmittingAudit, setIsSubmittingAudit] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  const [selectedIndicatorKey, setSelectedIndicatorKey] = useState<IndicatorKey | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Initial Load
  const fetchData = useCallback(async () => {
    if (!activeUser || !token) return;
    try {
      setIsLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      
      const [indRes, planRes, logsRes] = await Promise.all([
        fetch(`/api/indicators/${activeUser.id}`, { headers }),
        fetch(`/api/action-plan/${activeUser.id}`, { headers }),
        fetch(`/api/tool-usage/${activeUser.id}`, { headers }),
      ]);

      const indData = await indRes.json();
      const planData = await planRes.json();
      const logsData = await logsRes.json();

      setIndicators(indData);
      setActionPlan(planData);
      setToolLogs(logsData);

      // Determine readiness level
      const score = indData.total_digital_score || 0;
      if (score >= 75) setReadinessLevel('advanced');
      else if (score >= 50) setReadinessLevel('intermediate');
      else setReadinessLevel('beginner');
    } catch (err) {
      console.error('Failed to load initial data', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeUser, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Recalculate 3-Source Digital KPI
  const handleRecalculate = async () => {
    if (!activeUser) return;
    try {
      setIsRecalculating(true);
      const res = await fetch(`/api/kpi/calculate-digital-score/${activeUser.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.data && json.data.indicators) {
        setIndicators(json.data.indicators);
        if (json.data.readinessLevel) {
          setReadinessLevel(json.data.readinessLevel);
        }
        showToast("12 ta indikator 3 manba (o'z-o'zini baholash, izlar va metodist) sintezi orqali yangilandi!");
      }
    } catch (err) {
      console.error('Failed recalculation:', err);
    } finally {
      setIsRecalculating(false);
    }
  };

  // Submit Gamified Audit
  const handleSubmitAudit = async (answers: Record<IndicatorKey, number>) => {
    if (!activeUser) return;
    try {
      setIsSubmittingAudit(true);
      const res = await fetch('/api/digital-audit/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: activeUser.id,
          answers,
        }),
      });
      const json = await res.json();
      if (json.result && json.result.indicators) {
        setIndicators(json.result.indicators);
        setReadinessLevel(json.result.readinessLevel);
      }
      // Refresh logs
      const logsRes = await fetch(`/api/tool-usage/${activeUser.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setToolLogs(await logsRes.json());
      showToast("Savodxonlik auditi qabul qilindi va 12 ta ko'rsatkich qayta hisoblandi!");
    } catch (err) {
      console.error('Failed submitting audit:', err);
    } finally {
      setIsSubmittingAudit(false);
    }
  };

  // Toggle Plan Task
  const handleToggleTask = async (taskId: string) => {
    if (!activeUser) return;
    try {
      const res = await fetch('/api/action-plan/toggle-task', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: activeUser.id,
          taskId,
        }),
      });
      const json = await res.json();
      if (json.success) {
        // Refresh action plan and indicators
        const [planRes, indRes] = await Promise.all([
          fetch(`/api/action-plan/${activeUser.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`/api/indicators/${activeUser.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        ]);
        setActionPlan(await planRes.json());
        setIndicators(await indRes.json());
        showToast(
          json.task.completed
            ? `Vazifa bajarildi! Yangi nishon qo'lga kiritildi: ${json.task.badgeReward?.title || 'Yulduzcha'}`
            : 'Vazifa holati qaytarildi',
          'success'
        );
      }
    } catch (err) {
      console.error('Failed toggling task:', err);
    }
  };

  // Generate AI Action Plan
  const handleGenerateAIPlan = async () => {
    if (!activeUser) return;
    try {
      setIsGeneratingAI(true);
      const res = await fetch(`/api/action-plan/generate/${activeUser.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.plan) {
        setActionPlan(json.plan);
        showToast("Gemini 3.8 Flash orqali yangi 4 haftalik shaxsiy yo'l xaritasi shakllantirildi!");
      }
    } catch (err) {
      console.error('Failed generating AI plan:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Log Digital Tool Activity (Simulator)
  const handleLogToolAction = async (toolName: string, action: string, details: string) => {
    if (!activeUser) return;
    try {
      const res = await fetch('/api/tool-usage/log', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: activeUser.id,
          toolName,
          action,
          details,
        }),
      });
      const json = await res.json();
      if (json.success) {
        if (json.updatedKpi) {
          setIndicators(json.updatedKpi);
        }
        // Refresh logs
        const logsRes = await fetch(`/api/tool-usage/${activeUser.id}`);
        setToolLogs(await logsRes.json());
      }
    } catch (err) {
      console.error('Failed logging action:', err);
    }
  };

  let hasTakenFirstTest = false;
  let isPlanFullyCompleted = false;

  if (indicators && actionPlan) {
    const countCompleted = (tasks: any[] | undefined) => {
      if (!Array.isArray(tasks)) return 0;
      return tasks.filter((t: any) => t.completed).length;
    };
    const w1 = countCompleted(actionPlan.week_1_tasks);
    const w2 = countCompleted(actionPlan.week_2_tasks);
    const w3 = countCompleted(actionPlan.week_3_tasks);
    const w4 = countCompleted(actionPlan.week_4_tasks);
    const totalCompleted = w1 + w2 + w3 + w4;
    const allTasks = [
      ...(actionPlan.week_1_tasks || []),
      ...(actionPlan.week_2_tasks || []),
      ...(actionPlan.week_3_tasks || []),
      ...(actionPlan.week_4_tasks || []),
    ];
    const allTasksCompleted = allTasks.length > 0 && totalCompleted === allTasks.length;
    const allTestsCompleted = 
      actionPlan.week1TestScore !== undefined && actionPlan.week1TestScore !== null &&
      actionPlan.week2TestScore !== undefined && actionPlan.week2TestScore !== null &&
      actionPlan.week3TestScore !== undefined && actionPlan.week3TestScore !== null &&
      actionPlan.week4TestScore !== undefined && actionPlan.week4TestScore !== null;
      
    isPlanFullyCompleted = allTasksCompleted && allTestsCompleted;
    hasTakenFirstTest = (indicators as any).initial_digital_score > 0 || (indicators as any).total_digital_score > 0;
  }

  const showAuditButton = !hasTakenFirstTest || isPlanFullyCompleted;
  const auditButtonText = isPlanFullyCompleted 
    ? "Tabriklaymiz, dasturni yakunladingiz! Qayta topshirish"
    : "Kompetensiyani Baholash";

  const dashboardContent = isLoading || !activeUser || !indicators || !actionPlan ? (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-700">
          DigiLead Smart EdTech Hub yuklanmoqda...
        </p>
        <p className="text-xs text-slate-400">
          12 ta axborot indikatori va ma'lumotlar bazasi tayyorlanmoqda
        </p>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Header
        activeUser={activeUser}
        onLogout={logout}
        showAuditButton={showAuditButton}
        auditButtonText={auditButtonText}
        onOpenAudit={() => setIsAuditModalOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenArchitecture={() => {
          setIsArchitectureOpen(true);
          handleLogToolAction(
            "Ekotizim Xaritasi (Architecture)", 
            "modullarni_organish", 
            "Direktor tizim arxitekturasi va raqamli jarayonlar bog'liqligini tahlil qildi"
          );
        }}
        onOpenHelp={() => setIsHelpOpen(true)}
        isRecalculating={isRecalculating}
        onRecalculate={handleRecalculate}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {!hasTakenFirstTest ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
            <ShieldCheck className="w-20 h-20 text-emerald-500 animate-pulse" />
            <h2 className="text-3xl font-extrabold text-slate-900">Xush kelibsiz!</h2>
            <p className="text-slate-600 max-w-xl text-lg">
              Tizimdan to'liq foydalanish va shaxsiy raqamli rivojlanish AI rejangizni yaratish uchun dastlabki "Case-Study" testini topshirishingiz shart.
            </p>
            <button
              onClick={() => setIsAuditModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg transition transform hover:scale-105"
            >
              Testni boshlash
            </button>
          </div>
        ) : (
          <>
            {/* Toast Notification */}
            {toastMessage && (
              <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3">
                <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 text-xs font-medium max-w-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{toastMessage.text}</span>
                </div>
              </div>
            )}

            {/* 1. Competency Hero Gauge & 3-Source Synthesis */}
            <section id="competency-hero">
              <CompetencyHero
                indicators={indicators}
                activeUser={activeUser}
                readinessLevel={readinessLevel}
                onOpenAudit={() => setIsAuditModalOpen(true)}
                onOpenHelp={() => setIsHelpOpen(true)}
              />
            </section>

            {/* 2. Main Dashboard Content */}
            <div className="max-w-5xl mx-auto space-y-8 mb-12">
              <section id="radar-section">
                <RadarChart
                  indicators={indicators}
                  selectedKey={selectedIndicatorKey}
                  onSelectIndicator={(key) => setSelectedIndicatorKey(key)}
                />
              </section>

              <section id="indicators-list-section">
                <IndicatorList
                  indicators={indicators}
                  selectedKey={selectedIndicatorKey}
                  onSelectKey={(key) => setSelectedIndicatorKey(key)}
                />
              </section>
            </div>

            {/* 3. 4-Week Personal Growth Timeline & AI Microlearning */}
            <div className="max-w-5xl mx-auto space-y-6">
              <section id="roadmap-section">
                <ActionPlanTimeline
                  plan={actionPlan}
                  onToggleTask={handleToggleTask}
                  onGenerateAIPlan={handleGenerateAIPlan}
                  isGeneratingAI={isGeneratingAI}
                />
              </section>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <div className="w-5 h-5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-md flex items-center justify-center text-white text-[10px]">
              DL
            </div>
            <span>MTT Direktorlari Axborot Kompetensiyasini Rivojlantirish Tizimi</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">

            <button
              onClick={() => setIsHelpOpen(true)}
              className="hover:text-slate-600 transition"
            >
              Yordam
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GamifiedAssessmentModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        onSubmitAudit={handleSubmitAudit}
        isSubmitting={isSubmittingAudit}
      />

      <DigitalFootprintSimulator
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        logs={toolLogs}
        onLogAction={handleLogToolAction}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <HelpTutorialModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={!activeUser ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!activeUser ? <Register /> : <Navigate to="/" />} />
      <Route path="/admin" element={activeUser?.role === 'superadmin' ? <AdminDashboard /> : <Navigate to="/" />} />
      <Route path="/" element={activeUser ? (activeUser.role === 'superadmin' ? <Navigate to="/admin" /> : dashboardContent) : <Navigate to="/login" />} />
    </Routes>
  );
}
