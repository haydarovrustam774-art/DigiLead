import {
  User,
  DigitalIndicators12,
  ToolUsageLog,
  DigitalActionPlan,
  IndicatorKey,
} from '../src/types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-dir-01',
    fullName: 'Dilorom Karimova',
    email: 'd.karimova@mtt42.uz',
    role: 'director',
    organizationId: 'MTT-TASHKENT-42',
    organizationName: '42-sonli Davlat Maktabgacha Ta\'lim Tashkiloti "Gulshan"',
    digitalReadinessLevel: 'intermediate',
    createdAt: '2025-09-01T08:00:00Z',
    experienceYears: 18,
    phone: '+998 90 123-45-67',
  },
  {
    id: 'usr-met-02',
    fullName: 'Nodira Rahimova',
    email: 'n.rahimova@edtech.uz',
    role: 'it_methodist',
    organizationId: 'TUMAN-MMTB-CHILONZOR',
    organizationName: 'Chilonzor tumani MMTB IT-Metodika markazi',
    digitalReadinessLevel: 'advanced',
    createdAt: '2025-08-15T08:00:00Z',
    experienceYears: 9,
    phone: '+998 93 987-65-43',
  },
  {
    id: 'usr-aud-03',
    fullName: 'Shavkat Aliyev',
    email: 'sh.aliyev@inspeksiya.uz',
    role: 'auditor',
    organizationId: 'INSPECTION-AGENCY',
    organizationName: 'Maktabgacha va maktab ta\'limi vazirligi huzuridagi Ta\'lim inspeksiyasi',
    digitalReadinessLevel: 'advanced',
    createdAt: '2025-07-10T08:00:00Z',
    experienceYears: 14,
    phone: '+998 97 555-44-33',
  },
  {
    id: 'usr-adm-04',
    fullName: 'Rustam Haydarov',
    email: 'haydarovrustam774@gmail.com',
    role: 'superadmin',
    organizationId: 'DIGILEAD-HQ',
    organizationName: 'DigiLead: Smart EdTech Hub Boshqaruv Markazi',
    digitalReadinessLevel: 'advanced',
    createdAt: '2025-06-01T08:00:00Z',
    experienceYears: 12,
    phone: '+998 99 888-77-66',
  }
];

export const INITIAL_INDICATORS: Record<string, DigitalIndicators12> = {
  'usr-dir-01': {
    id: 'kpi-dir-01-q1',
    userId: 'usr-dir-01',
    evaluationPeriod: '2026-Q1',
    cloud_computing_usage: 52, // o'rta
    data_driven_decisions: 64, // o'rta
    edtech_integration: 78, // yaxshi
    cybersecurity_awareness: 42, // past - rivojlantirish kerak
    digital_communication: 88, // a'lo (Telegram kanallar faol)
    digital_monitoring: 58, // o'rta
    resource_digitization: 46, // past
    ai_automation_adoption: 38, // past - texnofobiya
    digital_ethics: 85, // yuqori
    lms_navigation: 62, // o'rta
    digital_troubleshooting: 48, // past
    continuous_digital_learning: 72, // yaxshi
    total_digital_score: 61,
    updatedAt: new Date().toISOString(),
  }
};

export const INITIAL_TOOL_LOGS: ToolUsageLog[] = [
  {
    id: 'log-1',
    userId: 'usr-dir-01',
    toolName: 'Google Drive',
    usageFrequency: 8,
    actionType: {
      action: 'create_doc',
      details: "MTT oylik ish rejasi bulutli papkaga joylandi",
      timestamp: '2026-09-10T10:30:00Z',
    },
    createdAt: '2026-09-10T10:30:00Z',
  },
  {
    id: 'log-2',
    userId: 'usr-dir-01',
    toolName: 'Telegram',
    usageFrequency: 24,
    actionType: {
      action: 'broadcast_announcement',
      details: "Ota-onalar kanaliga haftalik menyu yuborildi",
      timestamp: '2026-09-11T09:15:00Z',
    },
    createdAt: '2026-09-11T09:15:00Z',
  },
  {
    id: 'log-3',
    userId: 'usr-dir-01',
    toolName: 'Zoom',
    usageFrequency: 2,
    actionType: {
      action: 'online_meeting',
      details: "Tarbiyachilar bilan onlayn tezkor brifing",
      timestamp: '2026-09-12T14:00:00Z',
    },
    createdAt: '2026-09-12T14:00:00Z',
  },
  {
    id: 'log-4',
    userId: 'usr-dir-01',
    toolName: 'ERP System',
    usageFrequency: 5,
    actionType: {
      action: 'inventory_check',
      details: "Oziq-ovqat ombori elektron hisoboti ko'rildi",
      timestamp: '2026-09-13T08:45:00Z',
    },
    createdAt: '2026-09-13T08:45:00Z',
  }
];

