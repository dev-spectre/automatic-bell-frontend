import {
  RunningScheduleOverview,
  ScheduleCalendar,
  ScheduleList,
} from "@/components/Dashboard";
import { PageHeader } from "@/components/Utilities";

export function Dashboard() {
  return (
    <>
      <PageHeader label="Dashboard" />
      <div className="flex flex-col gap-7">
        <RunningScheduleOverview />
        <ScheduleCalendar />
        <ScheduleList />
      </div>
    </>
  );
}
