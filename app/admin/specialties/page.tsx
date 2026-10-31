import { listSpecialties } from "@/src/services/firestore/specialties";
import { SpecialtiesClient } from "./SpecialtiesClient";

export default async function AdminSpecialtiesPage() {
  const specialties = (await listSpecialties()) as unknown as Parameters<typeof SpecialtiesClient>[0]["specialties"];
  return <SpecialtiesClient specialties={specialties} />;
}
