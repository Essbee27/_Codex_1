import { Router } from "express";
import { CostController } from "../controllers/costController.js";
import { HealthController } from "../controllers/healthController.js";
import { ModelController } from "../controllers/modelController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { costRoutes } from "./costRoutes.js";
import { modelRoutes } from "./modelRoutes.js";

interface RouteControllerDeps {
  modelController: ModelController;
  costController: CostController;
  healthController: HealthController;
}

export function buildRoutes({ modelController, costController, healthController }: RouteControllerDeps) {
  const router = Router();

  router.get("/health", asyncHandler(healthController.check));
  router.use("/models", modelRoutes(modelController));
  router.use("/cost", costRoutes(costController));

  return router;
}
