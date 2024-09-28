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

export function useCalendarMonthCount(
  calendarContainer: React.MutableRefObject<HTMLDivElement | null>,
) {
  const [numberOfMonths, setNumberOfMonths] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (!calendarContainer.current) return;
      const containerComputedStyle = getComputedStyle(
        calendarContainer.current,
      );
      const containerPadding =
        parseFloat(containerComputedStyle.paddingLeft) +
        parseFloat(containerComputedStyle.paddingRight);
      const containerWidth =
        calendarContainer.current.clientWidth - containerPadding;

      const calendar = calendarContainer.current.firstElementChild;
      if (!calendar) return;
      const calendarMonth = calendar.firstElementChild?.lastElementChild;
      if (!calendarMonth) return;
      const calendarMonthStyle = getComputedStyle(calendarMonth);
      const widthOfLastMonth =
        calendarMonth?.clientWidth +
        parseFloat(calendarMonthStyle.marginLeft) -
        2;

      const activeSchedules = calendarContainer.current.lastElementChild;
      if (!activeSchedules) return;
      const activeSchedulesComputedStyle = getComputedStyle(activeSchedules);
      const activeSchedulesPadding =
        parseFloat(activeSchedulesComputedStyle.paddingLeft) +
        parseFloat(activeSchedulesComputedStyle.paddingRight);
      const border = parseFloat(activeSchedulesComputedStyle.borderRight);
      const activeSchedulesWidth = Math.max(
        activeSchedules.clientWidth - activeSchedulesPadding - border,
        170,
      );

      const freeSpace = containerWidth - activeSchedulesWidth;
      const calculatedNumberOfMonths = Math.max(
        Math.round(freeSpace / widthOfLastMonth) - 1,
        1,
      );
      if (
        Math.round(numberOfMonths) === 1 ||
        calculatedNumberOfMonths != Math.round(numberOfMonths)
      ) {
        setNumberOfMonths(calculatedNumberOfMonths);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return numberOfMonths;
}
