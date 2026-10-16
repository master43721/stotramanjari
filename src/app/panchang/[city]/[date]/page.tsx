import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import PanchangDatePicker from "@/components/PanchangDatePicker";
import {
  getPanchangSnapshot,
  isPanchangCity,
  isPanchangDate,
  PANCHANG_CITIES,
  PanchangCityId,
  todayInIndia,
} from "@/lib/panchangService";
import { LotusIcon, SparklesIcon } from "@/components/Icons";

interface PanchangPageProps {
  params: Promise<{
    city: string;
    date: string;
  }>;
}

export async function generateStaticParams() {
  const today = todayInIndia();
  const cities = Object.keys(PANCHANG_CITIES) as PanchangCityId[];
  return cities.map((city) => ({
    city,
    date: today,
  }));
}

export async function generateMetadata({ params }: PanchangPageProps): Promise<Metadata> {
  const { city, date } = await params;
  if (!isPanchangCity(city) || !isPanchangDate(date)) {
    return { title: "Panchang Not Found" };
  }

  const panchang = await getPanchangSnapshot(city, date);
  const title = `${panchang.dateTelugu} పంచాంగం - ${panchang.cityNameTelugu} (${panchang.cityName}) | Daily Vedic Panchang`;
  const description = `నేటి తెలుగు పంచాంగం: ${panchang.cityNameTelugu} (${panchang.cityName}) లో ${panchang.dateLabel}. తిథి: ${panchang.tithi}, నక్షత్రం: ${panchang.nakshatra}, యోగం: ${panchang.yoga}, కరణం: ${panchang.karana}, రాహు కాలం: ${panchang.rahuKalam}, అభిజిత్ ముహూర్తం: ${panchang.abhijitMuhurtam}.`;
  const canonicalUrl = `https://stotramani.app/panchang/${city}/${date}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Stotramani",
      locale: "te_IN",
      type: "article",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `Vedic Panchang for ${panchang.cityName} - Stotramani`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    keywords: [
      `${panchang.cityName.toLowerCase()} panchang`,
      `${panchang.cityNameTelugu} పంచాంగం`,
      "telugu panchangam",
      "today panchang",
      "tithi",
      "nakshatra",
      "rahu kalam",
      "abhijit muhurtam",
      panchang.tithiEnglish.toLowerCase(),
      panchang.nakshatraEnglish.toLowerCase(),
      "stotramani",
    ],
  };
}

export default async function PanchangDatePage({ params }: PanchangPageProps) {
  const { city, date } = await params;

  if (!isPanchangCity(city) || !isPanchangDate(date)) {
    notFound();
  }

  const panchang = await getPanchangSnapshot(city, date);
  const canonicalUrl = `https://stotramani.app/panchang/${city}/${date}`;

  // Date navigation calculations
  const currentDateObj = new Date(`${date}T12:00:00+05:30`);
  const prevDateObj = new Date(currentDateObj.getTime() - 86400 * 1000);
  const nextDateObj = new Date(currentDateObj.getTime() + 86400 * 1000);

  const prevDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(prevDateObj);

  const nextDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(nextDateObj);

  const todayStr = todayInIndia();
  const isToday = date === todayStr;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Panchang", href: `/panchang/${city}/${todayStr}` },
    { label: panchang.cityName, href: `/panchang/${city}/${todayStr}` },
    { label: panchang.dateTelugu, href: canonicalUrl },
  ];

  const shareText = `నేటి తెలుగు పంచాంగం (${panchang.cityNameTelugu} - ${panchang.dateLabel}):\nతిథి: ${panchang.tithi}\nనక్షత్రం: ${panchang.nakshatra}\nరాహు కాలం: ${panchang.rahuKalam}\nఅభిజిత్ ముహూర్తం: ${panchang.abhijitMuhurtam}\n\nసంపూర్ణ వివరాలు ఇక్కడ చూడండి:\n${canonicalUrl}`;
  const shareWhatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": canonicalUrl,
        url: canonicalUrl,
        name: `${panchang.dateTelugu} పంచాంగం - ${panchang.cityName}`,
        description: `Daily Vedic Panchang with Tithi, Nakshatra, Rahu Kalam, and Muhurtas for ${panchang.cityName}.`,
        inLanguage: ["te", "en"],
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://stotramani.app/#website",
          name: "Stotramani",
          url: "https://stotramani.app",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: crumb.label,
          item: `https://stotramani.app${crumb.href}`,
        })),
      },
    ],
  };

  const citiesList = Object.entries(PANCHANG_CITIES) as [PanchangCityId, typeof PANCHANG_CITIES[PanchangCityId]][];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div
        style={{
          backgroundColor: "var(--bg-base)",
          color: "var(--text-primary)",
          minHeight: "100vh",
          paddingBlock: "clamp(1.5rem, 4vw, 4rem)",
          position: "relative",
        }}
      >
        <div className="container" style={{ maxWidth: "1000px" }}>
          <Breadcrumbs items={breadcrumbs} />

          {/* Header */}
          <header style={{ textAlign: "center", marginBottom: "2rem" }}>
            <span
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--accent)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <LotusIcon size={16} /> శ్రీ వేద పంచాంగ దర్శిని · Vedic Panchang
            </span>
            <h1
              style={{
                fontSize: "clamp(1.75rem, 4.5vw, 2.75rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                background: "linear-gradient(135deg, var(--text-primary) 30%, var(--accent) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginTop: "0.35rem",
                marginBottom: "0.35rem",
              }}
            >
              {panchang.dateTelugu} పంచాంగం
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
              {panchang.cityNameTelugu} ({panchang.cityName}) · {panchang.dateLabel}
            </p>
          </header>

          {/* City Selector Bar */}
          <section
            aria-label="City Selector"
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "1.75rem",
            }}
          >
            {citiesList.map(([cId, cData]) => {
              const active = cId === city;
              return (
                <Link
                  key={cId}
                  href={`/panchang/${cId}/${date}`}
                  style={{
                    padding: "0.45rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.86rem",
                    fontWeight: active ? 700 : 500,
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    backgroundColor: active ? "var(--accent)" : "var(--bg-card)",
                    color: active ? "#060606" : "var(--text-secondary)",
                    border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                    boxShadow: active ? "0 0 15px var(--accent-glow)" : "none",
                  }}
                >
                  {cData.nameTelugu} ({cData.name})
                </Link>
              );
            })}
          </section>

          {/* Date Navigation & Picker Bar */}
          <nav
            aria-label="Date Navigation"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
              padding: "0.85rem 1.25rem",
              backgroundColor: "var(--bg-card)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              marginBottom: "2rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <Link
                href={`/panchang/${city}/${prevDate}`}
                className="btn"
                style={{
                  fontSize: "0.84rem",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "16px",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                }}
              >
                ← నిన్న (Prev Day)
              </Link>
              {!isToday && (
                <Link
                  href={`/panchang/${city}/${todayStr}`}
                  className="btn"
                  style={{
                    fontSize: "0.84rem",
                    padding: "0.4rem 0.85rem",
                    borderRadius: "16px",
                    backgroundColor: "var(--accent-light)",
                    borderColor: "var(--accent)",
                    color: "var(--accent)",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  నేడు (Today)
                </Link>
              )}
              <Link
                href={`/panchang/${city}/${nextDate}`}
                className="btn"
                style={{
                  fontSize: "0.84rem",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "16px",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                }}
              >
                రేపు (Next Day) →
              </Link>
            </div>

            <PanchangDatePicker currentCity={city} currentDate={date} />
          </nav>

          {/* Today's Festival / Vrata Highlight Banner */}
          {panchang.todayFestival && (
            <div
              style={{
                padding: "1rem 1.5rem",
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, var(--bg-card) 100%)",
                border: "1px solid var(--accent)",
                marginBottom: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  ⭐ నేటి విశేషం / పర్వదినం · Daily Observance
                </span>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: "0.25rem", color: "var(--text-primary)" }}>
                  {panchang.todayFestival}
                </h2>
                <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                  అధిష్టాన దైవం: <strong style={{ color: "var(--accent)" }}>{panchang.presidingDeity}</strong>
                </p>
              </div>

              <a
                href={shareWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  backgroundColor: "#25D366",
                  color: "#ffffff",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  padding: "0.45rem 1rem",
                  borderRadius: "20px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  textDecoration: "none",
                }}
              >
                పంచాంగం WhatsApp లో షేర్ చేయండి
              </a>
            </div>
          )}

          {/* 5 Limbs of Panchang (పంచాంగ పంచాంగాలు) Grid */}
          <section aria-labelledby="panchanga-angas-heading" style={{ marginBottom: "2.5rem" }}>
            <h2
              id="panchanga-angas-heading"
              style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--accent)",
              }}
            >
              <SparklesIcon size={18} /> పంచాంగ పంచాంగాలు · 5 Limbs of Panchang
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              {/* Vara */}
              <div className="panchang-fact" style={{ padding: "1rem 1.25rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                  1. వారం / Vara (Day of the Week)
                </span>
                <strong style={{ fontSize: "1.15rem", marginTop: "0.35rem", display: "block" }}>
                  {panchang.dayName}
                </strong>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  అధిదేవత: {panchang.presidingDeity}
                </p>
              </div>

              {/* Tithi */}
              <div className="panchang-fact" style={{ padding: "1rem 1.25rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                  2. తిథి / Tithi (Lunar Day)
                </span>
                <strong style={{ fontSize: "1.15rem", marginTop: "0.35rem", display: "block" }}>
                  {panchang.tithi}
                </strong>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  పక్షం: {panchang.paksha}
                </p>
              </div>

              {/* Nakshatra */}
              <div className="panchang-fact" style={{ padding: "1rem 1.25rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                  3. నక్షత్రం / Nakshatra (Constellation)
                </span>
                <strong style={{ fontSize: "1.15rem", marginTop: "0.35rem", display: "block" }}>
                  {panchang.nakshatra}
                </strong>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  పాదం: {panchang.pada ? `${panchang.pada}వ పాదం` : "ప్రస్తుతం నడుస్తున్నది"}
                </p>
              </div>

              {/* Yoga */}
              <div className="panchang-fact" style={{ padding: "1rem 1.25rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                  4. యోగం / Yoga
                </span>
                <strong style={{ fontSize: "1.15rem", marginTop: "0.35rem", display: "block" }}>
                  {panchang.yoga}
                </strong>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  రవి-చంద్రుల సంయోగ కోణం
                </p>
              </div>

              {/* Karana */}
              <div className="panchang-fact" style={{ padding: "1rem 1.25rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                  5. కరణం / Karana (Half of Tithi)
                </span>
                <strong style={{ fontSize: "1.15rem", marginTop: "0.35rem", display: "block" }}>
                  {panchang.karana}
                </strong>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  కార్యసిద్ధి &amp; ముహూర్త నిర్ణయం
                </p>
              </div>
            </div>
          </section>

          {/* Astronomical Timings: Sun, Moon & Muhurtas */}
          <section aria-labelledby="timings-heading" style={{ marginBottom: "2.5rem" }}>
            <h2
              id="timings-heading"
              style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                marginBottom: "1rem",
                color: "var(--accent)",
              }}
            >
              కాల గణన &amp; ముహూర్తాలు · Timings &amp; Muhurtams
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "0.75rem",
              }}
            >
              <div className="panchang-fact">
                <span>సూర్యోదయం / Sunrise</span>
                <strong>{panchang.sunrise}</strong>
              </div>
              <div className="panchang-fact">
                <span>సూర్యాస్తమయం / Sunset</span>
                <strong>{panchang.sunset}</strong>
              </div>
              <div className="panchang-fact">
                <span>చంద్రోదయం / Moonrise</span>
                <strong>{panchang.moonrise}</strong>
              </div>
              <div className="panchang-fact">
                <span>చంద్రాస్తమయం / Moonset</span>
                <strong>{panchang.moonset}</strong>
              </div>

              {/* Auspicious Muhurtas */}
              <div className="panchang-fact">
                <span>అభిజిత్ ముహూర్తం / Abhijit</span>
                <strong data-tone="success">{panchang.abhijitMuhurtam}</strong>
              </div>
              <div className="panchang-fact">
                <span>అమృత కాలం / Amrit Kalam</span>
                <strong data-tone="success">{panchang.amritKalam}</strong>
              </div>

              {/* Inauspicious Muhurtas */}
              <div className="panchang-fact">
                <span>రాహు కాలం / Rahu Kalam</span>
                <strong data-tone="warning">{panchang.rahuKalam}</strong>
              </div>
              <div className="panchang-fact">
                <span>యమగండం / Yamagandam</span>
                <strong data-tone="warning">{panchang.yamagandam}</strong>
              </div>
              <div className="panchang-fact">
                <span>గుళిక కాలం / Gulika Kalam</span>
                <strong>{panchang.gulikaKalam}</strong>
              </div>
              <div className="panchang-fact">
                <span>దుర్ముహూర్తం / Durmuhurtam</span>
                <strong data-tone="warning">{panchang.durmuhurtam}</strong>
              </div>
            </div>
          </section>

          {/* Recommended Stotra of the Day */}
          {panchang.recommendedStotra && (
            <section
              aria-labelledby="recommended-stotra-heading"
              style={{
                marginBottom: "2.5rem",
                padding: "1.5rem",
                borderRadius: "var(--radius-lg)",
                background: "linear-gradient(135deg, var(--accent-light) 0%, var(--bg-card) 100%)",
                border: "1px solid var(--accent)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    ⭐ నేటి విశిష్ట స్తోత్ర పఠనం · Recommended Chanting
                  </span>
                  <h2
                    id="recommended-stotra-heading"
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      marginTop: "0.35rem",
                    }}
                  >
                    {panchang.recommendedStotra.titleEnglish} —{" "}
                    <span style={{ fontFamily: "var(--font-telugu)", color: "var(--text-secondary)" }}>
                      {panchang.recommendedStotra.titleTelugu}
                    </span>
                  </h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "0.4rem", maxWidth: "680px", lineHeight: 1.5 }}>
                    {panchang.recommendedStotra.description}
                  </p>
                </div>

                <Link
                  href={panchang.recommendedStotra.url}
                  className="btn"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "#060606",
                    fontWeight: 700,
                    padding: "0.65rem 1.4rem",
                    borderRadius: "24px",
                    fontSize: "0.92rem",
                    boxShadow: "0 0 20px var(--accent-glow)",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  స్తోత్రం పఠించండి / Read Stotram →
                </Link>
              </div>
            </section>
          )}

          {/* Upcoming Festivals / Vratam Section */}
          {panchang.upcomingFestivals.length > 0 && (
            <section aria-labelledby="upcoming-festivals-heading" style={{ marginBottom: "3rem" }}>
              <h2
                id="upcoming-festivals-heading"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  marginBottom: "1rem",
                  color: "var(--accent)",
                }}
              >
                రాబోవు పర్వదినాలు &amp; వ్రతాలు · Upcoming Festivals &amp; Vratams
              </h2>

              <div style={{ display: "grid", gap: "0.75rem" }}>
                {panchang.upcomingFestivals.map((fest, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                      padding: "0.9rem 1.2rem",
                      backgroundColor: "var(--bg-card)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: 700 }}>
                        {fest.date}
                      </span>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginTop: "0.15rem" }}>
                        {fest.nameTelugu} · {fest.nameEnglish}
                      </h3>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                        {fest.description}
                      </p>
                    </div>

                    <Link
                      href={`/panchang/${city}/${fest.date}`}
                      className="btn"
                      style={{
                        fontSize: "0.82rem",
                        padding: "0.35rem 0.85rem",
                        borderRadius: "16px",
                        borderColor: "var(--border)",
                        color: "var(--text-primary)",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ఆ రోజు పంచాంగం →
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
