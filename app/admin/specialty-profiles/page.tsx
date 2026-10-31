import { listSpecialties } from "@/src/services/firestore/specialties";
import SpecialtyProfilesClient from "./SpecialtyProfilesClient";

export default async function AdminSpecialtyProfilesPage() {
  const specialties = (await listSpecialties()) as unknown as Parameters<typeof SpecialtyProfilesClient>[0]["specialties"];
  return <SpecialtyProfilesClient specialties={specialties} />;
}
