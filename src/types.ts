export type UserRole = 'superadmin' | 'director' | 'it_methodist' | 'auditor';
export type DigitalReadinessLevel = 'beginner' | 'intermediate' | 'advanced';
export type ActionPlanStatus = 'not_started' | 'in_progress' | 'completed';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  digitalReadinessLevel: DigitalReadinessLevel;
  createdAt: string;
  avatar?: string;
  experienceYears?: number;
  phone?: string;
}

export type IndicatorKey =
  | 'cloud_computing_usage'
  | 'data_driven_decisions'
  | 'edtech_integration'
  | 'cybersecurity_awareness'
  | 'digital_communication'
  | 'digital_monitoring'
  | 'resource_digitization'
  | 'ai_automation_adoption'
  | 'digital_ethics'
  | 'lms_navigation'
  | 'digital_troubleshooting'
  | 'continuous_digital_learning';

export interface DigitalIndicators12 {
  id: string;
  userId: string;
  evaluationPeriod: string;
  cloud_computing_usage: number;
  data_driven_decisions: number;
  edtech_integration: number;
  cybersecurity_awareness: number;
  digital_communication: number;
  digital_monitoring: number;
  resource_digitization: number;
  ai_automation_adoption: number;
  digital_ethics: number;
  lms_navigation: number;
  digital_troubleshooting: number;
  continuous_digital_learning: number;
  total_digital_score: number;
  initial_digital_score?: number;
  intellect_score?: number;
  info_score?: number;
  creative_score?: number;
  team_score?: number;
  updatedAt?: string;
}

export interface IndicatorMeta {
  key: IndicatorKey;
  title: string;
  shortTitle: string;
  friendlyExplanation: string;
  iconName: string;
  category: 'boshqaruv' | 'xavfsizlik' | 'pedagogik' | 'shaxsiy_osish';
  practicalTip: string;
  targetBenchmark: number;
}

export interface ToolUsageLog {
  id: string;
  userId: string;
  toolName: 'Google Drive' | 'Zoom' | 'ERP System' | 'ChatGPT' | 'Telegram' | 'Kundalik/LMS';
  usageFrequency: number; // sessions per week
  actionType: {
    action: string;
    details: string;
    timestamp: string;
  };
  createdAt: string;
}

export interface ActionTask {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  weekNumber: 1 | 2 | 3 | 4;
  category: 'theory' | 'collab' | 'practice' | 'workflow';
  stageLabel: string;
  completed: boolean;
  badgeReward: {
    icon: string;
    title: string;
  };
  stepGuide: string[];
}

export interface DigitalActionPlan {
  id: string;
  userId: string;
  generatedBasedOnKpiId: string;
  week_1_tasks: ActionTask[];
  week_2_tasks: ActionTask[];
  week_3_tasks: ActionTask[];
  week_4_tasks: ActionTask[];
  week1TestScore?: number | null;
  week2TestScore?: number | null;
  week3TestScore?: number | null;
  week4TestScore?: number | null;
  progress_status: ActionPlanStatus;
  targetWeakIndicators: IndicatorKey[];
  aiReasoning: string;
  createdAt: string;
}

export interface CaseStudyQuestion {
  id: string;
  caseNumber: number;
  title: string;
  context: string;
  situation: string;
  targetIndicator: IndicatorKey;
  options: {
    id: string;
    text: string;
    score: number; // 0 to 100
    isRecommended: boolean;
    explanation: string;
  }[];
}

export interface CalculationBreakdown {
  selfAssessmentScore: number;
  digitalFootprintScore: number;
  itMethodistScore: number;
  totalScore: number;
  indicators: Record<IndicatorKey, {
    self: number;
    footprint: number;
    methodist: number;
    final: number;
  }>;
}
