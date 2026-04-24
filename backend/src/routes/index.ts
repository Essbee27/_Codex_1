import { Router } from "express";
import { healthController } from "../controllers/healthController.js";
import { CostController } from "../controllers/costController.js";
import { ModelController } from "../controllers/modelController.js";
import { costRoutes } from "./costRoutes.js";
import { modelRoutes } from "./modelRoutes.js";

interface RouteControllerDeps {
  modelController: ModelController;
  costController: CostController;
}

export function buildRoutes({ modelController, costController }: RouteControllerDeps) {
  const router = Router();

  router.get("/health", healthController);
  router.use("/models", modelRoutes(modelController));
  router.use("/cost", costRoutes(costController));

  return router;
}
