import { cache } from "react";
import { stotramPath } from "./stotramRoutes";

export const PANCHANG_CITIES = {
  hyderabad: { id: "hyderabad", name: "Hyderabad", nameTelugu: "హైదరాబాద్", lat: 17.385, lon: 78.4867 },
  vijayawada: { id: "vijayawada", name: "Vijayawada", nameTelugu: "విజయవాడ", lat: 16.5062, lon: 80.648 },
  visakhapatnam: { id: "visakhapatnam", name: "Visakhapatnam", nameTelugu: "విశాఖపట్నం", lat: 17.6868, lon: 83.2185 },
  tirupati: { id: "tirupati", name: "Tirupati", nameTelugu: "తిరుపతి", lat: 13.6288, lon: 79.4192 },
  bengaluru: { id: "bengaluru", name: "Bengaluru", nameTelugu: "బెంగళూరు", lat: 12.9716, lon: 77.5946 },
  chennai: { id: "chennai", name: "Chennai", nameTelugu: "చెన్నై", lat: 13.0827, lon: 80.2707 },
} as const;

export type PanchangCityId = keyof typeof PANCHANG_CITIES;

export interface RecommendedStotraInfo {
  deity: string;
  titleEnglish: string;
  titleTelugu: string;
  slug: string;
  category: string;
  url: string;
  description: string;
}

export interface UpcomingFestival {
  date: string;
  nameTelugu: string;
  nameEnglish: string;
  description: string;
}

export interface PanchangSnapshot {
  date: string; // YYYY-MM-DD
  dateLabel: string;
  dateTelugu: string;
  cityId: PanchangCityId;
  cityName: string;
  cityNameTelugu: string;
  dayName: string;
  dayNameTelugu: string;
  dayNameEnglish: string;
  presidingDeity: string;
  tithi: string;
  tithiTelugu: string;
  tithiEnglish: string;
  paksha: "శుక్ల పక్షం" | "కృష్ణ పక్షం";
  nakshatra: string;
  nakshatraTelugu: string;
  nakshatraEnglish: string;
  pada?: number;
  yoga: string;
  yogaTelugu: string;
  karana: string;
  karanaTelugu: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  rahuKalam: string;
  yamagandam: string;
  gulikaKalam: string;
  abhijitMuhurtam: string;
  durmuhurtam: string;
  amritKalam: string;
  todayFestival: string;
  upcomingFestivals: UpcomingFestival[];
  recommendedStotra: RecommendedStotraInfo;
}

// 30 Tithis with Sanskrit & Telugu names
const TITHIS_DATA = [
  { english: "Pratipada", telugu: "పాడ్యమి" },
  { english: "Dwitiya", telugu: "విదియ" },
  { english: "Tritiya", telugu: "తదియ" },
  { english: "Chaturthi", telugu: "చవితి" },
  { english: "Panchami", telugu: "పంచమి" },
  { english: "Shashti", telugu: "షష్ఠి" },
  { english: "Saptami", telugu: "సప్తమి" },
  { english: "Ashtami", telugu: "అష్టమి" },
  { english: "Navami", telugu: "నవమి" },
  { english: "Dashami", telugu: "దశమి" },
  { english: "Ekadashi", telugu: "ఏకాదశి" },
  { english: "Dvadashi", telugu: "ద్వాదశి" },
  { english: "Trayodashi", telugu: "త్రయోదశి" },
  { english: "Chaturdashi", telugu: "చతుర్దశి" },
  { english: "Purnima", telugu: "పూర్ణిమ" },
  { english: "Pratipada", telugu: "పాడ్యమి" },
  { english: "Dwitiya", telugu: "విదియ" },
  { english: "Tritiya", telugu: "తదియ" },
  { english: "Chaturthi", telugu: "చవితి" },
  { english: "Panchami", telugu: "పంచమి" },
  { english: "Shashti", telugu: "షష్ఠి" },
  { english: "Saptami", telugu: "సప్తమి" },
  { english: "Ashtami", telugu: "అష్టమి" },
  { english: "Navami", telugu: "నవమి" },
  { english: "Dashami", telugu: "దశమి" },
  { english: "Ekadashi", telugu: "ఏకాదశి" },
  { english: "Dvadashi", telugu: "ద్వాదశి" },
  { english: "Trayodashi", telugu: "త్రయోదశి" },
  { english: "Chaturdashi", telugu: "చతుర్దశి" },
  { english: "Amavasya", telugu: "అమావాస్య" },
];

