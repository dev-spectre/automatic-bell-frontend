import req from "@/api/requests";
import { useEffect, useRef } from "react";
import { useAlert } from "./alert";
import { COULDNT_CONNNECT_TO_DEVICE } from "@/constants/alert";
import { getDeviceId, getDeviceIp } from "@/utilities/device";
import {
  addActiveSchedules,
  addSchedules,
  assignSchedules,
  removeSchedules,
} from "@/store/slice/schedules";
import { Schedule } from "@/schema/createSchedule";
import { useDispatch } from "react-redux";
import { StringArrObject } from "@/types";
import { updateSettingsUnsafe } from "@/store/slice/settings";

async function storeScheduleToState() {
  const deviceId = getDeviceId() ?? NaN;
  const deviceIp = await getDeviceIp(deviceId);
  const res = await req.get(`http://${deviceIp}/schedule`);
  if (!res || !res.success) {
    throw new Error("NO_DATA");
  }
  const data = res.data;
  const active: string[] = data.active;
  const schedules: Schedule[] = [];
  const monthly: StringArrObject = data.monthly;
  const skip: StringArrObject = data.skip;
  const once: StringArrObject = data.once;
  const weekly: string[][] = data.weekly;

  for (const [key, value] of Object.entries<Schedule["schedules"]>(
    data.schedules,
  )) {
    if (value.at(0)?.type) {
      schedules.push({
        scheduleName: key,
        schedules: value,
      });
    }
  }

  return {
    schedules,
    active,
    weekly,
    monthly,
    once,
    skip,
  };
}

async function storeSettingsToState() {
  const deviceId = getDeviceId() ?? NaN;
  const deviceIp = await getDeviceIp(deviceId);
  const res = await req.get(`http://${deviceIp}/config`);
  if (!res || !res.success) {
    throw new Error("NO_DATA");
  }
  const data = res.data;
  if (!data) return;

  return {
    network: {
      wlanCredentials: data["wlan_credentials"],
      connectionAttempts: data["max_attempts"],
    },
    time: {
      offset: data["time_fetch_offset"],
    },
    schedule: {
      minGapBetweenRings: data["gap"],
      maxWaitForMissedschedule: data["max_wait"],
    },
  };
}

export function useStoreScheduleToState() {
  const alert = useAlert();
  const dispatch = useDispatch();
  const isAlertShown = useRef(false);

  useEffect(() => {
    storeScheduleToState()
      .then((schedule) => {
        const schedules: string[] = [];
        schedule.schedules.forEach((schedule) => {
          schedules.push(schedule.scheduleName);
        });

        dispatch(
          removeSchedules({
            schedules,
          }),
        );

        dispatch(
          addSchedules({
            schedules: schedule.schedules,
          }),
        );
        dispatch(addActiveSchedules(schedule.active));

        const { skip, once, monthly, weekly } = schedule;
        dispatch(
          assignSchedules({
            skip,
            once,
            monthly,
            weekly,
          }),
        );
      })
      .catch(() => {
        if (isAlertShown.current) return;
        alert(COULDNT_CONNNECT_TO_DEVICE);
        isAlertShown.current = true;
      });

    storeSettingsToState()
      .then((config) => {
        if (!config) return;
        dispatch(updateSettingsUnsafe(config));
      })
      .catch(() => {
        if (isAlertShown.current) return;
        alert(COULDNT_CONNNECT_TO_DEVICE);
        isAlertShown.current = true;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
