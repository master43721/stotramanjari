import { redirect } from "next/navigation";
import { todayInIndia } from "@/lib/panchangService";

export default function PanchangIndexPage() {
  const today = todayInIndia();
  redirect(`/panchang/hyderabad/${today}`);
}
