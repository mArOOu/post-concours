import { listInterviews } from "@/src/services/firestore/interviews";
import InterviewsClient from "./InterviewsClient";

export default async function AdminResidentInterviewsPage() {
  const interviews = (await listInterviews()) as unknown as Parameters<typeof InterviewsClient>[0]["interviews"];
  return <InterviewsClient interviews={interviews} />;
}
