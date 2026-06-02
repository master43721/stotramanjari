import { getAllStotrams } from "@/data/loader";
import HomeContainer from "@/components/HomeContainer";

export default function Home() {
  const stotrams = getAllStotrams();

  return <HomeContainer initialStotrams={stotrams} />;
}
