import { EditScheduleList } from "@/components/Schedule";
import { PageHeader } from "@/components/Utilities";

export function EditSchedule() {
  return (
    <>
      <PageHeader label="Edit Schedule" />
      <EditScheduleList />
    </>
  );
}
