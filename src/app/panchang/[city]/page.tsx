import { redirect } from "next/navigation";
import { isPanchangCity, todayInIndia } from "@/lib/panchangService";

interface CityPageProps {
  params: Promise<{
    city: string;
  }>;
}

export default async function PanchangCityIndexPage({ params }: CityPageProps) {
  const { city } = await params;
  const targetCity = isPanchangCity(city) ? city : "hyderabad";
  const today = todayInIndia();
  redirect(`/panchang/${targetCity}/${today}`);
}
