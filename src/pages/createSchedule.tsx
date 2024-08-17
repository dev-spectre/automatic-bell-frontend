import { ScheduleCreateForm } from "@/components/Form";
import { PageHeader } from "@/components/Utilities";

export function CreateSchedule() {
  return (
    <>
      <PageHeader label="Create Schedule" />
      <ScheduleCreateForm />
    </>
  );
}