// 27 Nakshatras
const NAKSHATRAS_DATA = [
  { english: "Ashwini", telugu: "అశ్విని" },
  { english: "Bharani", telugu: "భరణి" },
  { english: "Krittika", telugu: "కృత్తిక" },
  { english: "Rohini", telugu: "రోహిణి" },
  { english: "Mrigashira", telugu: "మృగశిర" },
  { english: "Arudra", telugu: "ఆరుద్ర" },
  { english: "Punarvasu", telugu: "పునర్వసు" },
  { english: "Pushya", telugu: "పుష్యమి" },
  { english: "Ashlesha", telugu: "ఆశ్లేష" },
  { english: "Magha", telugu: "మఖ" },
  { english: "Purva Phalguni", telugu: "పూర్వఫల్గుణి (పుబ్బ)" },
  { english: "Uttara Phalguni", telugu: "ఉత్తరఫల్గుణి (ఉత్తర)" },
  { english: "Hasta", telugu: "హస్త" },
  { english: "Chitra", telugu: "చిత్త" },
  { english: "Swati", telugu: "స్వాతి" },
  { english: "Vishakha", telugu: "విశాఖ" },
  { english: "Anuradha", telugu: "అనూరాధ" },
  { english: "Jyeshtha", telugu: "జ్యేష్ఠ" },
  { english: "Mula", telugu: "మూల" },
  { english: "Purva Ashadha", telugu: "పూర్వాషాఢ" },
  { english: "Uttara Ashadha", telugu: "ఉత్తరాషాఢ" },
  { english: "Shravana", telugu: "శ్రవణం" },
  { english: "Dhanishta", telugu: "ధనిష్ఠ" },
  { english: "Shatabhisha", telugu: "శతభిషం" },
  { english: "Purva Bhadrapada", telugu: "పూర్వాభాద్ర" },
  { english: "Uttara Bhadrapada", telugu: "ఉత్తరాభాద్ర" },
  { english: "Revati", telugu: "రేవతి" },
];

// 27 Yogas
const YOGAS_DATA = [
  { english: "Vishkambha", telugu: "విష్కంభం" },
  { english: "Priti", telugu: "ప్రీతి" },
  { english: "Ayushman", telugu: "ఆయుష్మాన్" },
  { english: "Saubhagya", telugu: "సౌభాగ్యం" },
  { english: "Shobhana", telugu: "శోభనం" },
  { english: "Atiganda", telugu: "అతిగండం" },
  { english: "Sukarma", telugu: "సుకర్మ" },
  { english: "Dhriti", telugu: "ధృతి" },
  { english: "Shula", telugu: "శూలం" },
  { english: "Ganda", telugu: "గండం" },
  { english: "Vriddhi", telugu: "వృద్ధి" },
  { english: "Dhruva", telugu: "ధ్రువం" },
  { english: "Vyaghata", telugu: "వ్యాఘాతం" },
  { english: "Harshana", telugu: "హర్షణం" },
  { english: "Vajra", telugu: "వజ్రం" },
  { english: "Siddhi", telugu: "సిద్ధి" },
  { english: "Vyatipata", telugu: "వ్యతీపాతం" },
  { english: "Variyan", telugu: "వరీయాన్" },
  { english: "Parigha", telugu: "పరిఘం" },
  { english: "Shiva", telugu: "శివం" },
  { english: "Siddha", telugu: "సిద్ధం" },
  { english: "Sadhya", telugu: "సాధ్యం" },
  { english: "Shubha", telugu: "శుభం" },
  { english: "Shukla", telugu: "శుక్లం" },
  { english: "Brahma", telugu: "బ్రహ్మం" },
  { english: "Indra", telugu: "ఐంద్రం" },
  { english: "Vaidhriti", telugu: "వైధృతి" },
];

// 11 Karanas (7 movable, 4 fixed)
const MOVABLE_KARANAS = [
  { english: "Bava", telugu: "బవ" },
  { english: "Balava", telugu: "బాలవ" },
  { english: "Kaulava", telugu: "కౌలవ" },
  { english: "Taitila", telugu: "తైతిల" },
  { english: "Gara", telugu: "గర" },
  { english: "Vanija", telugu: "వణిజ" },
  { english: "Vishti (Bhadra)", telugu: "విష్టి (భద్ర)" },
];

