import "./styles.css";
import {
  Countdown,
  formatHms,
  pad,
  parseQuickMinutes,
  remainingFromMinutes,
  remainingFromTarget,
  splitHms,
  toDatetimeLocalValue,
  type SetupMode,
} from "./countdown";

const $ = <T extends HTMLElement>(id: string): T => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
};

const tabTarget = $<HTMLButtonElement>("tab-target");
const tabQuick = $<HTMLButtonElement>("tab-quick");
const targetInput = $<HTMLInputElement>("target-input");
const quickInput = $<HTMLInputElement>("quick-input");
const setupBar = $("setup-bar");
const runBar = $("run-bar");
const setupError = $("setup-error");
const runMeta = $("run-meta");
const startBtn = $<HTMLButtonElement>("start-btn");
const resetBtn = $<HTMLButtonElement>("reset-btn");
const doneOverlay = $("done-overlay");
const doneBtn = $<HTMLButtonElement>("done-btn");
const paramMode = $("param-mode");
const paramSet = $("param-set");
const sessionMeta = $("session-meta");
const dH = $("d-h");
const dM = $("d-m");
const dS = $("d-s");

let mode: SetupMode = "target";
let session = 1;
let previewTimer: ReturnType<typeof setInterval> | null = null;

function render(sec: number): void {
  const { h, m, s } = splitHms(sec);
  dH.textContent = pad(h);
  dM.textContent = pad(m);
  dS.textContent = pad(s);
}

function currentSec(): number {
  return mode === "target"
    ? remainingFromTarget(targetInput.value)
    : remainingFromMinutes(quickInput.value);
}

function updateParams(): void {
  paramMode.textContent = `Mode · ${mode === "target" ? "目标时间" : "快捷时长"}`;
  if (mode === "quick") {
    const minutes = parseQuickMinutes(quickInput.value);
    paramSet.textContent = `Set · ${minutes ? `${minutes} Min` : "--"}`;
  } else {
    paramSet.textContent = `Set · +${formatHms(currentSec())}`;
  }
  if (!countdown.running) render(currentSec());
}

function setMode(next: SetupMode): void {
  mode = next;
  tabTarget.classList.toggle("tab-active", next === "target");
  tabQuick.classList.toggle("tab-active", next === "quick");
  tabTarget.setAttribute("aria-selected", String(next === "target"));
  tabQuick.setAttribute("aria-selected", String(next === "quick"));
  targetInput.classList.toggle("hidden", next !== "target");
  quickInput.classList.toggle("hidden", next !== "quick");
  hideError();
  updateParams();
}

function showError(msg: string): void {
  setupError.textContent = msg;
  setupError.classList.remove("hidden");
}

function hideError(): void {
  setupError.classList.add("hidden");
}

function stopPreview(): void {
  if (previewTimer) {
    clearInterval(previewTimer);
    previewTimer = null;
  }
}

function startPreview(): void {
  stopPreview();
  previewTimer = setInterval(updateParams, 1000);
}

function begin(sec: number, meta: string): void {
  stopPreview();
  session += 1;
  sessionMeta.textContent = `SESSION — ${pad(session)} · LOCAL`;
  runMeta.textContent = meta;
  setupBar.classList.add("hidden");
  runBar.classList.remove("hidden");
  runBar.classList.add("flex");
  countdown.start(sec);
}

function finish(): void {
  document.body.classList.add("time-up");
  doneOverlay.classList.remove("hidden");
  doneOverlay.classList.add("flex");
}

function resetAll(): void {
  countdown.stop();
  document.body.classList.remove("time-up");
  doneOverlay.classList.remove("flex");
  doneOverlay.classList.add("hidden");
  runBar.classList.remove("flex");
  runBar.classList.add("hidden");
  setupBar.classList.remove("hidden");
  startPreview();
  updateParams();
}

const countdown = new Countdown({
  onTick: render,
  onFinish: finish,
});

targetInput.value = toDatetimeLocalValue(new Date(Date.now() + 3600000));
tabTarget.addEventListener("click", () => setMode("target"));
tabQuick.addEventListener("click", () => setMode("quick"));
targetInput.addEventListener("input", () => {
  hideError();
  updateParams();
});
quickInput.addEventListener("input", () => {
  hideError();
  updateParams();
});

startBtn.addEventListener("click", () => {
  if (mode === "target") {
    const value = targetInput.value;
    if (!value) {
      showError("请选择目标日期与时间");
      return;
    }
    const diff = remainingFromTarget(value);
    if (diff <= 0) {
      showError("目标时间必须晚于当前时间");
      return;
    }
    begin(diff, `目标时间 · ${value.replace("T", " ")}`);
    return;
  }
  const minutes = parseQuickMinutes(quickInput.value);
  if (!minutes) {
    showError("请输入有效的倒计时分钟数");
    return;
  }
  begin(minutes * 60, `倒计时时长 · ${minutes} 分钟`);
});

resetBtn.addEventListener("click", resetAll);
doneBtn.addEventListener("click", resetAll);

startPreview();
updateParams();
