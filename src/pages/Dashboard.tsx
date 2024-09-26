import { RunningScheduleOverview, ScheduleList } from "@/components/Dashboard";
import { PageHeader } from "@/components/Utilities";

export function Dashboard() {
  return (
    <>
      <PageHeader label="Dashboard" />
      <RunningScheduleOverview />
      <div className="mt-9">
        <ScheduleList />
      </div>
    </>
  );
}
