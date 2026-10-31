import { listFaqs } from "@/src/services/firestore/faq";
import FaqClient from "./FaqClient";

export default async function AdminFaqPage() {
  const faqs = (await listFaqs()) as unknown as Parameters<typeof FaqClient>[0]["faqs"];
  return <FaqClient faqs={faqs} />;
}
