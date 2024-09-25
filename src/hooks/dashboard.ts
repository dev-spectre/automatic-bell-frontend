import { getCurrentTime } from "@/utilities/dashboard";
import { useEffect, useState } from "react";

export function useSyncTime() {
  const currentTime = getCurrentTime();
  const [time, setTime] = useState(currentTime);

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    //* To get next minute
    const min = date.getMinutes() + 1;
    const delta =
      Number(new Date(year, month, day, hour, min)) - Number(new Date());

    let intervalId: NodeJS.Timeout;
    const timeoutId = setTimeout(() => {
      setTime(getCurrentTime());
      intervalId = setInterval(() => setTime(getCurrentTime()), 60000);
    }, delta);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  return time;
}
