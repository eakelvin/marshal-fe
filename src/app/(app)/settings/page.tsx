import { SettingsView } from "@/components/settings/settings-view";
import { getCurrentUser } from "@/lib/api/user-server";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await getCurrentUser();
  return <SettingsView user={user} />;
}
