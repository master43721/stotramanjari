import HomeClient from "@/components/HomeClient";
import categoryMappings from "@/data/category-mappings.json";
import { getStotramsIndex } from "@/data/loader";

// Keep the sizeable catalogue out of the client JavaScript bundle. It is sent
// in the React Server Component payload while search and filtering stay local.
export default function HomePage() {
  return (
    <HomeClient
      stotrams={getStotramsIndex()}
      categoryMappings={categoryMappings as Record<string, string[]>}
    />
  );
}
