import { SettingsForm } from "@/components/forms/Settings";
import { PageHeader } from "@/components/Utilities";

export function Settings() {
  return (
    <>
      <PageHeader label="Settings" />
      <SettingsForm />
    </>
  );
}
