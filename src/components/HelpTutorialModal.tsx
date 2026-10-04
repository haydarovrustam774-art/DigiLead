import React from 'react';
import {
  X,
  HelpCircle,
  Smile,
  Shield,
  Cloud,
  CheckCircle,
  PlayCircle,
  Lightbulb,
} from 'lucide-react';

interface HelpTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpTutorialModal: React.FC<HelpTutorialModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const rules = [
    {
      title: "1. Xotirjamlik — birinchi qadam",
      text: "Texnologiya sizni almashtirish uchun emas, balki qog'ozbozlik yukini yelkangizdan olish uchun yaratilgan. Hech qanday tugmani bosishdan qo'rqmang — tizimda xato qilib bo'lmaydi!",
      icon: <Smile className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: "2. Qog'ozdan ko'ra bulutli xotira ishonchliroq",
      text: "Qog'oz hujjat yo'qolishi, suv tegishi yoki yirtilishi mumkin. Bulutli xotira (Google Drive) dagi fayllaringiz esa xavfsiz serverda doim saqlanadi.",
      icon: <Cloud className="w-5 h-5 text-blue-600" />,
    },
    {
      title: "3. Kiberxotirjamlik qoidalari",
      text: "Pochtanggizga shubhali yoki 'shoshilinch tekshiruv' deb kelgan havolalarni ochmang. Muhim dasturlarga oddiy raqamlar emas, o'zingiz biladigan so'zli parol qo'ying.",
      icon: <Shield className="w-5 h-5 text-amber-600" />,
    },
    {
      title: "4. Kichik qadamlar (Microlearning)",
      text: "Kuniga atigi 5 daqiqalik amaliy mashq sizni 1 oyda zamonaviy raqamli yetakchiga aylantiradi.",
      icon: <Lightbulb className="w-5 h-5 text-purple-600" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
                Texnofobiyani Yengish va Tezkor Yo'riqnomalar
              </h2>
              <p className="text-xs text-slate-500">
                MTT rahbarlari uchun kognitiv yengillik va qulay tavsiyalar
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

        {/* Body */}
        <div className="p-6 sm:p-7 overflow-y-auto flex-1 space-y-5">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Platforma falsafasi:
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              "DigiLead: Smart EdTech Hub" ta'lim muassasalari rahbarlarining texnologiyaga nisbatan 
              qo'rquvini (texnofobiyani) yo'qotish va insoniy, qulay, do'stona muhitda raqamli 
              boshqaruv ko'nikmalarini shakllantirish uchun yaratilgan ilmiy-amaliy loyihadir.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Rahbar uchun 4 ta oltin raqamli qoida:
            </h3>
            {rules.map((rule, idx) => (
              <div
                key={`rule-${idx}`}
                className="p-4 rounded-2xl border border-slate-200/80 bg-white flex items-start gap-3.5 shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {rule.icon}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {rule.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {rule.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200/70 text-xs text-teal-900 leading-relaxed flex items-center gap-3">
            <PlayCircle className="w-6 h-6 text-teal-700 shrink-0" />
            <div>
              <span className="font-bold block">Savollaringiz bormi?</span>
              MTT IT-metodisti va pedagogik jamoa sizga har doim virtual hamrohlik qilishga tayyor.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs"
          >
            Tushundim, rahmat!
          </button>
        </div>
      </div>
    </div>
  );
};
