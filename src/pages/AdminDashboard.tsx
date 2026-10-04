import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Activity, BarChart2, Plus, Edit2, Trash2, LogOut, X, Save, TrendingUp, Award, Target, BrainCircuit, BarChart, Lightbulb } from 'lucide-react';
import { DigitalIndicators12 } from '../types';
import { INDICATOR_KEYS } from '../data/indicatorsData';
import { RadarChart } from '../components/RadarChart';

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  organizationName: string;
  digitalReadinessLevel: string;
  createdAt: string;
  latestIndicators: DigitalIndicators12 | null;
  actionPlans: any[];
}

export default function AdminDashboard() {
  const { token, user: activeUser, logout } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organizationName: '',
    role: 'director',
    password: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Foydalanuvchilarni yuklab bo'lmadi");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeUser?.role === 'superadmin') {
      fetchUsers();
    } else {
      setError("Sizda ushbu sahifaga kirish huquqi yo'q");
      setIsLoading(false);
    }
  }, [token, activeUser]);

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ fullName: '', email: '', organizationName: '', role: 'director', password: '' });
    setSelectedUserId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setModalMode('edit');
    setFormData({
      fullName: user.fullName,
      email: user.email,
      organizationName: user.organizationName,
      role: user.role,
      password: '' // Keep empty unless changing
    });
    setSelectedUserId(user.id);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (modalMode === 'add') {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(formData)
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Qo\'shishda xatolik');
        }
      } else {
        const res = await fetch(`/api/admin/users/${selectedUserId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error('Tahrirlashda xatolik');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Rostdan ham ${name} ni o'chirmoqchimisiz? Uning barcha natijalari o'chib ketadi!`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("O'chirishda xatolik");
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- STATS CALCULATION ---
  const stats = useMemo(() => {
    const directors = users.filter(u => u.role === 'director');
    const total = directors.length;
    
    let totalScore = 0;
    let advanced = 0;
    let intermediate = 0;
    let beginner = 0;

    const avgIndicators: any = {
      cloud_computing_usage: 0,
      data_driven_decisions: 0,
      edtech_integration: 0,
      cybersecurity_awareness: 0,
      digital_communication: 0,
      digital_monitoring: 0,
      resource_digitization: 0,
      ai_automation_adoption: 0,
      digital_ethics: 0,
      lms_navigation: 0,
      digital_troubleshooting: 0,
      continuous_digital_learning: 0,
      total_digital_score: 0,
      intellectScore: 0,
      infoScore: 0,
      creativeScore: 0,
      teamScore: 0
    };

    const avgInitialIndicators: any = { ...avgIndicators }; // initialize with 0s

    directors.forEach(d => {
      const score = d.latestIndicators?.totalDigitalScore || 0;
      totalScore += score;
      
      if (score >= 75) advanced++;
      else if (score >= 50) intermediate++;
      else beginner++;

      if (d.latestIndicators) {
        const camelMapping: any = {
          cloud_computing_usage: 'cloudComputingUsage',
          data_driven_decisions: 'dataDrivenDecisions',
          edtech_integration: 'edtechIntegration',
          cybersecurity_awareness: 'cybersecurityAwareness',
          digital_communication: 'digitalCommunication',
          digital_monitoring: 'digitalMonitoring',
          resource_digitization: 'resourceDigitization',
          ai_automation_adoption: 'aiAutomationAdoption',
          digital_ethics: 'digitalEthics',
          lms_navigation: 'lmsNavigation',
          digital_troubleshooting: 'digitalTroubleshooting',
          continuous_digital_learning: 'continuousDigitalLearning'
        };
        
        let initialParsed: any = null;
        if ((d.latestIndicators as any).initialIndicatorsJson) {
           try {
             initialParsed = JSON.parse((d.latestIndicators as any).initialIndicatorsJson);
           } catch(e) {}
        }

        INDICATOR_KEYS.forEach(key => {
          const camelKey = camelMapping[key] || key;
          const currentVal = (d.latestIndicators as any)[camelKey] || 0;
          avgIndicators[key] += currentVal;
          
          if (initialParsed) {
             avgInitialIndicators[key] += initialParsed[camelKey] || 0;
          } else {
             avgInitialIndicators[key] += currentVal; // Fallback if no initial recorded
          }
        });

        let i = d.latestIndicators.intellectScore || 0;
        let in_ = d.latestIndicators.infoScore || 0;
        let c = d.latestIndicators.creativeScore || 0;
        let t = d.latestIndicators.teamScore || 0;
        
        // Fallback for old data where these metrics are 0 despite having taken the test
        if (i === 0 && d.latestIndicators.totalDigitalScore > 0) {
           i = Math.round(((d.latestIndicators.dataDrivenDecisions||0) + (d.latestIndicators.edtechIntegration||0) + (d.latestIndicators.continuousDigitalLearning||0)) / 3);
           in_ = Math.round(((d.latestIndicators.cloudComputingUsage||0) + (d.latestIndicators.resourceDigitization||0) + (d.latestIndicators.lmsNavigation||0)) / 3);
           c = Math.round(((d.latestIndicators.aiAutomationAdoption||0) + (d.latestIndicators.digitalTroubleshooting||0) + (d.latestIndicators.cybersecurityAwareness||0)) / 3);
           t = Math.round(((d.latestIndicators.digitalCommunication||0) + (d.latestIndicators.digitalMonitoring||0) + (d.latestIndicators.digitalEthics||0)) / 3);
        }

        avgIndicators.intellectScore += i;
        avgIndicators.infoScore += in_;
        avgIndicators.creativeScore += c;
        avgIndicators.teamScore += t;
      }
    });

    if (total > 0) {
      INDICATOR_KEYS.forEach(key => {
        avgIndicators[key] = Math.round(avgIndicators[key] / total);
        avgInitialIndicators[key] = Math.round(avgInitialIndicators[key] / total);
      });
      avgIndicators.total_digital_score = Math.round(totalScore / total);
      avgIndicators.intellectScore = Math.round(avgIndicators.intellectScore / total);
      avgIndicators.infoScore = Math.round(avgIndicators.infoScore / total);
      avgIndicators.creativeScore = Math.round(avgIndicators.creativeScore / total);
      avgIndicators.teamScore = Math.round(avgIndicators.teamScore / total);
    }

    return {
      total,
      averageScore: total > 0 ? Math.round(totalScore / total) : 0,
      advanced,
      intermediate,
      beginner,
      advancedPct: total > 0 ? Math.round((advanced / total) * 100) : 0,
      intermediatePct: total > 0 ? Math.round((intermediate / total) * 100) : 0,
      beginnerPct: total > 0 ? Math.round((beginner / total) * 100) : 0,
      avgIndicators: avgIndicators as DigitalIndicators12,
      avgInitialIndicators: avgInitialIndicators as DigitalIndicators12
    };
  }, [users]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Xatolik</h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-sm">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">DigiLead Admin</h1>
            <p className="text-[11px] text-slate-500 font-medium">Monitoring va Boshqaruv</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-700">{activeUser?.fullName}</span>
          <button 
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
          >
            <LogOut className="w-4 h-4" />
            Tizimdan chiqish
          </button>
        </div>
      </header>

      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        
        {/* --- STATS & INFOGRAPHICS SECTION --- */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Tizim bo'yicha umumiy holat</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* KPI Cards */}
            <div className="flex flex-col gap-6">
              {/* Total Users */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Jami Direktorlar</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                </div>
              </div>

              {/* Average Score */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">O'rtacha Ball (Tizim)</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.averageScore} <span className="text-sm font-medium text-slate-400">/ 100</span></p>
                </div>
              </div>

              {/* Readiness Breakdown */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex-1 flex flex-col justify-center">
                <p className="text-sm font-medium text-slate-500 mb-4">Darajalar taqsimoti</p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-bold text-emerald-700">Ilg'or (Advanced)</span>
                      <span className="text-slate-500">{stats.advancedPct}% ({stats.advanced})</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats.advancedPct}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-bold text-amber-700">O'rta (Intermediate)</span>
                      <span className="text-slate-500">{stats.intermediatePct}% ({stats.intermediate})</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${stats.intermediatePct}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-bold text-rose-700">Boshlang'ich (Beginner)</span>
                      <span className="text-slate-500">{stats.beginnerPct}% ({stats.beginner})</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: `${stats.beginnerPct}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Radar Chart for System Average */}
            <div className="lg:col-span-2 relative">
               <div className="absolute top-6 left-6 z-10">
                 <h3 className="text-lg font-bold text-slate-900">O'rtacha Kompetensiya Radari</h3>
                 <p className="text-xs text-slate-500 max-w-xs mt-1">
                   Ushbu diagramma tizimdagi barcha direktorlarning o'rtacha ko'rsatkichlarini aks ettiradi.
                 </p>
               </div>
                {stats.total > 0 ? (
                 <RadarChart indicators={stats.avgIndicators} initialIndicators={stats.avgInitialIndicators} hideHeader={true} />
               ) : (
                 <div className="bg-white rounded-3xl border border-slate-200 h-[460px] flex flex-col items-center justify-center text-slate-400">
                   <Target className="w-12 h-12 mb-3 opacity-20" />
                   <p>Hali ma'lumotlar yo'q</p>
                 </div>
               )}
            </div>

          </div>
        </div>

        {/* --- USERS TABLE SECTION --- */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Foydalanuvchilarni Boshqarish</h2>
              <p className="text-slate-500 mt-1">Direktorlar profillarini qo'shish va tahrirlash</p>
            </div>
            <button 
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Yangi qo'shish
            </button>
          </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 text-slate-600 text-sm border-b border-slate-200">
                  <th className="p-4 font-semibold">Foydalanuvchi</th>
                  <th className="p-4 font-semibold">Tashkilot</th>
                  <th className="p-4 font-semibold">Rol</th>
                  <th className="p-4 font-semibold text-center">Darajasi</th>
                  <th className="p-4 font-semibold text-center">Birinchi Test</th>
                  <th className="p-4 font-semibold text-center">Joriy Ball</th>
                  <th className="p-4 font-semibold">Haftalik Natijalar</th>
                  <th className="p-4 font-semibold text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {users.map((user) => {
                  const plan = user.actionPlans?.[0];
                  let w1 = 0, w2 = 0, w3 = 0, w4 = 0;
                  let w1T = 0, w2T = 0, w3T = 0, w4T = 0;
                  if (plan) {
                     w1 = plan.week1TestScore ?? 0;
                     w2 = plan.week2TestScore ?? 0;
                     w3 = plan.week3TestScore ?? 0;
                     w4 = plan.week4TestScore ?? 0;
                     
                     const parseW = (w: string) => {
                       try { return JSON.parse(w || '[]').filter((t:any)=>t.completed).length; } catch(e) { return 0; }
                     }
                     w1T = parseW(plan.week1Tasks);
                     w2T = parseW(plan.week2Tasks);
                     w3T = parseW(plan.week3Tasks);
                     w4T = parseW(plan.week4Tasks);
                  }
                  return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{user.fullName}</div>
                      <div className="text-slate-500 text-xs">{user.email}</div>
                    </td>
                    <td className="p-4 text-slate-700">{user.organizationName}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                        user.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        user.digitalReadinessLevel === 'advanced' ? 'bg-emerald-100 text-emerald-700' :
                        user.digitalReadinessLevel === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {user.digitalReadinessLevel}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {user.latestIndicators ? (
                        <div className="flex items-center justify-center space-x-1">
                          <span className="font-bold text-slate-500">{(user.latestIndicators as any).initialDigitalScore || 0}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {user.latestIndicators ? (
                        <div className="flex items-center justify-center space-x-1">
                          <BarChart2 className="w-4 h-4 text-indigo-500" />
                          <span className="font-bold text-slate-900">{user.latestIndicators.totalDigitalScore}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {plan ? (
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                          <span className={`px-1.5 py-0.5 rounded ${w1>0||w1T>0?'text-emerald-700 bg-emerald-100':'text-slate-500 bg-slate-100'}`} title="1-hafta: Test natijasi (T) va Bajarilgan vazifalar (V)">
                            W1: T{w1}-V{w1T}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded ${w2>0||w2T>0?'text-emerald-700 bg-emerald-100':'text-slate-500 bg-slate-100'}`} title="2-hafta: Test natijasi (T) va Bajarilgan vazifalar (V)">
                            W2: T{w2}-V{w2T}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded ${w3>0||w3T>0?'text-emerald-700 bg-emerald-100':'text-slate-500 bg-slate-100'}`} title="3-hafta: Test natijasi (T) va Bajarilgan vazifalar (V)">
                            W3: T{w3}-V{w3T}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded ${w4>0||w4T>0?'text-emerald-700 bg-emerald-100':'text-slate-500 bg-slate-100'}`} title="4-hafta: Test natijasi (T) va Bajarilgan vazifalar (V)">
                            W4: T{w4}-V{w4T}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">Reja yo'q</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {user.id !== activeUser?.id && (
                          <button 
                            onClick={() => handleDelete(user.id, user.fullName)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
            
            {users.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                Hozircha foydalanuvchilar yo'q.
              </div>
            )}
          </div>
        </div>

        {/* --- 4 CRITERIA SECTION --- */}
        <div className="pt-8 mt-8 border-t border-slate-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Shaxsiy Rivojlanish Mezonlari</h2>
            <p className="text-slate-500 mt-1">4 ta asosiy mezon bo'yicha umumiy va shaxsiy ko'rsatkichlar</p>
          </div>

          {/* Averages */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-800 leading-tight">Umumiy<br/>Intellektuallik</span>
              </div>
              <div className="text-2xl font-black text-emerald-600">
                {stats.avgIndicators.intellectScore || 0}%
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <BarChart className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-800 leading-tight">Umumiy<br/>Axborotlilik</span>
              </div>
              <div className="text-2xl font-black text-blue-600">
                {stats.avgIndicators.infoScore || 0}%
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-800 leading-tight">Umumiy<br/>Ijodkorlik</span>
              </div>
              <div className="text-2xl font-black text-purple-600">
                {stats.avgIndicators.creativeScore || 0}%
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-800 leading-tight">Umumiy<br/>Jamoaviylik</span>
              </div>
              <div className="text-2xl font-black text-amber-600">
                {stats.avgIndicators.teamScore || 0}%
              </div>
            </div>
          </div>

          {/* Individual Results Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/50 text-slate-600 text-sm border-b border-slate-200">
                    <th className="p-4 font-semibold">Foydalanuvchi</th>
                    <th className="p-4 font-semibold text-center text-emerald-700">Intellektuallik</th>
                    <th className="p-4 font-semibold text-center text-blue-700">Axborotlilik</th>
                    <th className="p-4 font-semibold text-center text-purple-700">Ijodkorlik</th>
                    <th className="p-4 font-semibold text-center text-amber-700">Jamoaviylik</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {users.filter(u => u.role === 'director').map((user) => {
                    let i = user.latestIndicators?.intellectScore || 0;
                    let in_ = user.latestIndicators?.infoScore || 0;
                    let c = user.latestIndicators?.creativeScore || 0;
                    let t = user.latestIndicators?.teamScore || 0;
                    
                    if (i === 0 && user.latestIndicators && user.latestIndicators.totalDigitalScore > 0) {
                      const ind = user.latestIndicators;
                      i = Math.round(((ind.dataDrivenDecisions||0) + (ind.edtechIntegration||0) + (ind.continuousDigitalLearning||0)) / 3);
                      in_ = Math.round(((ind.cloudComputingUsage||0) + (ind.resourceDigitization||0) + (ind.lmsNavigation||0)) / 3);
                      c = Math.round(((ind.aiAutomationAdoption||0) + (ind.digitalTroubleshooting||0) + (ind.cybersecurityAwareness||0)) / 3);
                      t = Math.round(((ind.digitalCommunication||0) + (ind.digitalMonitoring||0) + (ind.digitalEthics||0)) / 3);
                    }

                    return (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">{user.fullName}</div>
                        <div className="text-slate-500 text-xs">{user.organizationName}</div>
                      </td>
                      <td className="p-4 text-center font-bold text-emerald-600">
                        {i}%
                      </td>
                      <td className="p-4 text-center font-bold text-blue-600">
                        {in_}%
                      </td>
                      <td className="p-4 text-center font-bold text-purple-600">
                        {c}%
                      </td>
                      <td className="p-4 text-center font-bold text-amber-600">
                        {t}%
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
      </div>
      
      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">
                {modalMode === 'add' ? 'Yangi foydalanuvchi' : 'Tahrirlash'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">F.I.Sh</label>
                <input 
                  required
                  type="text" 
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tashkilot (MTT nomi)</label>
                <input 
                  required
                  type="text" 
                  value={formData.organizationName}
                  onChange={e => setFormData({...formData, organizationName: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rol</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  <option value="director">Direktor</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Parol {modalMode === 'edit' && <span className="text-slate-400 font-normal">(O'zgartirmasangiz bo'sh qoldiring)</span>}
                </label>
                <input 
                  required={modalMode === 'add'}
                  type="text" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="Yangi parol..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              
              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 transition flex items-center gap-2"
                >
                  {isSaving ? <Activity className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
