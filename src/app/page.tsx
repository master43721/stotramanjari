import HomeClient from "@/components/HomeClient";
import PanchangWidget from "@/components/PanchangWidget";
import categoryMappings from "@/data/category-mappings.json";
import { getStotramsIndex } from "@/data/loader";
import { getPanchangSnapshot, todayInIndia } from "@/lib/panchangService";

// Server Component: fetches Vedic Panchang at render time so crawlers and visitors
// get instantaneous daily panchang content without client-side loading or hydration delays.
export default async function HomePage() {
  const today = todayInIndia();
  const panchang = await getPanchangSnapshot("hyderabad", today);

  return (
    <HomeClient
      stotrams={getStotramsIndex()}
      categoryMappings={categoryMappings as Record<string, string[]>}
      panchang={<PanchangWidget initialData={panchang} cityId="hyderabad" date={today} />}
    />
  );
}
