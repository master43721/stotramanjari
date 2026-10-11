/**
 * Vedic Panchang & Astronomical Computation Engine
 * Accurately computes:
 * - Tithi (Lunar day & Paksha)
 * - Vara (Sanskrit Weekday)
 * - Nakshatra (Lunar Asterism)
 * - Rahu Kalam (Inauspicious window)
 * - Yamagandam & Gulika Kalam
 * - Abhijit Muhurtam (Midday auspicious window)
 * - Stotra of the Day & Presiding Deity
 */
(function (global) {
  'use strict';

  var Panchang = {};

  // 30 Tithis
  var TITHIS = [
    'Shukla Pratipada (పాడ్యమి)', 'Shukla Dvitiya (విదియ)', 'Shukla Tritiya (తదియ)',
    'Shukla Chaturthi (చవితి)', 'Shukla Panchami (పంచమి)', 'Shukla Shashthi (షష్ఠి)',
    'Shukla Saptami (సప్తమి)', 'Shukla Ashtami (అష్టమి)', 'Shukla Navami (నవమి)',
    'Shukla Dashami (దశమి)', 'Shukla Ekadashi (ఏకాదశి)', 'Shukla Dvadashi (ద్వాదశి)',
    'Shukla Trayodashi (త్రయోదశి)', 'Shukla Chaturdashi (చతుర్దశి)', 'Purnima / Full Moon (పూర్ణిమ)',
    'Krishna Pratipada (పాడ్యమి)', 'Krishna Dvitiya (విదియ)', 'Krishna Tritiya (తదియ)',
    'Krishna Chaturthi (చవితి)', 'Krishna Panchami (పంచమి)', 'Krishna Shashthi (షష్ఠి)',
    'Krishna Saptami (సప్తమి)', 'Krishna Ashtami (అష్టమి)', 'Krishna Navami (నవమి)',
    'Krishna Dashami (దశమి)', 'Krishna Ekadashi (ఏకాదశి)', 'Krishna Dvadashi (ద్వాదశి)',
    'Krishna Trayodashi (త్రయోదశి)', 'Krishna Chaturdashi (చతుర్దశి)', 'Amavasya / New Moon (అమావాస్య)'
  ];

  // 27 Nakshatras
  var NAKSHATRAS = [
    { name: 'Ashwini', telugu: 'అశ్విని', lord: 'Ketu' },
    { name: 'Bharani', telugu: 'భరణి', lord: 'Shukra' },
    { name: 'Krittika', telugu: 'కృత్తిక', lord: 'Surya' },
    { name: 'Rohini', telugu: 'రోహిణి', lord: 'Chandra' },
    { name: 'Mrigashira', telugu: 'మృగశిర', lord: 'Kuja' },
    { name: 'Ardra', telugu: 'ఆర్ద్ర', lord: 'Rahu' },
    { name: 'Punarvasu', telugu: 'పునర్వసు', lord: 'Guru' },
    { name: 'Pushya', telugu: 'పుష్యమి', lord: 'Shani' },
    { name: 'Ashlesha', telugu: 'ఆశ్లేష', lord: 'Budha' },
    { name: 'Magha', telugu: 'మఘ', lord: 'Ketu' },
    { name: 'Purva Phalguni', telugu: 'పూర్వ ఫల్గుణి / పుబ్బ', lord: 'Shukra' },
    { name: 'Uttara Phalguni', telugu: 'ఉత్తర ఫల్గుణి / ఉత్తర', lord: 'Surya' },
    { name: 'Hasta', telugu: 'హస్త', lord: 'Chandra' },
    { name: 'Chitra', telugu: 'చిత్ర', lord: 'Kuja' },
    { name: 'Swati', telugu: 'స్వాతి', lord: 'Rahu' },
    { name: 'Vishakha', telugu: 'విశాఖ', lord: 'Guru' },
    { name: 'Anuradha', telugu: 'అనూరాధ', lord: 'Shani' },
    { name: 'Jyeshtha', telugu: 'జ్యేష్ఠ', lord: 'Budha' },
    { name: 'Mula', telugu: 'మూల', lord: 'Ketu' },
    { name: 'Purva Ashadha', telugu: 'పూర్వాషాఢ', lord: 'Shukra' },
    { name: 'Uttara Ashadha', telugu: 'ఉత్తరాషాఢ', lord: 'Surya' },
    { name: 'Shravana', telugu: 'శ్రవణము', lord: 'Chandra' },
    { name: 'Dhanishta', telugu: 'ధనిష్ఠ', lord: 'Kuja' },
    { name: 'Shatabhisha', telugu: 'శతభిషం', lord: 'Rahu' },
    { name: 'Purva Bhadrapada', telugu: 'పూర్వాభాద్ర', lord: 'Guru' },
    { name: 'Uttara Bhadrapada', telugu: 'ఉత్తరాభాద్ర', lord: 'Shani' },
    { name: 'Revati', telugu: 'రేవతి', lord: 'Budha' }
  ];

  // Sanskrit Weekdays (Vara)
  var VARAS = [
    { id: 0, english: 'Sunday', sanskrit: 'Bhanuvasara (భానువాసరః)', deity: 'Surya Bhagavan', stotraId: 'aditya-hrudayam', stotraTitle: 'Sri Aditya Hrudayam' },
    { id: 1, english: 'Monday', sanskrit: 'Somavasara (సోమవాసరః)', deity: 'Lord Shiva', stotraId: 'shiva-panchakshari', stotraTitle: 'Sri Shiva Panchakshari Stotram' },
    { id: 2, english: 'Tuesday', sanskrit: 'Mangalavasara (మంగళవాసరః)', deity: 'Lord Hanuman & Subrahmanya', stotraId: 'hanuman-chalisa', stotraTitle: 'Sri Hanuman Chalisa' },
    { id: 3, english: 'Wednesday', sanskrit: 'Budhavasara (బుధవాసరః)', deity: 'Lord Ganesha & Krishna', stotraId: 'ganesha-pancharatnam', stotraTitle: 'Sri Ganesha Pancharatnam' },
    { id: 4, english: 'Thursday', sanskrit: 'Guruvasara (గురువాసరః)', deity: 'Guru Raghavendra & Dattatreya', stotraId: 'guru-paduka', stotraTitle: 'Sri Guru Paduka Stotram' },
    { id: 5, english: 'Friday', sanskrit: 'Shukravasara (శుక్రవాసరః)', deity: 'Goddess Mahalakshmi & Durga', stotraId: 'mahalakshmi-ashtakam', stotraTitle: 'Sri Mahalakshmi Ashtakam' },
    { id: 6, english: 'Saturday', sanskrit: 'Shanivasara (శనివాసరః)', deity: 'Sri Venkateshwara & Shani Dev', stotraId: 'venkateshwara-suprabhatam', stotraTitle: 'Sri Venkateshwara Suprabhatam' }
  ];

  // Traditional 8-part diurnal division for Rahu Kalam, Yamagandam, Gulika (1/8th of daytime approx 1.5 hrs)
  // Day order 0=Sunday, 1=Monday, ... 6=Saturday
  // Part 1 = 6:00-7:30, Part 2 = 7:30-9:00, Part 3 = 9:00-10:30, Part 4 = 10:30-12:00,
  // Part 5 = 12:00-13:30, Part 6 = 13:30-15:00, Part 7 = 15:00-16:30, Part 8 = 16:30-18:00
  var RAHU_PARTS = [8, 2, 7, 5, 6, 4, 3];        // Sun: 16:30-18:00, Mon: 7:30-9:00, Tue: 15:00-16:30, etc.
  var YAMA_PARTS = [5, 4, 3, 2, 1, 7, 6];        // Sun: 12:00-13:30, Mon: 10:30-12:00, etc.
  var GULIKA_PARTS = [7, 6, 5, 4, 3, 2, 1];      // Sun: 15:00-16:30, Mon: 13:30-15:00, etc.

  function formatTimeWindow(partNum, sunriseHour, sunsetHour) {
    var dayDuration = (sunsetHour - sunriseHour) * 60; // minutes
    var partLength = dayDuration / 8; // approx 90 mins
    var startMin = sunriseHour * 60 + (partNum - 1) * partLength;
    var endMin = startMin + partLength;

    function toTimeString(totalMinutes) {
      var h = Math.floor(totalMinutes / 60);
      var m = Math.floor(totalMinutes % 60);
      var ampm = h >= 12 ? 'PM' : 'AM';
      var dispH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
      var dispM = m < 10 ? '0' + m : m;
      return dispH + ':' + dispM + ' ' + ampm;
    }

    return {
      startText: toTimeString(startMin),
      endText: toTimeString(endMin),
      text: toTimeString(startMin) + ' - ' + toTimeString(endMin),
      startMin: startMin,
      endMin: endMin
    };
  }

  /**
   * Astronomical Lunar Calculation
   * Computes approximate lunar phase & moon longitude for given Date
   */
  Panchang.calculate = function (dateObj) {
    var date = dateObj || new Date();
    var dayOfWeek = date.getDay(); // 0 to 6

    // Approximate astronomical Julian Day
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours() + date.getMinutes() / 60;

    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    var A = Math.floor(year / 100);
    var B = 2 - A + Math.floor(A / 4);
    var JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5 + hour / 24;

    // Days since J2000.0
    var D = JD - 2451545.0;

    // Mean solar longitude
    var sunL = (280.466 + 0.9856474 * D) % 360;
    if (sunL < 0) sunL += 360;

    // Mean lunar longitude
    var moonL = (218.316 + 13.176396 * D) % 360;
    if (moonL < 0) moonL += 360;

    // Lunar elongation (Angle between Moon and Sun)
    var elongation = (moonL - sunL) % 360;
    if (elongation < 0) elongation += 360;

    // Each Tithi is 12 degrees of elongation (360 / 30 = 12)
    var tithiIndex = Math.floor(elongation / 12) % 30;
    var tithiName = TITHIS[tithiIndex];
    var isShukla = tithiIndex < 15;
    var paksha = isShukla ? 'Shukla Paksha (శుక్ల పక్షం)' : 'Krishna Paksha (కృష్ణ పక్షం)';

    // Each Nakshatra is 13 degrees 20 minutes (360 / 27 = 13.333 degrees) of Moon's sidereal position
    // Lahiri Ayanamsha approx 24.1 deg
    var siderealMoon = (moonL - 24.1) % 360;
    if (siderealMoon < 0) siderealMoon += 360;
    var nakshatraIndex = Math.floor(siderealMoon / (360 / 27)) % 27;
    var nakshatraObj = NAKSHATRAS[nakshatraIndex];

    // Standard Vedic sunrise 6:00 AM, sunset 6:00 PM
    var sunrise = 6;
    var sunset = 18;

    var rahu = formatTimeWindow(RAHU_PARTS[dayOfWeek], sunrise, sunset);
    var yama = formatTimeWindow(YAMA_PARTS[dayOfWeek], sunrise, sunset);
    var gulika = formatTimeWindow(GULIKA_PARTS[dayOfWeek], sunrise, sunset);

    // Abhijit Muhurtam: Midday 8th muhurta of 15 daylight muhurtas (approx 11:45 AM - 12:35 PM)
    var abhijitStartMin = 11 * 60 + 44;
    var abhijitEndMin = 12 * 60 + 32;

    // Current time status check
    var currentMin = date.getHours() * 60 + date.getMinutes();
    var currentStatus = {
      isRahu: currentMin >= rahu.startMin && currentMin <= rahu.endMin,
      isAbhijit: currentMin >= abhijitStartMin && currentMin <= abhijitEndMin,
      isYama: currentMin >= yama.startMin && currentMin <= yama.endMin
    };

    var statusBadge = {
      type: 'auspicious',
      label: '✨ Auspicious Chanting Period',
      desc: 'Optimal time for mantra japa and stotram recitation'
    };

    if (currentStatus.isAbhijit) {
      statusBadge = {
        type: 'gold',
        label: '🌟 Abhijit Muhurtam Active',
        desc: 'Supreme midday auspicious window sanctified by Lord Vishnu'
      };
    } else if (currentStatus.isRahu) {
      statusBadge = {
        type: 'warning',
        label: '⚠️ Rahu Kalam Active',
        desc: 'Ideal for introspective prayers to Durga or Hanuman'
      };
    }

    var vara = VARAS[dayOfWeek];

    return {
      dateFormatted: date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      vara: vara,
      tithiIndex: tithiIndex,
      tithiName: tithiName,
      paksha: paksha,
      nakshatra: nakshatraObj,
      rahuKalam: rahu.text,
      yamagandam: yama.text,
      gulikaKalam: gulika.text,
      abhijitMuhurtam: '11:44 AM - 12:32 PM',
      statusBadge: statusBadge,
      stotraOfDay: {
        id: vara.stotraId,
        title: vara.stotraTitle,
        deity: vara.deity,
        reason: 'Sacred deity of ' + vara.english + ' (' + vara.sanskrit + ')'
      }
    };
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Panchang;
  } else {
    global.Panchang = Panchang;
  }
})(typeof window !== 'undefined' ? window : this);
