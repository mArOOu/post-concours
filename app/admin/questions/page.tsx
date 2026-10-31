import { listQuestions } from "@/src/services/firestore/questions";
import { QuestionsClient } from "./QuestionsClient";

export default async function AdminQuestionsPage() {
  const questions = (await listQuestions()) as unknown as Parameters<typeof QuestionsClient>[0]["questions"];
  return <QuestionsClient questions={questions} />;
}
