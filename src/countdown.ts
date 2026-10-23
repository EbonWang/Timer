export type SetupMode = "target" | "quick";

export function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function splitHms(totalSeconds: number): { h: number; m: number; s: number } {
  const sec = Math.max(0, Math.floor(totalSeconds));
  return {
    h: Math.floor(sec / 3600),
    m: Math.floor((sec % 3600) / 60),
    s: sec % 60,
  };
}

export function formatHms(totalSeconds: number): string {
  const { h, m, s } = splitHms(totalSeconds);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function toDatetimeLocalValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function remainingFromTarget(value: string, now = Date.now()): number {
  if (!value) return 0;
  const diff = Math.floor((new Date(value).getTime() - now) / 1000);
  return diff > 0 ? diff : 0;
}

export function remainingFromMinutes(raw: string): number {
  const minutes = Number.parseInt(raw, 10);
  return minutes > 0 ? minutes * 60 : 0;
}

export function parseQuickMinutes(raw: string): number | null {
  const minutes = Number.parseInt(raw, 10);
  if (!Number.isFinite(minutes) || minutes <= 0) return null;
  return minutes;
}

export type CountdownCallbacks = {
  onTick: (remainingSeconds: number) => void;
  onFinish: () => void;
};

export class Countdown {
  private timer: ReturnType<typeof setInterval> | null = null;
  private endAt = 0;

  constructor(private readonly callbacks: CountdownCallbacks) {}

  get running(): boolean {
    return this.timer !== null;
  }

  start(seconds: number): void {
    this.stop();
    const total = Math.max(0, Math.floor(seconds));
    this.endAt = Date.now() + total * 1000;
    this.callbacks.onTick(total);
    if (total <= 0) {
      this.callbacks.onFinish();
      return;
    }
    this.timer = setInterval(() => this.tick(), 200);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private tick(): void {
    const left = Math.max(0, Math.ceil((this.endAt - Date.now()) / 1000));
    this.callbacks.onTick(left);
    if (left <= 0) {
      this.stop();
      this.callbacks.onFinish();
    }
  }
}
