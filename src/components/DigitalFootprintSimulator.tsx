import React, { useState } from 'react';
import {
  X,
  Fingerprint,
  PlusCircle,
  Clock,
  Cloud,
  MessageSquare,
  Video,
  Database,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { ToolUsageLog } from '../types';

interface DigitalFootprintSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ToolUsageLog[];
  onLogAction: (toolName: string, action: string, details: string) => Promise<void>;
}

export const DigitalFootprintSimulator: React.FC<DigitalFootprintSimulatorProps> = ({
  isOpen,
  onClose,
  logs,
  onLogAction,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickActions = [
    {
      tool: 'Google Drive',
      action: 'bulutda_hujjat_yaratish',
      title: "Bulutda 'Oylik Taomnoma' yaratish",
      description: "Qog'oz o'rniga Google Docs dasturida yangi hujjat ochib, oshpaz va tarbiyachilarga ulashish.",
      impact: "+2% Bulutli texnologiyalar ko'rsatkichi",
      icon: <Cloud className="w-5 h-5 text-blue-500" />,
    },
    {
      tool: 'Telegram',
      action: 'rasmiy_xabarnoma',
      title: "Telegram kanalga haftalik foto-hisobot joylash",
      description: "Ota-onalar bilan shaffof aloqa o'rnatish uchun guruhga tasdiqlangan rasmiy xabar yuborish.",
      impact: "+2% Raqamli kommunikatsiya ko'rsatkichi",
      icon: <MessageSquare className="w-5 h-5 text-sky-500" />,
    },
    {
      tool: 'Zoom',
      action: 'onlayn_brifing',
      title: "Zoom'da tarbiyachilar tezkor yig'ilishini o'tkazish",
      description: "15 daqiqalik virtual muloqot orqali yangi o'quv dasturini muhokama qilish.",
      impact: "+2% EdTech integratsiyasi ko'rsatkichi",
      icon: <Video className="w-5 h-5 text-purple-500" />,
    },
    {
      tool: 'ERP System',
      action: 'ombor_audit',
      title: "ERP tizimida omborxona hisobotini tekshirish",
      description: "Oziq-ovqat va xo'jalik mahsulotlari kirim-chiqimini elektron qayd etish.",
      impact: "+2% Resurslarni raqamlashtirish ko'rsatkichi",
      icon: <Database className="w-5 h-5 text-amber-500" />,
    },
    {
      tool: 'ChatGPT',
      action: 'ai_ssenariy_yozish',
      title: "AI orqali 'Navro'z bayrami' ssenariysi tuzish",
      description: "Sun'iy intellektdan 5 xil ijodiy g'oya so'rab, MTT sharoitiga moslashtirish.",
      impact: "+3% Sun'iy intellekt (AI) ko'rsatkichi",
      icon: <Cpu className="w-5 h-5 text-emerald-500" />,
    },
  ];

  const handleTrigger = async (act: typeof quickActions[0]) => {
    try {
      setIsSubmitting(true);
      await onLogAction(act.tool, act.action, act.title);
      setSuccessToast(`Amal muvaffaqiyatli qayd etildi: ${act.title}`);
      setTimeout(() => setSuccessToast(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
                Raqamli Iz Qoldirish Simulyatori (Digital Footprint)
              </h2>
              <p className="text-xs text-slate-500">
                Tizimda amaliy faollik qoldiring va uning 12 indikatorga ta'sirini ko'ring
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

        {/* Modal Body */}
        <div className="p-6 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {/* Toast feedback */}
          {successToast && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successToast}</span>
            </div>
          )}

          {/* Explanation */}
          <div className="bg-teal-50/70 rounded-2xl p-4 border border-teal-200/70 text-xs text-teal-900 leading-relaxed">
            <strong className="block mb-1 text-teal-950 font-bold">Raqamli iz qanday ishlaydi?</strong>
            MTT direktori qog'oz emas, bulutli va raqamli vositalardan qanchalik tez-tez foydalansa, 
            tizim ushbu harakatlarni avtomatik hisoblab boradi va "Axborot kompetensiyasi indeksi"ga 
            <strong className="font-bold"> 40% lik salmoq</strong> bilan qo'shadi.
          </div>

          {/* Quick Simulation Actions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Bir marta bosish orqali raqamli amalni sinab ko'ring:
            </h3>
            <div className="space-y-2.5">
              {quickActions.map((act, idx) => (
                <div
                  key={`act-${idx}`}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-teal-300 bg-white hover:bg-teal-50/20 transition flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      {act.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {act.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {act.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      {act.impact}
                    </span>
                    <button
                      onClick={() => handleTrigger(act)}
                      disabled={isSubmitting}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs active:scale-95 transition disabled:opacity-60"
                    >
                      Amalga oshirish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Footprint Logs */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              So'nggi tizim audit loglari ({logs.length} ta qayd)
            </h3>
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{log.toolName}:</span>
                    <span className="text-slate-600 truncate max-w-xs">{log.actionType?.details || log.actionType?.action}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
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
