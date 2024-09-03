import { Schedule } from "@/schema/createSchedule";
import {
  ApiResponse,
  ScheduleMode,
  ErrorString,
  ExpandedSchedule,
  FormDataObject,
  Result,
} from "@/types";
import { getDeviceId, getDeviceIp } from "./device";
import req from "@/api/requests";
import { AssignSchedule } from "@/schema/assignSchedule";
import {
  COULDNT_CONNNECT_TO_DEVICE,
  UNKNOWN_ERR,
  DEVICE_ID_NOT_FOUND,
} from "@/constants/alert";

export function getFormData(form: HTMLFormElement) {
  const data: FormDataObject = {};
  const formData = new FormData(form);
  for (const keyValuePair of formData) {
    const key = keyValuePair[0] as string;
    const value = keyValuePair[1] as string;
    data[key] = value;
  }
  return data;
}

function convertToUnixTime(timeString: string) {
  const [hour, minute] = timeString.split(":").map((value) => parseInt(value));
  return (
    Math.floor(new Date(1970, 0, 1, hour, minute, 0, 0).getTime() / 1000) -
    new Date().getTimezoneOffset() * 60
  );
}

export function convertUnixTimeToString(unixTime: number) {
  const date = new Date(unixTime * 1000);
  const hour = date.getUTCHours().toString().padStart(2, "0");
  const minute = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  return `${hour}:${minute}:${seconds}`;
}

function getModeObject(mode: ScheduleMode) {
  const duration = `${mode.duration}s`;
  const ringCount = mode.ringCount ?? 1;
  const gap = `${mode.gap ?? 0}s`;
  return {
    ...mode,
    duration,
    ringCount,
    gap,
  };
}

export function expandSchedule(schedule: Schedule) {
  const expandedSchedule: ExpandedSchedule = {};
  schedule.schedules.forEach((schedule) => {
    const startTime = convertToUnixTime(schedule.start);
    if (schedule.type === "session") {
      const endTime = convertToUnixTime(schedule.end ?? "");
      const includeEndTime = schedule.includeEndTime ?? true;
      const intervalInSeconds = (schedule.interval ?? 0) * 60;
      const mode = getModeObject(schedule.mode);
      for (let i = startTime; i < endTime; i += intervalInSeconds) {
        expandedSchedule[convertUnixTimeToString(i)] = mode;
      }
      if (includeEndTime) {
        expandedSchedule[convertUnixTimeToString(endTime)] = mode;
      }
    } else {
      const mode = getModeObject(schedule.mode);
      expandedSchedule[convertUnixTimeToString(startTime)] = mode;
    }
  });
  return expandedSchedule;
}

export async function submitSchedule(
  schedule: Schedule,
  edit: boolean,
): Promise<Result<ApiResponse, ErrorString>> {
  try {
    const id = getDeviceId();
    if (!id)
      return {
        ok: false,
        error: "DEVICE_ID_NOT_FOUND",
      };
    const deviceIp = await getDeviceIp(id);
    const method = edit ? "put" : "post";
    const res: ApiResponse = await req[method](`http://${deviceIp}/schedule`, {
      schedules: {
        [schedule.scheduleName]: schedule.schedules,
      },
      force: true,
    });
    if (res.success) {
      return {
        ok: true,
        data: {
          success: true,
          ...res.data,
        },
      };
    } else {
      return {
        ok: false,
        error: "UNKNOWN_ERR",
      };
    }
  } catch (err) {
    return {
      ok: false,
      error: "DEVICE_ERR",
    };
  }
}

export async function assignSchedule(
  formData: AssignSchedule,
): Promise<Result<ApiResponse, ErrorString>> {
  try {
    const id = getDeviceId();
    if (!id)
      return {
        ok: false,
        error: "DEVICE_ID_NOT_FOUND",
      };

    const dayMap: { [key: string]: number } = {
      mon: 0,
      tue: 1,
      wed: 2,
      thu: 3,
      fri: 4,
      sat: 5,
      sun: 6,
    };
    const weekly: { [key: string]: string[] } = {};
    formData.weekly.forEach((value) => {
      const dayIndex = dayMap[value];
      weekly[dayIndex] = [formData.schedule];
    });

    const once: { [key: string]: string[] } = {};
    formData.once.forEach((value) => {
      once[value] = [formData.schedule];
    });

    const monthly: { [key: number]: string[] } = {};
    formData.monthly.forEach((value) => {
      // * device will not store schedule if not in 1-31)
      const index = Number(value) || 0;
      monthly[index] = [formData.schedule];
    });

    const deviceIp = await getDeviceIp(id);
    const res: ApiResponse = await req.put(`http://${deviceIp}/schedule`, {
      weekly,
      monthly,
      once,
      isAssignOnly: true,
      removeExisting: true,
    });
    if (res.success) {
      const activeRes = await req.put(`http://${deviceIp}/schedule/active`, {
        active: [formData.schedule],
      });

      if (activeRes.success)
        return {
          ok: true,
          data: {
            success: true,
            ...res.data,
          },
        };

      return {
        ok: false,
        error: "DEVICE_ERR",
      };
    } else {
      return {
        ok: false,
        error: "UNKNOWN_ERR",
      };
    }
  } catch (err) {
    return {
      ok: false,
      error: "DEVICE_ERR",
    };
  }
}

export function handleErrorResponse(err: ErrorString, edit: boolean) {
  if (err === "DEVICE_ERR") {
    alert({
      ...COULDNT_CONNNECT_TO_DEVICE,
      title: `Couldn't ${edit ? "edit" : "create"} schedule.`,
    });
  } else if (err === "UNKNOWN_ERR") {
    alert({
      ...UNKNOWN_ERR,
      title: `Couldn't ${edit ? "edit" : "create"} schedule.`,
    });
  } else if (err === "DEVICE_ID_NOT_FOUND") {
    alert(DEVICE_ID_NOT_FOUND);
  }
}
