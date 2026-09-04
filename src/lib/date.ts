export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysIso(baseIso: string, days: number): string {
  const date = new Date(baseIso + "T00:00:00");
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function isDue(dueDateIso: string, referenceIso: string = todayIso()): boolean {
  return dueDateIso <= referenceIso;
}

export function isWithinDays(dateIso: string, days: number, referenceIso: string = todayIso()): boolean {
  const limit = addDaysIso(referenceIso, days);
  return dateIso >= referenceIso && dateIso <= limit;
}

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("nl-NL", { weekday: "short" });
const DATE_FORMATTER = new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short" });

export function formatDateNL(dateIso: string): string {
  const date = new Date(dateIso + "T00:00:00");
  return `${WEEKDAY_FORMATTER.format(date)} ${DATE_FORMATTER.format(date)}`;
}
