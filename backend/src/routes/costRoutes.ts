import { Router } from "express";
import { CostController } from "../controllers/costController.js";
import { costEstimateSchema, validateBody } from "../middlewares/requestValidation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export function costRoutes(controller: CostController): Router {
  const router = Router();

  router.post("/estimate", validateBody(costEstimateSchema), asyncHandler(controller.estimate));

  return router;
}
