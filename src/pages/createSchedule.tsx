import { ScheduleCreateForm } from "@/components/Form";
import { ManualControl } from "@/components/Utilities";

export function CreateSchedule() {
  return (
    <>
      <div className="mb-7 flex flex-wrap-reverse items-center justify-between gap-2">
        <h2 className="text-lg sm:text-xl md:text-2xl">Create Schedule</h2>
        <ManualControl />
      </div>
      <ScheduleCreateForm />
    </>
  );
}
