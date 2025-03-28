import {
  assignColor,
  dateToString,
  formatTime,
  generateUniqueColour,
  getActiveScheduleDates,
  getCurrentDate,
  getNextRing,
  hexColourToCssClass,
  sortSchedules,
  timeToDate,
} from "@/utilities/dashboard";
import bgImg from "@/assets/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { AppStore } from "@/store";
import {
  useActiveScheduleOnDate,
  useCalendarMonthCount,
  useSyncTime,
} from "@/hooks/dashboard";
import { expandActiveSchedule, expandSchedule } from "@/utilities/forms";
import { PencilLine, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "./ui/switch";
import {
  addActiveSchedules,
  removeActiveSchedules,
} from "@/store/slice/schedules";
import req from "@/api/requests";
import { getDeviceId, getDeviceIp } from "@/utilities/device";
import { addToast } from "@/store/slice/toasts";
import { COULDNT_CONNNECT_TO_DEVICE } from "@/constants/alert";
import { Calendar } from "./ui/calendar";
import { useEffect, useRef, useState } from "react";
import { WEEK_COUNT, DAY_COUNT, ONE_MONTH_IN_MS } from "@/constants/dashboard";
import { SkipScheduleModal } from "./Utilities";
import { ScheduleState } from "@/types";

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
    <div className="relative isolate overflow-hidden rounded bg-eclipse-elixir-500 px-5 py-4 @container md:px-7 md:py-6">
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
        <div className="absolute inset-0 h-full bg-gradient-to-b from-[#1E213700] to-eclipse-elixir-500 to-60% opacity-60"></div>
      </div>
    </div>
  );
}

