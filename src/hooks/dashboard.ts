import { getCurrentTime } from "@/utilities/dashboard";
import { useEffect, useRef, useState } from "react";

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

export function useCalendarMonthCount(
  calendarContainer: React.MutableRefObject<HTMLDivElement | null>,
) {
  const [numberOfMonths, setNumberOfMonths] = useState(1);
  const numberOfMonthsRef = useRef(numberOfMonths);

  useEffect(() => {
    numberOfMonthsRef.current = numberOfMonths;
  });

  const handleResize = () => {
    const container = calendarContainer.current;
    if (!container) return;

    let numberOfMonths = 1;
    const width = container.offsetWidth;
    if (width >= 1460) {
      numberOfMonths = 4;
    } else if (width >= 1200) {
      numberOfMonths = 3;
    } else if (width >= 1120) {
      numberOfMonths = 3;
    } else if (width >= 810) {
      numberOfMonths = 2;
    } else if (width >= 720) {
      numberOfMonths = 1;
    }

    if (numberOfMonths !== numberOfMonthsRef.current) {
      setNumberOfMonths(numberOfMonths);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return numberOfMonths;
}
