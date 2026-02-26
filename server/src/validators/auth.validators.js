export function isEmail(email) {
  return typeof email === "string" && email.includes("@");
}