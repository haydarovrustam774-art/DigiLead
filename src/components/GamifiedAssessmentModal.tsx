import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Trophy,
  RotateCcw,
} from 'lucide-react';
import { CASE_STUDY_QUESTIONS } from '../data/indicatorsData';
import { CaseStudyQuestion, IndicatorKey } from '../types';

// Utility to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

interface GamifiedAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAudit: (answers: Record<IndicatorKey, number>) => Promise<void>;
  isSubmitting: boolean;
}

export const GamifiedAssessmentModal: React.FC<GamifiedAssessmentModalProps> = ({
  isOpen,
  onClose,
  onSubmitAudit,
  isSubmitting,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userSelections, setUserSelections] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<CaseStudyQuestion[]>([]);

  useEffect(() => {
    if (isOpen) {
      const randomized = shuffleArray(CASE_STUDY_QUESTIONS).map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));
      setShuffledQuestions(randomized);
      setCurrentStep(0);
      setUserSelections({});
      setShowExplanation(false);
      setIsFinished(false);
    }
  }, [isOpen]);

  if (!isOpen || shuffledQuestions.length === 0) return null;

  const currentQuestion = shuffledQuestions[currentStep];
  const selectedOptionId = currentQuestion ? userSelections[currentQuestion.id] : null;
  const selectedOption = currentQuestion?.options.find((o) => o.id === selectedOptionId);

  const handleSelect = (optionId: string) => {
    if (showExplanation) return;
    setUserSelections((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentStep < shuffledQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const calculateFinalAuditResults = () => {
    const sums: Record<string, number> = {};
    const counts: Record<string, number> = {};
    
    shuffledQuestions.forEach((q) => {
      const optId = userSelections[q.id];
      const opt = q.options.find((o) => o.id === optId);
      if (opt) {
        sums[q.targetIndicator] = (sums[q.targetIndicator] || 0) + opt.score;
        counts[q.targetIndicator] = (counts[q.targetIndicator] || 0) + 1;
      }
    });

    const scoresByIndicator: Record<IndicatorKey, number> = {} as any;
    for (const key in sums) {
      scoresByIndicator[key as IndicatorKey] = Math.round(sums[key] / counts[key]);
    }
    
    return scoresByIndicator;
  };

  const handleCompleteAndSubmit = async () => {
    const answers = calculateFinalAuditResults();
    await onSubmitAudit(answers);
    onClose();
    // Reset state
    setCurrentStep(0);
    setUserSelections({});
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
                Raqamli Savodxonlikni Baholash (Case-Studies)
              </h2>
              <p className="text-xs text-slate-500">
                MTT hayotidan olingan {shuffledQuestions.length} ta real boshqaruv vaziyati
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
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {!isFinished ? (
            <div>
              {/* Progress bar */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>Vaziyat #{currentStep + 1} / {shuffledQuestions.length}</span>
                <span className="text-emerald-700 font-bold">
                  {Math.round(((currentStep + 1) / shuffledQuestions.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentStep + 1) / shuffledQuestions.length) * 100}%` }}
                />
              </div>

              {/* Case Context & Situation */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  {currentQuestion.title}
                </span>
                <p className="text-xs text-slate-500 italic mt-2 mb-1">
                  Holat: {currentQuestion.context}
                </p>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-2 leading-relaxed">
                  {currentQuestion.situation}
                </h3>
              </div>

              {/* Interactive Option Cards */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  Quyidagi variantlardan qaysi birini tanlaysiz?
                </p>
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = selectedOptionId === opt.id;
                  const letterLabel = String.fromCharCode(65 + optIdx); // A, B, C, D, E
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      disabled={showExplanation}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-start gap-3.5 ${
                        isSelected
                          ? opt.isRecommended
                            ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-200'
                            : 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-200'
                          : showExplanation
                            ? 'bg-slate-50/50 border-slate-100 opacity-60 cursor-default'
                            : 'bg-white hover:bg-slate-50 border-slate-200 cursor-pointer'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                          isSelected
                            ? opt.isRecommended
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-amber-600 bg-amber-600 text-white'
                            : 'border-slate-300 bg-slate-50 text-slate-500'
                        }`}
                      >
                        {isSelected ? <CheckCircle2 className="w-3.5 h-3.5" /> : letterLabel}
                      </div>
                      <div className="flex-1 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                        {opt.text}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Gentle Instant Feedback */}
              {showExplanation && selectedOption && (
                <div
                  className={`mt-5 p-4 rounded-2xl border animate-in fade-in ${
                    selectedOption.isRecommended
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs mb-1">
                    {selectedOption.isRecommended ? (
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    )}
                    <span>
                      {selectedOption.isRecommended
                        ? "To'g'ri va xavfsiz qaror!"
                        : "Muhim tushuntirish:"}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    {selectedOption.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Results Finish Screen */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4 shadow-sm">
                <Trophy className="w-9 h-9" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                Sinov Muvaffaqiyatli Yakunlandi!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                Siz barcha amaliy vaziyatlar bo'yicha o'z boshqaruv qarorlaringizni bildirdingiz. 
                Natijalar avtomatik ravishda 12 ta axborot indikatoriga kiritiladi.
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-left space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Javob berilgan vaziyatlar:</span>
                  <span className="font-bold text-slate-900">{shuffledQuestions.length} / {shuffledQuestions.length} ta</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Har indikatorga savollar:</span>
                  <span className="font-bold text-slate-900">5 tadan × 3 ta javob</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Integratsiya qilinadigan soha:</span>
                  <span className="font-bold text-emerald-700">12 ta indikator</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          {!isFinished ? (
            <>
              <span className="text-xs text-slate-400">
                O'zbekiston MTT standarti
              </span>
              <button
                onClick={handleNext}
                disabled={!selectedOptionId}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition disabled:opacity-40 active:scale-95 shadow-xs"
              >
                <span>Keyingi vaziyat</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsFinished(false);
                  setCurrentStep(0);
                  setUserSelections({});
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Qayta topshirish
              </button>
              <button
                onClick={handleCompleteAndSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs disabled:opacity-60 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? "Saqlanmoqda..." : "Indikatorlarni Yangilash"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
