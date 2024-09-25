import { ExpandedSchedule } from "@/types";

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
