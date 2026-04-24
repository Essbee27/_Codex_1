import cors from "cors";
import express from "express";
import { EnrichmentAdapter } from "./adapters/enrichmentAdapter.js";
import { env } from "./config/env.js";
import { CostController } from "./controllers/costController.js";
import { HealthController } from "./controllers/healthController.js";
import { ModelController } from "./controllers/modelController.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { loggingMiddleware } from "./middlewares/logging.js";
import { notFoundHandler } from "./middlewares/notFound.js";
import { rateLimitMiddleware } from "./middlewares/rateLimit.js";
import { ModelRepository } from "./repositories/modelRepository.js";
import { buildRoutes } from "./routes/index.js";
import { CostService } from "./services/costService.js";
import { ModelService } from "./services/modelService.js";

export function createApp() {
  const app = express();

  const modelRepository = new ModelRepository();
  const enrichmentAdapter = new EnrichmentAdapter();

  const modelService = new ModelService(modelRepository, enrichmentAdapter);
  const costService = new CostService(modelRepository);

  const modelController = new ModelController(modelService);
  const costController = new CostController(costService);
  const healthController = new HealthController(modelRepository);

  app.use(cors());
  app.use(express.json({ limit: "200kb" }));
  app.use(loggingMiddleware);
  app.use(rateLimitMiddleware);

  app.use(env.API_PREFIX, buildRoutes({ modelController, costController, healthController }));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
