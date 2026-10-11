/**
 * Vedic Panchang Calculation Engine
 * Calculates Vara, Tithi, Nakshatra, Rahu Kalam, and Abhijit Muhurtam client-side.
 */

export interface PanchangInfo {
  date: string;
  dayName: string;
  dayTelugu: string;
  presidingDeity: string;
  deityCategory: string;
  tithi: {
    name: string;
    paksha: "Shukla" | "Krishna";
    telugu: string;
  };
  nakshatra: {
    name: string;
    telugu: string;
  };
  rahuKalam: string;
  abhijitMuhurtam: string;
  recommendedStotra: {
    deity: string;
    titleEnglish: string;
    titleTelugu: string;
    slug: string;
    description: string;
  };
}

const TITHIS = [
  { name: "Pratipada", telugu: "పాడ్యమి" },
  { name: "Dwitiya", telugu: "విదియ" },
  { name: "Tritiya", telugu: "తదియ" },
  { name: "Chaturthi", telugu: "చవితి" },
  { name: "Panchami", telugu: "పంచమి" },
  { name: "Shashti", telugu: "షష్ఠి" },
  { name: "Saptami", telugu: "సప్తమి" },
  { name: "Ashtami", telugu: "అష్టమి" },
  { name: "Navami", telugu: "నవమి" },
  { name: "Dashami", telugu: "దశమి" },
  { name: "Ekadashi", telugu: "ఏకాదశి" },
  { name: "Dvadashi", telugu: "ద్వాదశి" },
  { name: "Trayodashi", telugu: "త్రయోదశి" },
  { name: "Chaturdashi", telugu: "చతుర్దశి" },
  { name: "Purnima", telugu: "పూర్ణిమ" },
  { name: "Pratipada", telugu: "పాడ్యమి" },
  { name: "Dwitiya", telugu: "విదియ" },
  { name: "Tritiya", telugu: "తదియ" },
  { name: "Chaturthi", telugu: "చవితి" },
  { name: "Panchami", telugu: "పంచమి" },
  { name: "Shashti", telugu: "షష్ఠి" },
  { name: "Saptami", telugu: "సప్తమి" },
  { name: "Ashtami", telugu: "అష్టమి" },
  { name: "Navami", telugu: "నవమి" },
  { name: "Dashami", telugu: "దశమి" },
  { name: "Ekadashi", telugu: "ఏకాదశి" },
  { name: "Dvadashi", telugu: "ద్వాదశి" },
  { name: "Trayodashi", telugu: "త్రయోదశి" },
  { name: "Chaturdashi", telugu: "చతుర్దశి" },
  { name: "Amavasya", telugu: "అమావాస్య" },
];

const NAKSHATRAS = [
  { name: "Ashwini", telugu: "అశ్విని" },
  { name: "Bharani", telugu: "భరణి" },
  { name: "Krittika", telugu: "కృత్తిక" },
  { name: "Rohini", telugu: "రోహిణి" },
  { name: "Mrigashira", telugu: "మృగశిర" },
  { name: "Arudra", telugu: "ఆరుద్ర" },
  { name: "Punarvasu", telugu: "పునర్వసు" },
  { name: "Pushya", telugu: "పుష్యమి" },
  { name: "Ashlesha", telugu: "ఆశ్లేష" },
  { name: "Magha", telugu: "మఖ" },
  { name: "Purva Phalguni", telugu: "పూర్వఫల్గుణి (పుబ్బ)" },
  { name: "Uttara Phalguni", telugu: "ఉత్తరఫల్గుణి (ఉత్తర)" },
  { name: "Hasta", telugu: "హస్త" },
  { name: "Chitra", telugu: "చిత్త" },
  { name: "Swati", telugu: "స్వాతి" },
  { name: "Vishakha", telugu: "విశాఖ" },
  { name: "Anuradha", telugu: "అనూరాధ" },
  { name: "Jyeshtha", telugu: "జ్యేష్ఠ" },
  { name: "Mula", telugu: "మూల" },
  { name: "Purva Ashadha", telugu: "పూర్వాషాఢ" },
  { name: "Uttara Ashadha", telugu: "ఉత్తరాషాఢ" },
  { name: "Shravana", telugu: "శ్రవణం" },
  { name: "Dhanishta", telugu: "ధనిష్ఠ" },
  { name: "Shatabhisha", telugu: "శతభిషం" },
  { name: "Purva Bhadrapada", telugu: "పూర్వాభాద్ర" },
  { name: "Uttara Bhadrapada", telugu: "ఉత్తరాభాద్ర" },
  { name: "Revati", telugu: "రేవతి" },
];

