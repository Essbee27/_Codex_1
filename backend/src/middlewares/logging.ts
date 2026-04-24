import pinoHttp from "pino-http";
import { logger } from "../utils/logger.js";

export const loggingMiddleware = pinoHttp({
  logger,
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        id: req.id
      };
    }
  }
});
