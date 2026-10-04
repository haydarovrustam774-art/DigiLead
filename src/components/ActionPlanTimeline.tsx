import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  Award,
  Video,
  Users,
  Shield,
  FileText,
  AlertTriangle,
  RefreshCw,
  Star,
  BookOpen,
} from 'lucide-react';
import { DigitalActionPlan, ActionTask, IndicatorKey } from '../types';
import { INDICATORS_METADATA } from '../data/indicatorsData';
import { WEEKLY_TESTS } from '../data/weeklyTests';
import { HelpCircle, CheckSquare, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

interface ActionPlanTimelineProps {
  plan: DigitalActionPlan;
  onToggleTask: (taskId: string) => void;
  onGenerateAIPlan: () => void;
  isGeneratingAI: boolean;
}

export const ActionPlanTimeline: React.FC<ActionPlanTimelineProps> = ({
  plan,
  onToggleTask,
  onGenerateAIPlan,
  isGeneratingAI,
}) => {
  const [expandedTestWeek, setExpandedTestWeek] = useState<number | null>(null);
  const [testAnswers, setTestAnswers] = useState<Record<string, number>>({});
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [submittedWeeks, setSubmittedWeeks] = useState<Record<number, boolean>>({
    1: plan.week1TestScore !== undefined && plan.week1TestScore !== null,
    2: plan.week2TestScore !== undefined && plan.week2TestScore !== null,
    3: plan.week3TestScore !== undefined && plan.week3TestScore !== null,
    4: plan.week4TestScore !== undefined && plan.week4TestScore !== null,
  });
  const [testScores, setTestScores] = useState<Record<number, number>>({
    1: plan.week1TestScore || 0,
    2: plan.week2TestScore || 0,
    3: plan.week3TestScore || 0,
    4: plan.week4TestScore || 0,
  });

  const toggleTaskExpand = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleOptionSelect = (testId: string, optionIndex: number) => {
    setTestAnswers(prev => ({
      ...prev,
      [testId]: optionIndex
    }));
  };

  const handleSubmitTest = async (weekNum: number) => {
    const score = WEEKLY_TESTS.filter(t => t.week === weekNum).filter(t => testAnswers[t.id] === t.correctIndex).length;
    setTestScores(prev => ({ ...prev, [weekNum]: score }));
    setSubmittedWeeks(prev => ({ ...prev, [weekNum]: true }));
    setExpandedTestWeek(null);
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/action-plan/test-score/${plan.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ weekNum, score })
      });
    } catch (e) {
      console.error("Test saqlashda xato:", e);
    }
  };

  const weeks = [
    {
      weekNumber: 1 as const,
      title: "1-hafta: Nazariy anglash",
      subtitle: "Qisqa video-yo'riqnomalar va texnofobiyani yengish",
      icon: <BookOpen className="w-4 h-4 text-emerald-600" />,
      tasks: plan.week_1_tasks || [],
    },
    {
      weekNumber: 2 as const,
      title: "2-hafta: Birgalikda ishlash",
      subtitle: "Virtual xonada hamkasb bilan xavfsiz hujjat ulashish",
      icon: <Users className="w-4 h-4 text-blue-600" />,
      tasks: plan.week_2_tasks || [],
    },
    {
      weekNumber: 3 as const,
      title: "3-hafta: Amaliy integratsiya",
      subtitle: "Ota-onalar va jamoa bilan onlayn platformada ishlash",
      icon: <Video className="w-4 h-4 text-purple-600" />,
      tasks: plan.week_3_tasks || [],
    },
    {
      weekNumber: 4 as const,
      title: "4-hafta: Ish jarayoniga joriy etish",
      subtitle: "O'zlashtirilgan bilimlarni kundalik ishga tatbiq qilish va hisobot",
      icon: <Award className="w-4 h-4 text-amber-600" />,
      tasks: plan.week_4_tasks || [],
    },
  ];

  // Calculate total tasks and completed
  const allTasks = weeks.flatMap((w) => w.tasks);
  const completedTasks = allTasks.filter((t) => t.completed);
  const completionPercentage = allTasks.length > 0
    ? Math.round((completedTasks.length / allTasks.length) * 100)
    : 0;

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return <Shield className="w-3.5 h-3.5 text-amber-500" />;
      case 'Users':
        return <Users className="w-3.5 h-3.5 text-blue-500" />;
      case 'Video':
        return <Video className="w-3.5 h-3.5 text-purple-500" />;
      case 'Award':
        return <Award className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
      {/* Header and AI Generator CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
              4 Haftalik Shaxsiy Raqamli O'sish Yo'l Xaritasi
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              AI Microlearning
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Kuniga 5–15 daqiqalik yengil amaliy mashqlar orqali raqamli odatlarni shakllantirish
          </p>
        </div>

        {/* Generate AI Plan Button - Hide if tasks already generated */}
        {allTasks.length === 0 && (
          <button
            onClick={onGenerateAIPlan}
            disabled={isGeneratingAI}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs active:scale-95 transition disabled:opacity-60 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAI ? "AI Reja Tuzmoqda..." : "AI Orqali Yangi Reja Generatsiya Qilish"}</span>
          </button>
        )}
      </div>

      {/* Target Weak Indicators Identified by AI */}
      <div className="mb-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-amber-900">
                AI Tahlili: Rivojlantirishga muhtoj eng past 3 ta ko'rsatkich
              </h4>
              <span className="text-[11px] font-bold text-amber-800">
                Dastur progressi: {completionPercentage}%
              </span>
            </div>
            <p className="text-[11px] text-amber-800/90 mt-1 leading-relaxed">
              {plan.aiReasoning || "Tizim direktorning 12 indikatorini tahlil qilib, eng ko'p qo'llab-quvvatlash kerak bo'lgan sohalarga yo'naltirilgan dastur tuzdi."}
            </p>

            {/* Target indicator pills */}
            <div className="flex flex-wrap gap-2 mt-2.5">
              {plan.targetWeakIndicators?.map((key) => {
                const meta = INDICATORS_METADATA[key as IndicatorKey];
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white text-amber-950 border border-amber-200 text-xs font-semibold shadow-2xs"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{meta ? meta.shortTitle : key}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Stepper / Timeline for 4 Weeks */}
      {allTasks.length === 0 ? (
        <div className="text-center py-10 space-y-5">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800">
              Hali reja tuzilmagan
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Yuqoridagi <strong>"AI Orqali Yangi Reja Generatsiya Qilish"</strong> tugmasini bosing. 
              Sun'iy intellekt sizning 12 indikatoringizni tahlil qilib, 
              shaxsiy 4 haftalik raqamli o'sish dasturini tuzib beradi.
            </p>
          </div>
          <button
            onClick={onGenerateAIPlan}
            disabled={isGeneratingAI}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold shadow-lg active:scale-95 transition disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAI ? "AI Reja Tuzmoqda..." : "Hozir Reja Generatsiya Qilish"}</span>
          </button>
        </div>
      ) : (
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 sm:before:left-6 before:w-0.5 before:bg-slate-200 before:z-0">
        {weeks.map((week, wIdx) => {
          const isWeekCompleted = week.tasks.length > 0 && week.tasks.every((t) => t.completed);

          return (
            <div key={`week-${week.weekNumber}`} className="relative z-10">
              {/* Week Step Node */}
              <div className="flex items-center gap-3.5 mb-3">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm shadow-xs transition-colors ring-4 ring-white ${
                    isWeekCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {isWeekCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <span>W{week.weekNumber}</span>
                  )}
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                    {week.title}
                    {isWeekCompleted && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                        Bajarildi
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {week.subtitle}
                  </p>
                </div>
              </div>

              {/* Tasks in this Week */}
              <div className="ml-10 sm:ml-12 pl-3 sm:pl-4 space-y-3">
                {week.tasks.map((task) => {
                  const isExpanded = expandedTasks[task.id];
                  
                  return (
                    <div
                      key={task.id}
                      onClick={(e) => toggleTaskExpand(task.id, e)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        task.completed
                          ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs'
                          : 'bg-white hover:bg-slate-50/70 border-slate-200/90'
                      }`}
                    >
                      {/* Top Header Row */}
                      <div className="flex items-center gap-3.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleTask(task.id);
                          }}
                          className="shrink-0 focus:outline-hidden"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                          ) : (
                            <Circle className="w-6 h-6 text-slate-300 hover:text-emerald-500" />
                          )}
                        </button>
                        
                        <div className="flex-1 min-w-0 flex flex-wrap items-center justify-between gap-2">
                          <h4
                            className={`text-sm font-bold ${
                              task.completed ? 'line-through text-slate-500' : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </h4>
                          
                          <div className="flex items-center gap-3">
                            {/* Duration chip */}
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              <Clock className="w-3 h-3" />
                              {task.durationMinutes} daqiqa
                            </span>

                            {/* Reward badge */}
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                              {getBadgeIcon(task.badgeReward?.icon || 'Sparkles')}
                              <span>{task.badgeReward?.title || 'Nishon'}</span>
                            </span>
                            
                            {/* Chevron */}
                            <button className="text-slate-400 hover:text-emerald-600 transition-colors ml-1">
                              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expandable Content Body */}
                      {isExpanded && (
                        <div className="mt-4 ml-9 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                  <Lightbulb className="w-4 h-4 text-amber-600" />
                                </div>
                                <h5 className="font-bold text-sm text-slate-800">Batafsil ko'rsatma va tavsiyalar</h5>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                Amaliy tavsiya
                              </span>
                            </div>
                            
                            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap ml-10">
                              {task.description}
                            </div>
                            
                            {/* Step-by-step guidance list */}
                            {task.stepGuide && task.stepGuide.length > 0 && (
                              <div className="mt-4 ml-10 pt-3 border-t border-amber-200/50 space-y-2">
                                {task.stepGuide.map((step, sIdx) => (
                                  <div
                                    key={`step-${sIdx}`}
                                    className="text-xs text-slate-600 flex items-start gap-2"
                                  >
                                    <CheckSquare className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Weekly Test Section */}
              {week.tasks.length > 0 && (
                <div className="mt-5 pt-5 ml-10 sm:ml-12 pl-3 sm:pl-4 border-t border-slate-200 border-dashed">
                  {submittedWeeks[week.weekNumber] ? (
                    <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between animate-in fade-in zoom-in-95">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center shadow-inner">
                          <Award className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-slate-800">{week.weekNumber}-hafta testi yakunlandi</h5>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Sizning natijangiz: <strong className="text-indigo-700">
                              {testScores[week.weekNumber]} / 10
                            </strong> (
                              {Math.round((testScores[week.weekNumber] / 10) * 100)}%
                            )
                          </p>
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-100/50 px-3 py-1 rounded-lg">Tasdiqlandi</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setExpandedTestWeek(expandedTestWeek === week.weekNumber ? null : week.weekNumber)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs sm:text-sm transition-colors border border-indigo-100"
                      >
                        <CheckSquare className="w-4 h-4" />
                        <span>{week.weekNumber}-hafta bo'yicha test (10 ta savol)</span>
                      </button>

                      {expandedTestWeek === week.weekNumber && (
                        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                          {WEEKLY_TESTS.filter(t => t.week === week.weekNumber).map((test, idx) => {
                            const selectedAnswer = testAnswers[test.id];
                            const isAnswered = selectedAnswer !== undefined;

                            return (
                              <div key={test.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/60">
                                <h5 className="font-bold text-sm text-slate-800 mb-3 flex gap-2">
                                  <span className="text-indigo-600">{idx + 1}.</span>
                                  <span>{test.question}</span>
                                </h5>
                                <div className="space-y-2 pl-5">
                                  {test.options.map((opt, oIdx) => {
                                    const isSelected = selectedAnswer === oIdx;
                                    const isCorrect = test.correctIndex === oIdx;
                                    
                                    let optionClass = "border-slate-200 hover:border-indigo-300 hover:bg-white text-slate-700";
                                    if (isAnswered) {
                                      if (isCorrect) {
                                        optionClass = "border-emerald-500 bg-emerald-50 text-emerald-800 font-medium";
                                      } else if (isSelected && !isCorrect) {
                                        optionClass = "border-red-300 bg-red-50 text-red-700";
                                      } else {
                                        optionClass = "border-slate-200 opacity-50";
                                      }
                                    }

                                    return (
                                      <label
                                        key={oIdx}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${optionClass}`}
                                      >
                                        <input
                                          type="radio"
                                          name={`test-${test.id}`}
                                          disabled={isAnswered}
                                          checked={isSelected}
                                          onChange={() => handleOptionSelect(test.id, oIdx)}
                                          className="text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-slate-300 disabled:opacity-50"
                                        />
                                        <span className="text-xs sm:text-sm">{opt}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}

                          <div className="pt-4 flex justify-end">
                            <button
                              onClick={() => handleSubmitTest(week.weekNumber)}
                              disabled={WEEKLY_TESTS.filter(t => t.week === week.weekNumber).some(t => testAnswers[t.id] === undefined)}
                              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-bold shadow-md transition-colors"
                            >
                              Testni yakunlash
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}

      {/* Completion Banner */}
      {completionPercentage === 100 && allTasks.length > 0 && (
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg text-center relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold">Tabriklaymiz! Siz 4 haftalik dasturni to'liq yakunladingiz.</h3>
            <p className="text-sm text-emerald-50">Sizning raqamli odatlaringiz yangi bosqichga ko'tarildi. Endi joriy raqamli holatingizni yangilash uchun 12 Indikatorli Radarni qayta hisoblang.</p>
            <button
              onClick={() => {
                // To be passed as prop or use a global event, or just tell user to click top button.
                // We will add onRetakeAudit prop to the component to trigger the modal.
                if (typeof window !== 'undefined') {
                   const btn = document.getElementById('btn-recalculate') || document.querySelector('button[aria-label="Hisoblash"]');
                   if(btn) (btn as HTMLButtonElement).click();
                }
              }}
              className="mt-4 px-6 py-2.5 bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
            >
              12 Indikatorli Radarni (Spider Chart) Yangilash
            </button>
          </div>
          <Sparkles className="absolute top-2 right-4 w-20 h-20 text-white/10" />
          <Star className="absolute bottom-2 left-4 w-16 h-16 text-white/10" />
        </div>
      )}
    </div>
  );
};