export function ScheduleList() {
  const { schedules, active } = useSelector(
    (state: AppStore) => state.schedules,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sortedScheduleNames = sortSchedules(schedules);
  return (
    <div className="overflow-scroll rounded bg-eclipse-elixir-500 px-5 py-4 @container md:px-7 md:py-6">
      <div className="mb-3 flex justify-between">
        <p className="text-xl">Schedule List</p>
        <div className="flex gap-2">
          <button onClick={() => navigate("/schedule/create")}>
            <Plus />
          </button>
          <button onClick={() => navigate("/schedule/edit")}>
            <PencilLine />
          </button>
        </div>
      </div>
      <table className="w-full min-w-72 overflow-scroll text-left text-xs sm:text-sm md:text-base">
        <thead className="border-b-4 border-b-transparent text-hoki-500">
          <tr>
            <th>Schedule Name</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th className="hidden @md:table-cell">No. of rings</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {sortedScheduleNames.map((scheduleName) => {
            const schedule = schedules[scheduleName];
            const expandedSchedule = expandSchedule({
              scheduleName,
              schedules: schedule,
            });
            const timings = Object.keys(expandedSchedule);
            const startTime = formatTime(timeToDate(timings.at(0) ?? ""));
            const endTime = formatTime(timeToDate(timings.at(-1) ?? ""));
            return (
              <tr key={scheduleName}>
                <td>{scheduleName}</td>
                <td>
                  <span className="not-sr-only font-mono">
                    {startTime.replace(/0/g, "O")}
                  </span>
                  <span className="sr-only">{startTime}</span>
                </td>
                <td>
                  <span className="not-sr-only font-mono">
                    {endTime.replace(/0/g, "O")}
                  </span>
                  <span className="sr-only">{endTime}</span>
                </td>
                <td className="hidden @md:table-cell">{timings.length}</td>
                <td>
                  <Switch
                    id={scheduleName}
                    className="data-[state=checked]:bg-orange-450 data-[state=unchecked]:bg-eclipse-elixir-400"
                    checked={active.includes(scheduleName)}
                    onCheckedChange={async (checked) => {
                      if (checked) {
                        dispatch(addActiveSchedules([scheduleName]));
                      } else {
                        dispatch(removeActiveSchedules([scheduleName]));
                      }

                      const activeSchedules = checked
                        ? [...active, scheduleName]
                        : active.filter((value) => value !== scheduleName);
                      const deviceId = getDeviceId() ?? NaN;
                      const deviceIp = await getDeviceIp(deviceId);
                      const res = await req.put(
                        `http://${deviceIp}/schedule/active`,
                        {
                          active: activeSchedules,
                        },
                      );
                      if (!res.success) {
                        if (!checked) {
                          dispatch(addActiveSchedules([scheduleName]));
                        } else {
                          dispatch(removeActiveSchedules([scheduleName]));
                        }
                        dispatch(
                          addToast({
                            ...COULDNT_CONNNECT_TO_DEVICE,
                            title: "Couldn't update active schedules.",
                          }),
                        );
                      }
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ScheduleCalendar() {
  const calendarContainer = useRef<HTMLDivElement | null>(null);
  const numberOfMonths = useCalendarMonthCount(calendarContainer);
  const [startDate, setStartDate] = useState(new Date());
  const year = startDate.getFullYear();
  const month = startDate.getMonth() + numberOfMonths;
  const [endDate, setEndtDate] = useState(
    new Date(
      year,
      month,
      WEEK_COUNT * DAY_COUNT - new Date(year, month, 1).getDay(),
    ),
  );
  const [skipSchedules, setSkipSchedules] = useState<{
    [key: string]: boolean;
  }>({});
  const date = useRef(new Date());

  useEffect(() => {
    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + numberOfMonths,
      1,
    );
    endDate.setDate(WEEK_COUNT * DAY_COUNT - endDate.getDay());
    setEndtDate(endDate);
  }, [numberOfMonths, startDate]);

  const schedules = useSelector((state: AppStore) => state.schedules);
  const [activeSchedules, setActiveSchedules] =
    useActiveScheduleOnDate(schedules);

  const activeScheduleDates = getActiveScheduleDates(
    schedules,
    startDate,
    endDate,
  );
  assignColor(schedules.active);

  return (
    <div
      ref={calendarContainer}
      className="flex-wrap gap-2 rounded bg-eclipse-elixir-500 px-5 py-4 max-xs:text-center xs:flex xs:divide-x md:px-7 md:py-6"
    >
      <Calendar
        onMonthChange={(month) => {
          const today = new Date();
          if (Number(today) - Number(month) > numberOfMonths * ONE_MONTH_IN_MS)
            return;
          if (
            today.getMonth() === month.getMonth() &&
            today.getFullYear() === month.getFullYear()
          ) {
            month = today;
          }
          const day = month.getDay();

          const startDate = new Date(
            month.getFullYear(),
            month.getMonth(),
            month.getDate() - day,
          );

          const endDate = new Date(
            month.getFullYear(),
            month.getMonth() + numberOfMonths - 1,
            1,
          );
          endDate.setDate(WEEK_COUNT * DAY_COUNT - endDate.getDay());

          setStartDate(startDate);
          setEndtDate(endDate);
          assignColor(schedules.active);
        }}
        id="calendar"
        fixedWeeks={true}
        showOutsideDays={true}
        className="inline-block p-0 max-xs:mb-5"
        classNames={{
          day_selected: "bg-orange-450 text-black",
          day_today:
            "bg-eclipse-elixir-600 outline outline-1 outline-orange-450",
          cell: "h-8 w-8 md:h-10 md:w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-eclipse-elixir-500/50 [&:has([aria-selected])]:bg-eclipse-elixir-500 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        }}
        modifiers={activeScheduleDates}
        modifiersClassNames={schedules.active.reduce(
          (classNames: { [key: string]: string }, schedule) => {
            classNames[schedule] = hexColourToCssClass(
              generateUniqueColour(schedule),
            );
            return classNames;
          },
          {},
        )}
        numberOfMonths={numberOfMonths}
        disabled={{
          before: new Date(),
        }}
        onDayClick={(selectedDate) => {
          const prevDate = date.current;
          date.current = new Date(selectedDate.toDateString());
          const dateString = dateToString(selectedDate);
          const weekDay = selectedDate
            .toLocaleString("en-IN", { weekday: "short" })
            .toLowerCase() as keyof ScheduleState["weekly"];
          const monthDate = selectedDate.getDate();
          const skipSchedules: { [key: string]: boolean } = {};
          const activeSchedules: string[] = [];
          schedules.active.forEach((schedule) => {
            if (
              !schedules.skip[dateString]?.includes(schedule) &&
              (schedules.weekly[weekDay].includes(schedule) ||
                schedules.monthly[monthDate].includes(schedule) ||
                schedules.once[dateString]?.includes(schedule))
            ) {
              skipSchedules[schedule] = false;
              activeSchedules.push(schedule);
            }
          });

          if (schedules.skip.hasOwnProperty(dateString)) {
            schedules.skip[dateString].forEach((schedule) => {
              skipSchedules[schedule] = true;
            });
          }

          setActiveSchedules(activeSchedules);

          if (prevDate.toDateString() != selectedDate.toDateString()) return;
          setSkipSchedules(skipSchedules);
        }}
      />
      <SkipScheduleModal
        date={date.current}
        skipSchedules={skipSchedules}
        setSkipSchedules={setSkipSchedules}
        schedules={schedules}
        setActiveSchedules={setActiveSchedules}
      />
      <div className="flex-grow border-hoki-600 pl-4 text-left">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <p className="mb-1 xs:text-lg">Active Schedules</p>
          <p className="text-sm text-hoki-500">{`${getCurrentDate(date.current).split(", ")[1]}`}</p>
        </div>
        <div className="space-y-2">
          {activeSchedules.map((schedule) => (
            <div key={schedule} className="flex gap-2">
              <span
                style={{
                  backgroundColor: generateUniqueColour(schedule),
                }}
                className="inline-block w-1"
              ></span>
              <p className="inline-block">{schedule}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
