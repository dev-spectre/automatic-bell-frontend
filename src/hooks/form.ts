import { Schedule } from "@/schema/createSchedule";
import { AppStore } from "@/store";
import { clear, setMode } from "@/store/slice/createScheduleForm";
import { SelectOptionValue } from "@/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useInitialValue(
  scheduleName: string | undefined | null,
): Schedule {
  const schedules = useSelector((store: AppStore) => store.schedules.schedules);
  if (scheduleName && schedules[scheduleName]) {
    return {
      scheduleName,
      schedules: schedules[scheduleName],
    };
  } else {
    return {
      scheduleName: "",
      schedules: [
        {
          start: "",
          end: "",
          type: "session",
          includeEndTime: true,
          interval: NaN,
          mode: {
            type: "",
            gap: NaN,
            ringCount: null,
            duration: NaN,
          },
        },
      ],
    };
  }
}

export function useScheduleListOptionValues(): SelectOptionValue[] {
  const schedules = useSelector((store: AppStore) => store.schedules.schedules);
  const scheduleListOptionValues: SelectOptionValue[] = [];
  Object.keys(schedules).forEach((schedule) => {
    scheduleListOptionValues.push({
      value: schedule,
      label: schedule,
    });
  });

  return scheduleListOptionValues;
}

export function useSyncStateAndFormValues(values: Schedule) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clear());
    values.schedules.forEach((value, index) => {
      if (value.mode.type !== "single" && value.mode.type !== "repeat") return;
      dispatch(
        setMode({
          type: value.mode.type,
          value: index,
        }),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);
}