export const INITIAL_ACTION_PLANS: Record<string, DigitalActionPlan> = {
  'usr-dir-01': {
    id: 'plan-dir-01',
    userId: 'usr-dir-01',
    generatedBasedOnKpiId: 'kpi-dir-01-q1',
    progress_status: 'in_progress',
    targetWeakIndicators: ['ai_automation_adoption', 'cybersecurity_awareness', 'resource_digitization'],
    aiReasoning: "MTT direktori Dilorom Karimovaning raqamli profili tahlil qilindi. Sun'iy intellektdan qo'rqish (texnofobiya) va parollar xavfsizligi bo'yicha ko'nikmalarni bosqichma-bosqich oshirish uchun 4 haftalik yengil mikro-o'quv rejasi shakllantirildi.",
    createdAt: '2026-09-08T09:00:00Z',
    week_1_tasks: [
      {
        id: 't-w1-1',
        weekNumber: 1,
        title: "Nazariy anglash: Sun'iy intellekt qo'rqinchli emas",
        description: "MTT boshqaruvida sun'iy intellekt (ChatGPT/Gemini) qanday qilib vaqtingizning 40% ini tejashini tushuntiruvchi 4 daqiqalik video-qo'llanmani ko'rish.",
        durationMinutes: 4,
        category: 'theory',
        stageLabel: "1-hafta: Nazariy anglash",
        completed: true,
        badgeReward: {
          icon: 'Sparkles',
          title: "Birinchi Qadam Nishoni",
        },
        stepGuide: [
          "1. Havoladagi qisqa videoni oching.",
          "2. Rahbarning kundalik rejalashtirishida AI qanday yordam berishini ko'ring.",
          "3. O'zingiz uchun 1 ta foydali jihatni qayd eting."
        ]
      },
      {
        id: 't-w1-2',
        weekNumber: 1,
        title: "Kiberxavfsizlik: 2 bosqichli himoyani (2FA) yoqish",
        description: "Telegram va ish pochtangizga kiberxavfsizlik himoya parolini qo'yish.",
        durationMinutes: 6,
        category: 'theory',
        stageLabel: "1-hafta: Nazariy anglash",
        completed: true,
        badgeReward: {
          icon: 'Shield',
          title: "Xavfsiz Qal'a Nishoni",
        },
        stepGuide: [
          "1. Telegram sozlamalari -> Maxfiylik va Xavfsizlik bo'limiga kiring.",
          "2. 'Ikki bosqichli tekshiruv' tugmasini bosing va faqat o'zingiz biladigan parol o'rnating."
        ]
      }
    ],
    week_2_tasks: [
      {
        id: 't-w2-1',
        weekNumber: 2,
        title: "Birgalikda ishlash: Hamkasb bilan bulutli hujjat ulashish",
        description: "Google Hujjatlar (Docs) dasturida 'Navro'z bayrami rejasi' faylini yaratib, metodist Nodira Rahimovaga tahrirlash havolasini yuborish mashqi.",
        durationMinutes: 8,
        category: 'collab',
        stageLabel: "2-hafta: Birgalikda ishlash",
        completed: false,
        badgeReward: {
          icon: 'Users',
          title: "Hamkorlik Ustasi",
        },
        stepGuide: [
          "1. docs.google.com saytiga kiring va 'Yangi hujjat' oching.",
          "2. 'Ulashish' (Share) tugmasini bosib, metodist pochtasini kiriting.",
          "3. Birgalikda bitta fayl ustida real vaqtda ishlashni sinab ko'ring."
        ]
      }
    ],
    week_3_tasks: [
      {
        id: 't-w3-1',
        weekNumber: 3,
        title: "Amaliy integratsiya: Onlayn ota-onalar uchrashuvini rejalashtirish",
        description: "Google Meet yoki Zoom dasturida virtual xona yaratib, guruh ota-onalariga xavfsiz ulanish havolasini yuborish.",
        durationMinutes: 12,
        category: 'practice',
        stageLabel: "3-hafta: Amaliy integratsiya",
        completed: false,
        badgeReward: {
          icon: 'Video',
          title: "Raqamli Moderator",
        },
        stepGuide: [
          "1. meet.google.com sahifasiga kiring va 'Yangi uchrashuv boshlash' tugmasini bosing.",
          "2. Havolani nusxalang va ota-onalar guruhiga yuboring.",
          "3. Mikrofon va kamerani yoqish/o'chirish tugmalarini sinab ko'ring."
        ]
      }
    ],
    week_4_tasks: [
      {
        id: 't-w4-1',
        weekNumber: 4,
        title: "Haqiqiy ish jarayoniga joriy etish: Elektron hisobot topshirish",
        description: "Oylik moddiy va oziq-ovqat xarajatlarini to'liq elektron ERP tizimida tekshirib, qog'ozsiz tasdiqlash.",
        durationMinutes: 15,
        category: 'workflow',
        stageLabel: "4-hafta: Ish jarayoniga joriy etish",
        completed: false,
        badgeReward: {
          icon: 'Award',
          title: "Raqamli Lider Yulduzi",
        },
        stepGuide: [
          "1. Tizimdagi 'Oylik tahlil' bo'limini oching.",
          "2. Raqamli ko'rsatkichlarni ko'zdan kechirib, 'Elektron tasdiqlash' tugmasini bosing.",
          "3. Audit uchun elektron raqamli iz yaratilganligini tekshiring."
        ]
      }
    ]
  }
};
