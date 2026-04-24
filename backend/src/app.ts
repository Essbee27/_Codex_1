import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { CostController } from "./controllers/costController.js";
import { ModelController } from "./controllers/modelController.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { loggingMiddleware } from "./middlewares/logging.js";
import { notFoundHandler } from "./middlewares/notFound.js";
import { rateLimitMiddleware } from "./middlewares/rateLimit.js";
import { EnrichmentAdapter } from "./adapters/enrichmentAdapter.js";
import { ModelRepository } from "./repositories/modelRepository.js";
import { CostService } from "./services/costService.js";
import { ModelService } from "./services/modelService.js";
import { buildRoutes } from "./routes/index.js";

export function createApp() {
  const app = express();

  const modelRepository = new ModelRepository();
  const enrichmentAdapter = new EnrichmentAdapter();

  const modelService = new ModelService(modelRepository, enrichmentAdapter);
  const costService = new CostService(modelRepository);

  const modelController = new ModelController(modelService);
  const costController = new CostController(costService);

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "200kb" }));
  app.use(loggingMiddleware);
  app.use(rateLimitMiddleware);

  app.use(env.API_PREFIX, buildRoutes({ modelController, costController }));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
