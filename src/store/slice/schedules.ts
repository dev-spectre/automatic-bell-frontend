import {
  AssignSchedulePayload,
  MonthlySchedule,
  ScheduleState,
  ScheduleStateAddPayload,
  ScheduleStateDeletePayload,
  Schedules,
  StringArrObject,
} from "@/types";
import { getCache } from "@/utilities/cache";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ScheduleState = getCache("scheduleSlice") ?? {
  skip: {} satisfies StringArrObject as StringArrObject,
  once: {} satisfies StringArrObject as StringArrObject,
  weekly: {
    sun: [],
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
  } satisfies StringArrObject as StringArrObject,
  monthly: (() => {
    const monthly: MonthlySchedule = {};
    for (let i = 1; i <= 31; i++) {
      monthly[i] = [];
    }
    return monthly;
  })(),
  schedules: {} satisfies Schedules as Schedules,
  active: [] satisfies string[] as string[],
};

const scheduleSlice = createSlice({
  name: "scheduleSlice",
  initialState,
  reducers: {
    addSchedules: (state, action: PayloadAction<ScheduleStateAddPayload>) => {
      action.payload.schedules.forEach(
        (schedule) =>
          (state.schedules[schedule.scheduleName] = schedule.schedules),
      );
    },

    removeSchedules: (
      state,
      action: PayloadAction<ScheduleStateDeletePayload>,
    ) => {
      action.payload.schedules.forEach((schedule) => {
        delete state.schedules[schedule];
      });
      state.active = state.active.filter(
        (value) => !action.payload.schedules.includes(value),
      );
      _removeSchedulesFromState(state, {
        payload: action.payload.schedules,
        type: "removeScheduleAssignment",
      });
    },

    addActiveSchedules: (state, action: PayloadAction<string[]>) => {
      state.active = [
        ...new Set([...state.active, ...action.payload].reverse()),
      ].reverse();
    },

    removeActiveSchedules: (state, action: PayloadAction<string[]>) => {
      state.active = state.active.filter(
        (value) => !action.payload.includes(value),
      );
    },

    assignSchedules: (state, action: PayloadAction<AssignSchedulePayload>) => {
      const { skip, once, monthly, weekly, schedules } = action.payload;

      if (schedules) {
        _removeSchedulesFromState(state, {
          payload: schedules,
          type: "removeScheduleAssignment",
        });
      }

      if (skip) {
        Object.keys(skip).forEach((date) => {
          if (!state.skip[date]) {
            state.skip[date] = [];
          }
          state.skip[date] = [...new Set([...state.skip[date], ...skip[date]])];
        });
      }

      if (once) {
        Object.keys(once).forEach((date) => {
          if (!state.once[date]) {
            state.once[date] = [];
          }
          state.once[date] = [...new Set([...state.once[date], ...once[date]])];
        });
      }

      if (monthly) {
        Object.keys(monthly).forEach((day) => {
          const dayNum = parseInt(day);
          if (1 > dayNum || dayNum > 31) return;
          if (!state.monthly[dayNum]) {
            state.monthly[dayNum] = [];
          }
          state.monthly[dayNum] = [
            ...new Set([...state.monthly[dayNum], ...monthly[dayNum]]),
          ];
        });
      }

      const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
      if (weekly && Array.isArray(weekly)) {
        weekly.forEach((daySchedule, index) => {
          if (index > 6) return;
          const day = days[index] as keyof ScheduleState["weekly"];
          if (!state.weekly[day]) {
            state.weekly[day] = [];
          }
          state.weekly[day] = [
            ...new Set([...state.weekly[day], ...daySchedule]),
          ];
        });
      } else if (weekly && !Array.isArray(weekly)) {
        Object.keys(weekly).forEach((dayString) => {
          const day = dayString as keyof ScheduleState["weekly"];
          if (!days.includes(day)) return;
          state.weekly[day] = weekly[day];
        });
      }
    },

    unassignSchedules: (
      state,
      action: PayloadAction<AssignSchedulePayload>,
    ) => {
      const { skip, once, monthly, weekly } = action.payload;

      if (skip) {
        Object.keys(skip).forEach((date) => {
          if (!state.skip.hasOwnProperty(date)) return;
          state.skip[date] = state.skip[date].filter(
            (schedule) => !skip[date].includes(schedule),
          );
        });
      }

      if (once) {
        Object.keys(once).forEach((date) => {
          if (!state.once.hasOwnProperty(date)) return;
          state.once[date] = state.once[date].filter(
            (schedule) => !once[date].includes(schedule),
          );
        });
      }

      if (monthly) {
        Object.keys(monthly).forEach((day) => {
          const dayNum = parseInt(day);
          if (dayNum < 1 || dayNum > 31) return;
          state.monthly[dayNum] = state.monthly[dayNum].filter(
            (schedule) => !monthly[dayNum].includes(schedule),
          );
        });
      }

      const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
      if (weekly && Array.isArray(weekly)) {
        weekly.forEach((daySchedule, index) => {
          if (index > 6) return;
          const day = days[index] as keyof ScheduleState["weekly"];
          state.weekly[day] = state.weekly[day].filter(
            (schedule) => !daySchedule.includes(schedule),
          );
        });
      } else if (weekly && !Array.isArray(weekly)) {
        Object.keys(weekly).forEach((dayString) => {
          if (!days.includes(dayString)) return;
          const day = dayString as keyof ScheduleState["weekly"];
          state.weekly[day] = state.weekly[day].filter(
            (schedule) => !weekly[day].includes(schedule),
          );
        });
      }
    },

    removeSchedulesFromState: (state, action: PayloadAction<string[]>) => {
      _removeSchedulesFromState(state, action);
    },
  },
});

function _removeSchedulesFromState(
  state: {
    skip: StringArrObject;
    once: StringArrObject;
    weekly: StringArrObject;
    monthly: MonthlySchedule;
  },
  action: PayloadAction<string[]>,
) {
  const schedulesToRemove = action.payload;

  Object.keys(state.skip).forEach((date) => {
    state.skip[date] = state.skip[date].filter(
      (schedule) => !schedulesToRemove.includes(schedule),
    );
    if (state.skip[date].length === 0) {
      delete state.skip[date];
    }
  });

  Object.keys(state.once).forEach((date) => {
    state.once[date] = state.once[date].filter(
      (schedule) => !schedulesToRemove.includes(schedule),
    );
    if (state.once[date].length === 0) {
      delete state.once[date];
    }
  });

  Object.keys(state.monthly).forEach((day) => {
    const dayNum = parseInt(day);
    if (dayNum >= 1 && dayNum <= 31 && state.monthly[dayNum]) {
      state.monthly[dayNum] = state.monthly[dayNum].filter(
        (schedule) => !schedulesToRemove.includes(schedule),
      );
    }
  });

  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  days.forEach((day) => {
    if (state.weekly[day]) {
      state.weekly[day] = state.weekly[day].filter(
        (schedule) => !schedulesToRemove.includes(schedule),
      );
    }
  });
}

export const {
  addSchedules,
  removeSchedules,
  addActiveSchedules,
  removeActiveSchedules,
  assignSchedules,
  unassignSchedules,
} = scheduleSlice.actions;
export default scheduleSlice.reducer;
