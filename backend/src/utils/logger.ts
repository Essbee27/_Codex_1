/* eslint-disable no-console */

type LogMeta = Record<string, unknown>;

function sanitize(meta?: LogMeta) {
  if (!meta) return undefined;

  const forbidden = ["authorization", "token", "apiKey", "x-api-key", "cookie", "set-cookie"];
  const clone: LogMeta = {};

  Object.entries(meta).forEach(([key, value]) => {
    const lower = key.toLowerCase();
    clone[key] = forbidden.some((needle) => lower.includes(needle)) ? "[REDACTED]" : value;
  });

  return clone;
}

export const logger = {
  info(message: string, meta?: LogMeta) {
    console.info(message, sanitize(meta));
  },
  warn(message: string, meta?: LogMeta) {
    console.warn(message, sanitize(meta));
  },
  error(message: string, meta?: LogMeta) {
    console.error(message, sanitize(meta));
  }
};
