export function isTimeHHmm(t) {
  return typeof t === "string" && /^\d{2}:\d{2}$/.test(t);
}