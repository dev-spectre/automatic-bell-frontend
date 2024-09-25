import { getCurrentDate, getNextRing } from "@/utilities/dashboard";
import bgImg from "@/assets/logo.svg";
import { useSelector } from "react-redux";
import { AppStore } from "@/store";
import { useSyncTime } from "@/hooks/dashboard";
import { expandActiveSchedule } from "@/utilities/forms";

export function RunningScheduleOverview() {
  const currentDate = getCurrentDate();
  const time = useSyncTime();
  const { schedules, active } = useSelector(
    (state: AppStore) => state.schedules,
  );
  const nextRing = getNextRing(expandActiveSchedule(active, schedules));
  const activeScheduleTags = active.map((value, idx) => (
    <p
      key={idx}
      className="rounded-full border border-hoki-600 bg-eclipse-elixir-500 px-2"
    >
      {value}
    </p>
  ));

  return (
    <div className="relative isolate overflow-hidden rounded bg-eclipse-elixir-500 px-5 py-4 @container md:col-span-2 md:px-7 md:py-6">
      <div className="relative z-20 space-y-1">
        <div className="mb-5 flex flex-wrap items-end">
          <div className="mr-3 text-2xl font-bold md:text-6xl">{time}</div>
          <div className="md:text-lg">{currentDate}</div>
        </div>
        <div className="text-hoki-500">
          <p className="inline">Active Schedule: </p>
          <span className="inline-flex flex-wrap gap-1">
            {activeScheduleTags.length ? activeScheduleTags : "--"}
          </span>
        </div>
        <p>
          <span className="text-hoki-500">Next Bell: </span>
          {nextRing ?? "--"}
        </p>
      </div>
      <div className="absolute bottom-0 right-5 top-1/2 z-0 hidden aspect-square h-[150%] -translate-y-1/2 @md:block">
        <img className="opacity-55" src={bgImg} alt="" />
        <div className="absolute inset-0 h-full bg-gradient-to-b from-transparent to-eclipse-elixir-500 to-60% opacity-60"></div>
      </div>
    </div>
  );
}
