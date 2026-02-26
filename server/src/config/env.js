export function requireEnv(keys = []) {
  const missing = keys.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing env keys: ${missing.join(", ")}`);
  }
}