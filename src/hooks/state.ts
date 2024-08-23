import req from "@/api/requests";
import { useEffect } from "react";
import { useAlert } from "./alert";
import { COULDNT_CONNNECT_TO_DEVICE } from "@/constants/alert";
import { getDeviceId, getDeviceIp } from "@/utilities/device";
import { addSchedules } from "@/store/slice/schedules";
import { Schedule } from "@/schema/createSchedule";
import { useDispatch } from "react-redux";

async function storeScheduleToState() {
  const deviceId = getDeviceId() ?? NaN;
  const deviceIp = await getDeviceIp(deviceId);
  const res = await req.get(`http://${deviceIp}/schedule`);
  if (!res || !res.success) {
    throw new Error("NO_DATA");
  }
  const data = res.data;
  const schedules: Schedule[] = [];
  for (const [key, value] of Object.entries<Schedule["schedules"]>(data.schedules)) {
    if (value.at(0)?.type) {
      schedules.push({
        scheduleName: key,
        schedules: value,
      });
    }
  }
  return schedules;
}

export function useStoreScheduleToState() {
  const alert = useAlert();
  const dispatch = useDispatch();

  useEffect(() => {
    storeScheduleToState()
      .then((schedules) => dispatch(addSchedules({ schedules })))
      .catch((err) => +console.log(err) || alert(COULDNT_CONNNECT_TO_DEVICE));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
