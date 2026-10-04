import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `Siz maktabgacha ta'lim tizimi (MTT) direktorlari uchun raqamli ko'nikmalarni rivojlantiruvchi ekspertsiz.
Direktorning eng past ko'rsatkichlari: cybersecurity_awareness, data_driven_decisions.
Shu muammolarni bartaraf etish uchun kunlik mikro-mashqlardan iborat 4 haftalik reja tuzing. (Har haftada aniq 7 ta mashq bo'lishi shart).
Natijani FAQAT valid JSON formatida qaytaring:
{
  "aiReasoning": "Qisqa izoh (Masalan: Sizning natijalaringiz asosida...)",
  "week1": [ { "title": "Mashq nomi", "description": "Mashq tavsifi", "durationMinutes": 10, "stepGuide": ["Qadam 1", "Qadam 2"] } ],
  "week2": [ { "title": "Mashq nomi", "description": "Mashq tavsifi", "durationMinutes": 10, "stepGuide": ["Qadam 1", "Qadam 2"] } ],
  "week3": [ { "title": "Mashq nomi", "description": "Mashq tavsifi", "durationMinutes": 10, "stepGuide": ["Qadam 1", "Qadam 2"] } ],
  "week4": [ { "title": "Mashq nomi", "description": "Mashq tavsifi", "durationMinutes": 10, "stepGuide": ["Qadam 1", "Qadam 2"] } ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    console.log("Raw output:", response.text);
    const text = response.text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
    const parsed = JSON.parse(text);
    console.log("Parsed OK!");
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
