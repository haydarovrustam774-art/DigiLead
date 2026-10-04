import React, { useState } from 'react';
import {
  X,
  Database,
  Layers,
  FileCode,
  ShieldCheck,
  Server,
  Zap,
  Copy,
  Check,
  Code2,
} from 'lucide-react';
import { PRISMA_SCHEMA, SQL_DDL_SCHEMA } from '../data/schemas';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'prisma' | 'sql' | 'endpoints' | 'security'>('prisma');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2500);
  };

  const apiEndpoints = [
    {
      method: 'POST',
      path: '/api/digital-audit/submit',
      desc: "Direktorning keys-savollar javoblarini va o'z-o'zini baholash natijalarini qabul qiladi, 12 ta indikatorni yangilaydi.",
      params: '{ userId: UUID, answers: { [indicatorKey]: number } }',
      returns: '{ success: true, result: CalculationBreakdown }',
    },
    {
      method: 'GET',
      path: '/api/kpi/calculate-digital-score/:user_id',
      desc: "3 xil mustaqil manbani (o'z-o'zini baholash 35%, raqamli izlar 40%, IT-metodist xulosasi 25%) sintez qilib 12 indikator va umumiy indeksni aniqlaydi.",
      params: 'user_id (path parameter)',
      returns: '{ indicators: DigitalIndicators12, breakdown: Object, readinessLevel: string }',
    },
    {
      method: 'POST',
      path: '/api/action-plan/generate/:user_id',
      desc: "Direktorning 12 indikatoridan eng past 3 tasini avtomatik aniqlab, Gemini 3.8 Flash AI orqali 4 haftalik mikro-o'quv o'sish rejasini shakllantiradi.",
      params: 'user_id (path parameter)',
      returns: '{ plan: DigitalActionPlan }',
    },
    {
      method: 'GET',
      path: '/api/indicators/:user_id',
      desc: "Direktorning 12 ta axborot indikatori joriy ballarini (0-100%) qaytaradi.",
      params: 'user_id (path parameter)',
      returns: 'DigitalIndicators12',
    },
    {
      method: 'POST',
      path: '/api/action-plan/toggle-task',
      desc: "Mikro-vazifa bajarilishini tasdiqlaydi, virtual nishon (badge) beradi va tegishli indikator ballini oshiradi.",
      params: '{ userId: UUID, taskId: string }',
      returns: '{ task: ActionTask, planProgress: string, updatedScore: number }',
    },
    {
      method: 'POST',
      path: '/api/tool-usage/log',
      desc: "Google Drive, Zoom, ERP, ChatGPT kabi vositalardan foydalanish faolligini qayd etadi (Digital Footprint).",
      params: '{ userId: UUID, toolName: string, action: string, details: string }',
      returns: '{ success: true, log: ToolUsageLog, updatedKpi: Object }',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
                Tizim Arxitekturasi va Ma'lumotlar Bazasi Schemasi
              </h2>
              <p className="text-xs text-slate-500">
                PostgreSQL relyatsion modeli, Prisma ORM kodi va REST API arxitekturasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200/70 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('prisma')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'prisma'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Prisma Schema (ORM)</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'sql'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>PostgreSQL DDL (SQL)</span>
          </button>
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'endpoints'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Backend API Endpoints</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'security'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Zero-Trust & Redis Keshlash</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
          {activeTab === 'prisma' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">
                  Prisma ORM kodi: 5 ta relyatsion jadval va ENUM tiplar
                </span>
                <button
                  onClick={() => handleCopy(PRISMA_SCHEMA, 'prisma')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-2xs"
                >
                  {copied === 'prisma' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Nusxalandi!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kodni nusxalash</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                {PRISMA_SCHEMA}
              </pre>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">
                  PostgreSQL relyatsion SQL DDL: cheklovlar (CHECK constraints), UUID va indekslar
                </span>
                <button
                  onClick={() => handleCopy(SQL_DDL_SCHEMA, 'sql')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-2xs"
                >
                  {copied === 'sql' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Nusxalandi!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kodni nusxalash</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-900 text-sky-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                {SQL_DDL_SCHEMA}
              </pre>
            </div>
          )}

          {activeTab === 'endpoints' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Backend mikroservis va REST API endpointlari ro'yxati (Node.js/Express & NestJS/FastAPI ga mos):
              </p>
              <div className="space-y-3">
                {apiEndpoints.map((ep, idx) => (
                  <div
                    key={`ep-${idx}`}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md font-mono ${
                          ep.method === 'POST'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {ep.path}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">
                      {ep.desc}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono">
                      <div>
                        <span className="text-slate-400">Request: </span>
                        <span className="text-slate-700">{ep.params}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Response: </span>
                        <span className="text-slate-700">{ep.returns}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
              {/* Zero-Trust */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2 font-['Outfit',sans-serif]">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Zero-Trust Xavfsizlik Modeli va GDPR Talablari
                </h3>
                <p className="text-slate-600 mb-3">
                  MTTda bolalar va xodimlar shaxsiy ma'lumotlari aylanadi. Shuning uchun Zero-Trust arxitekturasi:
                </p>
                <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                  <li><strong>Hech qachon ishonmaslik, har doim tekshirish:</strong> Har bir API so'rovi JWT va RBAC tokenlari orqali tekshiriladi.</li>
                  <li><strong>Ma'lumotlar bazasida shifrlash (Encryption at rest):</strong> AES-256 algoritmi orqali shifrlangan saqlash.</li>
                  <li><strong>Tranzitda shifrlash (Encryption in transit):</strong> TLS 1.3 shifrlangan kanali.</li>
                  <li><strong>Audit Logs:</strong> Har bir amal `Tool_Usage_Logs` va tizim audit jadvaliga o'zgarmas (immutable) qilib qayd etiladi.</li>
                </ul>
              </div>

              {/* Redis Caching */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2 font-['Outfit',sans-serif]">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Redis In-Memory Keshlash Arxitekturasi
                </h3>
                <p className="text-slate-600 mb-3">
                  12 indikatorli radar chart va o'rtacha tuman statistikasi tez yuklanishi uchun Redis kesh qatlami:
                </p>
                <div className="p-3 bg-slate-900 text-amber-300 rounded-xl font-mono text-[11px] leading-relaxed">
                  {'Key formati: kpi:cache:user:{user_id}:period:{2026-Q1} (TTL: 900 soniya)'}<br/>
                  Invalidatsiya: Har safar audit topshirilganda yoki yangi raqamli iz tushganda kesh avtomatik tozalab qayta generatsiya qilinadi.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs transition hover:bg-slate-800 shadow-xs"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
