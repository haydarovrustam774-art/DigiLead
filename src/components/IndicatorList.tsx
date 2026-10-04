import React, { useState } from 'react';
import {
  Cloud,
  BarChart3,
  Sparkles,
  ShieldCheck,
  MessageSquareShare,
  Activity,
  Boxes,
  Cpu,
  UserCheck,
  Compass,
  Wrench,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { DigitalIndicators12, IndicatorKey } from '../types';
import { INDICATORS_METADATA, INDICATOR_KEYS } from '../data/indicatorsData';

interface IndicatorListProps {
  indicators: DigitalIndicators12;
  selectedKey?: IndicatorKey | null;
  onSelectKey?: (key: IndicatorKey) => void;
}

export const IndicatorList: React.FC<IndicatorListProps> = ({
  indicators,
  selectedKey,
  onSelectKey,
}) => {
  const [expandedKey, setExpandedKey] = useState<IndicatorKey | null>(selectedKey || null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const getIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Cloud':
        return <Cloud className={className} />;
      case 'BarChart3':
        return <BarChart3 className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'MessageSquareShare':
        return <MessageSquareShare className={className} />;
      case 'Activity':
        return <Activity className={className} />;
      case 'Boxes':
        return <Boxes className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'UserCheck':
        return <UserCheck className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Wrench':
        return <Wrench className={className} />;
      case 'GraduationCap':
        return <GraduationCap className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) {
      return {
        barColor: 'bg-emerald-500',
        badgeBg: 'bg-emerald-100/80 text-emerald-800 border-emerald-200',
        textColor: 'text-emerald-700',
        statusLabel: "A'lo (Ilg'or)",
      };
    }
    if (score >= 50) {
      return {
        barColor: 'bg-amber-500',
        badgeBg: 'bg-amber-100/80 text-amber-800 border-amber-200',
        textColor: 'text-amber-700',
        statusLabel: "O'rta daraja",
      };
    }
    return {
      barColor: 'bg-rose-400',
      badgeBg: 'bg-rose-100/80 text-rose-800 border-rose-200',
      textColor: 'text-rose-600',
      statusLabel: "E'tibor zarur",
    };
  };

  const categories = [
    { id: 'all', label: "Barcha 12 indikator" },
    { id: 'boshqaruv', label: "Boshqaruv & Hujjatlar" },
    { id: 'xavfsizlik', label: "Xavfsizlik & Etika" },
    { id: 'pedagogik', label: "Pedagogika & LMS" },
    { id: 'shaxsiy_osish', label: "AI & Muammolar yechimi" },
  ];

  const filteredKeys = INDICATOR_KEYS.filter((key) => {
    if (activeCategory === 'all') return true;
    return INDICATORS_METADATA[key].category === activeCategory;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
      {/* Title and Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
            12 Asosiy Axborot Indikatori Ko'rsatkichlari
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Har bir indikator ustiga bosib, amaliy tavsiyalarni o'rganing
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Indicator Rows */}
      <div className="space-y-3">
        {filteredKeys.map((key, index) => {
          const meta = INDICATORS_METADATA[key];
          const score = indicators[key] || 0;
          const styling = getScoreColor(score);
          const isExpanded = expandedKey === key;

          return (
            <div
              key={key}
              className={`rounded-2xl border transition-all duration-200 ${
                isExpanded
                  ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                  : 'border-slate-200/80 hover:border-slate-300 bg-white'
              }`}
            >
              {/* Row Header */}
              <div
                onClick={() => {
                  setExpandedKey(isExpanded ? null : key);
                  if (onSelectKey) onSelectKey(key);
                }}
                className="p-4 sm:p-4.5 flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                {/* Left: Icon & Names */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isExpanded ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {getIcon(meta.iconName, 'w-5 h-5')}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {meta.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium hidden md:inline">
                        #{index + 1}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {meta.friendlyExplanation}
                    </p>
                  </div>
                </div>

                {/* Right: Progress Bar & Score */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="hidden sm:flex flex-col items-end gap-1 w-28">
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${styling.barColor} transition-all duration-700`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">
                      Maqsad: {meta.targetBenchmark}%
                    </span>
                  </div>

                  {/* Score pill */}
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${styling.badgeBg}`}
                  >
                    <span>{score}%</span>
                  </span>

                  {/* Chevron Toggle */}
                  <button
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    aria-label="Tafsilotni ko'rish"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Mobile Progress Bar */}
              <div className="sm:hidden px-4 pb-3 pt-0">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${styling.barColor} transition-all duration-700`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>

              {/* Expandable Practical Advice Card */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-4 pt-1 border-t border-slate-100/80 animate-in fade-in duration-200">
                  <div className="bg-white rounded-xl p-3.5 border border-emerald-100 flex items-start gap-3 mt-2 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">
                          Bu ko'nikmani qanday oshirish mumkin?
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Amaliy tavsiya
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        {meta.practicalTip}
                      </p>
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Status: <strong className={styling.textColor}>{styling.statusLabel}</strong></span>
                        <span className="text-slate-400">Direktor benchmark standarti: {meta.targetBenchmark}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
