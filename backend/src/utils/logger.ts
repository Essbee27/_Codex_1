import pino from "pino";
import { env } from "../config/env.js";

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.x-api-key",
      "req.body.token",
      "req.body.apiKey",
      "res.headers['set-cookie']"
    ],
    censor: "[REDACTED]"
  }
});
