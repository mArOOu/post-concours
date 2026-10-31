import { listSpecialties } from "@/src/services/firestore/specialties";
import { listAttributeDefinitions } from "@/src/services/firestore/settings";
import ScoresClient from "./ScoresClient";

export default async function AdminScoresPage() {
  const attributes = (await listAttributeDefinitions()) as unknown as Parameters<typeof ScoresClient>[0]["attributes"];
  const specialties = (await listSpecialties()) as unknown as Parameters<typeof ScoresClient>[0]["specialties"];
  return <ScoresClient attributes={attributes} specialties={specialties} />;
}
