import { ScheduleCreateForm } from "@/components/forms/Schedule";
import { PageHeader } from "@/components/Utilities";

export function CreateSchedule() {
  return (
    <>
      <PageHeader label="Create Schedule" />
      <ScheduleCreateForm />
    </>
  );
}
