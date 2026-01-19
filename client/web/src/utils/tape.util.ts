import type { Tape } from "@/types";

const key = import.meta.env.VITE_LOCAL_KEY;

export const saveLocalTape = (tapeName: string) => {
  const date = new Date();
  localStorage.setItem(key, JSON.stringify({ tape: tapeName, date: date}));
}
export const loadLocalTape = (): { tape: string, date: Date } | null => {
  const item = localStorage.getItem(key);
  if (item === null) return null;
  return JSON.parse(item);
}
