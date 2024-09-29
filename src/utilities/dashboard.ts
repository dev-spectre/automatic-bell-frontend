import { ExpandedSchedule, Schedules, StringArrObject } from "@/types";

export function formatTime(date: Date): string {
  let hours: number = date.getHours();
  let minutes: number = date.getMinutes();
  const ampm: string = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const paddedHours: string = hours.toString().padStart(2, "0");
  const paddedMinutes: string = minutes.toString().padStart(2, "0");

  return `${paddedHours}:${paddedMinutes} ${ampm}`;
}

export function getCurrentTime(): string {
  const date: Date = new Date();
  return formatTime(date);
}

export function getCurrentDate(): string {
  const date = new Date();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayName = daysOfWeek[date.getDay()];

  const dayOfMonth = date.getDate().toString().padStart(2, "0");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = months[date.getMonth()];

  return `${dayName}, ${dayOfMonth} ${monthName}`;
}

export function timeToDate(timeStr: string): Date {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  const ringTime = new Date();
  ringTime.setHours(hours, minutes, seconds, 0);
  return ringTime;
}

export function getNextRing(expandedSchedule: ExpandedSchedule) {
  const now = new Date();
  let nextRing: Date | null = null;

  Object.keys(expandedSchedule).forEach((ringTime) => {
    const ringDate = timeToDate(ringTime);
    if (ringDate > now && (!nextRing || ringDate < nextRing)) {
      nextRing = ringDate;
    }
  });

  return nextRing ? formatTime(nextRing) : null;
}

export function sortSchedules(schedules: Schedules): string[] {
  const scheduleNames = Object.keys(schedules);

  const sortedSchedules = scheduleNames.sort((a, b) => a.localeCompare(b));
  return sortedSchedules;
}

function hashStringToInt(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToHex(num: number): string {
  const hex =
    ((num >> 24) & 0xff).toString(16) +
    ((num >> 16) & 0xff).toString(16) +
    ((num >> 8) & 0xff).toString(16);
  return hex.padStart(6, "0").substring(0, 6);
}

const adjustContrast = (hex: string): string => {
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);

  r = Math.max(25, r);
  g = Math.max(75, g);
  b = Math.max(155, b);

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  if (luminance < 128) {
    r = Math.min(255, r + 70);
    g = Math.min(255, g + 70);
    b = Math.min(255, b + 70);
  }

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export function generateUniqueColour(str: string): string {
  const hash = hashStringToInt(str);
  const hexColour = intToHex(hash);
  return adjustContrast(hexColour);
}

export function stringToDate(dateString: string): Date {
  const [day, month, year] = dateString
    .split("/")
    .map((value) => parseInt(value));
  return new Date(year, month - 1, day);
}

export function dateToString(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getActiveScheduleDates(
  schedules: {
    weekly: StringArrObject;
    once: StringArrObject;
    skip: StringArrObject;
    monthly: StringArrObject;
    active: string[];
  },
  startDate: Date,
  endDate: Date,
) {
  const { skip, once, weekly, monthly, active } = schedules;
  const result: { [scheduleName: string]: Set<string> } = {};
  const usedDates: Set<string> = new Set();

  const addDates = (scheduleName: string, date: string) => {
    if (!result[scheduleName]) {
      result[scheduleName] = new Set();
    }
    if (!usedDates.has(date)) {
      result[scheduleName].add(date);
      usedDates.add(date);
    }
  };

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const date = dateToString(currentDate);
    for (let i = active.length - 1; i >= 0; i--) {
      if (skip.hasOwnProperty(date) && skip[date].includes(active[i])) break;
      if (once.hasOwnProperty(date) && once[date].includes(active[i])) {
        addDates(active[i], date);
        break;
      }

      const dayOfMonth = currentDate.getDate();
      if (
        monthly.hasOwnProperty(dayOfMonth) &&
        monthly[dayOfMonth].includes(active[i])
      ) {
        addDates(active[i], date);
        break;
      }

      const dayOfWeek = currentDate
        .toLocaleString("en-IN", { weekday: "short" })
        .toLowerCase();
      if (weekly[dayOfWeek].includes(active[i])) {
        addDates(active[i], date);
        break;
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const finalResult: { [scheduleName: string]: Date[] } = {};
  Object.keys(result).forEach((scheduleName) => {
    finalResult[scheduleName] = Array.from(result[scheduleName]).map(
      stringToDate,
    );
  });

  return finalResult;
}

export function assignColor(active: string[]) {
  active.forEach((schedule) => {
    const nodes: NodeListOf<HTMLDivElement> = document.querySelectorAll(
      `.${schedule}`,
    );
    nodes.forEach((node: HTMLDivElement) => {
      node.style.color = generateUniqueColour(schedule);
    });
  });
}
