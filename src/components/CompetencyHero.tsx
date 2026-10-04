import React from 'react';
import {
  Award,
  TrendingUp,
  BrainCircuit,
  Fingerprint,
  UserCheck2,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Users,
  BarChart,
} from 'lucide-react';
import { DigitalIndicators12, DigitalReadinessLevel, User } from '../types';

interface CompetencyHeroProps {
  indicators: DigitalIndicators12;
  activeUser: User;
  readinessLevel: DigitalReadinessLevel;
  onOpenAudit: () => void;
  onOpenHelp: () => void;
}

export const CompetencyHero: React.FC<CompetencyHeroProps> = ({
  indicators,
  activeUser,
  readinessLevel,
  onOpenAudit,
  onOpenHelp,
}) => {
  const score = indicators.total_digital_score;

  // Psychological traffic light color styling
  // Sokin yashil (>=75%), Iliq sariq (50-74%), Och korall/qizil (<50%)
  const getStatusStyles = () => {
    if (score >= 75) {
      return {
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        ringColor: 'stroke-emerald-500',
        textColor: 'text-emerald-700',
        bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
        label: 'Ilg\'or Lider (Advanced)',
        summaryText: "A'lo daraja! Siz MTT boshqaruvida raqamli vositalardan xotirjam va samarali foydalanmoqdasiz.",
      };
    }
    if (score >= 50) {
      return {
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        ringColor: 'stroke-amber-500',
        textColor: 'text-amber-700',
        bgGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
        label: "O'rta Bosqich (Intermediate)",
        summaryText: "Yaxshi natija! Asosiy vositalar o'zlashtirilgan. Kiberxavfsizlik va bulutli xizmatlarni yana biroz mustahkamlaymiz.",
      };
    }
    return {
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
      ringColor: 'stroke-rose-400',
      textColor: 'text-rose-600',
      bgGradient: 'from-rose-500/10 via-amber-500/5 to-transparent',
      label: "Boshlang'ich Bosqich (Beginner)",
      summaryText: "Xavotirlanmang! DigiLead platformasi har bir qadamda sizga hamroh bo'lib, texnofobiyani yengishga ko'maklashadi.",
    };
  };

  const status = getStatusStyles();

  // SVG Circular progress math
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden relative">
      {/* Subtle warm accent gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${status.bgGradient} pointer-events-none`} />

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Score Circular Gauge */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-6 text-center sm:text-left lg:text-center border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-8">
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 144 144">
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-slate-100"
                  strokeWidth="11"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className={`${status.ringColor} transition-all duration-1000 ease-out`}
                  strokeWidth="11"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 tracking-tight font-['Outfit',sans-serif]">
                  {score}%
                </span>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Raqamli Indeks
                </span>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-2 shadow-2xs"
                style={{ backgroundColor: status.badgeBg }}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{status.label}</span>
              </div>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Baholash davri: <strong className="text-slate-700">{indicators.evaluationPeriod || '2026-Q1'}</strong>
              </p>
            </div>
          </div>

          {/* Contextual Narrative & 3-Source Synthesis */}
          <div className="lg:col-span-8 flex flex-col justify-between h-full">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
                  Hurmatli <span className="text-emerald-700">{activeUser.fullName}</span>,
                </h1>
                <span className="text-xs text-slate-600 bg-slate-100/90 px-3 py-1 rounded-lg font-medium border border-slate-200/60">
                  {activeUser.organizationName}
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mb-6">
                {status.summaryText} Platforma sizning boshqaruv ko'nikmalaringizni 
                <strong className="text-slate-800"> 12 ta asosiy axborot indikatori</strong> bo'yicha tahlil qilib, 
                kundalik qog'ozbozlik yuklamasini kamaytirishga yordam beradi.
              </p>
            </div>

            {/* 4 Criteria Section */}
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/70">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  Shaxsiy Rivojlanish Mezonlari
                </span>
                <button
                  onClick={onOpenHelp}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Qanday hisoblanadi?</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 1. Intellektuallik */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <BrainCircuit className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Intellektuallik</span>
                    </div>
                  </div>
                  <div className="text-lg font-black text-emerald-600 mt-1">
                    {indicators.intellect_score || 0}%
                  </div>
                </div>

                {/* 2. Axborotlilik */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                        <BarChart className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Axborotlilik</span>
                    </div>
                  </div>
                  <div className="text-lg font-black text-blue-600 mt-1">
                    {indicators.info_score || 0}%
                  </div>
                </div>

                {/* 3. Ijodkorlik */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Ijodkorlik</span>
                    </div>
                  </div>
                  <div className="text-lg font-black text-purple-600 mt-1">
                    {indicators.creative_score || 0}%
                  </div>
                </div>

                {/* 4. Jamoaviylik */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Jamoaviylik</span>
                    </div>
                  </div>
                  <div className="text-lg font-black text-amber-600 mt-1">
                    {indicators.team_score || 0}%
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