const WEEKDAY_DEITIES = [
  {
    day: "Sunday",
    telugu: "ఆదివారము",
    deity: "Surya Bhagavan",
    cat: "surya",
    slug: "aditya-hrudayam",
    titleEnglish: "Aditya Hrudayam",
    titleTelugu: "ఆదిత్య హృదయం",
    description: "Chant for vitality, confidence, radiant health, and divine brilliance on the Sun's day.",
    rahu: "04:30 PM – 06:00 PM",
  },
  {
    day: "Monday",
    telugu: "సోమవారము",
    deity: "Lord Shiva",
    cat: "shiva",
    slug: "shiva-panchakshari-stotram",
    titleEnglish: "Shiva Panchakshari Stotram",
    titleTelugu: "శ్రీ శివ పంచాక్షరీ స్తోత్రం",
    description: "Sacred hymn dedicated to Lord Shiva to bestow peace of mind and liberation.",
    rahu: "07:30 AM – 09:00 AM",
  },
  {
    day: "Tuesday",
    telugu: "మంగళవారము",
    deity: "Lord Hanuman",
    cat: "hanuman",
    slug: "hanuman-chalisa",
    titleEnglish: "Sri Hanuman Chalisa",
    titleTelugu: "శ్రీ హనుమాన్ చాలీసా",
    description: "Chanted on Tuesday for invincibility, courage, protection, and dispelling fear.",
    rahu: "03:00 PM – 04:30 PM",
  },
  {
    day: "Wednesday",
    telugu: "బుధవారము",
    deity: "Lord Ganesha",
    cat: "ganesha",
    slug: "ganesha-pancharatnam",
    titleEnglish: "Sri Ganesha Pancharatnam",
    titleTelugu: "శ్రీ గణేశ పంచరత్న స్తోత్రం",
    description: "Remove obstacles, invoke intellect (Buddhi), and attract auspicious beginnings.",
    rahu: "12:00 PM – 01:30 PM",
  },
  {
    day: "Thursday",
    telugu: "గురువారము",
    deity: "Guru & Dattatreya",
    cat: "guru",
    slug: "guru-paduka-stotram",
    titleEnglish: "Sri Guru Paduka Stotram",
    titleTelugu: "శ్రీ గురు పాదుకా స్తోత్రం",
    description: "Salutations to the holy lotus feet of Sadguru for wisdom, spiritual progress, and grace.",
    rahu: "01:30 PM – 03:00 PM",
  },
  {
    day: "Friday",
    telugu: "శుక్రవారము",
    deity: "Goddess Mahalakshmi",
    cat: "lakshmi",
    slug: "maha-lakshmi-ashtakam",
    titleEnglish: "Maha Lakshmi Ashtakam",
    titleTelugu: "మహాలక్ష్మ్యష్టకం",
    description: "Invoke abundance, auspicious harmony, wealth, and inner contentment on Friday.",
    rahu: "10:30 AM – 12:00 PM",
  },
  {
    day: "Saturday",
    telugu: "శనివారము",
    deity: "Sri Venkateshwara Swami",
    cat: "venkateshwara",
    slug: "sri-venkateswara-suprabhatam",
    titleEnglish: "Sri Venkateswara Suprabhatam",
    titleTelugu: "శ్రీ వేంకటేశ్వర సుప్రభాతం",
    description: "Awaken to the divine presence of Lord Srinivasa for relief from hardships and blessings.",
    rahu: "09:00 AM – 10:30 AM",
  },
];

/**
 * Astronomical calculation for today's Panchang
 */
export function calculatePanchang(targetDate: Date = new Date()): PanchangInfo {
  const dayIdx = targetDate.getDay();
  const weekday = WEEKDAY_DEITIES[dayIdx];

  // Julian date calculation for solar and lunar position approximation
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();

  // Reference epoch (Jan 1, 2000 12:00 UTC)
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  const d = jdn - 2451545.0; // days since J2000.0

  // Mean Solar Longitude (Sun)
  const sunMean = (280.46 + 0.9856474 * d) % 360;
  // Mean Lunar Longitude (Moon)
  const moonMean = (218.316 + 13.176396 * d) % 360;

  // Normalized angles
  const sunLong = (sunMean + 360) % 360;
  const moonLong = (moonMean + 360) % 360;

  // Tithi calculation: (Moon Longitude - Sun Longitude) / 12 degrees
  const angleDiff = (moonLong - sunLong + 360) % 360;
  const tithiIndex = Math.floor(angleDiff / 12) % 30;
  const tithiData = TITHIS[tithiIndex] || TITHIS[0];
  const paksha: "Shukla" | "Krishna" = tithiIndex < 15 ? "Shukla" : "Krishna";

  // Nakshatra calculation: Moon Longitude / (360 / 27) = Moon Longitude / 13.333333 degrees
  const nakshatraIndex = Math.floor(moonLong / (360 / 27)) % 27;
  const nakshatraData = NAKSHATRAS[nakshatraIndex] || NAKSHATRAS[0];

  return {
    date: targetDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    dayName: weekday.day,
    dayTelugu: weekday.telugu,
    presidingDeity: weekday.deity,
    deityCategory: weekday.cat,
    tithi: {
      name: tithiData.name,
      paksha,
      telugu: `${paksha === "Shukla" ? "శుక్ల పక్ష" : "కృష్ణ పక్ష"} ${tithiData.telugu}`,
    },
    nakshatra: {
      name: nakshatraData.name,
      telugu: nakshatraData.telugu,
    },
    rahuKalam: weekday.rahu,
    abhijitMuhurtam: "11:45 AM – 12:35 PM",
    recommendedStotra: {
      deity: weekday.deity,
      titleEnglish: weekday.titleEnglish,
      titleTelugu: weekday.titleTelugu,
      slug: weekday.slug,
      description: weekday.description,
    },
  };
}
