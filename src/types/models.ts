export type User = { id: string; name: string };
export type Shift = {
  id: string;
  date: string;
  startTime: string;
  endTime: string | null;
  breakMinutes: number;
};
export type LoginResponse = { token: string; user: User };
