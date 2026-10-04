import { GoogleGenAI, Type } from '@google/genai';
import {
  ActionTask,
  DigitalActionPlan,
  DigitalIndicators12,
  IndicatorKey,
} from '../src/types';
import { INITIAL_ACTION_PLANS, INITIAL_INDICATORS, INITIAL_USERS } from './mockDb';

const INDICATOR_NAMES_UZ: Record<IndicatorKey, string> = {
  cloud_computing_usage: "Bulutli texnologiyalar va elektron hujjat aylanishi",
  data_driven_decisions: "Ma'lumotlar tahlili va qaror qabul qilish",
  edtech_integration: "Pedagogik jarayonda EdTech vositalar integratsiyasi",
  cybersecurity_awareness: "Kiberxavfsizlik va axborot muhofazasi",
  digital_communication: "Raqamli kommunikatsiya va aloqa",
  digital_monitoring: "Ta'lim sifatini raqamli monitoring qilish",
  resource_digitization: "Moliyaviy va moddiy resurslarni raqamlashtirish",
  ai_automation_adoption: "Sun'iy intellekt va avtomatlashtirish",
  digital_ethics: "Raqamli etika va onlayn madaniyat",
  lms_navigation: "Elektron ta'lim platformalari (LMS) navigatsiyasi",
  digital_troubleshooting: "Raqamli muammolarni mustaqil hal etish",
  continuous_digital_learning: "Uzluksiz raqamli o'z-o'zini rivojlantirish",
};

