import { CreateSchedule } from "@/schema/createSchedule";
import {
  ApiResponse,
  CreateScheduleMode,
  ErrorString,
  ExpandedSchedule,
  FormDataObject,
  Result,
} from "@/types";
import { getDeviceId, getDeviceIp } from "./device";
import req from "@/api/requests";

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

function getModeString(mode: CreateScheduleMode) {
  const duration = mode.duration;
  if (mode.type === "single") {
    return `timer/${duration}`;
  } else {
    const ringCount = mode.ringCount ?? 0;
    const gap = mode.gap ?? 0;
    return `repeat/${ringCount}/${duration}/${gap}`;
  }
}

export function expandSchedule(schedule: CreateSchedule) {
  const expandedSchedule: ExpandedSchedule = {};
  schedule.schedules.forEach((schedule) => {
    const startTime = convertToUnixTime(schedule.start);
    if (schedule.type === "session") {
      const endTime = convertToUnixTime(schedule.end ?? "");
      const includeEndTime = schedule.includeEndTime ?? true;
      const intervalInSeconds = (schedule.interval ?? 0) * 60;
      const mode = getModeString(schedule.mode);
      for (let i = startTime; i < endTime; i += intervalInSeconds) {
        expandedSchedule[convertUnixTimeToString(i)] = mode;
      }
      if (includeEndTime) {
        expandedSchedule[convertUnixTimeToString(endTime)] = mode;
      }
    } else {
      const mode = getModeString(schedule.mode);
      expandedSchedule[convertUnixTimeToString(startTime)] = mode;
    }
  });
  return expandedSchedule;
}

export async function submitSchedule(
  schedule: CreateSchedule,
): Promise<Result<ApiResponse, ErrorString>> {
  try {
    const id = getDeviceId();
    if (!id)
      return {
        ok: false,
        error: "DEVICE_ID_NOT_FOUND",
      };
    console.log(expandSchedule(schedule));
    const deviceIp = await getDeviceIp(id);
    const res: ApiResponse = await req.post(`http://${deviceIp}/schedule`, {
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
