import stotramsData from "@/data/stotrams.json";
import { Stotram } from "@/types";
import HomeContainer from "@/components/HomeContainer";

export default function Home() {
  const stotrams: Stotram[] = stotramsData;

  return <HomeContainer initialStotrams={stotrams} />;
}