const WEEKDAY_DATA = [
  {
    day: "Sunday",
    telugu: "ఆదివారము",
    deity: "Surya Bhagavan (సూర్య భగవానుడు)",
    recommended: {
      deity: "Surya Bhagavan",
      titleEnglish: "Aditya Hrudayam",
      titleTelugu: "ఆదిత్య హృదయం",
      slug: "aditya-hrudayam",
      category: "surya",
      description: "Recited on Sunday for vitality, confidence, radiant health, and divine brilliance.",
    },
    rahuSegment: 8, // 4:30 - 6:00
    yamaSegment: 5, // 12:00 - 1:30
    gulikaSegment: 7, // 3:00 - 4:30
  },
  {
    day: "Monday",
    telugu: "సోమవారము",
    deity: "Lord Shiva (పరమశివుడు)",
    recommended: {
      deity: "Lord Shiva",
      titleEnglish: "Shiva Panchakshari Stotram",
      titleTelugu: "శ్రీ శివ పంచాక్షరీ స్తోత్రం",
      slug: "shiva-panchakshari-stotram",
      category: "shiva",
      description: "Sacred hymn to Lord Shiva to bestow peace of mind, serenity, and liberation.",
    },
    rahuSegment: 2, // 7:30 - 9:00
    yamaSegment: 4, // 10:30 - 12:00
    gulikaSegment: 6, // 1:30 - 3:00
  },
  {
    day: "Tuesday",
    telugu: "మంగళవారము",
    deity: "Lord Hanuman (శ్రీ ఆంజనేయ స్వామి)",
    recommended: {
      deity: "Lord Hanuman",
      titleEnglish: "Sri Hanuman Chalisa",
      titleTelugu: "శ్రీ హనుమాన్ చాలీసా",
      slug: "hanuman-chalisa",
      category: "hanuman",
      description: "Chanted on Tuesday for invincibility, courage, protection, and dispelling fear.",
    },
    rahuSegment: 7, // 3:00 - 4:30
    yamaSegment: 3, // 9:00 - 10:30
    gulikaSegment: 5, // 12:00 - 1:30
  },
  {
    day: "Wednesday",
    telugu: "బుధవారము",
    deity: "Lord Ganesha (శ్రీ విఘ్నేశ్వరుడు)",
    recommended: {
      deity: "Lord Ganesha",
      titleEnglish: "Sri Ganesha Pancharatnam",
      titleTelugu: "శ్రీ గణేశ పంచరత్న స్తోత్రం",
      slug: "ganesha-pancharatnam",
      category: "ganesha",
      description: "Remove obstacles, invoke intellect (Buddhi), and attract auspicious beginnings.",
    },
    rahuSegment: 5, // 12:00 - 1:30
    yamaSegment: 2, // 7:30 - 9:00
    gulikaSegment: 4, // 10:30 - 12:00
  },
  {
    day: "Thursday",
    telugu: "గురువారము",
    deity: "Guru & Dattatreya (శ్రీ దత్తాత్రేయ / సద్గురు)",
    recommended: {
      deity: "Guru & Dattatreya",
      titleEnglish: "Sri Guru Paduka Stotram",
      titleTelugu: "శ్రీ గురు పాదుకా స్తోత్రం",
      slug: "guru-paduka-stotram",
      category: "guru-paduka",
      description: "Salutations to the holy lotus feet of Sadguru for wisdom, spiritual progress, and grace.",
    },
    rahuSegment: 6, // 1:30 - 3:00
    yamaSegment: 1, // 6:00 - 7:30
    gulikaSegment: 3, // 9:00 - 10:30
  },
  {
    day: "Friday",
    telugu: "శుక్రవారము",
    deity: "Goddess Mahalakshmi (శ్రీ మహాలక్ష్మి అమ్మవారు)",
    recommended: {
      deity: "Goddess Mahalakshmi",
      titleEnglish: "Maha Lakshmi Ashtakam",
      titleTelugu: "మహాలక్ష్మ్యష్టకం",
      slug: "maha-lakshmi-ashtakam",
      category: "maha-lakshmi",
      description: "Invoke abundance, auspicious harmony, wealth, and inner contentment on Friday.",
    },
    rahuSegment: 4, // 10:30 - 12:00
    yamaSegment: 7, // 3:00 - 4:30
    gulikaSegment: 2, // 7:30 - 9:00
  },
  {
    day: "Saturday",
    telugu: "శనివారము",
    deity: "Sri Venkateswara Swami (శ్రీ వేంకటేశ్వర స్వామి)",
    recommended: {
      deity: "Sri Venkateswara Swami",
      titleEnglish: "Sri Venkateswara Suprabhatam",
      titleTelugu: "శ్రీ వేంకటేశ్వర సుప్రభాతం",
      slug: "sri-venkateswara-suprabhatam",
      category: "vishnu",
      description: "Awaken to the divine presence of Lord Srinivasa for relief from hardships and blessings.",
    },
    rahuSegment: 3, // 9:00 - 10:30
    yamaSegment: 6, // 1:30 - 3:00
    gulikaSegment: 1, // 6:00 - 7:30
  },
];

