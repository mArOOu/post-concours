import { listAttributeDefinitions } from "@/src/services/firestore/settings";
import { listScoringModels } from "@/src/services/firestore/settings";
import { SettingsClient } from "./SettingsClient";

export default async function AdminSettingsPage() {
  const attrs = (await listAttributeDefinitions()) as unknown as Parameters<typeof SettingsClient>[0]["attrs"];
  const models = (await listScoringModels()) as unknown as Parameters<typeof SettingsClient>[0]["models"];
  return (
    <SettingsClient
      attrs={attrs}
      models={models}
    />
  );
}
