import { ScheduleCreateForm } from "@/components/Form";
import { ManualControl } from "@/components/Utilities";

export function CreateSchedule() {
  return (
    <>
      <div className="mb-7 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl md:text-2xl">Create Schedule</h2>
        <ManualControl />
      </div>
      <ScheduleCreateForm />
    </>
  );
}
