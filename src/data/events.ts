export interface TimelineMedia {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  caption: string;
  aspectRatio: "wide" | "square" | "tall";
}

export interface TimelineStat {
  label: string;
  value: string;
}

export interface StackCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
}

export interface TimelineEvent {
  id: string;
  slug: string;
  date: string; // e.g., "نوفمبر 1998"
  year: string; // "1998" to "2025"
  location: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  previewImages: string[];
  stats?: TimelineStat[];
  media: TimelineMedia[];
  stackCards: StackCard[];
}

// Curated high-resolution Unsplash heritage, archival, architectural, manuscript, and culture images
const ARCHIVE_IMAGES = [
  "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1590076212472-ba0e30372132?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=1400&q=80",
];

const RAW_EVENTS_META = [
  {
    year: "1998",
    date: "أبريل 1998",
    location: "القاهرة، دار الوثائق القومية",
    title: "التأسيس وانطلاق المسار التوثيقي الموحد",
    subtitle: "إعلان مشروع حصر التراث التاريخي والمخطوطات النادرة",
    description:
      "شهد عام 1998 الاجتماع التأسيسي الأول الذي وحّد جهود المؤرخين والباحثين لحصر المخطوطات والوثائق المتفرقة في العالم العربي، ووضع القواعد العلمية للفهرسة المشتركة.",
    stats: [
      { label: "دولة مشاركة", value: "12" },
      { label: "وثيقة مفهرسة", value: "1,850" },
    ],
  },
  {
    year: "1999",
    date: "سبتمبر 1999",
    location: "الرباط، المغرب",
    title: "تدشين مجمع الرقمنة الأول للمخطوطات",
    subtitle: "إدخال أجهزة المسح الضوئي الميكروفيلمي البارد",
    description:
      "انطلاق أول وحدة متخصصة لتحويل الوثائق الورقية القديمة إلى نسخ رقمية غير مضغوطة للحفاظ عليها من الرطوبة والعوامل المناخية.",
    stats: [
      { label: "ساعة مسح رقمي", value: "14,000" },
      { label: "مجلد تاريخي معالج", value: "920" },
    ],
  },
  {
    year: "2000",
    date: "يناير 2000",
    location: "الرياض، المملكة العربية السعودية",
    title: "مطلع الألفية: بنك الذاكرة البصرية والشفاهية",
    subtitle: "توثيق الروايات الشفاهية لكبار الرواة والمعمرين",
    description:
      "إطلاق حملة ميدانية كبرى لتسجيل المقابلات الصوتية والأهازيج الشعبية والتاريخ الشفاهي للحرف التقليدية وتوثيقها بملفات سمعية فائقة النقاء.",
    stats: [
      { label: "مقابلة مسجلة", value: "3,400" },
      { label: "باحث ميداني", value: "45" },
    ],
  },
  {
    year: "2001",
    date: "نوفمبر 2001",
    location: "دمشق، سوريا",
    title: "المختبر الكيميائي لترميم الأحبار والرقوق",
    subtitle: "تقنيات تدعيم الورق بحرير الكوزو الطبيعي",
    description:
      "تأسيس أول مختبر إقليمي لترميم الرقوق القرآنية والمصنفات العلمية القديمة دون الإضرار بالأحبار الكربونية والحديدية التاريخية.",
    stats: [
      { label: "رق أثري تم ترميمه", value: "2,150" },
      { label: "خبير مرمم مؤهل", value: "80" },
    ],
  },
  {
    year: "2002",
    date: "يونيو 2002",
    location: "فاس، المغرب",
    title: "مسح العمارة الأندلسية والزخارف الجصية",
    subtitle: "أكبر بعثة رفع معماري وهندسي للمساجد العتيقة",
    description:
      "توثيق تفاصيل الزخارف الجصية والفسيفساء الخزفية (الزليج) والمقرنصات الخشبية في فاس ومراكش باستخدام ألواح فوتوغرافية عريضة.",
    stats: [
      { label: "لوح فوتوغرافي", value: "6,800" },
      { label: "موقع أثري موثق", value: "38" },
    ],
  },
  {
    year: "2003",
    date: "مارس 2003",
    location: "عمان، الأردن",
    title: "الأرشيف الصحفي وتوثيق الصحافة المبكرة",
    subtitle: "حفظ الدوريات والصحف الصادرة بين 1880 و1950",
    description:
      "فهرسة وتصوير آلاف الأعداد من أوائل الجرائد والمجلات الأدبية والسياسية التي شكّلت بدايات النهضة الفكرية في بلاد الشام ومصر.",
    stats: [
      { label: "عدد صحفي مؤرشف", value: "42,000" },
      { label: "عنوان دورية", value: "190" },
    ],
  },
  {
    year: "2004",
    date: "أكتوبر 2004",
    location: "الكويت",
    title: "أطلس الملاحة والتراث البحري الخليجي",
    subtitle: "جمع وثائق النواخذة ومسارات الغوص واللؤلؤ",
    description:
      "إصدار الأطلس الوثائقي المتكامل لصناعة السفن الخشبية التراثية (البوم والسنبوك) ويوميات رحلات الغوص على اللؤلؤ وخرائط المغاصات.",
    stats: [
      { label: "خريطة ملاحية", value: "140" },
      { label: "وثيقة تجارية أصلية", value: "1,200" },
    ],
  },
  {
    year: "2005",
    date: "ديسمبر 2005",
    location: "تونس العاصمة",
    title: "مؤتمر صون التراث الزيتوني وتاريخ القيروان",
    subtitle: "استعادة المخطوطات الفقهية والفلسفية النادرة",
    description:
      "توقيع اتفاقية الفهرسة الموحدة لخزائن جامع الزيتونة ومكتبات القيروان، ورقمنة فهارس أمهات الكتب في العلوم الطبيعية واللغوية.",
    stats: [
      { label: "مجلد محقق", value: "1,450" },
      { label: "مؤسسة شريكة", value: "24" },
    ],
  },
];