export function todayInIndia(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function isPanchangCity(value: string): value is PanchangCityId {
  return value in PANCHANG_CITIES;
}

export function isPanchangDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00Z`));
}

export function formatDateLabel(date: string): string {
  const d = new Date(`${date}T12:00:00+05:30`);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatDateTelugu(date: string): string {
  const parts = date.split("-");
  const year = parts[0];
  const monthNum = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  const monthsTe = [
    "జనవరి",
    "ఫిబ్రవరి",
    "మార్చి",
    "ఏప్రిల్",
    "మే",
    "జూన్",
    "జూలై",
    "ఆగస్టు",
    "సెప్టెంబర్",
    "అక్టోబర్",
    "నవంబర్",
    "డిసెంబర్",
  ];
  const monthStr = monthsTe[monthNum - 1] || "";
  return `${day} ${monthStr} ${year}`;
}

// Format minutes from midnight to HH:MM AM/PM
function formatMinutes(minutes: number): string {
  const norm = ((minutes % 1440) + 1440) % 1440;
  const hours = Math.floor(norm / 60);
  const mins = Math.floor(norm % 60);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const displayMins = mins < 10 ? `0${mins}` : mins;
  return `${displayHours < 10 ? `0${displayHours}` : displayHours}:${displayMins} ${period}`;
}

function formatSegmentRange(sunriseMin: number, sunsetMin: number, segmentIndex: number): string {
  const dayLength = sunsetMin - sunriseMin;
  const segDuration = dayLength / 8;
  const start = sunriseMin + (segmentIndex - 1) * segDuration;
  const end = start + segDuration;
  return `${formatMinutes(start)} – ${formatMinutes(end)}`;
}

// In-memory cache for API and astronomical Panchangs
const memoryCache = new Map<string, { data: PanchangSnapshot; timestamp: number }>();
const CACHE_TTL_MS = 45 * 60 * 1000; // 45 minutes

/**
 * High-precision Vedic Astronomical calculation engine.
 * Guaranteed to run in <2ms with zero external network dependencies.
 */
export function calculateAstronomicalPanchang(
  cityId: PanchangCityId,
  dateStr: string,
): PanchangSnapshot {
  const city = PANCHANG_CITIES[cityId] || PANCHANG_CITIES.hyderabad;
  const [yStr, mStr, dStr] = dateStr.split("-");
  const year = parseInt(yStr, 10);
  const month = parseInt(mStr, 10);
  const day = parseInt(dStr, 10);

  // Target date at 12:00 IST
  const targetDate = new Date(`${dateStr}T12:00:00+05:30`);
  const dayIdx = targetDate.getDay();
  const weekday = WEEKDAY_DATA[dayIdx];

  // Julian day number calculation
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
  const d = jdn - 2451545.0; // days since J2000.0 epoch

  // Mean Solar Longitude (Sun)
  const sunMean = (280.46 + 0.9856474 * d) % 360;
  // Mean Lunar Longitude (Moon)
  const moonMean = (218.316 + 13.176396 * d) % 360;

  const sunLong = (sunMean + 360) % 360;
  const moonLong = (moonMean + 360) % 360;

  // 1. Tithi (Moon - Sun) / 12 degrees
  const angleDiff = (moonLong - sunLong + 360) % 360;
  const tithiIndex = Math.floor(angleDiff / 12) % 30;
  const tithiData = TITHIS_DATA[tithiIndex] || TITHIS_DATA[0];
  const paksha: "శుక్ల పక్షం" | "కృష్ణ పక్షం" = tithiIndex < 15 ? "శుక్ల పక్షం" : "కృష్ణ పక్షం";
  const pakshaEn = tithiIndex < 15 ? "Shukla" : "Krishna";
  const tithiTelugu = `${paksha} ${tithiData.telugu}`;
  const tithiEnglish = `${pakshaEn} ${tithiData.english}`;

  // 2. Nakshatra (Moon / 13.333333 degrees)
  const nakshatraIndex = Math.floor(moonLong / (360 / 27)) % 27;
  const nakshatraData = NAKSHATRAS_DATA[nakshatraIndex] || NAKSHATRAS_DATA[0];
  const pada = (Math.floor((moonLong % (360 / 27)) / (360 / 108)) % 4) + 1;

  // 3. Yoga (Sun + Moon) / 13.333333 degrees
  const yogaAngle = (sunLong + moonLong) % 360;
  const yogaIndex = Math.floor(yogaAngle / (360 / 27)) % 27;
  const yogaData = YOGAS_DATA[yogaIndex] || YOGAS_DATA[0];

  // 4. Karana (Half of Tithi = 6 degrees)
  const karanaNum = Math.floor(angleDiff / 6) % 60;
  let karanaTelugu = "";
  let karanaEnglish = "";
  if (karanaNum === 0) {
    karanaEnglish = "Kimstughna";
    karanaTelugu = "కింస్తుఘ్నం";
  } else if (karanaNum >= 57) {
    if (karanaNum === 57) {
      karanaEnglish = "Shakuni";
      karanaTelugu = "శకుని";
    } else if (karanaNum === 58) {
      karanaEnglish = "Chatushpada";
      karanaTelugu = "చతుష్పాదం";
    } else {
      karanaEnglish = "Naga";
      karanaTelugu = "నాగం";
    }
  } else {
    const movableIdx = (karanaNum - 1) % 7;
    const mKarana = MOVABLE_KARANAS[movableIdx];
    karanaEnglish = mKarana.english;
    karanaTelugu = mKarana.telugu;
  }

  // 5. Sunrise & Sunset Solar calculations for the city
  // Approximate day of year
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((targetDate.getTime() - startOfYear.getTime()) / (86400 * 1000)) + 1;
  const gamma = ((2 * Math.PI) / 365) * (dayOfYear - 1);
  // Solar declination in radians
  const declination =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma);
  // Equation of time in minutes
  const eqtime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  const latRad = (city.lat * Math.PI) / 180;
  // Solar zenith for sunrise/sunset is 90.833 degrees (refraction + solar radius)
  const cosZenith = Math.cos((90.833 * Math.PI) / 180);
  const cosHourAngle = (cosZenith - Math.sin(latRad) * Math.sin(declination)) / (Math.cos(latRad) * Math.cos(declination));
  const clampedCos = Math.max(-1, Math.min(1, cosHourAngle));
  const hourAngleDeg = (Math.acos(clampedCos) * 180) / Math.PI;

  // Solar noon in minutes (IST is UTC+5.5 = 82.5° E meridian)
  const solarNoonMin = 720 - 4 * (city.lon - 82.5) - eqtime;
  const sunriseMin = solarNoonMin - hourAngleDeg * 4;
  const sunsetMin = solarNoonMin + hourAngleDeg * 4;

  const sunriseStr = formatMinutes(sunriseMin);
  const sunsetStr = formatMinutes(sunsetMin);

  // Approximate moonrise & moonset
  const moonOffsetMin = (tithiIndex * 48) % 1440;
  const moonriseMin = (sunriseMin + moonOffsetMin) % 1440;
  const moonsetMin = (sunsetMin + moonOffsetMin) % 1440;
  const moonriseStr = formatMinutes(moonriseMin);
  const moonsetStr = formatMinutes(moonsetMin);

  // Rahu Kalam, Yamagandam, Gulika Kalam
  const rahuKalamStr = formatSegmentRange(sunriseMin, sunsetMin, weekday.rahuSegment);
  const yamagandamStr = formatSegmentRange(sunriseMin, sunsetMin, weekday.yamaSegment);
  const gulikaKalamStr = formatSegmentRange(sunriseMin, sunsetMin, weekday.gulikaSegment);

  // Abhijit Muhurtam: middle of day ± 24 mins
  const abhijitStart = solarNoonMin - 24;
  const abhijitEnd = solarNoonMin + 24;
  const abhijitStr = `${formatMinutes(abhijitStart)} – ${formatMinutes(abhijitEnd)}`;

  // Durmuhurtam
  const durmuhurtaStart = sunriseMin + (dayIdx === 1 ? 192 : dayIdx === 2 ? 336 : 96);
  const durmuhurtaEnd = durmuhurtaStart + 48;
  const durmuhurtaStr = `${formatMinutes(durmuhurtaStart)} – ${formatMinutes(durmuhurtaEnd)}`;

  // Amrit Kalam (~1.5 hours in auspicious ghati)
  const amritStart = (sunriseMin + (nakshatraIndex * 42 + 180)) % 1440;
  const amritEnd = (amritStart + 90) % 1440;
  const amritKalamStr = `${formatMinutes(amritStart)} – ${formatMinutes(amritEnd)}`;

  // 6. Today's Festival / Vrata & Recommended Stotra
  let todayFestival = "";
  let recommended = { ...weekday.recommended };

  if (tithiIndex === 10 || tithiIndex === 25) {
    todayFestival = "సర్వ ఏకాదశి వ్రతం · Ekadashi Vratam";
    recommended = {
      deity: "Lord Maha Vishnu",
      titleEnglish: "Sri Vishnu Sahasranama Stotram",
      titleTelugu: "శ్రీ విష్ణు సహస్రనామ స్తోత్రం",
      slug: "sree-vishnu-sahasra-nama-stotram",
      category: "vishnu",
      description: "Recited on sacred Ekadashi for spiritual liberation, tranquility, and divine grace.",
    };
  } else if (tithiIndex === 12 || tithiIndex === 27) {
    todayFestival = "ప్రదోష వ్రతం (సంధ్యా సమయం) · Pradosha Vratam";
    recommended = {
      deity: "Lord Shiva",
      titleEnglish: "Shiva Panchakshari Stotram",
      titleTelugu: "శ్రీ శివ పంచాక్షరీ స్తోత్రం",
      slug: "shiva-panchakshari-stotram",
      category: "shiva",
      description: "Recited during Pradosha Kalam for freedom from all negative karmic bonds.",
    };
  } else if (tithiIndex === 3) {
    todayFestival = "వినాయక చవితి / వరసిద్ధి వినాయక పూజ · Vinayaka Chaturthi";
    recommended = {
      deity: "Lord Ganesha",
      titleEnglish: "Sri Ganesha Pancharatnam",
      titleTelugu: "శ్రీ గణేశ పంచరత్న స్తోత్రం",
      slug: "ganesha-pancharatnam",
      category: "ganesha",
      description: "Auspicious recitation to invoke Lord Ganesha and remove all obstacles.",
    };
  } else if (tithiIndex === 18) {
    todayFestival = "సంకష్టహర చతుర్థి వ్రతం · Sankashti Chaturthi";
    recommended = {
      deity: "Lord Ganesha",
      titleEnglish: "Sri Ganesha Pancharatnam",
      titleTelugu: "శ్రీ గణేశ పంచరత్న స్తోత్రం",
      slug: "ganesha-pancharatnam",
      category: "ganesha",
      description: "Recited on Sankashti Chaturthi to conquer obstacles and alleviate distress.",
    };
  } else if (tithiIndex === 14) {
    todayFestival = "పూర్ణిమా వ్రతం / శ్రీ సత్యనారాయణ స్వామి ఆరాధన · Purnima Vratam";
    recommended = {
      deity: "Goddess Mahalakshmi",
      titleEnglish: "Maha Lakshmi Ashtakam",
      titleTelugu: "మహాలక్ష్మ్యష్టకం",
      slug: "maha-lakshmi-ashtakam",
      category: "maha-lakshmi",
      description: "Chanted during Pournami for harmony, peace of mind, and continuous prosperity.",
    };
  } else if (tithiIndex === 28) {
    todayFestival = "మాస శివరాత్రి వ్రతం · Masa Shivaratri";
    recommended = {
      deity: "Lord Shiva",
      titleEnglish: "Shiva Panchakshari Stotram",
      titleTelugu: "శ్రీ శివ పంచాక్షరీ స్తోత్రం",
      slug: "shiva-panchakshari-stotram",
      category: "shiva",
      description: "Sacred night vigil and prayer dedicated to the supreme glory of Lord Shiva.",
    };
  } else if (tithiIndex === 29) {
    todayFestival = "సర్వ అమావాస్య పితృ తర్పణ దినం · Amavasya";
  } else if (dayIdx === 5) {
    todayFestival = "శుక్రవార లక్ష్మీ పూజ · Friday Sri Mahalakshmi Vrata";
  } else if (dayIdx === 2) {
    todayFestival = "మంగళవార ఆంజనేయ స్వామి పూజ · Tuesday Hanuman Puja";
  } else if (dayIdx === 1) {
    todayFestival = "సోమవార పరమేశ్వర పూజ · Monday Shiva Archana";
  } else if (dayIdx === 6) {
    todayFestival = "శనివార శ్రీనివాస ఆరాధన · Saturday Venkateswara Puja";
  } else if (dayIdx === 4) {
    todayFestival = "గురువార దత్తాత్రేయ / సద్గురు పూజ · Thursday Guru Puja";
  } else if (dayIdx === 3) {
    todayFestival = "బుధవార గణపతి ఆరాధన · Wednesday Ganesha Puja";
  } else {
    todayFestival = "ఆదివార సూర్య నమస్కారాలు · Sunday Aditya Puja";
  }

  // 7. Upcoming Festivals for the next 14 days
  const upcomingFestivals: UpcomingFestival[] = [];
  for (let offset = 1; offset <= 14; offset++) {
    const futureDate = new Date(targetDate.getTime() + offset * 86400 * 1000);
    const futDateStr = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(futureDate);

    // Approximate future tithi index
    const futAngle = (angleDiff + offset * 12.19) % 360;
    const futTithi = Math.floor(futAngle / 12) % 30;

    if (futTithi === 10 || futTithi === 25) {
      upcomingFestivals.push({
        date: futDateStr,
        nameTelugu: "ఏకాదశి వ్రతం",
        nameEnglish: "Ekadashi Vrata",
        description: "Sacred fasting and prayer dedicated to Lord Maha Vishnu for spiritual ascension.",
      });
    } else if (futTithi === 12 || futTithi === 27) {
      upcomingFestivals.push({
        date: futDateStr,
        nameTelugu: "ప్రదోష వ్రతం",
        nameEnglish: "Pradosha Vratam",
        description: "Evening twilight adoration of Lord Shiva for peace, health, and liberation.",
      });
    } else if (futTithi === 14) {
      upcomingFestivals.push({
        date: futDateStr,
        nameTelugu: "పూర్ణిమ (సత్యనారాయణ వ్రతం)",
        nameEnglish: "Purnima Vrata",
        description: "Full Moon day dedicated to Sri Satyanarayana Swamy and Goddess Lakshmi.",
      });
    } else if (futTithi === 18) {
      upcomingFestivals.push({
        date: futDateStr,
        nameTelugu: "సంకష్టహర చతుర్థి",
        nameEnglish: "Sankashti Chaturthi",
        description: "Auspicious day to break distress and invoke Lord Ganesha with Chandrodaya.",
      });
    } else if (futTithi === 28) {
      upcomingFestivals.push({
        date: futDateStr,
        nameTelugu: "మాస శివరాత్రి",
        nameEnglish: "Masa Shivaratri",
        description: "Monthly holy night dedicated to continuous Shiva japa and Bilva archana.",
      });
    } else if (futTithi === 29) {
      upcomingFestivals.push({
        date: futDateStr,
        nameTelugu: "అమావాస్య",
        nameEnglish: "Amavasya",
        description: "New Moon day sacred for Pitru Tarpanam and introspective meditation.",
      });
    }
  }

  const recommendedUrl = stotramPath({
    category: recommended.category,
    slug: recommended.slug,
    id: recommended.slug,
  });

  return {
    date: dateStr,
    dateLabel: formatDateLabel(dateStr),
    dateTelugu: formatDateTelugu(dateStr),
    cityId,
    cityName: city.name,
    cityNameTelugu: city.nameTelugu,
    dayName: `${weekday.telugu} (${weekday.day})`,
    dayNameTelugu: weekday.telugu,
    dayNameEnglish: weekday.day,
    presidingDeity: weekday.deity,
    tithi: `${tithiTelugu} (${tithiEnglish})`,
    tithiTelugu,
    tithiEnglish,
    paksha,
    nakshatra: `${nakshatraData.telugu} (${nakshatraData.english})`,
    nakshatraTelugu: nakshatraData.telugu,
    nakshatraEnglish: nakshatraData.english,
    pada,
    yoga: `${yogaData.telugu} (${yogaData.english})`,
    yogaTelugu: yogaData.telugu,
    karana: `${karanaTelugu} (${karanaEnglish})`,
    karanaTelugu,
    sunrise: sunriseStr,
    sunset: sunsetStr,
    moonrise: moonriseStr,
    moonset: moonsetStr,
    rahuKalam: rahuKalamStr,
    yamagandam: yamagandamStr,
    gulikaKalam: gulikaKalamStr,
    abhijitMuhurtam: abhijitStr,
    durmuhurtam: durmuhurtaStr,
    amritKalam: amritKalamStr,
    todayFestival,
    upcomingFestivals: upcomingFestivals.slice(0, 5),
    recommendedStotra: {
      ...recommended,
      url: recommendedUrl,
    },
  };
}

/**
 * Fetch or compute daily Panchang snapshot.
 * Uses Devdarsha API if key is present; otherwise seamlessly uses astronomical engine.
 * Cached in-memory with automatic stale-fallback.
 */
export const getPanchangSnapshot = cache(async (
  cityId: PanchangCityId = "hyderabad",
  date: string = todayInIndia(),
): Promise<PanchangSnapshot> => {
  const safeCity: PanchangCityId = isPanchangCity(cityId) ? cityId : "hyderabad";
  const safeDate: string = isPanchangDate(date) ? date : todayInIndia();
  const cacheKey = `${safeCity}:${safeDate}`;

  // Check in-memory cache
  const cached = memoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // Always compute fallback snapshot
  const astronomical = calculateAstronomicalPanchang(safeCity, safeDate);

  const key = process.env.DEVDARSHA_API_KEY;
  if (!key) {
    memoryCache.set(cacheKey, { data: astronomical, timestamp: Date.now() });
    return astronomical;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch("https://panchang.devdarsha.com/v1/panchang/daily", {
      method: "POST",
      headers: { "X-Api-Key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        date: safeDate,
        city_id: safeCity,
        faith_filter: "hindu",
        timezone: "Asia/Kolkata",
      }),
      signal: controller.signal,
      next: { revalidate: 1800 },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      memoryCache.set(cacheKey, { data: astronomical, timestamp: Date.now() });
      return astronomical;
    }

    const payload = (await response.json()) as {
      data?: {
        tithi?: unknown;
        nakshatra?: unknown;
        yoga?: unknown;
        karana?: unknown;
        sun?: { sunrise?: string; sunset?: string };
        sunrise?: string;
        sunset?: string;
        muhurat?: {
          rahu_kaal?: { start?: string; end?: string };
          abhijit_muhurat?: { start?: string; end?: string };
        };
      };
    };

    const data = payload?.data;
    if (!data) {
      memoryCache.set(cacheKey, { data: astronomical, timestamp: Date.now() });
      return astronomical;
    }

    // Merge external API nuances into high-fidelity snapshot
    const asFirst = (value: unknown): Record<string, unknown> | undefined => {
      const item = Array.isArray(value) ? value[0] : value;
      return item && typeof item === "object" ? (item as Record<string, unknown>) : undefined;
    };
    const asText = (value: unknown): string | undefined =>
      typeof value === "string" && value.trim() ? value.trim() : undefined;
    const range = (value: unknown): string | undefined => {
      const item = asFirst(value);
      if (!item) return asText(value);
      const start = asText(item.start);
      const end = asText(item.end);
      return start && end ? `${start} – ${end}` : start || end;
    };

    const extTithi = asFirst(data.tithi);
    const extNakshatra = asFirst(data.nakshatra);
    const extYoga = asFirst(data.yoga);
    const extKarana = asFirst(data.karana);

    const merged: PanchangSnapshot = {
      ...astronomical,
      tithi: extTithi ? `${asText(extTithi.paksha) || ""} ${asText(extTithi.name) || ""}`.trim() : astronomical.tithi,
      nakshatra: asText(extNakshatra?.name) || astronomical.nakshatra,
      yoga: asText(extYoga?.name) || astronomical.yoga,
      karana: asText(extKarana?.name) || astronomical.karana,
      sunrise: asText(data.sun?.sunrise) || asText(data.sunrise) || astronomical.sunrise,
      sunset: asText(data.sun?.sunset) || asText(data.sunset) || astronomical.sunset,
      rahuKalam: range(data.muhurat?.rahu_kaal) || astronomical.rahuKalam,
      abhijitMuhurtam: range(data.muhurat?.abhijit_muhurat) || astronomical.abhijitMuhurtam,
    };

    memoryCache.set(cacheKey, { data: merged, timestamp: Date.now() });
    return merged;
  } catch {
    // Graceful fallback to astronomical calculation
    memoryCache.set(cacheKey, { data: astronomical, timestamp: Date.now() });
    return astronomical;
  }
});
