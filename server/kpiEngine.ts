import {
  DigitalIndicators12,
  IndicatorKey,
  DigitalReadinessLevel,
  ToolUsageLog,
  CalculationBreakdown,
} from '../src/types';
import { INITIAL_INDICATORS, INITIAL_TOOL_LOGS, INITIAL_USERS } from './mockDb';

// Weights according to research methodology:
// Source A: Self-assessment / Online testing cases (35%)
// Source B: Digital footprint / System usage activity logs (40%)
// Source C: IT-Methodist peer evaluation (25%)
const WEIGHT_SELF = 0.35;
const WEIGHT_FOOTPRINT = 0.40;
const WEIGHT_METHODIST = 0.25;

export function calculateDigitalScores(
  userId: string,
  selfAnswers?: Record<IndicatorKey, number>
): {
  indicators: DigitalIndicators12;
  breakdown: CalculationBreakdown;
  readinessLevel: DigitalReadinessLevel;
} {
  const currentKpi = INITIAL_INDICATORS[userId] || INITIAL_INDICATORS['usr-dir-01'];
  const userLogs = INITIAL_TOOL_LOGS.filter((log) => log.userId === userId);

  // Digital footprint scoring from logs
  const toolScoreMap: Record<IndicatorKey, number> = {
    cloud_computing_usage: calculateFootprintForTool(userLogs, 'Google Drive', 55),
    data_driven_decisions: calculateFootprintForTool(userLogs, 'ERP System', 60),
    edtech_integration: calculateFootprintForTool(userLogs, 'Zoom', 70),
    cybersecurity_awareness: 45, // based on 2FA and secure login audit
    digital_communication: calculateFootprintForTool(userLogs, 'Telegram', 85),
    digital_monitoring: 60,
    resource_digitization: calculateFootprintForTool(userLogs, 'ERP System', 50),
    ai_automation_adoption: calculateFootprintForTool(userLogs, 'ChatGPT', 40),
    digital_ethics: 80,
    lms_navigation: calculateFootprintForTool(userLogs, 'Kundalik/LMS', 65),
    digital_troubleshooting: 50,
    continuous_digital_learning: 70,
  };

  // IT-Methodist peer evaluation baseline
  const methodistBaseScores: Record<IndicatorKey, number> = {
    cloud_computing_usage: 60,
    data_driven_decisions: 68,
    edtech_integration: 80,
    cybersecurity_awareness: 48,
    digital_communication: 90,
    digital_monitoring: 65,
    resource_digitization: 52,
    ai_automation_adoption: 42,
    digital_ethics: 88,
    lms_navigation: 70,
    digital_troubleshooting: 55,
    continuous_digital_learning: 75,
  };

  const keys: IndicatorKey[] = [
    'cloud_computing_usage',
    'data_driven_decisions',
    'edtech_integration',
    'cybersecurity_awareness',
    'digital_communication',
    'digital_monitoring',
    'resource_digitization',
    'ai_automation_adoption',
    'digital_ethics',
    'lms_navigation',
    'digital_troubleshooting',
    'continuous_digital_learning',
  ];

  const breakdownIndicators: CalculationBreakdown['indicators'] = {} as any;
  let totalScoreAccumulator = 0;

  const newIndicators: DigitalIndicators12 = {
    ...currentKpi,
    evaluationPeriod: '2026-Q1',
    updatedAt: new Date().toISOString(),
  };

  keys.forEach((key) => {
    // 1. Self assessment / test score
    const selfScore = selfAnswers && selfAnswers[key] !== undefined
      ? selfAnswers[key]
      : (currentKpi[key] || 50);

    // 2. Digital footprint score
    const footprintScore = toolScoreMap[key] || 50;

    // 3. IT-Methodist assessment
    const methodistScore = methodistBaseScores[key] || 60;

    // Weighted average
    const finalVal = Math.round(
      selfScore * WEIGHT_SELF +
      footprintScore * WEIGHT_FOOTPRINT +
      methodistScore * WEIGHT_METHODIST
    );

    const clampedVal = Math.max(0, Math.min(100, finalVal));
    newIndicators[key] = clampedVal;
    totalScoreAccumulator += clampedVal;

    breakdownIndicators[key] = {
      self: Math.round(selfScore),
      footprint: Math.round(footprintScore),
      methodist: Math.round(methodistScore),
      final: clampedVal,
    };
  });

  const finalTotal = Math.round(totalScoreAccumulator / keys.length);
  newIndicators.total_digital_score = finalTotal;

  // Readiness level threshold logic
  let readinessLevel: DigitalReadinessLevel = 'beginner';
  if (finalTotal >= 75) {
    readinessLevel = 'advanced';
  } else if (finalTotal >= 50) {
    readinessLevel = 'intermediate';
  } else {
    readinessLevel = 'beginner';
  }

  // Update in memory
  INITIAL_INDICATORS[userId] = newIndicators;
  const user = INITIAL_USERS.find((u) => u.id === userId);
  if (user) {
    user.digitalReadinessLevel = readinessLevel;
  }

  return {
    indicators: newIndicators,
    breakdown: {
      selfAssessmentScore: Math.round(
        Object.values(breakdownIndicators).reduce((acc, curr) => acc + curr.self, 0) / keys.length
      ),
      digitalFootprintScore: Math.round(
        Object.values(breakdownIndicators).reduce((acc, curr) => acc + curr.footprint, 0) / keys.length
      ),
      itMethodistScore: Math.round(
        Object.values(breakdownIndicators).reduce((acc, curr) => acc + curr.methodist, 0) / keys.length
      ),
      totalScore: finalTotal,
      indicators: breakdownIndicators,
    },
    readinessLevel,
  };
}

function calculateFootprintForTool(logs: ToolUsageLog[], toolName: string, fallback: number): number {
  const match = logs.find((l) => l.toolName === toolName);
  if (!match) return fallback;
  // E.g. frequency 10 = 70 score, frequency 20 = 90 score
  const calculated = Math.min(100, 40 + match.usageFrequency * 2.5);
  return Math.round(calculated);
}