// Assemble full TimelineEvents from 1998 to 2005 (8 years)
export const timelineEvents: TimelineEvent[] = RAW_EVENTS_META.map(
  (raw, idx) => {
    const img1 = ARCHIVE_IMAGES[idx % ARCHIVE_IMAGES.length];
    const img2 = ARCHIVE_IMAGES[(idx + 3) % ARCHIVE_IMAGES.length];
    const img3 = ARCHIVE_IMAGES[(idx + 7) % ARCHIVE_IMAGES.length];
    const img4 = ARCHIVE_IMAGES[(idx + 11) % ARCHIVE_IMAGES.length];

    const stackCards: StackCard[] = [
      {
        id: `card-${raw.year}-1`,
        title: raw.title,
        subtitle: raw.subtitle,
        image: img1,
        tag: "الحدث المفصلي",
      },
      {
        id: `card-${raw.year}-2`,
        title: "الوثيقة والسجل التاريخي",
        subtitle: `تفاصيل المحفوظات الرسمية في ${raw.location}`,
        image: img2,
        tag: "وثيقة أصلية",
      },
      {
        id: `card-${raw.year}-3`,
        title: "الشواهد البصرية والميدانية",
        subtitle: "لقطات مصورة توثق الأثر والعمل الميداني",
        image: img3,
        tag: "صورة أرشيفية",
      },
      {
        id: `card-${raw.year}-4`,
        title: "الأثر المعرفي والامتداد",
        subtitle: "المخرجات العلمية وقواعد البيانات الناتجة",
        image: img4,
        tag: "تقرير تحليلي",
      },
    ];

    return {
      id: `evt-${raw.year}`,
      slug: `station-${raw.year}`,
      year: raw.year,
      date: raw.date,
      location: raw.location,
      title: raw.title,
      subtitle: raw.subtitle,
      description: raw.description,
      coverImage: img1,
      previewImages: [img2, img3, img4],
      stats: raw.stats,
      stackCards,
      media: [
        {
          id: `m-${raw.year}-1`,
          type: "image",
          url: img1,
          caption: `${raw.title} — الصورة الأرشيفية المعتمدة`,
          aspectRatio: "wide",
        },
        {
          id: `m-${raw.year}-2`,
          type: "image",
          url: img2,
          caption: `وثيقة ملحقة من محفوظات عام ${raw.year}`,
          aspectRatio: "square",
        },
        {
          id: `m-${raw.year}-3`,
          type: "video",
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          thumbnail: img3,
          caption: `مشاهد وثائقية مرئية نادرة لعام ${raw.year}`,
          aspectRatio: "wide",
        },
      ],
    };
  }
);
