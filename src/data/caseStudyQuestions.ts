import { CaseStudyQuestion, IndicatorKey } from '../types';

export const CASE_STUDY_QUESTIONS: CaseStudyQuestion[] = [
  // ====================================================================
  // 1. cloud_computing_usage — Bulutli texnologiyalar (5 ta savol)
  // ====================================================================
  {
    id: 'ccu-1', caseNumber: 1, targetIndicator: 'cloud_computing_usage',
    title: "Yillik hisobotlarni saqlash", context: "Barcha xodimlar yillik hisobot tayyorlamoqda.",
    situation: "Hujjatlarni qanday yig'asiz?",
    options: [
      { id: '1-a', text: "Fleshkada olib kelishlarini so'rayman", score: 20, isRecommended: false, explanation: "Virus tushish xavfi yuqori va vaqt yo'qotiladi." },
      { id: '1-b', text: "Telegram orqali tashlashlarini aytaman", score: 55, isRecommended: false, explanation: "Telegram fayllarni chalkashtirib yuborishi mumkin." },
      { id: '1-c', text: "Google Drive'da umumiy papka ochib, link yuboraman", score: 100, isRecommended: true, explanation: "A'lo! Barcha ma'lumotlar markazlashgan va xavfsiz saqlanadi." }
    ]
  },
  {
    id: 'ccu-2', caseNumber: 2, targetIndicator: 'cloud_computing_usage',
    title: "Hujjatlarni tahrirlash", context: "Buyruq loyihasini metodist bilan birga tahrirlash kerak.",
    situation: "Jarayonni qanday qilasiz?",
    options: [
      { id: '2-a', text: "Wordda yozib, qog'ozda chiqarib beraman", score: 20, isRecommended: false, explanation: "Ortiqcha qog'oz sarfi va qayta tahrirlash qiyinlashadi." },
      { id: '2-b', text: "Word faylni telegramda yuborib turaman", score: 50, isRecommended: false, explanation: "Faylning bir necha xil versiyasi ko'payib ketadi." },
      { id: '2-c', text: "Google Docs orqali onlayn ruxsat beraman", score: 100, isRecommended: true, explanation: "Eng samarali usul - ikkalangiz bir vaqtda tahrirlaysiz." }
    ]
  },
  {
    id: 'ccu-3', caseNumber: 3, targetIndicator: 'cloud_computing_usage',
    title: "Arxiv hujjatlari", context: "Oxirgi 5 yillik papkalarni saqlash muammosi.",
    situation: "Joy yetishmayapti, nima qilasiz?",
    options: [
      { id: '3-a', text: "Zerto'laga (podval) tushirib qo'yaman", score: 10, isRecommended: false, explanation: "Hujjatlar namlikdan chirishi mumkin." },
      { id: '3-b', text: "Kompyuterimni D diskiga saqlayman", score: 55, isRecommended: false, explanation: "Kompyuter buzilsa hammasi o'chib ketadi." },
      { id: '3-c', text: "Skaner qilib, Bulutli xotiraga (Cloud) yuklayman", score: 100, isRecommended: true, explanation: "100% xavfsiz va istalgan joydan topish oson." }
    ]
  },
  {
    id: 'ccu-4', caseNumber: 4, targetIndicator: 'cloud_computing_usage',
    title: "Xizmat safarida hujjat kerak", context: "Viloyatga xizmat safarida ekansiz, zudlik bilan buyruq matnini ko'rish kerak bo'ldi.",
    situation: "Hujjatni qanday topasiz?",
    options: [
      { id: '4-a', text: "MTTga qo'ng'iroq qilib, kotibadan Telegram orqali yubortiraman", score: 30, isRecommended: false, explanation: "Boshqalarga bog'liq va vaqt sarflanadi." },
      { id: '4-b', text: "Xotiramda eslab, og'zaki ma'lumot beraman", score: 15, isRecommended: false, explanation: "Noaniq va xatolarga yo'l qo'yish mumkin." },
      { id: '4-c', text: "Telefon orqali Google Drive'ga kirib, hujjatni ochaman", score: 100, isRecommended: true, explanation: "Bulutli texnologiyaning asosiy afzalligi — har joydan ruxsat." }
    ]
  },
  {
    id: 'ccu-5', caseNumber: 5, targetIndicator: 'cloud_computing_usage',
    title: "Kompyuter buzilishi", context: "Ish kompyuteringiz buzildi, barcha ma'lumotlar ichida.",
    situation: "Ma'lumotlarni tiklash uchun nima qilasiz?",
    options: [
      { id: '5-a', text: "Usta chaqirib, qattiq diskni ta'mirlashga urinaman", score: 40, isRecommended: false, explanation: "Disk ochilmasligi yoki ma'lumotlar yo'qolishi xavfi bor." },
      { id: '5-b', text: "Hamma hujjatlarni qayta yozishga kirishaman", score: 10, isRecommended: false, explanation: "Ko'p vaqt va mehnat sarflanadi — nusxa yo'q." },
      { id: '5-c', text: "Barcha hujjatlarim bulutda (Cloud) edi, boshqa qurilmadan kiraman", score: 100, isRecommended: true, explanation: "Bulutli zaxira (backup) orqali hech narsa yo'qolmaydi." }
    ]
  },

  // ====================================================================
  // 2. data_driven_decisions — Ma'lumotlarga asoslangan qarorlar (5 ta savol)
  // ====================================================================
  {
    id: 'ddd-1', caseNumber: 6, targetIndicator: 'data_driven_decisions',
    title: "Oziq-ovqat xaridini rejalashtirish", context: "Keyingi oy uchun mahsulotlarga buyurtma berish.",
    situation: "Qancha oziq-ovqat kerakligini qanday hisoblaysiz?",
    options: [
      { id: '6-a', text: "Ko'z chamasi va o'tgan oydagidek buyurtma beraman", score: 20, isRecommended: false, explanation: "Raqamlarga asoslanmagan taxmin ziyon keltiradi." },
      { id: '6-b', text: "Oshpazdan so'rab yozib olaman", score: 50, isRecommended: false, explanation: "Subyektiv fikr, aniq qoldiqlar hisobga olinmagan." },
      { id: '6-c', text: "Oxirgi 3 oylik elektron hisobotdagi qoldiqlar dinamikasini tahlil qilaman", score: 100, isRecommended: true, explanation: "A'lo! Ma'lumotlarga asoslangan aniq qaror qabul qilindi." }
    ]
  },
  {
    id: 'ddd-2', caseNumber: 7, targetIndicator: 'data_driven_decisions',
    title: "Tarbiyachilar ustamasi", context: "Yil yakunida tarbiyachilarga ustama yozish kerak.",
    situation: "Kimga qancha ustama berishni qanday aniqlaysiz?",
    options: [
      { id: '7-a', text: "Shaxsiy munosabatimga va yoshiga qarab", score: 10, isRecommended: false, explanation: "Adolatsiz va noxolis qaror." },
      { id: '7-b', text: "Hamma teng bo'lishi uchun hammaga bir xil yozaman", score: 40, isRecommended: false, explanation: "Mehnat qilganlar rag'batlantirilmay qoladi." },
      { id: '7-c', text: "Monitoring tizimidagi ko'rsatkichlar reytingiga asosan", score: 100, isRecommended: true, explanation: "Ma'lumotlar tahlili orqali shaffof baholash." }
    ]
  },
  {
    id: 'ddd-3', caseNumber: 8, targetIndicator: 'data_driven_decisions',
    title: "Ota-onalar shikoyati", context: "Ayrim guruhlarda bolalar ovqat yemayotgani haqida arz tushdi.",
    situation: "Buni qanday hal qilasiz?",
    options: [
      { id: '8-a', text: "Oshpazni jazolab, ota-onalarni tinchlantiraman", score: 20, isRecommended: false, explanation: "Asossiz va shoshilinch xulosa." },
      { id: '8-b', text: "Tarbiyachilarga ovqat yedirishni qattiq tayinlayman", score: 50, isRecommended: false, explanation: "Muammoning asl sababi o'rganilmadi." },
      { id: '8-c', text: "Elektron so'rovnoma o'tkazib, menyu tahlili orqali qaysi ovqat yeyilmayotganini aniqlayman", score: 100, isRecommended: true, explanation: "Faktlar va raqamlar orqali ildiz muammoni topish." }
    ]
  },
  {
    id: 'ddd-4', caseNumber: 9, targetIndicator: 'data_driven_decisions',
    title: "Guruhlarni to'ldirish", context: "Yangi o'quv yiliga guruhlarni shakllantirishingiz kerak.",
    situation: "Har guruhga nechta bola olishni qanday belgilaysiz?",
    options: [
      { id: '9-a', text: "O'tgan yildagidek bo'ladi deb bir xil tarqataman", score: 25, isRecommended: false, explanation: "Har yilgi ehtiyoj farq qiladi." },
      { id: '9-b', text: "Tarbiyachilarning istaklariga qarab taqsimlayman", score: 45, isRecommended: false, explanation: "Subyektiv va asossiz." },
      { id: '9-c', text: "Navbat ma'lumotlari, yosh guruhlari statistikasi va xona sig'imini taqqoslab qaror qilaman", score: 100, isRecommended: true, explanation: "Data-driven yondoshuv bilan optimal taqsimlash." }
    ]
  },
  {
    id: 'ddd-5', caseNumber: 10, targetIndicator: 'data_driven_decisions',
    title: "Elektr sarfi oshgan", context: "Oxirgi 2 oyda MTT elektr to'lovi 2 baravar ko'paydi.",
    situation: "Sababini qanday aniqlaysiz?",
    options: [
      { id: '10-a', text: "Hammaga 'tejamkor bo'linglar' deb aytaman", score: 20, isRecommended: false, explanation: "Sabab aniqlanmagan holda umumiy chaqiriq samarasiz." },
      { id: '10-b', text: "Qo'riqchiga kechasi chiroqlarni o'chirishni tayinlayman", score: 50, isRecommended: false, explanation: "Bitta omilga e'tibor, lekin to'liq tahlil yo'q." },
      { id: '10-c', text: "Oylik elektr hisobotlarini taqqoslab, qaysi qurilmalar ko'p iste'mol qilayotganini aniqlayman", score: 100, isRecommended: true, explanation: "Raqamlar asosida muammoni aniq topish." }
    ]
  },

  // ====================================================================
  // 3. edtech_integration — EdTech integratsiyasi (5 ta savol)
  // ====================================================================
  {
    id: 'eti-1', caseNumber: 11, targetIndicator: 'edtech_integration',
    title: "Interaktiv ta'lim", context: "Mashg'ulotlarni qiziqarliroq qilish kerak.",
    situation: "Tarbiyachilarga qanday texnologik usulni tavsiya qilasiz?",
    options: [
      { id: '11-a', text: "Faqat o'yinchoqlar va kitoblar bilan ishlashni aytaman", score: 40, isRecommended: false, explanation: "Zamonaviy texnologiyalar imkoniyati boy berilmoqda." },
      { id: '11-b', text: "Bolalarga televizorda multfilm qo'yib berishni buyuraman", score: 25, isRecommended: false, explanation: "Passiv va pedagogik foydasi kam." },
      { id: '11-c', text: "Aqlli doskada interaktiv mantiqiy o'yinlar dasturini qo'llashni o'rgataman", score: 100, isRecommended: true, explanation: "EdTech vositalarini pedagogik maqsadga yo'naltirish." }
    ]
  },
  {
    id: 'eti-2', caseNumber: 12, targetIndicator: 'edtech_integration',
    title: "Video darsliklar yaratish", context: "Metodik tavsiyalarni tarbiyachilarga yetkazish.",
    situation: "Buni qanday tashkil etasiz?",
    options: [
      { id: '12-a', text: "Yozma buyruq chiqaraman, o'qib olishadi", score: 30, isRecommended: false, explanation: "Samarasiz va esda qolish darajasi past." },
      { id: '12-b', text: "Har juma barchani majlislar zaliga yig'aman", score: 55, isRecommended: false, explanation: "Vaqtni juda ko'p oladi." },
      { id: '12-c', text: "Qisqa video-qo'llanmalar yozib, ichki LMS portaliga joylayman", score: 100, isRecommended: true, explanation: "Zamonaviy va istalgan vaqtda ko'rish mumkin." }
    ]
  },
  {
    id: 'eti-3', caseNumber: 13, targetIndicator: 'edtech_integration',
    title: "Ota-onalar bilan ochiq dars", context: "Bolalarning natijalarini ko'rsatish.",
    situation: "Ochiq darsda qanday texnologiya ishlatsa yaxshi?",
    options: [
      { id: '13-a', text: "Qog'ozdagi rasmlarni ko'rsatib dars o'tish", score: 45, isRecommended: false, explanation: "An'anaviy, lekin yangicha yondashuv emas." },
      { id: '13-b', text: "Bolalarni faqat ashula aytishga majburlash", score: 20, isRecommended: false, explanation: "EdTech umuman ishlatilmadi." },
      { id: '13-c', text: "Bolalar javoblarini planshet orqali ekranga vizual chiqarish (Kahoot/Quizziz kabi)", score: 100, isRecommended: true, explanation: "A'lo! Interaktivlik va ota-onalarni lol qoldirish." }
    ]
  },
  {
    id: 'eti-4', caseNumber: 14, targetIndicator: 'edtech_integration',
    title: "Bolalar nutq rivojlanishi", context: "3-4 yoshli bolalar nutqi sust rivojlanyapti.",
    situation: "Tarbiyachiga qanday yordam berasiz?",
    options: [
      { id: '14-a', text: "Ko'proq kitob o'qishlarini aytaman", score: 45, isRecommended: false, explanation: "Yaxshi, lekin zamonaviy vosita emas." },
      { id: '14-b', text: "Ota-onalarga qo'shimcha mashg'ulot olishni maslahat beraman", score: 50, isRecommended: false, explanation: "Muammoning yechimini boshqalarga yuklash." },
      { id: '14-c', text: "Nutq rivojlantiruvchi interaktiv ta'limiy dasturlarni planshetda qo'llashni o'rgataman", score: 100, isRecommended: true, explanation: "EdTech orqali maqsadli rivojlantirish." }
    ]
  },
  {
    id: 'eti-5', caseNumber: 15, targetIndicator: 'edtech_integration',
    title: "Ota-onalar yig'ilishi", context: "Choraklik hisobotni ota-onalarga taqdim etish kerak.",
    situation: "Hisobotni qanday taqdim qilasiz?",
    options: [
      { id: '15-a', text: "Og'zaki gapirib beraman", score: 25, isRecommended: false, explanation: "Raqamlar va faktlar ko'rsatilmaydi." },
      { id: '15-b', text: "Qog'ozga yozib tarqataman", score: 45, isRecommended: false, explanation: "Vizual ta'sir kuchsiz." },
      { id: '15-c', text: "Infografika va diagrammali slayd tayyorlab, ekranda namoyish etaman", score: 100, isRecommended: true, explanation: "Vizual taqdimot orqali samarali muloqot." }
    ]
  },

  // ====================================================================
  // 4. cybersecurity_awareness — Kiberxavfsizlik (5 ta savol)
  // ====================================================================
  {
    id: 'csa-1', caseNumber: 16, targetIndicator: 'cybersecurity_awareness',
    title: "Fishing xabarlar", context: "Pochtaga shubhali 'Mukofot yutdingiz' xati keldi.",
    situation: "Siz qanday yo'l tutasiz?",
    options: [
      { id: '16-a', text: "Havolani bosib, ism-sharifimni kiritib ko'raman", score: 10, isRecommended: false, explanation: "Juda xavfli! Shaxsiy ma'lumotlar o'g'irlanadi." },
      { id: '16-b', text: "Hamkasblarimga ham yuboraman, ular ham yutsin", score: 0, isRecommended: false, explanation: "Virus butun tarmoqqa tarqaladi." },
      { id: '16-c', text: "Darhol spamga tiqib, pochtani o'chirib yuboraman", score: 100, isRecommended: true, explanation: "Kiberxavfsizlikning oltin qoidasi." }
    ]
  },
  {
    id: 'csa-2', caseNumber: 17, targetIndicator: 'cybersecurity_awareness',
    title: "Parollarni saqlash", context: "Sizda ERP, Nodavlat, Email tizimlarining parollari bor.",
    situation: "Ularni qayerda saqlaysiz?",
    options: [
      { id: '17-a', text: "Monitor yoki klaviatura tagiga yopishtirib qo'yaman", score: 10, isRecommended: false, explanation: "Istagan odam ruxsatsiz kira oladi." },
      { id: '17-b', text: "Barcha tizimlar uchun bitta oddiy (123456) parol qo'yaman", score: 20, isRecommended: false, explanation: "Bitta parol topilsa, barcha ma'lumotlar xavf ostida." },
      { id: '17-c', text: "Maxsus Parol Menenjeri (Password Manager) dasturida saqlayman", score: 100, isRecommended: true, explanation: "Eng zamonaviy va xavfsiz yechim." }
    ]
  },
  {
    id: 'csa-3', caseNumber: 18, targetIndicator: 'cybersecurity_awareness',
    title: "Ish stolidan ketish", context: "Sizning oldingizga shoshilinch odam kelib qoldi.",
    situation: "Kompyuter ekranida hisobotlar ochiq, nima qilasiz?",
    options: [
      { id: '18-a', text: "Shundoq ochiq qoldirib chiqib ketaman", score: 10, isRecommended: false, explanation: "Begona shaxslar ma'lumotlarni o'zgartirishi mumkin." },
      { id: '18-b', text: "Monitorni o'chirib qo'yaman", score: 45, isRecommended: false, explanation: "Monitor yoqilsa tizim baribir ochiq qoladi." },
      { id: '18-c', text: "Win + L tugmasini bosib ekranni bloklayman (Lock Screen)", score: 100, isRecommended: true, explanation: "To'g'ri! Axborot maxfiyligini ta'minlash muhim." }
    ]
  },
  {
    id: 'csa-4', caseNumber: 19, targetIndicator: 'cybersecurity_awareness',
    title: "Wi-Fi tarmoq xavfsizligi", context: "MTT Wi-Fi tarmog'iga begona odamlar ulanib yurishmoqda.",
    situation: "Nima qilasiz?",
    options: [
      { id: '19-a', text: "Hech narsa qilmayman, internet hammaga yetadi", score: 10, isRecommended: false, explanation: "Ruxsatsiz kirishlar tarmoqqa xavf tug'diradi." },
      { id: '19-b', text: "Wi-Fi o'chirib qo'yaman, sim orqali ishlaymiz", score: 40, isRecommended: false, explanation: "Haddan tashqari chora — barcha texnologiyalar to'xtaydi." },
      { id: '19-c', text: "Kuchli parol qo'yaman va uni muntazam almashtirib turaman", score: 100, isRecommended: true, explanation: "Tarmoq xavfsizligini ta'minlashning to'g'ri yo'li." }
    ]
  },
  {
    id: 'csa-5', caseNumber: 20, targetIndicator: 'cybersecurity_awareness',
    title: "Noma'lum dastur o'rnatish", context: "Internetdan yuklab olingan bepul dastur o'rnatishni so'rashmoqda.",
    situation: "Qanday javob berasiz?",
    options: [
      { id: '20-a', text: "Kerak bo'lsa o'rnataveringlar deb ruxsat beraman", score: 10, isRecommended: false, explanation: "Virus va zararli dasturlar tushishi mumkin." },
      { id: '20-b', text: "Faqat men o'rnataman deb aytaman va tekshirmasdan o'rnataman", score: 35, isRecommended: false, explanation: "Nazorat bor, lekin xavfsizlik tekshiruvi yo'q." },
      { id: '20-c', text: "Dasturning rasmiy saytdan ekanini tekshiraman va antivirus orqali skanerlayman", score: 100, isRecommended: true, explanation: "Xavfsiz IT boshqaruv — faqat ishonchli manbalardan." }
    ]
  },

  // ====================================================================
  // 5. digital_communication — Raqamli kommunikatsiya (5 ta savol)
  // ====================================================================
  {
    id: 'dco-1', caseNumber: 21, targetIndicator: 'digital_communication',
    title: "Ota-onalar bilan Telegram guruh", context: "Guruhda tushunmovchilik va janjal boshlandi.",
    situation: "Direktor sifatida qanday munosabat bildirasiz?",
    options: [
      { id: '21-a', text: "Guruhni o'chirib tashlayman", score: 25, isRecommended: false, explanation: "Muammo yechimsiz qoladi va norozilik ortadi." },
      { id: '21-b', text: "Barcha xabarlarga qattiq ohangda yozib, ularni urishaman", score: 35, isRecommended: false, explanation: "Konflikt yanada chuqurlashadi." },
      { id: '21-c', text: "Tinchlanishlarini so'rab, masalani yakka tartibda (lichkada) hal qilishni taklif etaman", score: 100, isRecommended: true, explanation: "Raqamli etika va to'g'ri kommunikatsiya yechimi." }
    ]
  },
  {
    id: 'dco-2', caseNumber: 22, targetIndicator: 'digital_communication',
    title: "Vazifa berish tizimi", context: "Metodist, hamshira va tarbiyachilarga topshiriqlar bermoqchisiz.",
    situation: "Buni qanday berasiz?",
    options: [
      { id: '22-a', text: "Yo'lakda ko'rganda og'zaki aytib o'taman", score: 25, isRecommended: false, explanation: "Topshiriq unutilishi yoki noto'g'ri bajarilishi ehtimoli baland." },
      { id: '22-b', text: "Barchasiga alohida sms yozib chiqaman", score: 55, isRecommended: false, explanation: "Nazorat qilish qiyinlashadi." },
      { id: '22-c', text: "Korporativ Telegram guruhda rasmiy so'rovnoma (poll) va aniq muddatli xabar qoldiraman", score: 100, isRecommended: true, explanation: "Tizimli va shaffof aloqa." }
    ]
  },
  {
    id: 'dco-3', caseNumber: 23, targetIndicator: 'digital_communication',
    title: "E'lonlar paneli", context: "Yakshanba kuni ertangi muhim yig'ilish haqida e'lon qilish.",
    situation: "Qachon va qayerga yozasiz?",
    options: [
      { id: '23-a', text: "Kechasi soat 23:00 da Telegram guruhiga yozaman", score: 20, isRecommended: false, explanation: "Xodimlarning dam olish huquqiga zid (Raqamli etika)." },
      { id: '23-b', text: "Dushanba ertalab kelganda aytaman", score: 40, isRecommended: false, explanation: "Tayyorgarlik uchun vaqt qolmaydi." },
      { id: '23-c', text: "Kechiktirib yuborish funksiyasi orqali ish vaqtiga soat qo'yaman", score: 100, isRecommended: true, explanation: "A'lo darajadagi raqamli madaniyat." }
    ]
  },
  {
    id: 'dco-4', caseNumber: 24, targetIndicator: 'digital_communication',
    title: "Video yig'ilish", context: "MTTlar orasida tajriba almashish uchun viloyat boshlig'i yig'ilish tashkil qilmoqchi.",
    situation: "Yig'ilish qayerda bo'lishi kerakligini qanday taklif qilasiz?",
    options: [
      { id: '24-a', text: "Barcha direktorlarni viloyat markaziga yig'ish kerak", score: 25, isRecommended: false, explanation: "Transport xarajati va vaqt yo'qotish." },
      { id: '24-b', text: "Telefon qo'ng'iroqlari orqali gaplashsak bo'ladi", score: 45, isRecommended: false, explanation: "Vizual aloqa yo'q, hujjat almashish qiyin." },
      { id: '24-c', text: "Zoom yoki Google Meet orqali onlayn video konferensiya o'tkazishni taklif qilaman", score: 100, isRecommended: true, explanation: "Zamonaviy, tejamkor va samarali raqamli aloqa." }
    ]
  },
  {
    id: 'dco-5', caseNumber: 25, targetIndicator: 'digital_communication',
    title: "Tarbiyachi bilan kelishmovchilik", context: "Tarbiyachi Telegram guruhda noto'g'ri ma'lumot tarqatdi.",
    situation: "Qanday harakat qilasiz?",
    options: [
      { id: '25-a', text: "Guruhning o'zida unga jamoat oldida e'tiroz bildiraman", score: 15, isRecommended: false, explanation: "Jamoat oldida uyaltirish — raqamli bulling." },
      { id: '25-b', text: "Xabarni o'chirib tashlayman va indamayman", score: 40, isRecommended: false, explanation: "Muammoga yuzaki yechim — noto'g'ri ma'lumot qoladi." },
      { id: '25-c', text: "Shaxsiy chatda xatosini tushuntirib, guruhda to'g'ri ma'lumotni rasmiy qilib e'lon qilaman", score: 100, isRecommended: true, explanation: "Professional muloqot va faktlarni to'g'rilash." }
    ]
  },

  // ====================================================================
  // 6. digital_monitoring — Raqamli monitoring (5 ta savol)
  // ====================================================================
  {
    id: 'dmo-1', caseNumber: 26, targetIndicator: 'digital_monitoring',
    title: "Mashg'ulot nazorati", context: "Siz tarbiyachilar qanday dars o'tayotganini tekshirmoqchisiz.",
    situation: "Kuzatuvni qanday amalga oshirasiz?",
    options: [
      { id: '26-a', text: "Har kun bitta xonaga bostirib kirib o'tiraman", score: 35, isRecommended: false, explanation: "Bolalarni va tarbiyachini chalg'itadi." },
      { id: '26-b', text: "Kuzatuv kamerasidan 1 daqiqa qarab, yopib qo'yaman", score: 50, isRecommended: false, explanation: "To'liq pedagogik tahlil bo'lmaydi." },
      { id: '26-c', text: "Kameralar va elektron baholash varaqasi orqali tizimli raqamli monitoring qilaman", score: 100, isRecommended: true, explanation: "Zamonaviy va samarali boshqaruv." }
    ]
  },
  {
    id: 'dmo-2', caseNumber: 27, targetIndicator: 'digital_monitoring',
    title: "Davomat tekshiruvi", context: "Bolalar kelishi kamayib ketdi.",
    situation: "Sababni topish kerak, nima qilasiz?",
    options: [
      { id: '27-a', text: "Hamshiradan janjal qilib so'rayman", score: 20, isRecommended: false, explanation: "Muammo yechilmaydi." },
      { id: '27-b', text: "Qog'oz jurnallarni varaqlab sanab chiqaman", score: 50, isRecommended: false, explanation: "Juda ko'p vaqt va mehnat talab etadi." },
      { id: '27-c', text: "Elektron tizim (ERP)dagi davomat grafiklaridan tahlil olaman", score: 100, isRecommended: true, explanation: "Tezkor va adashmas faktlar olinadi." }
    ]
  },
  {
    id: 'dmo-3', caseNumber: 28, targetIndicator: 'digital_monitoring',
    title: "Tarbiyachilar portfoliosi", context: "Tarbiyachilarni yil yakuniga baholash.",
    situation: "Qanday qilib adolatli baholaysiz?",
    options: [
      { id: '28-a', text: "Faqat esda qolgan qilingan ishlariga qarab", score: 30, isRecommended: false, explanation: "Inson xotirasi adashishi mumkin." },
      { id: '28-b', text: "Stolimdagi qog'oz ma'lumotnomalarga qarab", score: 55, isRecommended: false, explanation: "Ma'lumotlar to'liq yoki arxivlanmagan bo'lishi mumkin." },
      { id: '28-c', text: "Google Drive'da yuritilgan elektron reyting va elektron portfoliolar asosida", score: 100, isRecommended: true, explanation: "Shaffof va 100% obektiv." }
    ]
  },
  {
    id: 'dmo-4', caseNumber: 29, targetIndicator: 'digital_monitoring',
    title: "Tashqi tekshiruv", context: "Ertaga viloyat XTBdan tekshiruvchi kelyapti.",
    situation: "Ma'lumotlarni qanday tayyorlaysiz?",
    options: [
      { id: '29-a', text: "Tun bo'yi qog'ozlarni tartibga keltiramiz", score: 20, isRecommended: false, explanation: "Oxirgi daqiqada shoshilish — sifatsiz natija." },
      { id: '29-b', text: "Hujjatlar qog'ozda tayyor, shu bilan boraman", score: 50, isRecommended: false, explanation: "Qog'oz ma'lumotlar tartibsiz yoki to'liqsiz bo'lishi mumkin." },
      { id: '29-c', text: "Elektron tizimda barcha ko'rsatkichlar doimiy yangilab borilgan — bitta tugma bilan hisobot chiqaraman", score: 100, isRecommended: true, explanation: "Doimiy raqamli monitoring — tekshiruvga doim tayyor." }
    ]
  },
  {
    id: 'dmo-5', caseNumber: 30, targetIndicator: 'digital_monitoring',
    title: "Bolalar rivojlanishi", context: "Ota-onalar bolaning rivojlanish ko'rsatkichlarini so'rayapti.",
    situation: "Qanday javob berasiz?",
    options: [
      { id: '30-a', text: "Tarbiyachi bilan gaplashing deb aytaman", score: 30, isRecommended: false, explanation: "Rahbarlik boshqaruvidan chetlashish." },
      { id: '30-b', text: "Umumiy gaplar bilan bolangiz yaxshi deb javob beraman", score: 40, isRecommended: false, explanation: "Aniq ma'lumot berilmadi." },
      { id: '30-c', text: "Elektron portfoliodagi rivojlanish ko'rsatkichlari grafiklarini ko'rsataman", score: 100, isRecommended: true, explanation: "Raqamli monitoring orqali shaffof va ishonchli javob." }
    ]
  },

  // ====================================================================
  // 7. resource_digitization — Resurslarni raqamlashtirish (5 ta savol)
  // ====================================================================
  {
    id: 'rdi-1', caseNumber: 31, targetIndicator: 'resource_digitization',
    title: "Oziq-ovqat qoldig'i", context: "Oshxonada shakar tez tugab qolyapti.",
    situation: "Buni qanday nazorat qilasiz?",
    options: [
      { id: '31-a', text: "Omborxona qulfini almashtiraman", score: 35, isRecommended: false, explanation: "Tizimli yechim emas." },
      { id: '31-b', text: "Omborchiga daftarga yozishni qattiq tayinlayman", score: 50, isRecommended: false, explanation: "Daftarni o'zgartirish oson." },
      { id: '31-c', text: "Kirish-chiqish mahsulotlarini Excel elektron bazasiga kiritib borish tizimini joriy etaman", score: 100, isRecommended: true, explanation: "Raqamli nazorat orqali yo'qotishlar keskin kamayadi." }
    ]
  },
  {
    id: 'rdi-2', caseNumber: 32, targetIndicator: 'resource_digitization',
    title: "Buzilgan jihozlar hisobi", context: "MTTda nechta stul, stol singanini bilish kerak.",
    situation: "Buning eng yaxshi yo'li nima?",
    options: [
      { id: '32-a', text: "Xo'jalik mudirini chaqirib so'rayman", score: 35, isRecommended: false, explanation: "Og'zaki ma'lumot noto'g'ri bo'lishi mumkin." },
      { id: '32-b', text: "Barcha xonalarni aylanib o'zim sanab chiqaman", score: 50, isRecommended: false, explanation: "Direktor vaqtining bekorga sarflanishi." },
      { id: '32-c', text: "Mulk inventarizatsiyasini elektron QR kodlar yoki markaziy Excelda yuritaman", score: 100, isRecommended: true, explanation: "Resurslarning raqamli pasportizatsiyasi - mukammal." }
    ]
  },
  {
    id: 'rdi-3', caseNumber: 33, targetIndicator: 'resource_digitization',
    title: "Yangi buyumlar xaridi", context: "Tarbiyachilardan juda ko'p qog'oz va kraskaga buyurtma tushmoqda.",
    situation: "Resursni maqbullashtirish uchun nima qilasiz?",
    options: [
      { id: '33-a', text: "Hamma so'rovlarni rad etaman", score: 20, isRecommended: false, explanation: "Ta'lim sifatiga salbiy ta'sir qiladi." },
      { id: '33-b', text: "Qancha so'rasa shuncha olib beraveraman", score: 30, isRecommended: false, explanation: "Budjet isrofgarchiligi." },
      { id: '33-c', text: "Tarbiyachilarga QR kodli interaktiv vizual materiallardan ko'proq foydalanishni o'rgataman", score: 100, isRecommended: true, explanation: "Qog'oz o'rniga raqamli resurs - 2 barobar foyda." }
    ]
  },
  {
    id: 'rdi-4', caseNumber: 34, targetIndicator: 'resource_digitization',
    title: "Dori-darmon hisobi", context: "Tibbiy punkt uchun dori-darmonlar hisobini yuritish kerak.",
    situation: "Qanday tizim joriy qilasiz?",
    options: [
      { id: '34-a', text: "Hamshiraga daftarga yozishni buyuraman", score: 30, isRecommended: false, explanation: "Qog'oz hisobda xatolar ko'p bo'ladi." },
      { id: '34-b', text: "Har oyda bir marta o'zim kelish-ketishni tekshiraman", score: 50, isRecommended: false, explanation: "Nazorat bor, lekin real-time emas." },
      { id: '34-c', text: "Elektron jadvalda yaroqlilik muddati, kirish-chiqish avtomatik hisobot tizimini yarataman", score: 100, isRecommended: true, explanation: "Raqamli boshqaruv - xavfsiz va aniq." }
    ]
  },
  {
    id: 'rdi-5', caseNumber: 35, targetIndicator: 'resource_digitization',
    title: "Chorak yakunidagi inventarizatsiya", context: "Har chorak yakunida barcha mulk ro'yxatini tuzish talab qilinadi.",
    situation: "Qanday amalga oshirasiz?",
    options: [
      { id: '35-a', text: "Xo'jalik mudiriga daftardagi ma'lumotlardan hisobot yozdiraman", score: 30, isRecommended: false, explanation: "Qog'oz ma'lumotlar eskirgan bo'lishi mumkin." },
      { id: '35-b', text: "Har xonaga kirib, birin-ketin sanab yozaman", score: 45, isRecommended: false, explanation: "Ko'p vaqt oladi va xatolik ehtimoli bor." },
      { id: '35-c', text: "QR kodlar orqali elektron skanerlash va avtomatik hisobot olaman", score: 100, isRecommended: true, explanation: "Bir daqiqada aniq raqamli inventarizatsiya." }
    ]
  },

  // ====================================================================
  // 8. ai_automation_adoption — Sun'iy intellekt (5 ta savol)
  // ====================================================================
  {
    id: 'aia-1', caseNumber: 36, targetIndicator: 'ai_automation_adoption',
    title: "Yig'ilish bayonnomasi", context: "Uzoq majlis o'tdi, uning bayonnomasini yozish kerak.",
    situation: "Vaqtni tejash uchun nima qilasiz?",
    options: [
      { id: '36-a', text: "Kotibaga 3 soat vaqt berib, qo'lda yozdiraman", score: 25, isRecommended: false, explanation: "Inson mehnati samarasiz sarflanyapti." },
      { id: '36-b', text: "Esda qolgan qisqacha narsalarni Wordga yozib qo'yaman", score: 45, isRecommended: false, explanation: "Muhim masalalar qolib ketishi mumkin." },
      { id: '36-c', text: "Majlis audio yozuvini AI ga yuklab, tayyor matn formatiga o'girdiraman", score: 100, isRecommended: true, explanation: "Super samaradorlik va innovatsion yondashuv." }
    ]
  },
  {
    id: 'aia-2', caseNumber: 37, targetIndicator: 'ai_automation_adoption',
    title: "Tadbir senariysi", context: "Yangi yil bayramiga o'zgacha ertak senariysi kerak.",
    situation: "Buni kim tuzadi?",
    options: [
      { id: '37-a', text: "Eski yillardagi senariyni yana ishlatamiz", score: 35, isRecommended: false, explanation: "Bolalar va ota-onalar uchun qiziqarsiz." },
      { id: '37-b', text: "Internetdan ruscha variantni qidirib, tarjima qilaman", score: 55, isRecommended: false, explanation: "Vaqt oladi va original emas." },
      { id: '37-c', text: "ChatGPT/Gemini AI ga kreativ senariy yozish uchun so'rov beraman", score: 100, isRecommended: true, explanation: "Ajoyib g'oya! AI bir daqiqada yangi g'oyalar beradi." }
    ]
  },
  {
    id: 'aia-3', caseNumber: 38, targetIndicator: 'ai_automation_adoption',
    title: "Xat yozish", context: "Ota-onalarga tarqatiladigan rasmiy e'lon matni tuzish.",
    situation: "Grammatik xatosiz rasmiy matn tuzish uchun:",
    options: [
      { id: '38-a', text: "O'zim xato bo'lsa ham yozib tarqataman", score: 25, isRecommended: false, explanation: "Tashkilot obro'siga putur yetadi." },
      { id: '38-b', text: "Til o'qituvchisini chaqirtirib yozdiraman", score: 55, isRecommended: false, explanation: "Vaqt kutish talab qilinadi." },
      { id: '38-c', text: "Sun'iy intellektdan rasmiy ohangda va bexato matn yozib berishni so'rayman", score: 100, isRecommended: true, explanation: "Sun'iy intellektdan avtomatlashtirishda to'g'ri foydalanish." }
    ]
  },
  {
    id: 'aia-4', caseNumber: 39, targetIndicator: 'ai_automation_adoption',
    title: "Hisobot jadvallarini tayyorlash", context: "Choraklik hisobot uchun 20 ta jadval to'ldirish kerak.",
    situation: "Formulalar va jadvallar bilan nima qilasiz?",
    options: [
      { id: '39-a', text: "Har birini qo'lda kalkulyatorda hisoblab to'ldiraman", score: 20, isRecommended: false, explanation: "Ko'p vaqt va xatolik ehtimoli yuqori." },
      { id: '39-b', text: "Excel formulalarini ishlata olaman, lekin juda sekin", score: 50, isRecommended: false, explanation: "Asosiy ko'nikma bor, lekin AI yordami ishlatilmagan." },
      { id: '39-c', text: "AI yordamida shablon formulalar va jadvallar avtomatik generatsiya qildiraman", score: 100, isRecommended: true, explanation: "Soatlab vaqtni tejash va xatosiz natija." }
    ]
  },
  {
    id: 'aia-5', caseNumber: 40, targetIndicator: 'ai_automation_adoption',
    title: "Rasm va banner tayyorlash", context: "Bayramga chiroyli e'lon banneri kerak.",
    situation: "Dizaynni qanday qilasiz?",
    options: [
      { id: '40-a', text: "Qo'lda A4 qog'ozga yozib, ko'paytirib tarqataman", score: 15, isRecommended: false, explanation: "Estetik jihatdan zaif va vaqt talab etadi." },
      { id: '40-b', text: "Canva dasturida tayyor shablonlardan birini tanlashga urinaman", score: 55, isRecommended: false, explanation: "Yaxshi boshlang'ich, lekin AI imkoniyatlari ko'proq." },
      { id: '40-c', text: "AI orqali matn va rasm generatsiya qilib, professional banner yarataman", score: 100, isRecommended: true, explanation: "Zamonaviy AI vositalar orqali tezkor va sifatli natija." }
    ]
  },

  // ====================================================================
  // 9. digital_ethics — Raqamli etika (5 ta savol)
  // ====================================================================
  {
    id: 'det-1', caseNumber: 41, targetIndicator: 'digital_ethics',
    title: "Bolalar suratlari", context: "Kuzgi bayramda olingan rasmlarni ijtimoiy tarmoqqa qo'yish kerak.",
    situation: "Sizning harakatingiz qanday bo'ladi?",
    options: [
      { id: '41-a', text: "Barcha rasmlarni darhol Instagram/Facebook ga yuklayman", score: 10, isRecommended: false, explanation: "Bolalarning shaxsiy huquqlari va raqamli etika buzildi." },
      { id: '41-b', text: "Faqat eng chiroyli chiqqan bolalarning rasmini qo'yaman", score: 30, isRecommended: false, explanation: "Baribir ota-ona roziligi olinmagan." },
      { id: '41-c', text: "Ota-onalarning yozma roziligi bor bolalarni yoki yuzlari to'g'ridan-to'g'ri ko'rinmagan kadrlarni yuklayman", score: 100, isRecommended: true, explanation: "Yuksak raqamli axloq va shaxs daxlsizligi hurmati." }
    ]
  },
  {
    id: 'det-2', caseNumber: 42, targetIndicator: 'digital_ethics',
    title: "Muloqot madaniyati", context: "Bir tarbiyachi Telegram guruhda qo'pol xato qildi.",
    situation: "Direktor sifatida qanday reaksiya qilasiz?",
    options: [
      { id: '42-a', text: "Guruhning o'zida uni izza qilib so'kib tashlayman", score: 10, isRecommended: false, explanation: "Raqamli kiber-bulling! Jamoa oldida obro'sini to'kish mumkin emas." },
      { id: '42-b', text: "Indamay qo'ya qolaman, bilmaganga olaman", score: 40, isRecommended: false, explanation: "Rahbarlik nazorati yo'qoladi." },
      { id: '42-c', text: "Lichkasiga yozib, xatosini madaniyatli tushuntiraman", score: 100, isRecommended: true, explanation: "Etika qoidasi: Maqtov jamoada, tanqid yakkama-yakka." }
    ]
  },
  {
    id: 'det-3', caseNumber: 43, targetIndicator: 'digital_ethics',
    title: "Ma'lumot tarqalishi", context: "Boshqa MTT rahbari sizdan bir xodimingiz maoshini so'radi.",
    situation: "Telegramdan kelgan ushbu savolga nima deysiz?",
    options: [
      { id: '43-a', text: "Suratga tushirib tashlab beraman", score: 10, isRecommended: false, explanation: "Shaxsiy moliyaviy ma'lumotlarni tarqatish qonunan taqiqlangan." },
      { id: '43-b', text: "Taxminiy raqam aytib yuboraman", score: 40, isRecommended: false, explanation: "Etikaga zid." },
      { id: '43-c', text: "Bu maxfiy ma'lumot ekanligini, xodimning roziligisiz bera olmasligimni xushmuomalalik bilan tushuntiraman", score: 100, isRecommended: true, explanation: "Korporativ etika va ma'lumotlar maxfiyligini saqlash." }
    ]
  },
  {
    id: 'det-4', caseNumber: 44, targetIndicator: 'digital_ethics',
    title: "Xodim haqida shikoyat", context: "Ota-ona Telegram guruhda tarbiyachi haqida shikoyat yozdi.",
    situation: "Guruhda qanday munosabat bildirasiz?",
    options: [
      { id: '44-a', text: "Guruhda ota-onani qo'llab-quvvatlab tarbiyachini tanqid qilaman", score: 10, isRecommended: false, explanation: "Xodimni jamoat oldida kamsitish — etikaga zid." },
      { id: '44-b', text: "Guruhda 'bu yerda bunday masalalar muhokama qilinmaydi' deb yozaman", score: 50, isRecommended: false, explanation: "Qisman to'g'ri, lekin muammo hal qilinmaydi." },
      { id: '44-c', text: "Ota-onaga lichkada yozib, masalani shaxsan ko'rib chiqishimni va'da qilaman", score: 100, isRecommended: true, explanation: "Ikkala tomonning huquqlari himoya qilinadi." }
    ]
  },
  {
    id: 'det-5', caseNumber: 45, targetIndicator: 'digital_ethics',
    title: "Shaxsiy telefon ishlatish", context: "Ish vaqtida tarbiyachi shaxsiy telefonida ijtimoiy tarmoqlarda o'tiryapti.",
    situation: "Qanday chora ko'rasiz?",
    options: [
      { id: '45-a', text: "Telefonini olib qo'yaman", score: 15, isRecommended: false, explanation: "Huquqiy jihatdan noto'g'ri — shaxsiy mulkka tajovuz." },
      { id: '45-b', text: "Hech narsa demayman, hammaning o'z ishi", score: 30, isRecommended: false, explanation: "Bolalar xavfsizligi va ta'lim sifatiga zid." },
      { id: '45-c', text: "Ichki tartibga telefondan foydalanish qoidasini kiritib, barcha xodimlarga tushuntiraman", score: 100, isRecommended: true, explanation: "Tizimli va adolatli yondashuv — qoida asosida boshqarish." }
    ]
  },

  // ====================================================================
  // 10. lms_navigation — LMS navigatsiyasi (5 ta savol)
  // ====================================================================
  {
    id: 'lms-1', caseNumber: 46, targetIndicator: 'lms_navigation',
    title: "Vazirlik portali", context: "Bolalarni tizimdan navbatdan olish.",
    situation: "Tizim qanday ishlaydi deb so'rashganda:",
    options: [
      { id: '46-a', text: "Doim boshqalarga qildiraman, o'zim tushunmayman", score: 20, isRecommended: false, explanation: "Direktor tizimdan o'zi foydalana olishi shart." },
      { id: '46-b', text: "Parolimni metodistga berib qo'yganman, o'sha kiradi", score: 30, isRecommended: false, explanation: "Xavfsizlik qoidasi buzilgan va mustaqillik yo'q." },
      { id: '46-c', text: "Shaxsiy ERIm (kalit) orqali tizimga o'zim kirib amallarni bajaraman", score: 100, isRecommended: true, explanation: "Elektron Hukumat tizimlari bilan ishlash ko'nikmasi shakllangan." }
    ]
  },
  {
    id: 'lms-2', caseNumber: 47, targetIndicator: 'lms_navigation',
    title: "Platformani yangilash", context: "ERP tizimida yangi oyna qo'shildi, nima qilishni bilmayapsiz.",
    situation: "Shu vaziyatdagi yo'lingiz:",
    options: [
      { id: '47-a', text: "Tizim buzilibdi deb tashlab qo'yaman", score: 20, isRecommended: false, explanation: "Texnofobiya belgisi." },
      { id: '47-b', text: "Ertasi kuni vazirlikka qo'ng'iroq qilib urishaman", score: 40, isRecommended: false, explanation: "Noto'g'ri kommunikatsiya." },
      { id: '47-c', text: "Tizimdagi 'Yo'riqnoma' (Help) tugmasini bosib, yangilanish bilan tanishaman", score: 100, isRecommended: true, explanation: "Interfeys navigatsiyasi va o'rganish ko'nikmasi mavjud." }
    ]
  },
  {
    id: 'lms-3', caseNumber: 48, targetIndicator: 'lms_navigation',
    title: "Xodimlar ma'lumotlari", context: "O'qituvchilar bazasiga malaka oshirish guvohnomalarini biriktirish kerak.",
    situation: "Qanday amalga oshirasiz?",
    options: [
      { id: '48-a', text: "Qog'oz ko'piyalarni papkada yig'ib yuraman", score: 25, isRecommended: false, explanation: "Tizimdan foydalanilmadi." },
      { id: '48-b', text: "Hammasini faylga yig'ib telegramda metodistga tashlayman", score: 45, isRecommended: false, explanation: "Vazifani o'zgalarga asossiz yuklash." },
      { id: '48-c', text: "LMS tizimidagi 'Xodimlar portfoliosi' menyusidan PDF fayllarni biriktirib chiqaman", score: 100, isRecommended: true, explanation: "Elektron tizimni 100% to'g'ri qo'llash." }
    ]
  },
  {
    id: 'lms-4', caseNumber: 49, targetIndicator: 'lms_navigation',
    title: "Attestatsiya tizimi", context: "Tarbiyachilarni attestatsiyadan o'tkazish uchun hujjatlar tizimga kiritilishi kerak.",
    situation: "Jarayonni qanday boshqarasiz?",
    options: [
      { id: '49-a', text: "Metodistga topshiraman, o'sha kiritib beradi", score: 30, isRecommended: false, explanation: "Direktor sifatida mas'uliyat o'zida — delegatsiya sababsiz." },
      { id: '49-b', text: "Qog'ozda hujjatlarni to'plab, faqat oxirida tizimga kiritaman", score: 50, isRecommended: false, explanation: "Oxirgi daqiqada shoshilish — xatoliklarga olib keladi." },
      { id: '49-c', text: "Har tarbiyachi uchun tizimda bosqichma-bosqich hujjatlarni kiritib, jarayonni monitoring qilaman", score: 100, isRecommended: true, explanation: "LMS navigatsiyasi va tizimli boshqaruv." }
    ]
  },
  {
    id: 'lms-5', caseNumber: 50, targetIndicator: 'lms_navigation',
    title: "Elektron ariza", context: "Ota-onalardan elektron ariza qabul qilish tizimiga o'tish kerak.",
    situation: "Jarayonni qanday tashkil qilasiz?",
    options: [
      { id: '50-a', text: "Faqat qog'oz ariza qabul qilishda davom etaman", score: 15, isRecommended: false, explanation: "Zamonaviy talablarga javob bermaydi." },
      { id: '50-b', text: "Google Forms orqali ariza qabul qilaman, lekin tizimga kiritmay qoldiraman", score: 50, isRecommended: false, explanation: "Yarim raqamli — rasmiy tizimdagi integratsiya yetishmaydi." },
      { id: '50-c', text: "ERP tizimidagi rasmiy elektron ariza menyusidan foydalanib, jarayonni to'liq onlayn boshqaraman", score: 100, isRecommended: true, explanation: "To'liq raqamli boshqaruv — LMS navigatsiyasi yuqori." }
    ]
  },

  // ====================================================================
  // 11. digital_troubleshooting — Muammolarni hal etish (5 ta savol)
  // ====================================================================
  {
    id: 'dtr-1', caseNumber: 51, targetIndicator: 'digital_troubleshooting',
    title: "Internet uzilishi", context: "Topshiriqni yuborayotganingizda internet o'chib qoldi.",
    situation: "Nima qilasiz?",
    options: [
      { id: '51-a', text: "Asabiylashib kompyuterni o'chirib qo'yaman", score: 15, isRecommended: false, explanation: "Stressga berilish." },
      { id: '51-b', text: "Provayder ustidan darhol shikoyat yozaman", score: 40, isRecommended: false, explanation: "Vaziyatni o'rganmay turib emotsional xulosa." },
      { id: '51-c', text: "Router va kabellarni tekshirib, kerak bo'lsa telefon orqali hotspot tarqatib ishni bitiraman", score: 100, isRecommended: true, explanation: "Amaliy muammo yechish (Troubleshooting) ko'nikmasi." }
    ]
  },
  {
    id: 'dtr-2', caseNumber: 52, targetIndicator: 'digital_troubleshooting',
    title: "Printer ishlamay qoldi", context: "Hujjat chop etish kerak, printer qog'ozni olmayapti.",
    situation: "Birinchi qadamingiz nima?",
    options: [
      { id: '52-a', text: "Yangi printer sotib olishga buyurtma beraman", score: 10, isRecommended: false, explanation: "Moliyaviy isrofgarchilik." },
      { id: '52-b', text: "Boshqa ishchini chaqirib qildiraman", score: 45, isRecommended: false, explanation: "Kichik narsalarda ham o'zgalarga qaramlik." },
      { id: '52-c', text: "Printer ekranini o'qib ko'raman (Qog'oz qisilishi yoki kraska tugagani ehtimoli)", score: 100, isRecommended: true, explanation: "Muammoga texnik yondashuv va mustaqil tahlil." }
    ]
  },
  {
    id: 'dtr-3', caseNumber: 53, targetIndicator: 'digital_troubleshooting',
    title: "Dastur qotib qolishi", context: "Kompyuterda birdaniga hamma narsa qotib qoldi (zavisat).",
    situation: "Qanday chora ko'rasiz?",
    options: [
      { id: '53-a', text: "Zetkani sug'urib tashlab o'chiraman", score: 15, isRecommended: false, explanation: "Qattiq disk (Xotira) kuyishi mumkin." },
      { id: '53-b', text: "Usta kelguncha kutib o'tiraman", score: 35, isRecommended: false, explanation: "Vaqtni yo'qotish." },
      { id: '53-c', text: "Ctrl+Alt+Delete orqali Task Manager (Vazifalar menejeri)ni ochib, qotib qolgan dasturni to'xtataman", score: 100, isRecommended: true, explanation: "Kompyuter savodxonligining asosi." }
    ]
  },
  {
    id: 'dtr-4', caseNumber: 54, targetIndicator: 'digital_troubleshooting',
    title: "Proyektor ishlamayapti", context: "Ota-onalar yig'ilishi boshlanishiga 10 daqiqa qoldi, proyektor kompyuterni ko'rsatmayapti.",
    situation: "Nima qilasiz?",
    options: [
      { id: '54-a', text: "Proyektorsiz, faqat og'zaki gaplashaman", score: 30, isRecommended: false, explanation: "Taqdimot samarasiz bo'ladi." },
      { id: '54-b', text: "IT ustani chaqiraman, kutamiz", score: 40, isRecommended: false, explanation: "Vaqt yo'qoladi, usta kech kelishi mumkin." },
      { id: '54-c', text: "HDMI kabelni tekshiraman, kompyuter ekran sozlamasidan proyektor rejimini yoqaman (Win+P)", score: 100, isRecommended: true, explanation: "Oddiy texnik diagnostika bilan mustaqil yechim topish." }
    ]
  },
  {
    id: 'dtr-5', caseNumber: 55, targetIndicator: 'digital_troubleshooting',
    title: "Parol esdan chiqdi", context: "ERP tizimga kirish parolingiz esdan chiqdi.",
    situation: "Nima qilasiz?",
    options: [
      { id: '55-a', text: "Yangi hisob ochishni so'rayman", score: 15, isRecommended: false, explanation: "Eski ma'lumotlar yo'qoladi, keraksiz murakkablik." },
      { id: '55-b', text: "Kimningdir parolini ishlatib kiraman", score: 10, isRecommended: false, explanation: "Xavfsizlik qoidalarining jiddiy buzilishi." },
      { id: '55-c', text: "Parolni tiklash (Forgot Password) funksiyasini ishlataman yoki admin bilan bog'lanaman", score: 100, isRecommended: true, explanation: "Standart va xavfsiz tiklash jarayoni." }
    ]
  },

  // ====================================================================
  // 12. continuous_digital_learning — Uzluksiz raqamli o'rganish (5 ta savol)
  // ====================================================================
  {
    id: 'cdl-1', caseNumber: 56, targetIndicator: 'continuous_digital_learning',
    title: "Yangi texnologiya", context: "Vazirlik yangi elektron jurnali dasturini ishga tushirdi.",
    situation: "Unga munosabatingiz:",
    options: [
      { id: '56-a', text: "Eskisi yaxshi edi deb, yangisini o'rganishdan qochaman", score: 20, isRecommended: false, explanation: "O'zgarishlarga qarshilik." },
      { id: '56-b', text: "Faqat buyruq kelsagina zo'rg'a o'rganaman", score: 50, isRecommended: false, explanation: "Passiv yondashuv." },
      { id: '56-c', text: "Dasturning video-qo'llanmalarini topib, qiziqish bilan mustaqil o'rganib chiqaman", score: 100, isRecommended: true, explanation: "Uzluksiz ta'lim (Lifelong learning) belgisi." }
    ]
  },
  {
    id: 'cdl-2', caseNumber: 57, targetIndicator: 'continuous_digital_learning',
    title: "IT-vebinar", context: "Shanba kuni 'Ta'limda Sun'iy Intellekt' mavzusida ochiq onlayn dars bo'lyapti.",
    situation: "Ishtirok etasizmi?",
    options: [
      { id: '57-a', text: "Menga buning umuman keragi yo'q", score: 15, isRecommended: false, explanation: "Zamondan ortda qolish." },
      { id: '57-b', text: "Kimdir majburlasa kirib o'tiraman", score: 45, isRecommended: false, explanation: "Qiziqish yo'q, vaqt zoye ketadi." },
      { id: '57-c', text: "Albatta, 1 soat vaqtimni ajratib yangi bilimlarni qayd qilib olaman", score: 100, isRecommended: true, explanation: "Shaxsiy rivojlanishga sarmoya." }
    ]
  },
  {
    id: 'cdl-3', caseNumber: 58, targetIndicator: 'continuous_digital_learning',
    title: "O'zaro tajriba almashish", context: "Boshqa tumandagi direktor ajoyib elektron hisobot formulasini o'ylab topibdi.",
    situation: "Bunga reaksiyangiz:",
    options: [
      { id: '58-a', text: "O'zini ko'rsatyapti deya, e'tibor bermayman", score: 25, isRecommended: false, explanation: "Professional hasad, rivojlanishga to'sqinlik qiladi." },
      { id: '58-b', text: "Faqat o'z tizimim bilan qolaman", score: 45, isRecommended: false, explanation: "Tajriba almashinuvisiz turg'unlik keladi." },
      { id: '58-c', text: "U bilan bog'lanib, formulasini o'rganaman va o'z amaliyotimga ham tatbiq etib ko'raman", score: 100, isRecommended: true, explanation: "Kollaboratsiya va ochiq fikrlilik." }
    ]
  },
  {
    id: 'cdl-4', caseNumber: 59, targetIndicator: 'continuous_digital_learning',
    title: "YouTube orqali o'rganish", context: "Yangi Excel formulalari haqida YouTube'da video topdingiz.",
    situation: "Nima qilasiz?",
    options: [
      { id: '59-a', text: "Vaqtim yo'q, ko'rmay qo'yaman", score: 20, isRecommended: false, explanation: "15 daqiqalik o'rganish vaqtini ajratmaslik — sababsiz." },
      { id: '59-b', text: "Ko'raman, lekin amaliyotga tatbiq qilmayman", score: 50, isRecommended: false, explanation: "Bilim ortadi, lekin ko'nikma shakllanmaydi." },
      { id: '59-c', text: "Ko'rib, o'sha kuni ish jadvalimga tatbiq etib mashq qilaman", score: 100, isRecommended: true, explanation: "Ko'rish + amaliyot = chinakam o'rganish." }
    ]
  },
  {
    id: 'cdl-5', caseNumber: 60, targetIndicator: 'continuous_digital_learning',
    title: "Raqamli malaka oshirish", context: "Tuman XTB raqamli ko'nikmalar bo'yicha 3 kunlik kurs taklif qilyapti.",
    situation: "Qatnashasizmi?",
    options: [
      { id: '60-a', text: "Vaqtim yo'q, ish ko'p deb rad etaman", score: 20, isRecommended: false, explanation: "Rivojlanish imkoniyatini boy berish." },
      { id: '60-b', text: "Metodistni yuboraman, o'zi o'rganib kelsin", score: 45, isRecommended: false, explanation: "Direktor o'zi ham o'rganishi shart." },
      { id: '60-c', text: "Qatnashib, o'rgangan bilimlarimni jamoaga ham o'rgataman", score: 100, isRecommended: true, explanation: "Uzluksiz o'rganish va bilimni tarqatish — ideal model." }
    ]
  },
];