export async function generateActionPlanForUser(
  userId: string
): Promise<DigitalActionPlan> {
  const user = INITIAL_USERS.find((u) => u.id === userId) || INITIAL_USERS[0];
  const indicators: DigitalIndicators12 =
    INITIAL_INDICATORS[userId] || INITIAL_INDICATORS['usr-dir-01'];

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

  // Sort to find the 3 lowest indicators
  const sorted = keys.map((key) => ({
    key,
    score: indicators[key] || 0,
    name: INDICATOR_NAMES_UZ[key],
  })).sort((a, b) => a.score - b.score);

  const lowestThree = sorted.slice(0, 3);
  const targetWeakKeys = lowestThree.map((item) => item.key);

  let plan: DigitalActionPlan;

  // Try using Gemini AI if API key is provided
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `Siz maktabgacha ta'lim tashkilotlari (MTT) direktorlari uchun "DigiLead" raqamli murabbiysisiz.
Direktor: ${user.fullName}, Tashkilot: ${user.organizationName}.
Ushbu rahbarning raqamli kompetensiyasida eng past 3 ta ko'rsatkich aniqlandi:
1. ${lowestThree[0].name} (${lowestThree[0].score}% ball)
2. ${lowestThree[1].name} (${lowestThree[1].score}% ball)
3. ${lowestThree[2].name} (${lowestThree[2].score}% ball)

Maqsad: Rahbarning "texnofobiya" (texnologiyadan qo'rqish) sini yengish, kognitiv yuklamani minimal darajaga tushirish.
Iltimos, 4 haftalik shaxsiy mikro-o'quv (har bir vazifa 3-15 daqiqa) rivojlanish rejasini tuzib bering:
- 1-hafta: Nazariy anglash (qisqacha video-yo'riqnoma ko'rish, texnofobiyani yengish)
- 2-hafta: Birgalikda ishlash (virtual xonada yoki bulutda hamkasb bilan xavfsiz mashq)
- 3-hafta: Amaliy integratsiya (ota-onalar yoki tarbiyachilar bilan onlayn tadbir/aloqa)
- 4-hafta: O'zlashtirilgan bilimlarni haqiqiy ish jarayoniga joriy etish va hisobot berish.

Har bir vazifa uchun o'zbek tilida tushunarli sarlavha, qisqa tavsif, davomiyligi (daqiqa), bosqichma-bosqich qo'llanma (3 ta qadam), va virtual nishon (badge) nomi bering.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              aiReasoning: { type: Type.STRING },
              week1: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    durationMinutes: { type: Type.INTEGER },
                    badgeTitle: { type: Type.STRING },
                    stepGuide: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['title', 'description', 'durationMinutes', 'badgeTitle', 'stepGuide'],
                },
              },
              week2: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    durationMinutes: { type: Type.INTEGER },
                    badgeTitle: { type: Type.STRING },
                    stepGuide: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['title', 'description', 'durationMinutes', 'badgeTitle', 'stepGuide'],
                },
              },
              week3: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    durationMinutes: { type: Type.INTEGER },
                    badgeTitle: { type: Type.STRING },
                    stepGuide: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['title', 'description', 'durationMinutes', 'badgeTitle', 'stepGuide'],
                },
              },
              week4: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    durationMinutes: { type: Type.INTEGER },
                    badgeTitle: { type: Type.STRING },
                    stepGuide: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['title', 'description', 'durationMinutes', 'badgeTitle', 'stepGuide'],
                },
              },
            },
            required: ['aiReasoning', 'week1', 'week2', 'week3', 'week4'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');

      const mapTasks = (items: any[], weekNum: 1 | 2 | 3 | 4, stage: string, cat: ActionTask['category']): ActionTask[] => {
        return (items || []).map((t, idx) => ({
          id: `ai-t-w${weekNum}-${idx + 1}-${Date.now()}`,
          weekNumber: weekNum,
          title: t.title,
          description: t.description,
          durationMinutes: t.durationMinutes || 8,
          category: cat,
          stageLabel: stage,
          completed: false,
          badgeReward: {
            icon: weekNum === 1 ? 'Sparkles' : weekNum === 2 ? 'Users' : weekNum === 3 ? 'Video' : 'Award',
            title: t.badgeTitle || `Hafta ${weekNum} Yulduzi`,
          },
          stepGuide: t.stepGuide || [],
        }));
      };

      plan = {
        id: `plan-${userId}-${Date.now()}`,
        userId,
        generatedBasedOnKpiId: indicators.id,
        progress_status: 'in_progress',
        targetWeakIndicators: targetWeakKeys,
        aiReasoning: parsed.aiReasoning || `Gemini 3.8 Flash AI tahlili: ${lowestThree.map(t => t.name).join(', ')} bo'yicha moslashtirilgan o'quv traektoriyasi shakllantirildi.`,
        createdAt: new Date().toISOString(),
        week_1_tasks: mapTasks(parsed.week1, 1, "1-hafta: Nazariy anglash", 'theory'),
        week_2_tasks: mapTasks(parsed.week2, 2, "2-hafta: Birgalikda ishlash", 'collab'),
        week_3_tasks: mapTasks(parsed.week3, 3, "3-hafta: Amaliy integratsiya", 'practice'),
        week_4_tasks: mapTasks(parsed.week4, 4, "4-hafta: Ish jarayoniga joriy etish", 'workflow'),
      };

      INITIAL_ACTION_PLANS[userId] = plan;
      return plan;
    } catch (err) {
      console.warn('Gemini AI plan generation fallback to expert rule engine:', err);
    }
  }

  // Expert Algorithmic Generation (tailored to the 3 lowest indicators)
  const weak1 = lowestThree[0];
  const weak2 = lowestThree[1];
  const weak3 = lowestThree[2];

  plan = {
    id: `plan-${userId}-${Date.now()}`,
    userId,
    generatedBasedOnKpiId: indicators.id,
    progress_status: 'in_progress',
    targetWeakIndicators: targetWeakKeys,
    aiReasoning: `DigiLead AI Tahlili: Direktorning eng past 3 ta ko'rsatkichi (${weak1.name}: ${weak1.score}%, ${weak2.name}: ${weak2.score}%, ${weak3.name}: ${weak3.score}%) aniqlandi. Texnofobiyani bartaraf etish va bosqichma-bosqich raqamli odat shakllantirish uchun 4 haftalik shaxsiy reja tuzildi.`,
    createdAt: new Date().toISOString(),
    week_1_tasks: [
      {
        id: `w1-t1-${Date.now()}`,
        weekNumber: 1,
        title: `Nazariy anglash: ${weak1.name} asoslari`,
        description: `Mazkur ko'nikma bo'yicha 5 daqiqalik qisqa va qulay video-qo'llanmani tomosha qiling va qog'ozsiz ishlash afzalligini his eting.`,
        durationMinutes: 5,
        category: 'theory',
        stageLabel: "1-hafta: Nazariy anglash",
        completed: false,
        badgeReward: {
          icon: 'Sparkles',
          title: "Birinchi Qadam Nishoni",
        },
        stepGuide: [
          "1. Havolani ochib 5 daqiqalik qo'llanmani ko'ring.",
          "2. Rahbar faoliyatidagi qulayliklarni daftarchangizga qayd eting.",
          "3. 'Qo'llanmani ko'rdim' deb belgilang."
        ],
      },
      {
        id: `w1-t2-${Date.now()}`,
        weekNumber: 1,
        title: `Kiberxotirjamlik: ${weak2.name} bo'yicha dastlabki tekshiruv`,
        description: `Profil va telefon xavfsizligini ta'minlash uchun oddiy sozlamalarni faollashtirish.`,
        durationMinutes: 7,
        category: 'theory',
        stageLabel: "1-hafta: Nazariy anglash",
        completed: false,
        badgeReward: {
          icon: 'Shield',
          title: "Xavfsiz Qal'a Nishoni",
        },
        stepGuide: [
          "1. Ishchi profilingizning maxfiylik sozlamalarini tekshiring.",
          "2. Shaxsiy parolingizni mustahkamlang.",
          "3. O'zlashtirishni yakunlang."
        ],
      }
    ],
    week_2_tasks: [
      {
        id: `w2-t1-${Date.now()}`,
        weekNumber: 2,
        title: `Birgalikda ishlash: Hamkasb bilan bulutli muhitda amaliy mashq`,
        description: `Metodist yoki hamkasbingiz bilan bitta umumiy hujjat ustida masofadan birga ishlash tajribasi.`,
        durationMinutes: 10,
        category: 'collab',
        stageLabel: "2-hafta: Birgalikda ishlash",
        completed: false,
        badgeReward: {
          icon: 'Users',
          title: "Hamkorlik Ustasi Nishoni",
        },
        stepGuide: [
          "1. Hujjat yarating va hamkasbingizga elektron pochta orqali ruxsat bering.",
          "2. Matnda kichik o'zgarish kiritib, bir vaqtning o'zida ikkala tomon ko'rayotganiga ishonch hosil qiling.",
          "3. Izoh (comment) yozish funksiyasini sinab ko'ring."
        ],
      }
    ],
    week_3_tasks: [
      {
        id: `w3-t1-${Date.now()}`,
        weekNumber: 3,
        title: `Amaliy integratsiya: Ota-onalar bilan onlayn aloqa yoki monitoring o'tkazish`,
        description: `Zoom yoki Google Meet dasturida virtual xona ochib, 15 daqiqalik onlayn muloqot tashkil etish.`,
        durationMinutes: 15,
        category: 'practice',
        stageLabel: "3-hafta: Amaliy integratsiya",
        completed: false,
        badgeReward: {
          icon: 'Video',
          title: "Raqamli Moderator Nishoni",
        },
        stepGuide: [
          "1. Onlayn xona havolasini shakllantiring va guruhga yuboring.",
          "2. Ekran ulashish (Screen share) tugmasi orqali hisobot taqdimotini ko'rsating.",
          "3. Savol-javoblarni onlayn qabul qiling."
        ],
      }
    ],
    week_4_tasks: [
      {
        id: `w4-t1-${Date.now()}`,
        weekNumber: 4,
        title: `Haqiqiy ish jarayoniga joriy etish: Tizim orqali qog'ozsiz hisobot berish`,
        description: `O'zlashtirilgan bilimlarni MTTning kundalik hujjat aylanishiga to'liq tatbiq etish va tizimga kiritish.`,
        durationMinutes: 15,
        category: 'workflow',
        stageLabel: "4-hafta: Ish jarayoniga joriy etish",
        completed: false,
        badgeReward: {
          icon: 'Award',
          title: "Raqamli Lider Oltin Yulduzi",
        },
        stepGuide: [
          "1. Mazkur yo'nalish bo'yicha yakuniy hisobotni raqamli tizimga yuklang.",
          "2. Auditor va IT-metodistga ko'rib chiqish so'rovini yuboring.",
          "3. Raqamli kompetensiya indeksingiz o'sishini kuzating."
        ],
      }
    ]
  };

  INITIAL_ACTION_PLANS[userId] = plan;
  return plan;
}
