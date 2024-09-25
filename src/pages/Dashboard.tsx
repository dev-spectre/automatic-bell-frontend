import { RunningScheduleOverview } from "@/components/RunningScheduleOverview";
import { PageHeader } from "@/components/Utilities";

export function Dashboard() {
  return (
    <>
      <PageHeader label="Dashboard" />
      <div className="bg row-auto grid gap-5 md:grid-cols-2">
        <RunningScheduleOverview />
      </div>
    </>
  );
}
